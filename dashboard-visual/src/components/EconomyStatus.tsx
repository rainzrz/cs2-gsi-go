import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface EconomyStatusProps {
  teams: any;
  allPlayers: Record<string, any>;
}

export const EconomyStatus = ({ teams, allPlayers }: EconomyStatusProps) => {
  const getEconomyTag = (totalMoney: number, playerCount: number) => {
    if (!totalMoney || !playerCount) return "Unknown";
    
    const avgMoney = totalMoney / playerCount;
    
    if (avgMoney >= 4000) return "Full Buy";
    if (avgMoney >= 2500) return "Force Buy";
    if (avgMoney >= 1500) return "Semi-Eco";
    return "Eco";
  };

  const getTagVariant = (tag: string) => {
    switch (tag) {
      case "Full Buy": return "success";
      case "Force Buy": return "warning";
      case "Semi-Eco": return "secondary";
      case "Eco": return "destructive";
      default: return "outline";
    }
  };

  const ctMoney = teams?.ct_total_money || 0;
  const tMoney = teams?.t_total_money || 0;
  const ctPlayers = teams?.ct_alive_players || 5;
  const tPlayers = teams?.t_alive_players || 5;

  const ctTag = getEconomyTag(ctMoney, ctPlayers);
  const tTag = getEconomyTag(tMoney, tPlayers);

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Economia dos Times
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CT Economy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">CT</Badge>
              <span className="text-team-ct font-semibold text-white">Counter-Terrorists</span>
            </div>
            <Badge variant={getTagVariant(ctTag) as any} className="text-sm">
              {ctTag}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Economia Total:</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold text-primary">${ctMoney}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Média por Jogador:</span>
            <span className="text-primary font-semibold">
              ${Math.round(ctMoney / ctPlayers)}
            </span>
          </div>
        </div>

        <div className="border-t border-border"></div>

        {/* T Economy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-accent text-accent">T</Badge>
              <span className="text-team-t font-semibold text-white">Terrorists</span>
            </div>
            <Badge variant={getTagVariant(tTag) as any} className="text-sm">
              {tTag}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Economia Total:</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold text-primary">${tMoney}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Média por Jogador:</span>
            <span className="text-primary font-semibold">
              ${Math.round(tMoney / tPlayers)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};