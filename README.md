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
