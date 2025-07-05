package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"nhooyr.io/websocket"
)

type Hub struct {
	clients map[*websocket.Conn]struct{}
	addCh   chan *websocket.Conn
	delCh   chan *websocket.Conn
	bcastCh chan []byte
}

func newHub() *Hub {
	h := &Hub{
		clients: make(map[*websocket.Conn]struct{}),
		addCh:   make(chan *websocket.Conn),
		delCh:   make(chan *websocket.Conn),
		bcastCh: make(chan []byte, 128),
	}
	go h.run()
	return h
}

func (h *Hub) run() {
	for {
		select {
		case c := <-h.addCh:
			h.clients[c] = struct{}{}
		case c := <-h.delCh:
			delete(h.clients, c)
			c.Close(websocket.StatusNormalClosure, "")
		case msg := <-h.bcastCh:
			for c := range h.clients {
				c.Write(h.ctx(), websocket.MessageText, msg)
			}
		}
	}
}

func (h *Hub) ctx() context.Context {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	return ctx
}

// HTTP POST /gsi
func gsiHandler(hub *Hub, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var gs GameState
		if err := json.NewDecoder(r.Body).Decode(&gs); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		addEconTags(&gs)

		// transmite p/ front
		out, _ := json.Marshal(gs)
		hub.bcastCh <- out

		// grava no banco se round acabou
		if gs.Round.Phase == "over" {
			_, _ = db.Exec(
				`INSERT INTO rounds(map, econ_ct, econ_t, created_at) VALUES (?, ?, ?, strftime('%s','now'))`,
				gs.Map.Name, gs.Econ.CT, gs.Econ.T,
			)
		}
	}
}

// WebSocket /ws
func wsHandler(hub *Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, nil)
		if err != nil { return }
		hub.addCh <- c
		defer func() { hub.delCh <- c }()
		for {
			if _, _, err := c.Read(r.Context()); err != nil { break }
		}
	}
}
