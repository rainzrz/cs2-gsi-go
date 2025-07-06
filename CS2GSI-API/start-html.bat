@echo off
echo ========================================
echo    CS2 GSI API - Interface HTML
echo ========================================
echo.
echo Iniciando servidor HTTP na porta 8080...
echo.
echo URLs disponiveis:
echo - API Swagger: http://localhost:5000/swagger
echo - Interface HTML: http://localhost:8080
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
python -m http.server 8080
pause 