@echo off
REM StreamFusion - Docker Status
REM This batch file shows the status of Docker containers

echo.
echo ====================================================
echo   StreamFusion - Docker Status
echo ====================================================
echo.

cd /d "%~dp0"

echo Container Status:
echo.
docker-compose ps

echo.
echo.
echo Docker Version:
docker --version

echo.
echo Docker Compose Version:
docker-compose --version

echo.
pause
