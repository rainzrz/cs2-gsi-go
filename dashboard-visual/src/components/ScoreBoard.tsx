import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Target } from "lucide-react";

interface ScoreBoardProps {
  mapData: any;
}

export const ScoreBoard = ({ mapData }: ScoreBoardProps) => {
  if (!mapData) return null;

  const ctScore = mapData.team_ct?.score || 0;
  const tScore = mapData.team_t?.score || 0;
  const currentRound = mapData.round || 0;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-foreground">Placar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 items-center gap-6">
          {/* CT Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-6 h-6 text-team-ct" />
              <span className="text-team-ct font-bold text-lg">CT</span>
            </div>
            <div className="text-5xl font-bold text-team-ct mb-2">{ctScore}</div>
            <Badge variant="outline" className="border-team-ct text-team-ct">
              Counter-Terrorists
            </Badge>
          </div>
          
          {/* VS and Round */}
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground mb-2">VS</div>
            <div className="text-primary font-semibold">
              Round {currentRound}
            </div>
          </div>
          
          {/* T Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="w-6 h-6 text-team-t" />
              <span className="text-team-t font-bold text-lg">T</span>
            </div>
            <div className="text-5xl font-bold text-team-t mb-2">{tScore}</div>
            <Badge variant="outline" className="border-team-t text-team-t">
              Terrorists
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};