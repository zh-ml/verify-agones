package service

import (
	"context"
	"fmt"
	"klabchina/server/config"
	"klabchina/server/pkg/models"
	"time"

	agonesv1 "agones.dev/agones/pkg/apis/agones/v1"
	allocationv1 "agones.dev/agones/pkg/apis/allocation/v1"
	agones "agones.dev/agones/pkg/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"sigs.k8s.io/yaml"
)

type AgonesService struct {
	clientset *agones.Clientset
	namespace string
}

func NewAgonesService(clientset *agones.Clientset, cfg *config.Config) *AgonesService {
	return &AgonesService{
		clientset: clientset,
		namespace: cfg.Namespace,
	}
}

type ListGameServerRequest struct {
	Status string `json:"status"`
}

type CreateAgonesRequest struct {
	Name           string `json:"name"`
	Version        string `json:"version"`
	CpuResource    string `json:"cpuResource"`
	MemoryResource string `json:"memoryResource"`
	Label          string `json:"label"`
}

func (as *AgonesService) AllocateGameServer(ctx context.Context, req CreateAgonesRequest) (*models.GameServerInfo, error) {
	labels := map[string]string{
		"game": req.Label,
	}
	// 构造 GameServerAllocation 请求
	gsa := &allocationv1.GameServerAllocation{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: "gsa-" + req.Name + string('-'), //"gsa-" 自动生成名称
		},
		Spec: allocationv1.GameServerAllocationSpec{
			Required: allocationv1.GameServerSelector{
				LabelSelector: metav1.LabelSelector{
					MatchLabels: labels,
				},
			},
		},
	}

	// 发送 allocation 请求
	result, err := as.clientset.AllocationV1().GameServerAllocations(as.namespace).Create(ctx, gsa, metav1.CreateOptions{})
	if err != nil {
		panic(err)
	}

	// 输出分配结果
	fmt.Printf("Allocated GameServer:\n")
	fmt.Printf("Address: %s\n", result.Status.Address)
	for _, port := range result.Status.Ports {
		fmt.Printf("Port: %d\n", port.Port)
	}

	return &models.GameServerInfo{
		Name: result.Name,
		Port: result.Status.Ports[0].Port,
	}, nil
}

func (as *AgonesService) ListGameServers(ctx context.Context, req ListGameServerRequest) ([]*models.GameServerInfo, error) {
	gsList, err := as.clientset.AgonesV1().GameServers(as.namespace).List(ctx, metav1.ListOptions{})
	// fmt.Printf("ListAllocatedGameServer: %v", gsList)
	if err != nil {
		return nil, fmt.Errorf("failed to list GameServerAllocations: %v", err)
	}

	var gameServers []*models.GameServerInfo
	for _, gsa := range gsList.Items {
		if string(gsa.Status.State) == req.Status { // agonesv1.GameServerStateAllocated
			gameServers = append(gameServers, &models.GameServerInfo{
				Name:      gsa.Name,
				IP:        gsa.Status.Address,
				Port:      gsa.Status.Ports[0].Port,
				Status:    string(gsa.Status.State),
				StartTime: gsa.ObjectMeta.CreationTimestamp.Time,
			})
		} else {
			gameServers = append(gameServers, &models.GameServerInfo{
				Name: gsa.Name,
				// IP:   gsa.Status.Address,
				// Port:   gsa.Status.Ports[0].Port,
				Status:    string(gsa.Status.State),
				StartTime: gsa.ObjectMeta.CreationTimestamp.Time,
			})
		}
	}
	return gameServers, nil
}

func (as *AgonesService) DeleteGameServer(ctx context.Context, name string) error {
	err := as.clientset.AgonesV1().GameServers(as.namespace).Delete(ctx, name, metav1.DeleteOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete GameServer: %v", err)
	}
	return nil
}

func (as *AgonesService) CreateGameServerFromYAML(ctx context.Context, req CreateAgonesRequest, yamlContent string) (*models.GameServerInfo, error) {
	fmt.Println(yamlContent)
	var gs agonesv1.GameServer
	if err := yaml.Unmarshal([]byte(yamlContent), &gs); err != nil {
		return nil, fmt.Errorf("YAML 解析失败: %v", err)
	}
	fmt.Printf("Parsed GameServer: %+v\n", gs)
	// 设置命名空间
	gs.Namespace = as.namespace

	created, err := as.clientset.AgonesV1().GameServers(as.namespace).Create(ctx, &gs, metav1.CreateOptions{})
	if err != nil {
		return nil, fmt.Errorf("创建 GameServer 失败: %v", err)
	}

	as.WaitUntilReadyAndAllocate(ctx, req)

	return &models.GameServerInfo{
		Name: created.Name,
		IP:   created.Status.Address,
		Port: func() int32 {
			if len(created.Status.Ports) > 0 {
				return created.Status.Ports[0].Port
			}
			return 0
		}(),
		Status: string(created.Status.State),
	}, nil
}

func (as *AgonesService) WaitUntilReadyAndAllocate(ctx context.Context, req CreateAgonesRequest) (*models.GameServerInfo, error) {
	timeout := time.After(120 * time.Second)
	ticker := time.NewTicker(10 * time.Second)

	var allocatedGameServer *models.GameServerInfo
	var allocateErr error

	done := make(chan bool)
	go func() {
		for {
			select {
			case <-timeout:
				allocateErr = fmt.Errorf("timeout waiting for GameServer to be Ready")
				done <- true
				return
			case <-ticker.C:
				fmt.Println("Checking GameServer status...")
				listOpts := metav1.ListOptions{
					LabelSelector: fmt.Sprintf("game=%s", req.Label),
				}
				gsList, err := as.clientset.AgonesV1().GameServers(as.namespace).List(ctx, listOpts)
				if err != nil {
					allocateErr = fmt.Errorf("failed to list GameServers: %v", err)
					done <- true
					return
				}
				if len(gsList.Items) == 0 {
					fmt.Println("No GameServer found with label:", req.Label)
					continue
				}
				for _, gs := range gsList.Items {
					fmt.Printf("GameServer %s status: %s\n", gs.Name, gs.Status.State)
					if gs.Status.State == agonesv1.GameServerStateReady {
						// 执行 Allocate
						allocatedGameServer, allocateErr = as.AllocateGameServer(ctx, req)
						done <- true
						return
					}
				}
				fmt.Println("Waiting for GameServer to be Ready...")
			}
		}
	}()

	<-done
	return allocatedGameServer, allocateErr
}
