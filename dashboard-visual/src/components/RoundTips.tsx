import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle, CheckCircle, Target, ShoppingCart } from "lucide-react";

interface RoundTipsProps {
  mapData: any;
  teams: any;
  gameState: any;
}

export const RoundTips = ({ mapData, teams, gameState }: RoundTipsProps) => {
  const hasGameStarted = !!(mapData && mapData.round && mapData.round > 0);

  // Função para sugerir tipo de compra baseado na média de dinheiro
  const getBuySuggestion = (totalMoney: number, playerCount: number) => {
    if (!playerCount) return "Desconhecido";
    const avg = totalMoney / playerCount;
    if (avg >= 5000) return "Full Buy (compra completa) recomendada";
    if (avg >= 4000) return "Buy (compra padrão) possível";
    if (avg >= 2500) return "Force Buy (forçar compra) possível";
    if (avg >= 1500) return "Semi-Eco (compra leve) sugerida";
    return "Eco (guardar dinheiro) recomendada";
  };

  const getTips = () => {
    if (!hasGameStarted) return [];
    const tips = [];
    const ctMoney = teams?.ct_total_money || 0;
    const tMoney = teams?.t_total_money || 0;
    const ctPlayers = teams?.ct_alive_players || 5;
    const tPlayers = teams?.t_alive_players || 5;
    const currentRound = mapData?.round || 0;
    const ctScore = mapData?.team_ct?.score || 0;
    const tScore = mapData?.team_t?.score || 0;

    // Dica dinâmica para CT
    tips.push({
      type: "info",
      icon: ShoppingCart,
      title: "CT - Situação Econômica",
      description: getBuySuggestion(ctMoney, ctPlayers),
      priority: "high"
    });

    // Dica dinâmica para T
    tips.push({
      type: "info",
      icon: ShoppingCart,
      title: "T - Situação Econômica",
      description: getBuySuggestion(tMoney, tPlayers),
      priority: "high"
    });

    // Dica estratégica padrão
    tips.push({
      type: "success",
      icon: CheckCircle,
      title: "Dica Estratégica",
      description: "Gerencie a economia do time para garantir rodadas fortes e evitar resets.",
      priority: "low"
    });

    return tips;
  };

  const tips = getTips();

  const getVariantFromType = (type: string) => {
    switch (type) {
      case "warning": return "warning";
      case "success": return "success";
      case "info": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Dicas do Round
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasGameStarted && tips.length > 0 ? (
          tips.slice(0, 4).map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg border border-muted/20">
              <div className={`p-2 rounded-full ${
                tip.type === 'warning' ? 'bg-warning/20' :
                tip.type === 'success' ? 'bg-success/20' :
                'bg-secondary/20'
              }`}>
                <tip.icon className={`w-4 h-4 ${
                  tip.type === 'warning' ? 'text-primary' :
                  tip.type === 'success' ? 'text-success' :
                  'text-secondary-foreground'
                }`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-sm">{tip.title}</h4>
                  <Badge variant={getVariantFromType(tip.type) as any} className="text-xs">
                    {tip.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aguardando dados do jogo para gerar dicas...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};