# CS2 GSI API

Uma API web que expõe todas as informações possíveis de coletar do Counter-Strike 2 através do Game State Integration (GSI).

## Como usar

1. **Execute a API:**
   ```bash
   dotnet run --project CS2GSI-API/CS2GSI-API.csproj
   ```

2. **A API estará disponível em:**
   - **API**: http://localhost:5000
   - **Swagger UI**: http://localhost:5000/swagger
   - **GSI Port**: 4000 (para o CS2 enviar dados)

3. **Endpoints disponíveis:**

   - **`GET /api/gamestate`** - Todas as informações do jogo
   - **`GET /api/player`** - Informações do jogador local
   - **`GET /api/map`** - Informações do mapa e times
   - **`GET /api/allplayers`** - Informações de todos os jogadores
   - **`GET /api/bomb`** - Status da bomba
   - **`GET /api/grenades`** - Todas as granadas no mapa
   - **`GET /api/health`** - Status da API

## Informações coletadas

### Jogador Local (`/api/player`)
- Nome, Steam ID, Time
- Vida, Armadura, Dinheiro
- Armas (nome, munição, estado)
- Estatísticas da partida (kills, deaths, assists)
- Posição no mapa (X, Y, Z)
- Estado (flashed, smoked, burning, etc.)

### Mapa (`/api/map`)
- Nome do mapa, modo de jogo
- Fase atual (warmup, live, intermission)
- Placar dos times (CT e T)
- Round atual
- Timeouts restantes
- Espectadores

### Todos os Jogadores (`/api/allplayers`)
- Informações de todos os jogadores no servidor
- Mesmas informações do jogador local para cada um

### Bomba (`/api/bomb`)
- Estado (carried, planted, defused, exploded)
- Posição no mapa
- Jogador carregando

### Granadas (`/api/grenades`)
- Tipo de granada
- Posição e velocidade
- Tempo de vida
- Proprietário

### Round (`/api/gamestate.round`)
- Fase do round
- Condição de vitória
- Status da bomba

## Exemplo de uso

```bash
# Obter todas as informações
curl http://localhost:5000/api/gamestate

# Obter apenas informações do jogador
curl http://localhost:5000/api/player

# Verificar se a API está funcionando
curl http://localhost:5000/api/health
```

## Configuração do CS2

A API automaticamente gera o arquivo de configuração GSI para o CS2. Certifique-se de que:

1. O CS2 está rodando
2. A API está executando na porta 4000
3. O arquivo de configuração foi gerado em: `[CS2_DIR]/game/csgo/cfg/gamestate_integration_CS2GSI-API.cfg`

## Swagger UI

Acesse http://localhost:5000/swagger para uma interface web interativa que permite testar todos os endpoints. 