import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bomb, Target } from "lucide-react";

interface BombSiteStatsProps {
  mapData: any;
}

export const BombSiteStats = ({ mapData }: BombSiteStatsProps) => {
  // Simulação: supondo que no futuro virá do backend ou de estatísticas reais
  // Aqui, tentativas e sucessos são mockados, mas a lógica já considera 0 como inicial
  const hasData = !!(mapData && (mapData.team_ct || mapData.team_t));
  // Exemplo: supondo que mapData.bombsite_stats existe no futuro
  const bombAAttempts = mapData?.bombsite_stats?.A?.attempts ?? 0;
  const bombASuccess = mapData?.bombsite_stats?.A?.success ?? 0;
  const bombBAttempts = mapData?.bombsite_stats?.B?.attempts ?? 0;
  const bombBSuccess = mapData?.bombsite_stats?.B?.success ?? 0;

  // Winrate só é calculado se houver tentativas
  const bombAWinRate = bombAAttempts > 0 ? Math.round((bombASuccess / bombAAttempts) * 100) : 0;
  const bombBWinRate = bombBAttempts > 0 ? Math.round((bombBSuccess / bombBAttempts) * 100) : 0;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bomb className="w-5 h-5 text-primary" />
          Estatísticas dos Sites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bomb Site A */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">A</span>
              </div>
              <span className="font-semibold text-foreground">Bomb Site A</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{bombAWinRate}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
          <Progress value={bombAWinRate} className="h-3 bg-secondary" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tentativas: {bombAAttempts}</span>
            <span>Sucessos: {bombASuccess}</span>
          </div>
        </div>

        <div className="border-t border-border"></div>

        {/* Bomb Site B */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">B</span>
              </div>
              <span className="font-semibold text-foreground">Bomb Site B</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{bombBWinRate}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
          <Progress value={bombBWinRate} className="h-3 bg-secondary" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tentativas: {bombBAttempts}</span>
            <span>Sucessos: {bombBSuccess}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/20 rounded-lg p-3 space-y-2">
          <div className="text-sm font-semibold text-foreground">Recomendação</div>
          <div className="text-sm text-muted-foreground">
            {bombAAttempts === 0 && bombBAttempts === 0
              ? "Aguardando dados do jogo para gerar recomendações."
              : bombAWinRate > bombBWinRate 
                ? "Site A tem maior taxa de sucesso. Considere focar ataques no Site A."
                : "Site B tem maior taxa de sucesso. Considere focar ataques no Site B."
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};