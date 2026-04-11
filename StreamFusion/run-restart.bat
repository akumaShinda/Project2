@echo off
REM StreamFusion - Docker Restart
REM This batch file restarts the StreamFusion Docker container

echo.
echo ====================================================
echo   StreamFusion - Restarting Docker Container
echo ====================================================
echo.

cd /d "%~dp0"

echo Restarting Docker container...
docker-compose restart

echo.
echo Waiting for container to be ready...
timeout /t 5 >nul

echo.
echo ====================================================
echo   Docker container restarted successfully!
echo ====================================================
echo.
echo Access at: http://localhost:3000
echo.
pause
