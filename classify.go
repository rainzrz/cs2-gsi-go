package main

func classify(value int) string {
	switch {
	case value >= 20000:
		return "FULL"
	case value >= 12000:
		return "FORCE"
	default:
		return "ECO"
	}
}

func addEconTags(g *GameState) {
	g.Econ.CT = classify(g.Map.TeamCT.EquipmentValue)
	g.Econ.T = classify(g.Map.TeamT.EquipmentValue)
}
