# 🎮 Interface HTML para CS2 GSI API

Este arquivo HTML fornece uma interface visual simples para testar todos os endpoints da API CS2 GSI.

## 📋 Pré-requisitos

1. **API rodando**: Certifique-se de que a API CS2 GSI está rodando na porta 5000
2. **CS2 configurado**: O Counter-Strike 2 deve estar configurado com o GSI ativo
3. **Navegador moderno**: Chrome, Firefox, Edge ou Safari

## 🚀 Como usar

### 1. Iniciar a API
```bash
cd CS2GSI-API
dotnet run
```

### 2. Abrir o HTML

#### Opção A: Usando o script (Windows)
```bash
# Execute o arquivo batch
start-html.bat
```

#### Opção B: Usando Python
```bash
# Python 3
python -m http.server 8080
```

#### Opção C: Abrir diretamente
- Clique duas vezes no arquivo `index.html`
- Ou arraste o arquivo para o navegador

#### URLs disponíveis:
- **API Swagger**: http://localhost:5000/swagger
- **Interface HTML**: http://localhost:8080

### 3. Testar os endpoints
- Clique em "Verificar Status" para testar a conexão com a API
- Use os botões individuais para testar cada endpoint
- Use "Atualizar Todos os Dados" para buscar todos os dados de uma vez

## 🔧 Endpoints disponíveis

| Endpoint | Descrição | Dados retornados |
|----------|-----------|------------------|
| `/api/health` | Status da API | Informações de saúde e status |
| `/api/gamestate` | Estado completo | Todos os dados do jogo |
| `/api/player` | Jogador atual | Dados do jogador local |
| `/api/map` | Informações do mapa | Dados do mapa atual |
| `/api/allplayers` | Todos os jogadores | Lista de todos os jogadores |
| `/api/bomb` | Estado da bomba | Informações sobre a bomba |
| `/api/grenades` | Granadas ativas | Lista de granadas no mapa |

## 🎨 Funcionalidades

### Interface responsiva
- Design moderno e responsivo
- Cards organizados em grid
- Animações suaves e feedback visual

### Indicadores de status
- 🟢 Verde: Sucesso
- 🔴 Vermelho: Erro
- 🟡 Amarelo: Carregando

### Atualização automática
- Verificação automática de status ao carregar
- Atualização do estado do jogo a cada 30 segundos
- Botão para atualizar todos os dados manualmente

## 🛠️ Personalização

### Alterar porta da API
Se sua API estiver rodando em uma porta diferente, edite a linha no JavaScript:

```javascript
const API_BASE = 'http://localhost:5000'; // Altere para sua porta
```

### Adicionar novos endpoints
Para adicionar novos endpoints, siga o padrão:

1. Adicione um novo card no HTML
2. Crie uma função JavaScript correspondente
3. Adicione ao array de endpoints na função `refreshAll()`

## 🔍 Exemplos de dados

### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "hasGameState": true,
  "gsiPort": 4000
}
```

### Player Data
```json
{
  "steamid": "76561198123456789",
  "name": "PlayerName",
  "team": "T",
  "state": {
    "health": 100,
    "armor": 100,
    "money": 800
  }
}
```

### Map Data
```json
{
  "mode": "competitive",
  "name": "de_dust2",
  "phase": "live",
  "round": 1
}
```

## 🚨 Solução de problemas

### API não responde
- Verifique se a API está rodando: `dotnet run`
- Confirme a porta no `appsettings.json`
- Verifique se não há firewall bloqueando

### CORS errors
- A API já está configurada com CORS habilitado
- Se persistir, verifique se está usando a URL correta

### Dados vazios
- Certifique-se de que o CS2 está rodando
- Verifique se o GSI está configurado corretamente
- Confirme se o arquivo de configuração GSI foi gerado

## 📝 Notas

- O HTML usa JavaScript moderno (ES6+)
- Requer conexão com a API local
- Dados são atualizados em tempo real quando disponíveis
- Interface em português brasileiro
- Design responsivo para diferentes tamanhos de tela 