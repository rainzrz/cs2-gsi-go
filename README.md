# 🎮 CS2 GSI API

API REST para consumir dados do Game State Integration (GSI) do Counter-Strike 2, com dashboard visual moderno em React.

## 📋 Descrição

Este projeto fornece uma API REST que captura dados em tempo real do Counter-Strike 2 através do Game State Integration, permitindo que desenvolvedores e entusiastas monitorem partidas com um dashboard visual completo.

## 🚀 Instalação e Uso

### Pré-requisitos

- **Windows 10/11**
- **.NET 8.0** ou superior
- **Node.js 18+** e **npm**
- **PowerShell** (vem com Windows)
- **Counter-Strike 2** com GSI configurado

### Instalação Rápida

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/cs2-gsi-go.git
   cd cs2-gsi-go
   ```

2. **Execute o backend (API):**
   ```powershell
   cd CS2GSI-API
   dotnet run
   ```
   A API estará disponível em http://localhost:5000

3. **Execute o frontend (Dashboard Visual):**
   ```powershell
   cd dashboard-visual
   npm install
   npm run dev
   ```
   O dashboard estará disponível em http://localhost:5173 (ou porta informada pelo Vite)

4. **Acesse:**
   - **Dashboard Visual:** http://localhost:5173
   - **API Swagger:** http://localhost:5000/swagger
   - **Health Check:** http://localhost:5000/api/health

## 🔧 Endpoints da API

| Endpoint         | Método | Descrição                |
|------------------|--------|--------------------------|
| `/api/health`    | GET    | Status da API            |
| `/api/gamestate` | GET    | Estado completo do jogo  |
| `/api/player`    | GET    | Dados do jogador atual   |
| `/api/map`       | GET    | Informações do mapa      |
| `/api/allplayers`| GET    | Todos os jogadores       |
| `/api/bomb`      | GET    | Estado da bomba          |
| `/api/grenades`  | GET    | Granadas ativas          |

## 🎨 Dashboard Visual (React)

O dashboard visual está na pasta `dashboard-visual` e utiliza React + Vite:

- Visualização em tempo real dos dados do CS2
- Teste de endpoints
- Interface responsiva e moderna

### Scripts úteis:

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

## 📁 Estrutura do Projeto

```
cs2-gsi-go/
├── CS2GSI-API/           # API REST (.NET)
├── CounterStrike2GSI/    # Biblioteca GSI
├── dashboard-visual/     # Dashboard visual (React)
└── README.md             # Este arquivo
```

## 🛠️ Desenvolvimento

- O frontend e backend rodam separadamente em desenvolvimento.
- O frontend faz requisições para a API em http://localhost:5000/api

## ⚠️ Solução de Problemas

### Erro de Permissão
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Porta Ocupada
```powershell
# Verificar processos
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Matar processo
taskkill /PID <PID> /F
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
