# CS2 GSI API - Script Simples
# Execute como Administrador

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    CS2 GSI API - Inicializacao" -ForegroundColor Cyan
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

# Verificar .NET
Write-Host "Verificando .NET..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "NET OK: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "NET nao encontrado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "Python OK: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python nao encontrado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Iniciando API..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WindowStyle Hidden
Start-Sleep -Seconds 5
Write-Host "API iniciada!" -ForegroundColor Green

Write-Host "Iniciando servidor HTTP..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -WindowStyle Hidden
Start-Sleep -Seconds 3
Write-Host "Servidor HTTP iniciado!" -ForegroundColor Green

Write-Host ""
Write-Host "TUDO PRONTO!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs disponiveis:" -ForegroundColor White
Write-Host ""
Write-Host "API Swagger:" -ForegroundColor Yellow
Write-Host "http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Interface HTML:" -ForegroundColor Yellow
Write-Host "http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Health Check:" -ForegroundColor Yellow
Write-Host "http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor White
Write-Host "1. Abra http://localhost:8080 no navegador" -ForegroundColor Gray
Write-Host "2. Clique em 'Verificar Status'" -ForegroundColor Gray
Write-Host "3. Teste os endpoints" -ForegroundColor Gray
Write-Host ""
Write-Host "Pressione Ctrl+C para parar..." -ForegroundColor Yellow
Write-Host ""

# Monitoramento simples
while ($true) {
    Start-Sleep -Seconds 10
    
    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -UseBasicParsing
        Write-Host "API: Online" -ForegroundColor Green -NoNewline
    } catch {
        Write-Host "API: Offline" -ForegroundColor Red -NoNewline
    }
    
    Write-Host " | " -NoNewline
    
    try {
        $htmlResponse = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
        Write-Host "HTML: Online" -ForegroundColor Green
    } catch {
        Write-Host "HTML: Offline" -ForegroundColor Red
    }
} 