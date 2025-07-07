Game State Integration (GSI) para CS:GO / CS2

Documentação detalhada sobre a integração de estado de jogo (GSI) nos jogos da série Counter-Strike.

Índice

Visão Geral

Como Usar

Configuração do Arquivo .cfg

Campos Disponíveis

Componentes GSI

Componentes Avançados e para Espectador

Segurança

Exemplos de Código

Referências

Visão Geral

Game State Integration (GSI) é uma funcionalidade oficial da Valve que permite a aplicações externas receber dados do jogo CS:GO ou CS2 em tempo real. O jogo envia eventos para um endpoint HTTP configurado localmente ou remotamente por meio de requisições POST contendo o estado atual do jogo.

Isso é útil para:

Criar overlays e HUDs personalizados

Sincronizar luzes RGB, periféricos ou sistemas externos

Criar ferramentas de análise, estatísticas ou transmissão

Como Usar

Para começar a usar o GSI:

Crie um arquivo .cfg na pasta csgo/cfg/

Configure o endpoint (ex: http://localhost:3000)

Ative os campos que deseja receber

Implemente um receptor HTTP que trate os dados

Configuração do Arquivo .cfg

Caminho:

Steam/steamapps/common/Counter-Strike Global Offensive/csgo/cfg/

Exemplo básico

{
  "uri": "http://127.0.0.1:3000",
  "timeout": "5.0",
  "buffer": "0.1",
  "throttle": "0.1",
  "heartbeat": "30.0",
  "auth": {
    "token": "meuTokenDeSeguranca"
  },
  "data": {
    "provider": "1",
    "player_id": "1",
    "player_state": "1",
    "map": "1",
    "round": "1",
    "bomb": "1"
  }
}

Campos explicados

uri: endereço que receberá os dados via POST

timeout: quanto tempo o jogo espera por resposta

buffer: tempo para agrupar dados

throttle: mínimo intervalo entre eventos

heartbeat: frequência de "ping" mesmo sem eventos

auth.token: usado para validar o receptor

data: define quais partes do estado do jogo devem ser enviadas

Campos Disponíveis

provider: informações do cliente e versão

player_id: nome, SteamID, time e status

player_state: vida, colete, munição, dinheiro, etc.

player_position: coordenadas e direção do jogador

player_match_stats: kills, assists, deaths, MVPs, score

player_weapons: armamento e munição

map: nome do mapa, placar, rodada

bomb: estado da bomba (plantada, defusada...)

round: fase e resultado da rodada

Componentes GSI

provider

"provider": {
  "name": "Counter-Strike: Global Offensive",
  "appid": 730,
  "version": 13707,
  "steamid": "76561197984957084",
  "timestamp": 1660000000
}

player_id

"player": {
  "steamid": "7656119...",
  "name": "Jogador",
  "team": "T",
  "activity": "playing"
}

player_state

"state": {
  "health": 100,
  "armor": 50,
  "money": 800,
  "round_kills": 1
}

player_position

"position": "-1034.4, 512.5, 64.0",
"forward": "0.00, 1.00, 0.00"

player_match_stats

"match_stats": {
  "kills": 10,
  "assists": 2,
  "deaths": 5,
  "score": 25
}

player_weapons

"weapons": {
  "weapon_0": {
    "name": "weapon_ak47",
    "type": "Rifle",
    "state": "active",
    "ammo_clip": 30,
    "ammo_reserve": 90
  }
}

map

"map": {
  "name": "de_dust2",
  "round": 13,
  "team_ct": {"score": 7},
  "team_t": {"score": 6}
}

bomb

"bomb": {
  "state": "planting",
  "position": "100, 200, -50",
  "countdown": "3.0"
}

round

"round": {
  "phase": "over",
  "win_team": "CT",
  "bomb": "defused"
}

Componentes Avançados e para Espectador

allplayers_*

Campos aplicados a todos os jogadores (útil para espectador, streamers ou bots):

allplayers_id

allplayers_state

allplayers_position

allplayers_weapons

Observação: alto volume de dados — use com cuidado!

Específicos para modo espectador

bomb

player_position

phase_countdowns

allplayers_*

Segurança

Use auth.token para autenticação

Prefira usar HTTPS em produção

Evite expor o endpoint sem validação

Exemplos de Código

ASP.NET (C#)

[HttpPost("/csgo-gsi")]
public IActionResult Receive([FromBody] JsonElement data)
{
    Console.WriteLine("Estado do jogo recebido:");
    Console.WriteLine(data.ToString());
    return Ok();
}

Node.js (Express)

const express = require('express');
const app = express();
app.use(express.json());

app.post('/gsi', (req, res) => {
  console.log('GSI recebido:', req.body);
  res.sendStatus(200);
});

app.listen(3000);

Referências

Fonte 1 (Valve - Oficial)

Fonte 2 (Rakijah - CSGSI para C#)

Fonte 3 (Antonpup - CS2 GSI)

Fonte 4 (Bkid - Explicação Avançada)

