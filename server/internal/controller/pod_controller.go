package controller

import (
	"klabchina/server/config"
	"klabchina/server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"k8s.io/client-go/kubernetes"
)

type PodController struct {
	svc *service.PodService
}

func NewPodController(clientset *kubernetes.Clientset, cfg *config.Config) *PodController {
	return &PodController{
		svc: service.NewPodService(clientset, cfg),
	}
}

func (pc *PodController) CreatePod(c *gin.Context) {
	var req service.CreatePodRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pod, err := pc.svc.CreatePod(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pod)
}

func (pc *PodController) GetPod(c *gin.Context) {
	name := c.Param("name")
	pod, err := pc.svc.GetPod(c.Request.Context(), name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pod)
}

func (pc *PodController) ListPod(c *gin.Context) {
	pods, err := pc.svc.ListPod(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pods)
}

func (pc *PodController) DeletePod(c *gin.Context) {
	name := c.Param("name")
	err := pc.svc.DeletePod(c.Request.Context(), name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pod deleted"})
}
