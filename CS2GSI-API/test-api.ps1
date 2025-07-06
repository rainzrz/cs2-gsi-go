# Script para testar a API CS2 GSI
# Execute este script para verificar se todos os endpoints estão funcionando

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    Testando API CS2 GSI" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Função para testar um endpoint
function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Description
    )
    
    Write-Host "Testando: $Description" -ForegroundColor Yellow
    Write-Host "URL: $baseUrl$Endpoint" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$Endpoint" -TimeoutSec 10 -UseBasicParsing
        $content = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ SUCESSO" -ForegroundColor Green
            
            # Mostrar alguns dados importantes
            if ($Endpoint -eq "/api/health") {
                Write-Host "   Status: $($content.status)" -ForegroundColor Green
                Write-Host "   HasGameState: $($content.hasGameState)" -ForegroundColor Green
            }
            elseif ($Endpoint -eq "/api/player") {
                Write-Host "   Jogador: $($content.name)" -ForegroundColor Green
                Write-Host "   Vida: $($content.state.health)" -ForegroundColor Green
                Write-Host "   Dinheiro: $($content.state.money)" -ForegroundColor Green
            }
            elseif ($Endpoint -eq "/api/map") {
                Write-Host "   Mapa: $($content.name)" -ForegroundColor Green
                Write-Host "   Round: $($content.round)" -ForegroundColor Green
                Write-Host "   Fase: $($content.phase)" -ForegroundColor Green
            }
            elseif ($Endpoint -eq "/api/allplayers") {
                Write-Host "   Jogadores: $($content.Count)" -ForegroundColor Green
            }
            elseif ($Endpoint -eq "/api/bomb") {
                Write-Host "   Estado da bomba: $($content.state)" -ForegroundColor Green
            }
            elseif ($Endpoint -eq "/api/grenades") {
                Write-Host "   Granadas: $($content.Count)" -ForegroundColor Green
            }
        }
        else {
            Write-Host "❌ ERRO: Status $($response.StatusCode)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Testar todos os endpoints
$endpoints = @(
    @{Endpoint="/api/health"; Description="Health Check"},
    @{Endpoint="/api/player"; Description="Dados do Jogador"},
    @{Endpoint="/api/map"; Description="Dados do Mapa"},
    @{Endpoint="/api/allplayers"; Description="Todos os Jogadores"},
    @{Endpoint="/api/bomb"; Description="Estado da Bomba"},
    @{Endpoint="/api/grenades"; Description="Granadas Ativas"},
    @{Endpoint="/api/gamestate"; Description="Estado Completo do Jogo"}
)

foreach ($ep in $endpoints) {
    Test-Endpoint -Endpoint $ep.Endpoint -Description $ep.Description
    Start-Sleep -Seconds 1
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    Teste Concluído!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resumo:" -ForegroundColor White
Write-Host "   - API: http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Swagger: http://localhost:5000/swagger" -ForegroundColor Gray
Write-Host "   - Interface HTML: http://localhost:8080" -ForegroundColor Gray
Write-Host ""
Write-Host "Dicas:" -ForegroundColor White
Write-Host "   - Certifique-se de que o CS2 esta rodando" -ForegroundColor Gray
Write-Host "   - Entre em uma partida para ver dados completos" -ForegroundColor Gray
Write-Host "   - Use a interface HTML para testes visuais" -ForegroundColor Gray
Write-Host "" 