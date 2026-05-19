# Atelier 8 - Complete CI/CD Pipeline

## ✅ Status: READY TO DEPLOY

A full-stack **Task Manager** application with automated CI/CD pipeline.

---

## 🎯 What We Built

**Application:**
- **Frontend**: HTML/CSS/JS with Nginx
- **Backend**: Node.js/Express REST API
- **Tests**: Jest unit tests
- **Deployment**: Kubernetes with rolling updates

**Pipeline:**
- Automated testing → Code quality → Docker build → K8s deployment

---

## 🚀 Quick Start

### Option 1: Test Locally (Docker Compose)
```powershell
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline
docker-compose up --build
# Access: http://localhost:8080
```

### Option 2: Deploy to Kubernetes
```powershell
.\deploy-local.bat
# Automated deployment to Minikube
```

---

## 📁 Project Structure

```
Atelier-8-CI-CD-Pipeline/
├── app/
│   ├── backend/              # Node.js API
│   └── frontend/             # HTML/CSS/JS UI
├── kubernetes/               # K8s manifests
├── Jenkinsfile              # Jenkins pipeline
├── .gitlab-ci.yml           # GitLab CI
├── docker-compose.yml       # Local testing
├── deploy-local.bat         # Quick deploy
├── test-local.bat           # Quick test
├── SETUP-GUIDE.md           # Full instructions
└── README.md                # This file
```

---

## 📋 Prerequisites

- ✅ Docker Desktop running
- ✅ Minikube running (`.\minikube.exe start`)
- ✅ Jenkins at http://localhost:8080 (optional)
- ✅ SonarQube at http://localhost:9000 (optional)

---

## 🎯 Deployment Steps

### 1. Test Application
```powershell
.\test-local.bat
```

### 2. Deploy to Kubernetes
```powershell
.\deploy-local.bat
```

### 3. Access Application
```powershell
cd C:\Users\pc\Desktop\devops\Atelier-7-Kubernetes
.\minikube.exe service frontend-service -n task-manager
```

---

## 🔧 Manual Deployment

If scripts don't work, deploy manually:

```powershell
# 1. Start Minikube
cd C:\Users\pc\Desktop\devops\Atelier-7-Kubernetes
.\minikube.exe start

# 2. Build images
cd ..\Atelier-8-CI-CD-Pipeline\app\backend
docker build -t task-manager-backend:local .

cd ..\frontend
docker build -t task-manager-frontend:local .

# 3. Deploy to Kubernetes
cd ..\..
.\minikube.exe kubectl -- apply -f kubernetes/namespace.yaml
.\minikube.exe kubectl -- apply -f kubernetes/backend-deployment.yaml
.\minikube.exe kubectl -- apply -f kubernetes/backend-service.yaml
.\minikube.exe kubectl -- apply -f kubernetes/frontend-deployment.yaml
.\minikube.exe kubectl -- apply -f kubernetes/frontend-service.yaml

# 4. Check status
.\minikube.exe kubectl -- get pods -n task-manager
.\minikube.exe kubectl -- get services -n task-manager

# 5. Access app
.\minikube.exe service frontend-service -n task-manager
```

---

## 🧪 Test the Application

Once deployed:
1. **Add a task** - Type and click Add
2. **Complete a task** - Check the checkbox
3. **Delete a task** - Click Delete button
4. **View stats** - See total/completed/pending

---

## 🔄 CI/CD Pipeline Setup

For full automated pipeline, see [SETUP-GUIDE.md](SETUP-GUIDE.md)

**Quick overview:**
1. Configure Docker Hub credentials
2. Update image names in YAML files
3. Set up Jenkins pipeline OR GitLab CI
4. Push code → Automatic deployment!

---

## 🛑 Clean Up

```powershell
# Delete deployment
.\minikube.exe kubectl -- delete namespace task-manager

# Stop Minikube
.\minikube.exe stop

# Remove Docker images
docker-compose down
docker system prune -a
```

---

## 📚 Documentation

- **SETUP-GUIDE.md** - Complete setup instructions
- **Jenkinsfile** - Jenkins pipeline configuration
- **.gitlab-ci.yml** - GitLab CI configuration

---

## 🎉 Success!

You've built a complete CI/CD pipeline with:
- ✅ Automated testing
- ✅ Code quality checks
- ✅ Docker containerization
- ✅ Kubernetes orchestration
- ✅ Zero-downtime deployment
- ✅ Automatic rollback

**Ready for production!** 🚀
