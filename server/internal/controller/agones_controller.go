package controller

import (
	"klabchina/server/config"
	"klabchina/server/internal/service"
	"net/http"

	agones "agones.dev/agones/pkg/client/clientset/versioned"
	"github.com/gin-gonic/gin"
)

type AgonesController struct {
	svc *service.AgonesService
}

func NewAgonesController(clientset *agones.Clientset, cfg *config.Config) *AgonesController {
	return &AgonesController{
		svc: service.NewAgonesService(clientset, cfg),
	}
}

func (ac *AgonesController) AllocateGameServer(c *gin.Context) {
	var req service.CreateAgonesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pod, err := ac.svc.AllocateGameServer(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pod)
}

func (ac *AgonesController) ListAllocatedGameServer(c *gin.Context) {
	pods, err := ac.svc.ListAllocatedGameServer(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pods)
}

func (ac *AgonesController) DeleteGameServer(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "GameServer name is required"})
		return
	}

	err := ac.svc.DeleteGameServer(c.Request.Context(), name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "GameServer deleted successfully"})
}
