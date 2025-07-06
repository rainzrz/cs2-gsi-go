# 🚀 CS2 GSI API - Instruções do Terminal

## 📋 Passo a Passo Completo

### 1. Abrir PowerShell como Administrador
- Pressione `Win + X`
- Selecione "Windows PowerShell (Admin)" ou "Terminal (Admin)"

### 2. Navegar até a pasta
```powershell
cd caminho\para\cs2-gsi-go\CS2GSI-API
```

**Exemplos:**
```powershell
# Se estiver na área de trabalho
cd C:\Users\SeuUsuario\Desktop\cs2-gsi-go\CS2GSI-API

# Se estiver em outro local
cd D:\Projetos\cs2-gsi-go\CS2GSI-API
cd E:\GitHub\cs2-gsi-go\CS2GSI-API
```

### 3. Executar o script automático (RECOMENDADO)
```powershell
.\start-simple.ps1
```

**OU executar manualmente:**

### 3a. Iniciar a API (Terminal 1)
```powershell
dotnet run
```

### 3b. Iniciar servidor HTTP (Terminal 2 - novo PowerShell)
```powershell
python -m http.server 8080
```

## 🌐 URLs Disponíveis

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🔧 **API Swagger** | `http://localhost:5000/swagger` | Documentação da API |
| 🎮 **Interface HTML** | `http://localhost:8080` | Interface visual |
| 📊 **Health Check** | `http://localhost:5000/api/health` | Status da API |

## ✅ Verificação

### Testar se a API está funcionando:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

### Testar se o HTML está funcionando:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080"
```

## 🛑 Para Parar

### Se usou o script automático:
- Pressione `Ctrl + C` no terminal

### Se executou manualmente:
- Pressione `Ctrl + C` em cada terminal
- Ou feche os terminais

## ⚠️ Problemas Comuns

### Erro de permissão:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Porta já em uso:
```powershell
# Verificar processos na porta
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Matar processo (substitua PID pelo número)
taskkill /PID <PID> /F
```

### .NET não encontrado:
- Baixe em: https://dotnet.microsoft.com/download

### Python não encontrado:
- Baixe em: https://www.python.org/downloads/

### Pasta errada:
- Certifique-se de estar na pasta que contém `Program.cs`
- O script verifica automaticamente se está no local correto

## 📱 Próximos Passos

1. **Abra no navegador**: `http://localhost:8080`
2. **Clique em "Verificar Status"**
3. **Teste os endpoints da API**
4. **Certifique-se de que o CS2 está rodando com GSI**

## 🔍 Monitoramento

O script automático mostra o status a cada 10 segundos:
- ✅ API: Online
- ✅ HTML: Online

## 📞 Suporte

Se algo não funcionar:
1. Verifique se executou como Administrador
2. Confirme que .NET e Python estão instalados
3. Verifique se as portas 5000 e 8080 estão livres
4. Certifique-se de que o CS2 está configurado com GSI
5. Confirme que está na pasta correta (que contém `Program.cs`)

## 🎯 Requisitos do Sistema

- **Windows 10/11**
- **.NET 8.0** ou superior
- **Python 3.7** ou superior
- **PowerShell** (vem com Windows)
- **Counter-Strike 2** com GSI configurado 