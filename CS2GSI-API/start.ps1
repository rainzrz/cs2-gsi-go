# CS2 GSI API - Script Completo de Inicializacao e Testes
# Execute este script no PowerShell como Administrador

param(
    [switch]$SkipTests,
    [switch]$SkipChecks,
    [switch]$Headless
)

Set-Location -Path $PSScriptRoot

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
        try {
            $connection = Test-NetConnection -ComputerName "localhost" -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($connection) {
                $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
                foreach ($processId in $processes) {
                    try { Stop-Process -Id $processId -Force } catch {}
                }
            }
        } catch {}
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
        $ping = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
        if (-not $ping) { Show-Error "Rede: Problemas detectados"; exit 1 }
        $dns = Resolve-DnsName -Name "google.com" -ErrorAction Stop
    } catch {
        Show-Error "Conectividade: Problema detectado"
        exit 1
    }
    Show-Success "Conectividade OK"
}

# Funcao para iniciar servicos
function Start-Services {
    try {
        $dotnetProcess = Start-Process -FilePath "dotnet" -ArgumentList "run" -WindowStyle Hidden -PassThru
        $global:dotnetProcessId = $dotnetProcess.Id
        Start-Sleep -Seconds 8
        $retries = 0; $maxRetries = 10
        do {
            Start-Sleep -Seconds 2
            try {
                $response = Invoke-WebRequest -Uri "$API_URL/api/health" -TimeoutSec 5 -UseBasicParsing
                if ($response.StatusCode -eq 200) { break }
            } catch { $retries++ }
            if ($retries -ge $maxRetries) { Show-Error "API: Falha ao iniciar"; Stop-AllServices; exit 1 }
        } while ($retries -lt $maxRetries)
    } catch {
        Show-Error "API: Erro ao iniciar"
        Stop-AllServices
        exit 1
    }
    try {
        $pythonProcess = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", $HTML_PORT -WindowStyle Hidden -PassThru
        $global:pythonProcessId = $pythonProcess.Id
        Start-Sleep -Seconds 3
        $response = Invoke-WebRequest -Uri $HTML_URL -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -ne 200) { Show-Error "HTTP: Falha ao iniciar"; Stop-AllServices; exit 1 }
    } catch {
        Show-Error "HTTP: Erro ao iniciar"
        Stop-AllServices
        exit 1
    }
    Show-Success "Servicos OK"
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
}

# Variaveis globais para armazenar PIDs dos processos
$global:dotnetProcessId = $null
$global:pythonProcessId = $null

# Funcao para finalizar todos os processos
function Stop-AllServices {
    # Parar processo .NET especifico (se conhecido)
    if ($global:dotnetProcessId -and (Get-Process -Id $global:dotnetProcessId -ErrorAction SilentlyContinue)) {
        try {
            Stop-Process -Id $global:dotnetProcessId -Force
        } catch {}
    }
    # Parar processo Python especifico (se conhecido)
    if ($global:pythonProcessId -and (Get-Process -Id $global:pythonProcessId -ErrorAction SilentlyContinue)) {
        try {
            Stop-Process -Id $global:pythonProcessId -Force
        } catch {}
    }
    # Parar todos os processos dotnet relacionados ao projeto
    try {
        $dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object {
            $_.ProcessName -eq "dotnet" -and 
            $_.MainWindowTitle -like "*CS2GSI*" -or 
            $_.ProcessName -eq "dotnet"
        }
        if ($dotnetProcesses) {
            foreach ($process in $dotnetProcesses) {
                try {
                    Stop-Process -Id $process.Id -Force
                } catch {}
            }
        }
    } catch {}
    # Parar todos os processos python relacionados ao servidor HTTP
    try {
        $pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
            $_.ProcessName -eq "python" -or $_.ProcessName -eq "python.exe"
        }
        if ($pythonProcesses) {
            foreach ($process in $pythonProcesses) {
                try {
                    $connections = Get-NetTCPConnection -OwningProcess $process.Id -ErrorAction SilentlyContinue | Where-Object {$_.LocalPort -eq $HTML_PORT}
                    if ($connections) {
                        Stop-Process -Id $process.Id -Force
                    }
                } catch {}
            }
        }
    } catch {}
    # Parar processos por porta (fallback)
    try {
        $apiProcesses = Get-NetTCPConnection -LocalPort $API_PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($pid in $apiProcesses) {
            try {
                Stop-Process -Id $pid -Force
            } catch {}
        }
        $htmlProcesses = Get-NetTCPConnection -LocalPort $HTML_PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($pid in $htmlProcesses) {
            try {
                Stop-Process -Id $pid -Force
            } catch {}
        }
    } catch {}
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
    
    # Configurar tratamento de sinal para capturar Ctrl+C e fechamento
    $null = Register-EngineEvent PowerShell.Exiting -Action {
        Stop-AllServices
    }
    
    # Configurar tratamento de Ctrl+C
    try {
        $null = Register-EngineEvent -SourceIdentifier ([System.Console]::CancelKeyPress) -Action {
            Write-Host ""
            Show-Info "Sinal de cancelamento recebido. Finalizando servicos..."
            Stop-AllServices
            exit 0
        }
    } catch {
        # Fallback se o evento não estiver disponível
        Show-Warning "Tratamento de Ctrl+C limitado"
    }
    
    try {
        # Verificar parametros
        if ($Headless) {
            Show-Info "Modo headless ativado"
        }
        
        # Executar verificacoes
        if (-not $SkipChecks) {
            Test-CorrectDirectory
            Test-SystemRequirements
            Clear-OrphanedProcesses
            Test-PortAvailability
            Restore-Dependencies
        } else {
            Show-Warning "Verificacoes de sistema puladas (--SkipChecks)"
        }
        
        # Executar testes
        Invoke-UnitTests
        
        # Testar conectividade
        Test-Connectivity
        
        # Iniciar servicos
        Start-Services
        
        # Testar endpoints
        Test-Endpoints
        
        # Mostrar informacoes finais
        Show-FinalInfo
        
    } catch {
        Show-Error "Erro inesperado: $($_.Exception.Message)"
        Stop-AllServices
        exit 1
    }
}

# Executar funcao principal
Main 