import { useState, useEffect } from 'react';

// Types for CS2 API responses
export interface Player {
  name: string;
  money: number;
  health: number;
  armor: number;
  has_helmet: boolean;
  has_defusekit: boolean;
  weapons: Record<string, any>;
  state: {
    health: number;
    armor: number;
    helmet: boolean;
    flashed: number;
    smoked: number;
    burning: number;
    money: number;
    round_kills: number;
    round_killhs: number;
    equip_value: number;
  };
}

export interface Team {
  score: number;
  consecutive_round_losses: number;
  timeouts_remaining: number;
  matches_won_this_series: number;
}

export interface MapData {
  mode: string;
  name: string;
  phase: string;
  round: number;
  team_ct: Team;
  team_t: Team;
  num_matches_to_win_series: number;
  current_spectators: number;
  souvenirs_total: number;
}

export interface GameState {
  provider: any;
  map: MapData;
  round: any;
  player: Player;
  allplayers: Record<string, Player>;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const useCS2API = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [allPlayers, setAllPlayers] = useState<Record<string, Player>>({});
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [teams, setTeams] = useState<any>(null);
  const [lossBonus, setLossBonus] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

  const checkHealth = async () => {
    try {
      const health = await fetchData('/health');
      setIsConnected(true);
      return health;
    } catch (err) {
      setIsConnected(false);
      throw err;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [healthData, gameStateData, playersData, mapDataRes, teamsData, lossBonusData] = await Promise.allSettled([
        checkHealth(),
        fetchData('/gamestate'),
        fetchData('/allplayers'),
        fetchData('/map'),
        fetchData('/teams'),
        fetchData('/lossbonus')
      ]);

      if (healthData.status === 'fulfilled') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      if (gameStateData.status === 'fulfilled') {
        setGameState(gameStateData.value);
      }

      if (playersData.status === 'fulfilled') {
        setAllPlayers(playersData.value);
      }

      if (mapDataRes.status === 'fulfilled') {
        setMapData(mapDataRes.value);
      }

      if (teamsData.status === 'fulfilled') {
        setTeams(teamsData.value);
      }

      if (lossBonusData.status === 'fulfilled') {
        setLossBonus(lossBonusData.value);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchAllData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    gameState,
    allPlayers,
    mapData,
    teams,
    lossBonus,
    isConnected,
    loading,
    error,
    refetch: fetchAllData
  };
};