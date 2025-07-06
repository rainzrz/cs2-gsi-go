# CS2 GSI API - Script Completo de Inicializacao e Testes
# Execute este script no PowerShell como Administrador

param(
    [switch]$SkipTests,
    [switch]$SkipChecks,
    [switch]$Headless
)

Set-Location -Path $PSScriptRoot

$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-AllServices }

# Configuracoes
$API_PORT = 5000
$HTML_PORT = 8080
$GSI_PORT = 4000
$API_URL = "http://localhost:$API_PORT"
$HTML_URL = "http://localhost:$HTML_PORT"

# Funcao para exibir cabecalho
function Show-Header {
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "    CS2 GSI API - Setup Completo" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
}

# Funcao para exibir sucesso
function Show-Success {
    param([string]$Message)
    $global:__lastSuccess = $Message
}

# Funcao para exibir erro
function Show-Error {
    param([string]$Message)
    Write-Host "[ERRO] $Message" -ForegroundColor Red
}

# Funcao para exibir aviso
function Show-Warning {
    param([string]$Message)
    Write-Host "[AVISO] $Message" -ForegroundColor Yellow
}

# Funcao para exibir informacao
function Show-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

# Funcao para verificar se estamos na pasta correta
function Test-CorrectDirectory {
    if (-not (Test-Path "Program.cs")) {
        Show-Error "Execute este script na pasta CS2GSI-API"
        exit 1
    }
    Show-Success "Diretorio correto"
}

# Funcao para verificar pre-requisitos do sistema
function Test-SystemRequirements {
    try {
        $dotnetVersion = dotnet --version
    } catch {
        Show-Error ".NET nao encontrado! Baixe em: https://dotnet.microsoft.com/download"
        exit 1
    }
    try {
        $pythonVersion = python --version
    } catch {
        Show-Error "Python nao encontrado! Baixe em: https://www.python.org/downloads/"
        exit 1
    }
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
    if (-not $isAdmin) {
        Show-Error "Execute como Administrador para funcionamento total"
        exit 1
    }
    Show-Success "Pre-requisitos OK"
}

# Funcao para limpar processos orfaos
function Clear-OrphanedProcesses {
    # Limpeza silenciosa
}

# Funcao para verificar portas
function Test-PortAvailability {
    $ports = @($API_PORT, $HTML_PORT, $GSI_PORT)
    foreach ($port in $ports) {
        $portaOcupada = $false
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $result = $tcp.BeginConnect('localhost', $port, $null, $null)
            $wait = $result.AsyncWaitHandle.WaitOne(500) # 500ms timeout
            if ($tcp.Connected) {
                $tcp.Close()
                $portaOcupada = $true
            }
        } catch {}
        if ($portaOcupada) {
            # Tentar liberar processos na porta
            $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
            foreach ($processId in $processes) {
                try { Stop-Process -Id $processId -Force } catch {}
            }
        }
    }
    Show-Success "Portas OK"
}

# Funcao para restaurar dependencias
function Restore-Dependencies {
    try {
        dotnet restore --verbosity quiet
    } catch {
        try {
            dotnet restore --force --verbosity quiet
        } catch {
            Show-Error "Falha ao restaurar dependencias"
            exit 1
        }
    }
    Show-Success "Dependencias OK"
}

# Funcao para executar testes unitarios (simulados)
function Invoke-UnitTests {
    if ($SkipTests) { return }
    try {
        dotnet build --no-restore --verbosity quiet
        if ($LASTEXITCODE -ne 0) { Show-Error "Compilacao: Erro"; exit 1 }
        if (-not (Test-Path "appsettings.json")) { Show-Error "Configuracao: Arquivo nao encontrado"; exit 1 }
    } catch {
        Show-Error "Erro durante os testes: $($_.Exception.Message)"
        exit 1
    }
    Show-Success "Testes OK"
}

# Funcao para testar conectividade
function Test-Connectivity {
    try {
        $ping = Test-Connection -ComputerName "localhost" -Count 1 -Quiet
        if (-not $ping) { Show-Error "Rede: Problemas detectados"; exit 1 }
        $dns = Resolve-DnsName -Name "localhost" -ErrorAction Stop
    } catch {
        Show-Error "Conectividade: Problema detectado"
        exit 1
    }
    Show-Success "Conectividade OK"
}

