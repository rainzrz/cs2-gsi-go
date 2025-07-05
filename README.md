# Counter-Strike 2 GSI (Game State Integration)

[![Counter-Strike 2](https://img.shields.io/badge/CS2-243779?style=flat&label=Game&labelColor=fbab1d)](https://store.steampowered.com/app/730/)
[![.NET](https://github.com/antonpup/CounterStrike2GSI/actions/workflows/dotnet.yml/badge.svg?branch=master)](https://github.com/antonpup/CounterStrike2GSI/actions/workflows/dotnet.yml)
[![GitHub Release](https://img.shields.io/github/v/release/antonpup/CounterStrike2GSI)](https://github.com/antonpup/CounterStrike2GSI/releases/latest)
[![NuGet Version](https://img.shields.io/nuget/v/CounterStrike2GSI)](https://www.nuget.org/packages/CounterStrike2GSI)
[![NuGet Downloads](https://img.shields.io/nuget/dt/CounterStrike2GSI?label=nuget%20downloads)](https://www.nuget.org/packages/CounterStrike2GSI)

Uma biblioteca C# para integrar com o Game State Integration do Counter-Strike 2.

## 📋 Sobre o Counter-Strike 2 GSI

Esta biblioteca fornece uma maneira fácil de implementar a integração com o Game State do Counter-Strike 2 em aplicações C# através da exposição de vários eventos.

Nos bastidores, uma vez que a biblioteca é iniciada, ela escuta continuamente por requisições HTTP POST feitas pelo jogo em um endereço e porta específicos. Quando uma requisição é recebida, os dados JSON são analisados em um objeto [GameState](#estrutura-do-game-state) e são oferecidos à sua aplicação C# através do evento `NewGameState`. A biblioteca também se inscreve no `NewGameState` para determinar mudanças mais granulares e disparar eventos mais específicos _(como `BombStateUpdated`, `PlayerWeaponsPickedUp`, ou `RoundConcluded` para citar alguns)_. Uma lista completa dos eventos de jogo implementados pode ser encontrada na seção [Eventos de Jogo Implementados](#eventos-de-jogo-implementados).

## 🎮 Sobre Game State Integration

Game State Integration é a implementação da Valve para expor o estado atual do jogo _(como vida do jogador, mana, munição, etc.)_ e eventos do jogo sem a necessidade de ler a memória do jogo ou arriscar detecção de anti-cheat. As informações expostas pelo GSI são limitadas ao que a Valve determinou expor. Por exemplo, o jogo pode expor informações sobre todos os jogadores no servidor enquanto você está assistindo uma partida, mas só exporá informações do jogador local quando você estiver jogando. Embora as informações sejam limitadas, há informações suficientes para criar uma ferramenta de análise de jogo ao vivo, criar efeitos de iluminação RGB personalizados, ou criar um plugin de streaming ao vivo para mostrar informações adicionais do jogo. Por exemplo, o GSI pode ser visto sendo usado durante transmissões ao vivo de torneios competitivos para mostrar informações do jogador atualmente sendo observado e estatísticas do jogo.

Você pode ler sobre Game State Integration para Counter-Strike: Global Offensive [aqui](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration).

## 🚀 Instalação

Instale do [nuget](https://www.nuget.org/packages/CounterStrike2GSI).

## 🔨 Compilando o Counter-Strike 2 GSI

### Método 1: Visual Studio (Recomendado)
1. Certifique-se de ter o Visual Studio instalado com o workload `.NET desktop development` e o componente individual `.Net 8.0 Runtime`.
2. Certifique-se de ter o CMake 3.26 ou posterior instalado de [https://cmake.org/](https://cmake.org/).
3. No diretório raiz do repositório execute: `cmake -B build/ .` para gerar o arquivo de solução do projeto.
4. Abra a solução do projeto localizada em `build/CounterStrike2GSI.sln`.

### Método 2: .NET SDK (Alternativo)
1. Certifique-se de ter o .NET 8.0 SDK instalado.
2. Execute os seguintes comandos:
```bash
dotnet build CounterStrike2GSI/CounterStrike2GSI.csproj
dotnet build "CounterStrike2GSI Example Program/CounterStrike2GSI Example Program/CounterStrike2GSI Example Program.csproj"
```

## 📖 Como usar

### 1. Exemplo Básico
Após instalar o [pacote CounterStrike2GSI do nuget](https://www.nuget.org/packages/CounterStrike2GSI) em seu projeto, crie uma instância de `GameStateListener`, fornecendo uma porta personalizada ou URI personalizada.

```C#
GameStateListener gsl = new GameStateListener(3000); //http://localhost:3000/
```

ou

```C#
GameStateListener gsl = new GameStateListener("http://127.0.0.1:1234/");
```

> **Nota**: Se sua aplicação precisar escutar em um URI diferente de `http://localhost:*/` (por exemplo `http://192.168.0.2:100/`), você precisará executar sua aplicação com privilégios de administrador.

### 2. Configuração do GSI
Crie um arquivo de configuração de Game State Integration. Isso pode ser feito manualmente criando um arquivo `<CAMINHO PARA O DIRETÓRIO DO JOGO>/game/csgo/cfg/gamestate_integration_<NOME PERSONALIZADO>.cfg` onde `<NOME PERSONALIZADO>` deve ser o nome da sua aplicação (pode ser qualquer coisa). Ou você pode usar a função integrada `GenerateGSIConfigFile()` para localizar automaticamente o diretório do jogo e gerar o arquivo. A função automaticamente levará em consideração o URI especificado quando uma instância de `GameStateListener` foi criada na etapa anterior.

```C#
if (!gsl.GenerateGSIConfigFile("Example"))
{
    Console.WriteLine("Não foi possível gerar o arquivo de configuração GSI.");
}
```

A função `GenerateGSIConfigFile` recebe uma string `name` como parâmetro. Este é o `<NOME PERSONALIZADO>` mencionado anteriormente. A função também retornará `True` quando a geração do arquivo for bem-sucedida, e `False` caso contrário. O arquivo resultante do código acima deve se parecer com isto:

```
"Example Integration Configuration"
{
    "uri"          "http://localhost:3000/"
    "timeout"      "5.0"
    "buffer"       "0.1"
    "throttle"     "0.1"
    "heartbeat"    "10.0"
    "data"
    {
        "provider"                  "1"
        "tournamentdraft"           "1"
        "map"                       "1"
        "map_round_wins"            "1"
        "round"                     "1"
        "player_id"                 "1"
        "player_state"              "1"
        "player_weapons"            "1"
        "player_match_stats"        "1"
        "player_position"           "1"
        "phase_countdowns"          "1"
        "allplayers_id"             "1"
        "allplayers_state"          "1"
        "allplayers_match_stats"    "1"
        "allplayers_weapons"        "1"
        "allplayers_position"       "1"
        "allgrenades"               "1"
        "bomb"                      "1"
    }
}
```

### 3. Criar Handlers e Inscrever-se em Eventos
Crie handlers e inscreva-se nos eventos que sua aplicação usará. (Uma lista completa dos eventos de jogo expostos pode ser encontrada na seção [Eventos de Jogo Implementados](#eventos-de-jogo-implementados).)

Se sua aplicação só precisar de informações do `GameState`, isso é feito inscrevendo-se no evento `NewGameState` e criando um handler para ele:

```C#
...
gsl.NewGameState += OnNewGameState;
...

void OnNewGameState(GameState gs)
{
    // Ler informações do estado do jogo.
}
```

Se você gostaria de utilizar `Eventos de Jogo` em sua aplicação, isso é feito inscrevendo-se em um evento da lista [Eventos de Jogo Implementados](#eventos-de-jogo-implementados) e criando um handler para ele:

```C#
...
gsl.GameEvent += OnGameEvent; // Disparará em todos os GameEvent
gsl.BombStateUpdated += OnBombStateUpdated; // Só disparará em eventos BombStateUpdated.
gsl.PlayerWeaponsPickedUp += OnPlayerWeaponsPickedUp; // Só disparará em eventos PlayerWeaponsPickedUp.
gsl.RoundConcluded += OnRoundConcluded; // Só disparará em eventos RoundConcluded.
...

void OnGameEvent(CS2GameEvent game_event)
{
    // Ler informações do evento de jogo.
    
    if (game_event is PlayerTookDamage player_took_damage)
    {
        Console.WriteLine($"O jogador {player_took_damage.Player.Name} tomou {player_took_damage.Previous - player_took_damage.New} de dano!");
    }
    else if (game_event is PlayerActiveWeaponChanged active_weapon_changed)
    {
        Console.WriteLine($"O jogador {active_weapon_changed.Player.Name} mudou sua arma ativa para {active_weapon_changed.New.Name} de {active_weapon_changed.Previous.Name}.");
    }
}

void OnBombStateUpdated(BombStateUpdated game_event)
{
    Console.WriteLine($"A bomba agora está {game_event.New}.");
}

void OnPlayerWeaponsPickedUp(PlayerWeaponsPickedUp game_event)
{
    Console.WriteLine($"O jogador {game_event.Player.Name} pegou as seguintes armas:");
    foreach (var weapon in game_event.Weapons)
    {
        Console.WriteLine($"\t{weapon.Name}");
    }
}

void OnRoundConcluded(RoundConcluded game_event)
{
    Console.WriteLine($"Round {game_event.Round} concluído por {game_event.WinningTeam} pelo motivo: {game_event.RoundConclusionReason}");
}
```

Tanto `NewGameState` quanto `Eventos de Jogo` podem ser usados juntos. Os `Eventos de Jogo` são gerados com base no `GameState`, e estão lá para fornecer facilidade de uso.

### 4. Iniciar o GameStateListener
Finalmente você quer iniciar o `GameStateListener` para começar a capturar requisições HTTP POST. Isso é feito chamando o método `Start()` do `GameStateListener`. O método retornará `True` se iniciado com sucesso, ou `False` quando falhar ao iniciar. Frequentemente a falha ao iniciar é devido a permissões insuficientes ou outra aplicação já está usando a mesma porta.

```C#
if (!gsl.Start())
{
    // GameStateListener não pôde iniciar.
}
// GameStateListener iniciado e está escutando por requisições de Game State.
```

## 🌐 API Web

Este projeto também inclui uma **API Web completa** que expõe todas as informações do CS2 GSI através de endpoints REST.

### 🚀 Como usar a API

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

### 📊 Exemplo de resposta da API

```json
{
  "timestamp": "2025-07-05T22:13:59.0643487Z",
  "player": {
    "steamid": "165",
    "name": "Mayer",
    "team": 2,
    "state": {
      "health": 44,
      "armor": 100,
      "helmet": true,
      "money": 2400,
      "round_kills": 3
    },
    "weapons": [
      {
        "name": "weapon_mp9",
        "ammo_clip": 14,
        "ammo_reserve": 90
      }
    ],
    "match_stats": {
      "kills": 8,
      "deaths": 5,
      "score": 16
    }
  },
  "map": {
    "name": "de_mirage",
    "mode": 2,
    "round": 7,
    "phase": 1
  }
}
```

## 🎯 Eventos de Jogo Implementados

* `GameEvent` O evento base do jogo, disparará para todos os outros eventos listados.

### Eventos AllGrenades

* `AllGrenadesUpdated`
* `GrenadeUpdated`
* `NewGrenade`
* `ExpiredGrenade`

### Eventos AllPlayers

* `AllPlayersUpdated`
* `PlayerConnected`
* `PlayerDisconnected`

### Eventos Auth

* `AuthUpdated`

### Eventos Bomb

* `BombUpdated`
* `BombPlanting`
* `BombPlanted`
* `BombDefused`
* `BombDefusing`
* `BombDropped`
* `BombPickedup`
* `BombExploded`

### Eventos Killfeed

* `KillFeed`

### Eventos Map

* `MapUpdated`
* `GamemodeChanged`
* `TeamStatisticsUpdated`
* `TeamScoreChanged`
* `TeamRemainingTimeoutsChanged`
* `RoundChanged`
* `RoundConcluded`
* `RoundStarted`
* `LevelChanged`
* `MapPhaseChanged`
* `WarmupStarted`

### Eventos PhaseCountdowns

* `PhaseCountdownsUpdated`

### Eventos Player

* `PlayerUpdated`
* `PlayerGotKill`
* `PlayerDied`
* `PlayerTookDamage`
* `PlayerActiveWeaponChanged`
* `PlayerWeaponsPickedUp`
* `PlayerWeaponsDropped`

### Eventos Provider

* `ProviderUpdated`

### Eventos Round

* `RoundUpdated`
* `RoundConcluded`
* `RoundStarted`

### Eventos TournamentDraft

* `TournamentDraftUpdated`

## 📁 Estrutura do Game State

O Game State é composto por vários nós que contêm informações específicas sobre diferentes aspectos do jogo:

### Provider
Informações sobre o provedor do Game State.

### Auth
Informações de autenticação.

### Map
Informações sobre o mapa atual, incluindo:
- Nome do mapa
- Modo de jogo
- Fase atual
- Round atual
- Estatísticas dos times

### Round
Informações sobre o round atual, incluindo:
- Fase do round
- Condição de vitória

### Player
Informações sobre o jogador local, incluindo:
- Steam ID
- Nome
- Time
- Estado (vida, armadura, etc.)
- Armas
- Estatísticas da partida
- Posição (quando espectador)

### AllPlayers
Informações sobre todos os jogadores no servidor.

### Bomb
Informações sobre a bomba, incluindo:
- Estado
- Posição
- Jogador carregando

### AllGrenades
Informações sobre todas as granadas no mapa.

### PhaseCountdowns
Informações sobre contadores de fase.

### TournamentDraft
Informações sobre draft de torneio.

## 🔧 Exemplos de Uso

### Exemplo 1: Monitor de Vida
```C#
gsl.PlayerTookDamage += (PlayerTookDamage damage_event) =>
{
    Console.WriteLine($"Jogador {damage_event.Player.Name} tomou {damage_event.Previous - damage_event.New} de dano!");
};
```

### Exemplo 2: Monitor de Armas
```C#
gsl.PlayerActiveWeaponChanged += (PlayerActiveWeaponChanged weapon_event) =>
{
    Console.WriteLine($"Jogador {weapon_event.Player.Name} mudou para {weapon_event.New.Name}");
};
```

### Exemplo 3: Monitor de Round
```C#
gsl.RoundConcluded += (RoundConcluded round_event) =>
{
    Console.WriteLine($"Round {round_event.Round} concluído por {round_event.WinningTeam}");
};
```

## 🌟 Casos de Uso

### Stream Overlays
Crie overlays personalizados para suas transmissões ao vivo mostrando estatísticas em tempo real.

### Análise de Performance
Monitore suas estatísticas de jogo para melhorar sua performance.

### Integração com Hardware
Sincronize luzes RGB ou outros dispositivos com eventos do jogo.

### Bots de Discord/Telegram
Crie bots que notificam sobre eventos importantes do jogo.

### Dashboards Web
Crie painéis web para acompanhar partidas em tempo real.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar pull requests ou abrir issues.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Valve Corporation pelo Game State Integration
- Comunidade CS2 por feedback e sugestões
- Contribuidores do projeto

---

**Divirta-se criando aplicações incríveis com o CS2 GSI!** 🎮✨