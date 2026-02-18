@echo off
title Verza Design — Servidor Local
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       VERZA DESIGN — Servidor        ║
echo  ╚══════════════════════════════════════╝
echo.

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python encontrado. Iniciando servidor en puerto 8080...
    echo  [OK] Abriendo navegador en http://localhost:8080
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo.
    start "" "http://localhost:8080"
    python -m http.server 8080
    goto :end
)

:: Si no hay Python, intentar con Node.js / npx serve
npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Node.js encontrado. Iniciando servidor con npx serve...
    echo  [OK] Abriendo navegador en http://localhost:3000
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo.
    start "" "http://localhost:3000"
    npx serve -l 3000 .
    goto :end
)

:: Si no hay ninguno, abrir directamente el archivo HTML
echo  [AVISO] Python y Node.js no encontrados.
echo  [OK] Abriendo index.html directamente en el navegador...
echo.
start "" "%~dp0index.html"

:end
