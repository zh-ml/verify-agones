package controller

import (
	"klabchina/server/config"
	"klabchina/server/internal/service"
	"net/http"
	"strings"

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

func (ac *AgonesController) ListGameServers(c *gin.Context) {
	var req service.ListGameServerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pods, err := ac.svc.ListGameServers(c.Request.Context(), req)
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

func (ac *AgonesController) DeployGameServer(c *gin.Context) {
	var req service.CreateAgonesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var yamlData string
	var err error
	if strings.HasPrefix(req.Name, "minecraft-java") {
		mc := service.GSMinecraftTemplateVars{
			GameServerBaseTemplateVars: service.GameServerBaseTemplateVars{
				ContainerName: "minecraft",
				Image:         "itzg/minecraft-server:latest",
			},
			Label:              req.Label,
			Hostname:           "mc-java-server",
			ServiceName:        "mc-java-service",
			GenerateName:       req.Name,
			Protocol:           "TCP",
			PortName:           "minecraft-port",
			PortPolicy:         "Dynamic",
			EULA:               "TRUE",
			Version:            req.Version,
			OnlineMode:         "false",
			HealthInitialDelay: 60,
			HealthPeriod:       12,
			HealthFailure:      5,
			CpuResource:        req.CpuResource,
			MemoryResource:     req.MemoryResource,
		}
		yamlData, err = mc.RenderGameServerYAML()
		// yamlData, err = service.HandlerRenderGameServerYAML(mc)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to render GameServer YAML"})
		return
	}

	pod, err := ac.svc.CreateGameServerFromYAML(c.Request.Context(), req, yamlData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pod)
}
