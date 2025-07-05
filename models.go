package main

// campos mínimos usados no projeto; GSI tem bem mais.
type GameState struct {
	Map struct {
		Name      string `json:"name"`
		TeamCT    Team   `json:"team_ct"`
		TeamT     Team   `json:"team_t"`
		RoundWins []int  `json:"round_wins"` // opcional
	} `json:"map"`
	Round struct {
		Phase string `json:"phase"`
	} `json:"round"`
	Player struct {
		SteamID string `json:"steamid"`
		Name    string `json:"name"`
	} `json:"player"`
	Econ EconTag `json:"econ,omitempty"` // preenchido por nós
}

type Team struct {
	EquipmentValue int `json:"equipment_value"`
}

type EconTag struct {
	CT string `json:"ct"`
	T  string `json:"tr"`
}

// Registro compacto de um round para o banco
type RoundStat struct {
	ID        int64  `db:"id"`
	Map       string `db:"map"`
	Site      string `db:"site"`
	Result    bool   `db:"result"`
	EconCT    string `db:"econ_ct"`
	EconT     string `db:"econ_t"`
	CreatedAt int64  `db:"created_at"`
}
