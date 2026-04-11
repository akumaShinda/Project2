@echo off
REM StreamFusion - View Docker Logs
REM This batch file displays real-time Docker logs

echo.
echo ====================================================
echo   StreamFusion - Docker Logs
echo ====================================================
echo.
echo Displaying live logs (press Ctrl+C to exit)
echo.

cd /d "%~dp0"

docker-compose logs -f

pause
