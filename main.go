package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "file:stats.db?cache=shared")
	if err != nil { log.Fatal(err) }
	// Tabela se não existir
	db.Exec(`CREATE TABLE IF NOT EXISTS rounds(
	            id INTEGER PRIMARY KEY,
	            map TEXT, econ_ct TEXT, econ_t TEXT,
	            created_at INTEGER)`)

	hub := newHub()

	http.HandleFunc("/gsi", gsiHandler(hub, db))
	http.HandleFunc("/ws", wsHandler(hub))
	http.Handle("/", http.FileServer(http.Dir("./static")))

	log.Println("Listening on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
