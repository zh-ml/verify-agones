package controller

import (
	"klabchina/server/internal/ws"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // adjust for production CORS
	},
}

func PodStatusWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	// Example: send periodic mock data
	for {
		err := conn.WriteJSON(map[string]string{
			"name":   "mypod",
			"status": "Running",
		})
		if err != nil {
			log.Println("WebSocket write error:", err)
			break
		}
		// time.Sleep(time.Second * 5) // production: replace with informer callback
	}
}

func ServeWs(hub *ws.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println("WebSocket upgrade error:", err)
			return
		}
		client := &ws.Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
		client.Hub.Register <- client

		go client.WritePump()
		go client.ReadPump()
	}
}
