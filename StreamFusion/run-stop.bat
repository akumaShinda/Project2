@echo off
REM StreamFusion - Docker Stop
REM This batch file stops the StreamFusion Docker container

echo.
echo ====================================================
echo   StreamFusion - Stopping Docker Container
echo ====================================================
echo.

cd /d "%~dp0"

echo Stopping Docker container...
docker-compose down

echo.
echo ====================================================
echo   Docker container stopped successfully!
echo ====================================================
echo.
echo To start again, run: run.bat
echo.
pause
