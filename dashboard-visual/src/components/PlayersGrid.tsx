import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Heart, Shield, DollarSign } from "lucide-react";
import { Player } from "@/hooks/useCS2API";
import { cn } from "@/lib/utils";

interface PlayersGridProps {
  allPlayers: Record<string, Player>;
}

export const PlayersGrid = ({ allPlayers }: PlayersGridProps) => {
  const players = Object.entries(allPlayers);

  if (players.length === 0) {
    return (
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No players data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map(([playerId, player]) => (
        <Card key={playerId} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="truncate">{player.name || playerId}</span>
              </div>
              <Badge 
                variant={player.state?.health > 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {player.state?.health > 0 ? "ALIVE" : "DEAD"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Health & Armor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-status-alive" />
                  <span className="text-muted-foreground">Health</span>
                </div>
                <span className={cn(
                  "font-semibold",
                  (player.state?.health || 0) > 50 ? "text-status-alive" : "text-destructive"
                )}>
                  {player.state?.health || 0}
                </span>
              </div>
              <Progress 
                value={player.state?.health || 0} 
                className="h-2 bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-team-ct" />
                  <span className="text-muted-foreground">Armor</span>
                </div>
                <span className="font-semibold text-team-ct">
                  {player.state?.armor || 0}
                </span>
              </div>
              <Progress 
                value={player.state?.armor || 0} 
                className="h-2 bg-secondary"
              />
            </div>

            {/* Money */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-muted-foreground text-sm">Money</span>
              </div>
              <span className="font-bold text-success">
                ${player.state?.money || 0}
              </span>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Equipment</div>
              <div className="flex flex-wrap gap-1">
                {player.state?.helmet && (
                  <Badge variant="secondary" className="text-xs">
                    Helmet
                  </Badge>
                )}
                {player.has_defusekit && (
                  <Badge variant="secondary" className="text-xs">
                    Defuse Kit
                  </Badge>
                )}
                {player.state?.equip_value && (
                  <Badge variant="outline" className="text-xs">
                    ${player.state.equip_value}
                  </Badge>
                )}
              </div>
            </div>

            {/* Round Stats */}
            {(player.state?.round_kills > 0 || player.state?.round_killhs > 0) && (
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-warning font-bold">
                      {player.state?.round_kills || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Kills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-warning font-bold">
                      {player.state?.round_killhs || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Headshots</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};