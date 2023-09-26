package Controllers

import (
	"divvy-apis/Models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)


var (
	upgrader  = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	websockets []*websocket.Conn
)

func serveWs(w http.ResponseWriter, r *http.Request) {
	//remove later
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	index := len(websockets)
	if err != nil {
		fmt.Println(err)
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}
	// Probably not an efficient way
	websockets = append(websockets, ws)
	for {
        if _, _, err := ws.NextReader(); err != nil {
            ws.Close()
			websockets[index] = websockets[len(websockets)-1] // Copy last element to index.
			websockets = websockets[:len(websockets)-1]   // Truncate slice.
            break
        }
    }
}


func SendTxn(c *gin.Context){
	fmt.Println(len(websockets))
	var Transaction Models.Transactions
	c.ShouldBindJSON(&Transaction)
	data, err := json.Marshal(Transaction)
	model_err := Models.PostTransaction(&Transaction)
	if model_err != nil {
		fmt.Println(model_err)
	}
	if err == nil {
		for i := 0; i < len(websockets); i++  {
			websockets[i].WriteMessage(websocket.TextMessage, []byte(data))
		}
	}
	c.JSON(http.StatusOK, gin.H{"data": "done"})
}
