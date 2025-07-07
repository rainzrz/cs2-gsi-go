import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Shield, Target, Bomb, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RoundHistoryProps {
  mapData: any;
}

interface RoundEntry {
  round: number;
  winner: 'CT' | 'T';
  winType: string;
  timestamp: Date;
}

export const RoundHistory = ({ mapData }: RoundHistoryProps) => {
  const [history, setHistory] = useState<RoundEntry[]>([]);
  const prevCtScore = useRef<number>(0);
  const prevTScore = useRef<number>(0);
  const roundNumber = (mapData?.current_round || mapData?.round || 0);
  const ctScore = mapData?.team_ct?.score || 0;
  const tScore = mapData?.team_t?.score || 0;

  // Detecta mudança no placar e registra o vencedor
  useEffect(() => {
    if (ctScore > prevCtScore.current) {
      setHistory((prev) => [
        ...prev,
        {
          round: prev.length + 1,
          winner: 'CT',
          winType: 'elimination', // Pode ser aprimorado se houver info
          timestamp: new Date()
        }
      ]);
    } else if (tScore > prevTScore.current) {
      setHistory((prev) => [
        ...prev,
        {
          round: prev.length + 1,
          winner: 'T',
          winType: 'elimination',
          timestamp: new Date()
        }
      ]);
    }
    prevCtScore.current = ctScore;
    prevTScore.current = tScore;
    // eslint-disable-next-line
  }, [ctScore, tScore]);

  // Reseta histórico se o mapa mudar ou resetar
  useEffect(() => {
    if (ctScore === 0 && tScore === 0) {
      setHistory([]);
    }
    // eslint-disable-next-line
  }, [mapData?.map_name]);

  const getWinTypeIcon = (type: string) => {
    switch (type) {
      case 'bomb': return Bomb;
      case 'elimination': return Target;
      case 'time': return Clock;
      default: return Target;
    }
  };

  const getWinTypeText = (type: string) => {
    switch (type) {
      case 'bomb': return 'Bomba';
      case 'elimination': return 'Eliminação';
      case 'time': return 'Tempo';
      default: return 'Desconhecido';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Histórico de Rounds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum histórico de rounds disponível</p>
              </div>
            ) : (
              [...history].reverse().map((round, index) => {
                const WinIcon = getWinTypeIcon(round.winType);
                const isCtWin = round.winner === 'CT';
                return (
                  <div key={round.round} className="relative">
                    <div className="flex items-start gap-4 p-3 bg-muted/10 rounded-lg border border-muted/20">
                      {/* Round indicator */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isCtWin 
                          ? 'bg-team-ct/20 border-team-ct text-team-ct' 
                          : 'bg-team-t/20 border-team-t text-team-t'
                      }`}>
                        <span className="font-bold text-sm">R{round.round}</span>
                      </div>
                      {/* Round details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isCtWin ? (
                              <Shield className="w-4 h-4 text-team-ct" />
                            ) : (
                              <Target className="w-4 h-4 text-team-t" />
                            )}
                            <Badge 
                              variant="outline" 
                              className={`${isCtWin ? 'border-team-ct text-team-ct' : 'border-team-t text-team-t'}`}
                            >
                              {round.winner} Vitória
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(round.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <WinIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Vitória por {getWinTypeText(round.winType)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};