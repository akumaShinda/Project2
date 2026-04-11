@echo off
REM StreamFusion - Docker Clean
REM This batch file performs a complete Docker cleanup

echo.
echo ====================================================
echo   StreamFusion - Docker Complete Cleanup
echo ====================================================
echo.
echo This will:
echo   1. Stop all containers
echo   2. Remove all volumes
echo   3. Remove unused images
echo   4. Remove unused networks
echo.

set /p confirm="Are you sure? (yes/no): "
if /i not "%confirm%"=="yes" (
    echo Cancelled.
    exit /b 0
)

cd /d "%~dp0"

echo.
echo Stopping containers...
docker-compose down -v

echo Pruning Docker system...
docker system prune -a --volumes -f

echo.
echo ====================================================
echo   Cleanup complete!
echo ====================================================
echo.
echo To start fresh, run: run.bat
echo.
pause
