# 🎮 CS2 GSI GO

API REST e Dashboard Visual para monitoramento em tempo real do Counter-Strike 2 via Game State Integration (GSI).

---

## ✨ Visão Geral

Este projeto integra dados do CS2 em tempo real, oferecendo:
- **API RESTful** robusta em .NET 8
- **Dashboard visual moderno** (React + Vite + Tailwind + shadcn/ui)
- Insights de economia, rounds, estatísticas de sites, dicas dinâmicas e muito mais!

---

## 🚀 Instalação Rápida

### Pré-requisitos
- **Windows 10/11**
- **.NET 8.0** ou superior
- **Node.js 18+** e **npm**
- **PowerShell**
- **Counter-Strike 2** com GSI configurado

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/cs2-gsi-go.git
   cd cs2-gsi-go
   ```

2. **Inicie a API Backend:**
   ```powershell
   cd backend
   dotnet run
   ```
   Acesse: [http://localhost:5000/swagger](http://localhost:5000/swagger)

3. **Inicie o Dashboard Visual:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   O dashboard estará disponível em [http://localhost:8080](http://localhost:8080) (ou porta informada pelo Vite)

4. **Acesse:**
   - **Dashboard:** [http://localhost:8080](http://localhost:8080)
   - **API Swagger:** [http://localhost:5000/swagger](http://localhost:5000/swagger)
   - **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🏗️ Arquitetura do Projeto

```
cs2-gsi-go/
├── backend/           # API REST (.NET 8)
├── gsi-lib/           # Biblioteca GSI (C#)
├── frontend/          # Dashboard visual (React + Vite + Tailwind)
└── README.md          # Este arquivo
```

---

## 🖥️ Funcionalidades do Dashboard
- Status da API e do jogo em tempo real
- Histórico de rounds e vencedores
- Estatísticas detalhadas dos sites A/B (tentativas, sucessos, winrate)
- Situação econômica dos times (dinheiro total, média, dicas de compra)
- Dicas dinâmicas de estratégia e economia
- Seleção de tema visual (dark/light/colorido)
- Interface responsiva e moderna

---

## 🔗 Endpoints da API

| Endpoint             | Método | Descrição                                 |
|----------------------|--------|-------------------------------------------|
| `/api/health`        | GET    | Status da API                             |
| `/api/gamestate`     | GET    | Estado completo do jogo                   |
| `/api/player`        | GET    | Dados do jogador atual                    |
| `/api/map`           | GET    | Informações do mapa                       |
| `/api/allplayers`    | GET    | Todos os jogadores                        |
| `/api/bomb`          | GET    | Estado da bomba                           |
| `/api/grenades`      | GET    | Granadas ativas                           |
| `/api/teams`         | GET    | Estatísticas detalhadas dos times         |
| `/api/lossbonus`     | GET    | Informações de loss bonus                 |

> Explore todos os endpoints via Swagger: [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

## 🛠️ Scripts Úteis (Dashboard)

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

## ⚙️ Configuração do GSI no CS2

1. Copie o arquivo `cs2_gsi.cfg` para a pasta de configuração do CS2.
2. Certifique-se de que o CS2 está rodando e o GSI está ativo.
3. A API irá gerar automaticamente o arquivo de integração se necessário.

---

## 🧩 Tecnologias Utilizadas
- **Backend:** .NET 8, C#, ASP.NET Core, Swagger
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Comunicação:** REST API, WebSockets (futuro)

---

## 🧑‍💻 Desenvolvimento & Dicas
- O frontend e backend rodam separadamente em desenvolvimento.
- O frontend consome a API em `http://localhost:5000/api`.
- Para mudar a porta do dashboard:
  ```powershell
  npm run dev -- --port=5173
  ```
- Se a porta 8080 estiver ocupada, o Vite escolherá outra porta automaticamente.

---

## 🩹 Solução de Problemas

- **Erro de permissão no PowerShell:**
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **Porta ocupada:**
  ```powershell
  netstat -ano | findstr :5000
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```
- **API não recebe dados:**
  - Verifique se o CS2 está rodando e o GSI está configurado corretamente.
  - Confira o arquivo `cs2_gsi.cfg`.

---

## 📄 Licença

Projeto sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!

---

## 📚 Documentação Completa da Game State Integration (GSI)

> Abaixo está a documentação detalhada sobre a integração de estado de jogo (GSI) nos jogos da série Counter-Strike, traduzida e adaptada do arquivo csgo_gsi_documentacao.md.

# Game State Integration (GSI) para CS:GO / CS2

Documentação detalhada sobre a integração de estado de jogo (GSI) nos jogos da série Counter-Strike.

---

## Índice

