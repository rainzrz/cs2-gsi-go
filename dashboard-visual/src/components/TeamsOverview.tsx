import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Shield, Target } from "lucide-react";

interface TeamsOverviewProps {
  mapData: any;
  teams: any;
  lossBonus: any;
}

export const TeamsOverview = ({ mapData, teams, lossBonus }: TeamsOverviewProps) => {
  if (!mapData) return null;

  const ctScore = mapData.team_ct?.score || 0;
  const tScore = mapData.team_t?.score || 0;
  const ctLosses = mapData.team_ct?.consecutive_round_losses || 0;
  const tLosses = mapData.team_t?.consecutive_round_losses || 0;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Teams Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold">CT</span>
            </div>
            <div className="text-3xl font-bold text-primary">{ctScore}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              Losses: {ctLosses}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">VS</div>
            <Separator className="my-2" />
            <div className="text-sm text-muted-foreground">
              Round {mapData.round || 0}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-accent font-semibold">T</span>
            </div>
            <div className="text-3xl font-bold text-accent">{tScore}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              Losses: {tLosses}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Match Progress</span>
            <span>{ctScore + tScore}/30</span>
          </div>
          <Progress 
            value={(ctScore + tScore) / 30 * 100} 
            className="h-2 bg-secondary"
          />
        </div>

        {/* Loss Bonus Information */}
        {lossBonus && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Loss Bonus</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-primary font-semibold">CT Team</div>
                <div className="text-2xl font-bold text-success">
                  ${lossBonus.ct_loss_bonus || 0}
                </div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-accent font-semibold">T Team</div>
                <div className="text-2xl font-bold text-success">
                  ${lossBonus.t_loss_bonus || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Team Stats */}
        {teams && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Team Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-primary font-medium">Counter-Terrorists</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Money:</span>
                    <span className="text-success">${teams.ct_total_money || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players Alive:</span>
                    <span className="text-status-alive">{teams.ct_alive_players || 0}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-accent font-medium">Terrorists</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Money:</span>
                    <span className="text-success">${teams.t_total_money || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players Alive:</span>
                    <span className="text-status-alive">{teams.t_alive_players || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};