# Funcao para iniciar servicos
function Start-Services {
    Log-Debug "Iniciando job da API (.NET)"
    $projectPath = $PSScriptRoot
    $global:apiJob = Start-Job -ScriptBlock {
        param($path)
        Set-Location -Path $path
        dotnet run
    } -ArgumentList $projectPath
    Log-Debug "Job da API iniciado: $($global:apiJob.Id)"
    ProgressBar "Aguardando API subir" 8
    $retries = 0; $maxRetries = 10
    do {
        Start-Sleep -Seconds 2
        try {
            Log-Debug "Testando endpoint /api/health"
            $response = Invoke-WebRequest -Uri "$API_URL/api/health" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) { break }
        } catch { $retries++ }
        if ($retries -ge $maxRetries) { Log-Error "API não respondeu"; Stop-AllServices; exit 1 }
    } while ($retries -lt $maxRetries)
    Log-Ok "API iniciada"

    Log-Debug "Iniciando job do servidor HTTP (python)"
    $global:httpJob = Start-Job -ScriptBlock {
        param($path, $port)
        Set-Location -Path $path
        python -m http.server $port
    } -ArgumentList $projectPath, $HTML_PORT
    Log-Debug "Job do HTTP iniciado: $($global:httpJob.Id)"
    ProgressBar "Aguardando servidor HTTP subir" 3
    try {
        Log-Debug "Testando endpoint HTML"
        $response = Invoke-WebRequest -Uri $HTML_URL -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -ne 200) { Log-Error "HTTP não respondeu"; Stop-AllServices; exit 1 }
        Log-Ok "Servidor HTTP iniciado"
    } catch { Log-Error "HTTP não respondeu"; Stop-AllServices; exit 1 }
}

# Funcao para testar endpoints
function Test-Endpoints {
    $endpoints = @(
        @{Path="/api/health"},
        @{Path="/api/gamestate"},
        @{Path="/api/player"},
        @{Path="/api/map"},
        @{Path="/api/allplayers"},
        @{Path="/api/bomb"},
        @{Path="/api/grenades"}
    )
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri "$API_URL$($endpoint.Path)" -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -ne 200) { Show-Error "Endpoint $($endpoint.Path): Erro"; exit 1 }
        } catch {
            Show-Error "Endpoint $($endpoint.Path): Erro"
            exit 1
        }
    }
    Show-Success "Endpoints OK"
}

