# 🎮 CS2 GSI API

API REST para consumir dados do Game State Integration (GSI) do Counter-Strike 2, com interface visual HTML incluída.

## 📋 Descrição

Este projeto fornece uma API REST que captura dados em tempo real do Counter-Strike 2 através do Game State Integration, permitindo que desenvolvedores criem aplicações que reagem aos eventos do jogo.

## 🚀 Instalação e Uso

### Pré-requisitos

- **Windows 10/11**
- **.NET 8.0** ou superior
- **Python 3.7** ou superior
- **PowerShell** (vem com Windows)
- **Counter-Strike 2** com GSI configurado

### Instalação Rápida

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/cs2-gsi-go.git
   cd cs2-gsi-go/CS2GSI-API
   ```

2. **Execute o script de inicialização:**
   ```powershell
   # Abra PowerShell como Administrador
   .\start-simple.ps1
   ```

3. **Acesse as interfaces:**
   - **Interface Visual**: http://localhost:8080
   - **API Swagger**: http://localhost:5000/swagger
   - **Health Check**: http://localhost:5000/api/health

## 🔧 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/health` | GET | Status da API |
| `/api/gamestate` | GET | Estado completo do jogo |
| `/api/player` | GET | Dados do jogador atual |
| `/api/map` | GET | Informações do mapa |
| `/api/allplayers` | GET | Todos os jogadores |
| `/api/bomb` | GET | Estado da bomba |
| `/api/grenades` | GET | Granadas ativas |

## 🎨 Interface Visual

O projeto inclui uma interface HTML moderna que permite:

- ✅ Visualizar todos os dados da API
- ✅ Testar endpoints individualmente
- ✅ Monitorar status em tempo real
- ✅ Interface responsiva e intuitiva

## 📁 Estrutura do Projeto

```
cs2-gsi-go/
├── CS2GSI-API/                 # API REST
│   ├── Program.cs              # Configuração da API
│   ├── index.html              # Interface visual
│   ├── start-simple.ps1        # Script de inicialização
│   ├── start-all.ps1           # Script completo
│   └── COMO-USAR.txt           # Instruções
├── CounterStrike2GSI/          # Biblioteca GSI
└── README.md                   # Este arquivo
```

## 🛠️ Desenvolvimento

### Executar Manualmente

```powershell
# Terminal 1 - API
dotnet run

# Terminal 2 - Servidor HTTP
python -m http.server 8080
```

### Configuração do CS2 GSI

1. Abra o CS2
2. Vá para `Configurações > Game > Game State Integration`
3. Adicione uma nova configuração:
   - **URI**: `http://localhost:4000`
   - **Timeout**: `1.0`
   - **Buffer**: `0.1`
   - **Throttle**: `0.1`
   - **Heartbeat**: `30.0`

## 📊 Exemplo de Dados

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

## ⚠️ Solução de Problemas

### Erro de Permissão
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Porta Ocupada
```powershell
# Verificar processos
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Matar processo
taskkill /PID <PID> /F
```

### Pasta Errada
- Certifique-se de estar na pasta que contém `Program.cs`
- O script verifica automaticamente

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Valve Corporation pelo Game State Integration
- Comunidade CS2 por feedback e sugestões

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/cs2-gsi-go/issues)
- **Documentação**: [Wiki](https://github.com/seu-usuario/cs2-gsi-go/wiki)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
