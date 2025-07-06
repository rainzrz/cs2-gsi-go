# CS2 GSI API - Script de Inicializacao Completa
# Execute este script no PowerShell como Administrador

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    CS2 GSI API - Setup Completo" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos na pasta correta
if (-not (Test-Path "Program.cs")) {
    Write-Host "ERRO: Execute este script na pasta CS2GSI-API" -ForegroundColor Red
    Write-Host "   Certifique-se de estar na pasta que contem Program.cs" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "Pasta correta detectada!" -ForegroundColor Green
Write-Host ""

# Passo 1: Verificar se .NET esta instalado
Write-Host "Passo 1: Verificando .NET..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "NET encontrado: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "NET nao encontrado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Passo 2: Verificar se Python esta instalado
Write-Host ""
Write-Host "Passo 2: Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python nao encontrado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Passo 3: Iniciando a API..." -ForegroundColor Yellow
Write-Host "   Aguarde alguns segundos..." -ForegroundColor Gray

# Iniciar a API em background
Start-Process -FilePath "dotnet" -ArgumentList "run" -WindowStyle Hidden

# Aguardar a API inicializar
Start-Sleep -Seconds 5

Write-Host "API iniciada!" -ForegroundColor Green
Write-Host ""

Write-Host "Passo 4: Iniciando servidor HTTP..." -ForegroundColor Yellow
Write-Host "   Aguarde alguns segundos..." -ForegroundColor Gray

# Iniciar servidor HTTP em background
Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -WindowStyle Hidden

# Aguardar o servidor inicializar
Start-Sleep -Seconds 3

Write-Host "Servidor HTTP iniciado!" -ForegroundColor Green
Write-Host ""

# Mostrar informacoes finais
Write-Host "TUDO PRONTO!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs disponiveis:" -ForegroundColor White
Write-Host ""
Write-Host "   API Swagger (Documentacao):" -ForegroundColor Yellow
Write-Host "      http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Interface HTML (Visual):" -ForegroundColor Yellow
Write-Host "      http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Health Check:" -ForegroundColor Yellow
Write-Host "      http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor White
Write-Host "   1. Abra http://localhost:8080 no navegador" -ForegroundColor Gray
Write-Host "   2. Clique em 'Verificar Status'" -ForegroundColor Gray
Write-Host "   3. Teste os endpoints da API" -ForegroundColor Gray
Write-Host "   4. Certifique-se de que o CS2 esta rodando com GSI" -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - A API deve ser executada como Administrador" -ForegroundColor Red
Write-Host "   - O CS2 deve estar configurado com GSI" -ForegroundColor Red
Write-Host "   - Para parar, feche este terminal" -ForegroundColor Red
Write-Host ""
Write-Host "Para verificar se tudo esta funcionando:" -ForegroundColor White
Write-Host "   - API: http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host "   - HTML: http://localhost:8080" -ForegroundColor Gray
Write-Host ""

# Manter o script rodando
Write-Host "Pressione Ctrl+C para parar todos os servicos..." -ForegroundColor Yellow
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Verificar se a API ainda esta rodando
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "API: Online" -ForegroundColor Green -NoNewline
                Write-Host " | " -NoNewline
            } else {
                Write-Host "API: Offline" -ForegroundColor Red -NoNewline
                Write-Host " | " -NoNewline
            }
        } catch {
            Write-Host "API: Offline" -ForegroundColor Red -NoNewline
            Write-Host " | " -NoNewline
        }
        
        # Verificar se o servidor HTTP ainda esta rodando
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "HTML: Online" -ForegroundColor Green
            } else {
                Write-Host "HTML: Offline" -ForegroundColor Red
            }
        } catch {
            Write-Host "HTML: Offline" -ForegroundColor Red
        }
    }
} catch {
    Write-Host ""
    Write-Host "Parando todos os servicos..." -ForegroundColor Red
    
    # Parar processos
    Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Write-Host "Servicos parados!" -ForegroundColor Green
} 