# Funcao para exibir informacoes finais
function Show-FinalInfo {
    Show-Header
    Write-Host "TUDO PRONTO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor White
    Write-Host "  Swagger: $API_URL/swagger" -ForegroundColor Cyan
    Write-Host "  HTML:    $HTML_URL" -ForegroundColor Cyan
    Write-Host "  Health:  $API_URL/api/health" -ForegroundColor Cyan
    Write-Host ""
    if ($global:__lastSuccess) {
        Write-Host "Status: $global:__lastSuccess" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "Pressione Ctrl+C ou feche a janela para parar os serviços..." -ForegroundColor Yellow
    $script:stopRequested = $false
    trap {
        Write-Host "\n[AVISO] Ctrl+C detectado. Finalizando serviços..." -ForegroundColor Yellow
        Stop-AllServices
        Write-Host "Serviços finalizados!" -ForegroundColor Green
        $script:stopRequested = $true
        exit 0
    }
    while (-not $script:stopRequested) {
        Start-Sleep -Seconds 1
    }
}

# Adicionar variáveis globais de job
$global:apiJob = $null
$global:httpJob = $null

# Funcao para finalizar todos os processos
function Stop-AllServices {
    Write-Host "Finalizando servicos..." -ForegroundColor Yellow
    if ($global:apiJob) {
        try { Stop-Job -Job $global:apiJob -Force; Remove-Job -Job $global:apiJob -Force } catch {}
        Write-Host "  [CS2GSI-API] Job finalizado" -ForegroundColor Green
    }
    if ($global:httpJob) {
        try { Stop-Job -Job $global:httpJob -Force; Remove-Job -Job $global:httpJob -Force } catch {}
        Write-Host "  [CS2GSI-HTTP] Job finalizado" -ForegroundColor Green
    }
    Write-Host "Servicos finalizados!" -ForegroundColor Green
}

# Funcao para monitoramento continuo
function Start-Monitoring {
    Show-Section "Iniciando Monitoramento"
    
    Show-Info "Monitoramento ativo. Pressione Ctrl+C para parar..."
    Write-Host ""
    
    $startTime = Get-Date
    $checkCount = 0
    
    try {
        while ($true) {
            $checkCount++
            $currentTime = Get-Date
            $uptime = $currentTime - $startTime
            
            Write-Host "[$($currentTime.ToString('HH:mm:ss'))] Verificacao #$checkCount (Uptime: $($uptime.ToString('hh\:mm\:ss')))" -ForegroundColor Gray
            
            # Verificar API
            try {
                $apiResponse = Invoke-WebRequest -Uri "$API_URL/api/health" -TimeoutSec 5 -UseBasicParsing
                if ($apiResponse.StatusCode -eq 200) {
                    $healthData = $apiResponse.Content | ConvertFrom-Json
                    Write-Host "   API: Online" -ForegroundColor Green -NoNewline
                    Write-Host " (Game State: $($healthData.hasGameState))" -ForegroundColor Gray
                } else {
                    Write-Host "   API: Status $($apiResponse.StatusCode)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "   API: Offline" -ForegroundColor Red
            }
            
            # Verificar HTML
            try {
                $htmlResponse = Invoke-WebRequest -Uri $HTML_URL -TimeoutSec 5 -UseBasicParsing
                if ($htmlResponse.StatusCode -eq 200) {
                    Write-Host "   HTML: Online" -ForegroundColor Green
                } else {
                    Write-Host "   HTML: Status $($htmlResponse.StatusCode)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "   HTML: Offline" -ForegroundColor Red
            }
            
            Write-Host ""
            Start-Sleep -Seconds 30
        }
    } catch {
        Stop-AllServices
    }
}

# Funcao principal
function Main {
    Show-Header
    Log-Debug "Entrando em Main"
    try {
        # Configurar tratamento de sinal para capturar Ctrl+C e fechamento
        $null = Register-EngineEvent PowerShell.Exiting -Action {
            Stop-AllServices
        }
        
        # Configurar para finalizar processos quando o PowerShell for fechado
        $null = Register-EngineEvent PowerShell.Exiting -Action {
            Stop-AllServices
        }
        
        # Verificar parametros
        if ($Headless) {
            Show-Info "Modo headless ativado"
        }
        
        # Executar verificacoes
        if (-not $SkipChecks) {
            Log-Debug "Entrando em Test-SystemRequirements"
            Test-SystemRequirements
            Log-Debug "Entrando em Test-PortAvailability"
            Test-PortAvailability
            Log-Debug "Entrando em Restore-Dependencies"
            Restore-Dependencies
        } else {
            Show-Warning "Verificacoes de sistema puladas (--SkipChecks)"
        }
        
        # Executar testes
        Log-Debug "Entrando em Invoke-UnitTests"
        Invoke-UnitTests
        
        # Testar conectividade
        Test-Connectivity
        
        # Iniciar servicos
        Log-Debug "Entrando em Start-Services"
        Start-Services
        
        # Testar endpoints
        Log-Debug "Entrando em Test-Endpoints"
        Test-Endpoints
        
        # Mostrar informacoes finais
        Log-Debug "Entrando em Show-FinalInfo"
        Show-FinalInfo
        
    } catch {
        Log-Error "Erro inesperado: $($_.Exception.Message)"
        Stop-AllServices
        exit 1
    }
}

# Funcao para exibir mensagens de debug
function Log-Debug { param($msg) Write-Host "DEBUG: $msg" -ForegroundColor Magenta }

# Funcao para exibir mensagens de erro
function Log-Error { param($msg) Show-Error $msg }

# Funcao para exibir mensagens de sucesso
function Log-Ok { param($msg) Show-Success $msg }

# Funcao para exibir mensagens de informacao
function Log-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }

# Funcao para exibir mensagens de aviso
function Log-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }

# Funcao para exibir mensagens de passo
function Log-Step { param($msg) Write-Host "`n==== $msg ====" -ForegroundColor Magenta }

# Funcao para exibir mensagens de progresso
function ProgressBar {
    param($msg, $secs)
    for ($i=0; $i -le $secs; $i++) {
        Write-Progress -Activity $msg -Status "Aguarde..." -PercentComplete ($i*100/$secs)
        Start-Sleep -Seconds 1
    }
    Write-Progress -Activity $msg -Completed
}

# Executar funcao principal
Main 