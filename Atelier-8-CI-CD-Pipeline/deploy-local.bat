@echo off
echo ========================================
echo Task Manager - Local Deployment Script
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

echo [1/5] Docker is running...
echo.

REM Check if Minikube is running
cd C:\Users\pc\Desktop\devops\Atelier-7-Kubernetes
.\minikube.exe status >nul 2>&1
if errorlevel 1 (
    echo [2/5] Starting Minikube...
    .\minikube.exe start
) else (
    echo [2/5] Minikube is already running...
)
echo.

REM Navigate back to project
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline

echo [3/5] Building Docker images...
echo Building backend...
cd app\backend
docker build -t task-manager-backend:local .
cd ..\..

echo Building frontend...
cd app\frontend
docker build -t task-manager-frontend:local .
cd ..\..
echo.

echo [4/5] Deploying to Kubernetes...
cd C:\Users\pc\Desktop\devops\Atelier-7-Kubernetes

REM Apply Kubernetes manifests
.\minikube.exe kubectl -- apply -f ..\Atelier-8-CI-CD-Pipeline\kubernetes\namespace.yaml
.\minikube.exe kubectl -- apply -f ..\Atelier-8-CI-CD-Pipeline\kubernetes\backend-deployment.yaml
.\minikube.exe kubectl -- apply -f ..\Atelier-8-CI-CD-Pipeline\kubernetes\backend-service.yaml
.\minikube.exe kubectl -- apply -f ..\Atelier-8-CI-CD-Pipeline\kubernetes\frontend-deployment.yaml
.\minikube.exe kubectl -- apply -f ..\Atelier-8-CI-CD-Pipeline\kubernetes\frontend-service.yaml
echo.

echo [5/5] Waiting for deployment to complete...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Deployment Status:
echo ========================================
.\minikube.exe kubectl -- get pods -n task-manager
echo.
.\minikube.exe kubectl -- get services -n task-manager
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Opening application in browser...
.\minikube.exe service frontend-service -n task-manager
echo.
echo Press any key to exit...
pause >nul
