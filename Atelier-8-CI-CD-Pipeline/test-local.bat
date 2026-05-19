@echo off
echo ========================================
echo Task Manager - Local Testing Script
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [✓] Docker is running
echo.

echo ========================================
echo Testing with Docker Compose
echo ========================================
echo.

echo [1/4] Building containers...
docker-compose build

echo.
echo [2/4] Starting containers...
docker-compose up -d

echo.
echo [3/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Testing endpoints...
echo.

echo Testing Backend Health:
curl -s http://localhost:5000/health
echo.
echo.

echo Testing Backend API:
curl -s http://localhost:5000/api/tasks
echo.
echo.

echo ========================================
echo Services Status:
echo ========================================
docker-compose ps
echo.

echo ========================================
echo Application URLs:
echo ========================================
echo Frontend: http://localhost:8080
echo Backend API: http://localhost:5000/api/tasks
echo Health Check: http://localhost:5000/health
echo.

echo ========================================
echo Opening application in browser...
echo ========================================
start http://localhost:8080
echo.

echo Press any key to stop the containers...
pause >nul

echo.
echo Stopping containers...
docker-compose down

echo.
echo ========================================
echo Testing Complete!
echo ========================================
pause
