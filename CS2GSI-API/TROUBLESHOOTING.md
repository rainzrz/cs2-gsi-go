# 🔧 Troubleshooting - CS2 GSI API

## ❓ Problemas Comuns e Soluções

### 1. Endpoints retornando objetos vazios `{}`

**Problema:** Alguns endpoints como `/api/player`, `/api/map`, etc. retornam objetos vazios.

**Causa:** Os endpoints individuais estavam retornando objetos nulos ou não formatados corretamente.

**Solução:** ✅ **CORRIGIDO** - Os endpoints agora retornam dados formatados corretamente.

**Teste:** Acesse http://localhost:5000/api/player para ver os dados do jogador.

### 2. API não responde

**Sintomas:**
- Erro de conexão ao acessar http://localhost:5000
- Timeout nas requisições

**Soluções:**
```powershell
# 1. Verificar se a API está rodando
netstat -ano | findstr :5000

# 2. Reiniciar a API
dotnet run

# 3. Verificar logs no terminal
```

### 3. CS2 não envia dados

**Sintomas:**
- `/api/health` retorna `"hasGameState": false`
- Todos os endpoints retornam dados vazios

**Soluções:**
1. **Verificar configuração GSI no CS2:**
   - Abra o CS2
   - Vá em `Configurações > Game > Game State Integration`
   - Adicione: `http://localhost:4000`

2. **Verificar se o CS2 está rodando**
3. **Reiniciar a API como Administrador**

### 4. Erro de CORS

**Sintomas:**
- Erro no console do navegador sobre CORS
- Interface HTML não consegue acessar a API

**Solução:** ✅ **Já configurado** - A API tem CORS habilitado para todas as origens.

### 5. Porta já em uso

**Sintomas:**
- Erro ao iniciar a API
- "Address already in use"

**Solução:**
```powershell
# Verificar processos na porta
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Matar processo (substitua PID pelo número)
taskkill /PID <PID> /F
```

### 6. Dados inconsistentes

**Sintomas:**
- Alguns dados aparecem, outros não
- Dados desatualizados

**Soluções:**
1. **Verificar se o CS2 está em uma partida ativa**
2. **Aguardar alguns segundos** - O GSI pode demorar para enviar dados
3. **Reiniciar a API**

## 📊 Status dos Endpoints

| Endpoint | Status | Descrição |
|----------|--------|-----------|
| `/api/health` | ✅ Funcionando | Status da API |
| `/api/gamestate` | ✅ Funcionando | Dados completos |
| `/api/player` | ✅ Corrigido | Dados do jogador |
| `/api/map` | ✅ Corrigido | Dados do mapa |
| `/api/allplayers` | ✅ Corrigido | Todos os jogadores |
| `/api/bomb` | ✅ Corrigido | Estado da bomba |
| `/api/grenades` | ✅ Corrigido | Granadas ativas |

## 🔍 Como Verificar se Está Funcionando

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```
**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "hasGameState": true,
  "gsiPort": 4000
}
```

### 2. Player Data
```bash
curl http://localhost:5000/api/player
```
**Resposta esperada:**
```json
{
  "steamid": "76561198123456789",
  "name": "PlayerName",
  "team": 2,
  "state": {
    "health": 100,
    "armor": 100,
    "money": 800
  }
}
```

### 3. Interface HTML
- Acesse: http://localhost:8080
- Clique em "Verificar Status"
- Todos os cards devem mostrar "Dados carregados com sucesso!"

## 🚨 Problemas Conhecidos

### 1. Dados vazios quando não está em partida
- **Normal:** O CS2 só envia dados durante partidas ativas
- **Solução:** Entre em uma partida para ver dados

### 2. Dados de espectador limitados
- **Normal:** Como espectador, alguns dados podem ser limitados
- **Solução:** Jogue para ver todos os dados

### 3. Dados de outros jogadores vazios
- **Normal:** O GSI só envia dados de outros jogadores em certas situações
- **Solução:** Normal durante o jogo

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs** no terminal onde a API está rodando
2. **Teste os endpoints** individualmente
3. **Confirme a configuração** do CS2 GSI
4. **Reinicie tudo** (CS2 + API)

## 🔄 Reiniciar Tudo

```powershell
# 1. Parar a API (Ctrl+C)
# 2. Fechar o CS2
# 3. Reiniciar a API
dotnet run
# 4. Abrir o CS2
# 5. Entrar em uma partida
``` 