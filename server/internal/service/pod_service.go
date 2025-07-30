package service

import (
	"context"
	"klabchina/server/config"
	"klabchina/server/pkg/models"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type PodService struct {
	clientset *kubernetes.Clientset
	namespace string
}

func NewPodService(clientset *kubernetes.Clientset, cfg *config.Config) *PodService {
	return &PodService{
		clientset: clientset,
		namespace: cfg.Namespace,
	}
}

type CreatePodRequest struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}

func (ps *PodService) CreatePod(ctx context.Context, req CreatePodRequest) (*models.PodInfo, error) {
	pod := &v1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name: req.Name,
		},
		Spec: v1.PodSpec{
			Containers: []v1.Container{
				{
					Name:  req.Name,
					Image: req.Image,
					Ports: []v1.ContainerPort{
						{ContainerPort: 80},
					},
				},
			},
		},
	}

	result, err := ps.clientset.CoreV1().Pods(ps.namespace).Create(ctx, pod, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}

	return &models.PodInfo{
		Name:   result.Name,
		Status: string(result.Status.Phase),
	}, nil
}

func (ps *PodService) GetPod(ctx context.Context, name string) (*models.PodInfo, error) {
	pod, err := ps.clientset.CoreV1().Pods(ps.namespace).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return &models.PodInfo{
		Name:   pod.Name,
		IP:     pod.Status.PodIP,
		Status: string(pod.Status.Phase),
	}, nil
}

func (ps *PodService) ListPod(ctx context.Context) ([]*models.PodInfo, error) {
	var pods []*models.PodInfo
	pod, err := ps.clientset.CoreV1().Pods(ps.namespace).List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	if len(pod.Items) == 0 {
		return nil, nil // No pods found
	}
	for _, p := range pod.Items {
		pods = append(pods, &models.PodInfo{
			Name:   p.Name,
			IP:     p.Status.PodIP,
			Status: string(p.Status.Phase),
		})
	}

	return pods, nil
}

func (ps *PodService) DeletePod(ctx context.Context, name string) error {
	return ps.clientset.CoreV1().Pods(ps.namespace).Delete(ctx, name, metav1.DeleteOptions{})
}
