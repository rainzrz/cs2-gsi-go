import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, WifiOff, Gamepad2, Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface APIConnectionStatusProps {
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  gameState: any;
}

export const APIConnectionStatus = ({ isConnected, loading, error, gameState }: APIConnectionStatusProps) => {
  const getAPIStatus = () => {
    if (error) return { status: "Error", color: "destructive", icon: WifiOff };
    if (!isConnected) return { status: "Desconectado", color: "destructive", icon: WifiOff };
    if (loading) return { status: "Carregando...", color: "secondary", icon: Activity };
    return { status: "Conectado", color: "success", icon: Wifi };
  };

  const getGameStatus = () => {
    if (!gameState) return { status: "Desconectado", color: "destructive", icon: WifiOff };
    if (gameState.map) return { status: "Em Jogo", color: "success", icon: Gamepad2 };
    return { status: "No Menu", color: "warning", icon: Gamepad2 };
  };

  const apiStatus = getAPIStatus();
  const gameStatus = getGameStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* API Status */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="w-5 h-5 text-primary" />
            Status da API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                apiStatus.color === "success" ? "bg-success/20" :
                apiStatus.color === "warning" ? "bg-warning/20" :
                apiStatus.color === "destructive" ? "bg-destructive/20" :
                "bg-secondary/20"
              )}>
                <apiStatus.icon className={cn(
                  "w-5 h-5",
                  apiStatus.color === "success" ? "text-success" :
                  apiStatus.color === "warning" ? "text-warning" :
                  apiStatus.color === "destructive" ? "text-destructive" :
                  "text-secondary-foreground"
                )} />
              </div>
              <div>
                <Badge variant={apiStatus.color as any} className="mb-1">
                  {apiStatus.status}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  localhost:5000
                </div>
              </div>
            </div>
            <div className={cn(
              "w-3 h-3 rounded-full",
              isConnected && !error ? "bg-success animate-pulse" : "bg-destructive"
            )} />
          </div>
          
          {error && (
            <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Status */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="w-5 h-5 text-primary" />
            Status do Jogo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                gameStatus.color === "success" ? "bg-success/20" :
                gameStatus.color === "warning" ? "bg-warning/20" :
                gameStatus.color === "destructive" ? "bg-destructive/20" :
                "bg-secondary/20"
              )}>
                <gameStatus.icon className={cn(
                  "w-5 h-5",
                  gameStatus.color === "success" ? "text-success" :
                  gameStatus.color === "warning" ? "text-warning" :
                  gameStatus.color === "destructive" ? "text-destructive" :
                  "text-secondary-foreground"
                )} />
              </div>
              <div>
                <Badge variant={gameStatus.color as any} className="mb-1">
                  {gameStatus.status}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {gameState?.map?.name || "Counter-Strike 2"}
                </div>
              </div>
            </div>
            <div className={cn(
              "w-3 h-3 rounded-full",
              gameState?.map ? "bg-success animate-pulse" : "bg-warning"
            )} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};