@echo off
title Xpense - Full Stack Runner
echo ========================================================
echo   Starting Xpense Java Full Stack Application...
echo ========================================================
echo.

echo [1/2] Launching Spring Boot Backend (Port 8080)...
start "Xpense Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && mvn -Dmaven.repo.local=%~dp0backend\.m2 spring-boot:run"

echo [2/2] Launching React Frontend (Port 5173)...
start "Xpense Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are starting in separate windows:
echo   - Backend REST API:  http://localhost:8080/api
echo   - H2 Web Console:    http://localhost:8080/h2-console
echo   - Frontend Web App:  http://localhost:5173
echo.
pause
