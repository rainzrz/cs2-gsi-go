import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GameStatusProps {
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  mapData: any;
}

export const GameStatus = ({ isConnected, loading, error, mapData }: GameStatusProps) => {
  const getStatusColor = () => {
    if (!isConnected || error) return "destructive";
    if (loading) return "secondary";
    return "default";
  };

  const getStatusText = () => {
    if (error) return "API Error";
    if (!isConnected) return "Disconnected";
    if (loading) return "Loading...";
    return "Connected";
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-foreground">CS2 Game Status</span>
          <Badge variant={getStatusColor()} className="text-sm">
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              isConnected && !error && !loading ? "bg-status-alive animate-pulse" : "bg-destructive"
            )} />
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mapData && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Map:</span>
              <span className="text-accent font-semibold">{mapData.name || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mode:</span>
              <span className="text-foreground">{mapData.mode || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Phase:</span>
              <Badge variant="secondary" className="text-xs">
                {mapData.phase || "N/A"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Round:</span>
              <span className="text-primary font-bold">{mapData.round || 0}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};