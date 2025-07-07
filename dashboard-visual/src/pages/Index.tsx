import { useCS2API } from "@/hooks/useCS2API";
import { useTheme } from "@/hooks/useTheme";
import { APIConnectionStatus } from "@/components/APIConnectionStatus";
import { ScoreBoard } from "@/components/ScoreBoard";
import { EconomyStatus } from "@/components/EconomyStatus";
import { BombSiteStats } from "@/components/BombSiteStats";
import { RoundTips } from "@/components/RoundTips";
import { RoundHistory } from "@/components/RoundHistory";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw, Gamepad2, User, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/cs2-dashboard-hero.jpg";

const Index = () => {
  const {
    gameState,
    allPlayers,
    mapData,
    teams,
    lossBonus,
    isConnected,
    loading,
    error,
    refetch
  } = useCS2API();
  
  const { theme, setTheme } = useTheme();
  
  // Get player name from gameState
  const playerName = gameState?.player?.name || Object.values(allPlayers)[0]?.name || "Player";
  const mapName = mapData?.name || gameState?.map?.name || "Unknown Map";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        {/* Solid color banner */}
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{playerName}</h1>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="flex items-center gap-1">
                    <Map className="w-4 h-4" />
                    <span className="font-medium">{mapName}</span>
                  </div>
                  <span className="text-sm">•</span>
                  <span className="text-sm">Real-time monitoring</span>
                </div>
              </div>
            </div>
            <Button
              onClick={refetch}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Theme Selector */}
          <ThemeSelector onThemeChange={setTheme} currentTheme={theme} />

          {/* Status Row */}
          <APIConnectionStatus
            isConnected={isConnected}
            loading={loading}
            error={error}
            gameState={gameState}
          />

          {/* Scoreboard */}
          <ScoreBoard mapData={teams} />

          {/* Economy and Bomb Sites Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomyStatus teams={teams} allPlayers={allPlayers} />
            <BombSiteStats mapData={mapData} />
          </div>

          {/* Tips and History Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoundTips mapData={mapData} teams={teams} gameState={gameState} />
            <RoundHistory mapData={teams} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            CS2 GSI Dashboard - Real-time game state monitoring
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;