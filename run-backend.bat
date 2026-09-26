@echo off
title Xpense - Backend (Spring Boot)
echo ========================================================
echo   Starting Spring Boot REST API on port 8080...
echo ========================================================
cd /d %~dp0backend
mvn -Dmaven.repo.local=%~dp0backend\.m2 spring-boot:run
pause
