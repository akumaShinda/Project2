@echo off
REM StreamFusion - Docker Quick Start
REM This batch file starts the StreamFusion app on Docker

echo.
echo ====================================================
echo   StreamFusion - Docker Startup
echo ====================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo Docker is ready!
echo.
echo Starting StreamFusion...
echo.

REM Navigate to StreamFusion directory
cd /d "%~dp0"

REM Clean up old containers and images (optional)
echo Cleaning up old containers...
docker-compose down -v >nul 2>&1

echo Building and starting Docker container...
docker-compose up --build -d

REM Check if container started successfully
timeout /t 3 >nul
docker-compose ps >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker container failed to start
    echo Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo ====================================================
echo   SUCCESS! StreamFusion is starting...
echo ====================================================
echo.
echo Waiting for container to be ready (30-60 seconds)...
echo.

REM Wait for health check
setlocal enabledelayedexpansion
set counter=0
:health_check
docker-compose ps | find "healthy" >nul 2>&1
if errorlevel 1 (
    if %counter% lss 60 (
        set /a counter+=1
        timeout /t 1 /nobreak >nul
        goto health_check
    ) else (
        echo WARNING: Container took longer than expected to be healthy
        echo Check logs with: docker-compose logs
    )
)

echo.
echo ====================================================
echo   Ready to Use!
echo ====================================================
echo.
echo Home Page:      http://localhost:3000
echo Admin Panel:    http://localhost:3000/admin
echo Dashboard:      http://localhost:3000/dashboard
echo.
echo Login Credentials:
echo   Username: Akuma
echo   Password: SkylineR30
echo.
echo View Logs:      docker-compose logs -f
echo Stop Docker:    run-stop.bat
echo Restart:        run-restart.bat
echo.
echo Opening http://localhost:3000/admin in your browser...
echo.

REM Open browser
timeout /t 2 >nul
start http://localhost:3000/admin

pause
