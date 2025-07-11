package service

import (
	"context"
	"fmt"
	"klabchina/server/config"
	"klabchina/server/pkg/models"

	agonesv1 "agones.dev/agones/pkg/apis/agones/v1"
	allocationv1 "agones.dev/agones/pkg/apis/allocation/v1"
	agones "agones.dev/agones/pkg/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

type CreateAgonesRequest struct {
	Name string `json:"name"`
}

func (as *AgonesService) AllocateGameServer(ctx context.Context, req CreateAgonesRequest) (*models.GameServerInfo, error) {
	// fixme:前端传入的请求参数
	labels := map[string]string{
		"game":    "mc",
		"edition": "java",
	}
	// 构造 GameServerAllocation 请求
	gsa := &allocationv1.GameServerAllocation{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: req.Name + string('-'), //"gsa-" 自动生成名称
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

func (as *AgonesService) ListAllocatedGameServer(ctx context.Context) ([]*models.GameServerInfo, error) {
	gsList, err := as.clientset.AgonesV1().GameServers(as.namespace).List(ctx, metav1.ListOptions{})
	// fmt.Printf("ListAllocatedGameServer: %v", gsList)
	if err != nil {
		return nil, fmt.Errorf("failed to list GameServerAllocations: %v", err)
	}

	var gameServers []*models.GameServerInfo
	for _, gsa := range gsList.Items {
		if gsa.Status.State == agonesv1.GameServerStateAllocated {
			gameServers = append(gameServers, &models.GameServerInfo{
				Name:   gsa.Name,
				IP:     gsa.Status.Address,
				Port:   gsa.Status.Ports[0].Port,
				Status: string(gsa.Status.State),
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
