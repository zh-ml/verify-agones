package main

import (
	"klabchina/server/config"
	"klabchina/server/internal/controller"
	"klabchina/server/internal/k8s"
	"klabchina/server/internal/ws"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	router := gin.Default()
	// router.Use(middleware.JWTAuth())
	hub := ws.NewHub()
	go hub.Run()
	clientset := k8s.NewK8sClient(cfg)
	agonesClient := k8s.NewAgonesClient(cfg)
	pc := controller.NewPodController(clientset, hub, cfg)
	ac := controller.NewAgonesController(agonesClient, cfg)

	api := router.Group("/api")
	{
		api.POST("/pods", pc.CreatePod)
		api.GET("/pods/:name", pc.GetPod)
		api.GET("/pods/list", pc.ListPod)
		api.DELETE("/pods/:name", pc.DeletePod)
		api.GET("/ws/pods", controller.PodStatusWS)
		api.GET("/watch/pods", controller.ServeWs(hub))
		api.POST("/gs/allocate", ac.AllocateGameServer)
		api.POST("/gs/listGameServers", ac.ListGameServers)
		api.DELETE("/gs/delete/:name", ac.DeleteGameServer)
		api.POST("/gs/deployGameServer", ac.DeployGameServer)
	}

	router.Run(cfg.ServerPort) // e.g., ":8080"
}