- [Visão Geral](#visão-geral-gsi)
- [Como Usar](#como-usar-gsi)
- [Configuração do Arquivo .cfg](#configuração-do-arquivo-cfg-gsi)
- [Campos Disponíveis](#campos-disponíveis-gsi)
- [Componentes GSI](#componentes-gsi-gsi)
- [Componentes Avançados e para Espectador](#componentes-avançados-e-para-espectador-gsi)
- [Segurança](#segurança-gsi)
- [Exemplos de Código](#exemplos-de-código-gsi)
- [Referências](#referências-gsi)

---

## Visão Geral (GSI)

Game State Integration (GSI) é uma funcionalidade oficial da Valve que permite a aplicações externas receber dados do jogo CS:GO ou CS2 em tempo real. O jogo envia eventos para um endpoint HTTP configurado localmente ou remotamente por meio de requisições POST contendo o estado atual do jogo.

Isso é útil para:

- Criar overlays e HUDs personalizados
- Sincronizar luzes RGB, periféricos ou sistemas externos
- Criar ferramentas de análise, estatísticas ou transmissão

---

## Como Usar (GSI)

Para começar a usar o GSI:

1. Crie um arquivo `.cfg` na pasta `csgo/cfg/`
2. Configure o endpoint (ex: `http://localhost:3000`)
3. Ative os campos que deseja receber
4. Implemente um receptor HTTP que trate os dados

---

## Configuração do Arquivo .cfg (GSI)

### Caminho:

```
Steam/steamapps/common/Counter-Strike Global Offensive/csgo/cfg/
```

### Exemplo básico

```json
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
```

### Campos explicados

- `uri`: endereço que receberá os dados via POST
- `timeout`: quanto tempo o jogo espera por resposta
- `buffer`: tempo para agrupar dados
- `throttle`: mínimo intervalo entre eventos
- `heartbeat`: frequência de "ping" mesmo sem eventos
- `auth.token`: usado para validar o receptor
- `data`: define quais partes do estado do jogo devem ser enviadas

---

## Campos Disponíveis (GSI)

- `provider`: informações do cliente e versão
- `player_id`: nome, SteamID, time e status
- `player_state`: vida, colete, munição, dinheiro, etc.
- `player_position`: coordenadas e direção do jogador
- `player_match_stats`: kills, assists, deaths, MVPs, score
- `player_weapons`: armamento e munição
- `map`: nome do mapa, placar, rodada
- `bomb`: estado da bomba (plantada, defusada...)
- `round`: fase e resultado da rodada

---

## Componentes GSI (GSI)

### provider

```json
"provider": {
  "name": "Counter-Strike: Global Offensive",
  "appid": 730,
  "version": 13707,
  "steamid": "76561197984957084",
  "timestamp": 1660000000
}
```

### player_id

```json
"player": {
  "steamid": "7656119...",
  "name": "Jogador",
  "team": "T",
  "activity": "playing"
}
```

### player_state

```json
"state": {
  "health": 100,
  "armor": 50,
  "money": 800,
  "round_kills": 1
}
```

### player_position

```json
"position": "-1034.4, 512.5, 64.0",
"forward": "0.00, 1.00, 0.00"
```

### player_match_stats

```json
"match_stats": {
  "kills": 10,
  "assists": 2,
  "deaths": 5,
  "score": 25
}
```

### player_weapons

```json
"weapons": {
  "weapon_0": {
    "name": "weapon_ak47",
    "type": "Rifle",
    "state": "active",
    "ammo_clip": 30,
    "ammo_reserve": 90
  }
}
```

### map

```json
"map": {
  "name": "de_dust2",
  "round": 13,
  "team_ct": {"score": 7},
  "team_t": {"score": 6}
}
```

### bomb

```json
"bomb": {
  "state": "planting",
  "position": "100, 200, -50",
  "countdown": "3.0"
}
```

### round

```json
"round": {
  "phase": "over",
  "win_team": "CT",
  "bomb": "defused"
}
```

---

## Componentes Avançados e para Espectador (GSI)

### `allplayers_*`

Campos aplicados a todos os jogadores (útil para espectador, streamers ou bots):

- `allplayers_id`
- `allplayers_state`
- `allplayers_position`
- `allplayers_weapons`

**Observação:** alto volume de dados — use com cuidado!

### Específicos para modo espectador

- `bomb`
- `player_position`
- `phase_countdowns`
- `allplayers_*`

---

## Segurança (GSI)

- Use `auth.token` para autenticação
- Prefira usar HTTPS em produção
- Evite expor o endpoint sem validação

---

## Exemplos de Código (GSI)

### ASP.NET (C#)

```csharp
[HttpPost("/csgo-gsi")]
public IActionResult Receive([FromBody] JsonElement data)
{
    Console.WriteLine("Estado do jogo recebido:");
    Console.WriteLine(data.ToString());
    return Ok();
}
```

### Node.js (Express)

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/gsi', (req, res) => {
  console.log('GSI recebido:', req.body);
  res.sendStatus(200);
});

app.listen(3000);
```

---

## Referências (GSI)

- [Valve - Oficial](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration)
- [Rakijah - CSGSI para C#](https://github.com/rakijah/CSGSI)
- [Antonpup - CS2 GSI](https://github.com/antonpup/CounterStrike2GSI)
- [Bkid - Explicação Avançada](https://www.reddit.com/r/GlobalOffensive/comments/cjhcpy/game_state_integration_a_very_large_and_indepth/)
