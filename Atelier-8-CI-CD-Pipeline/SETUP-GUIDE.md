# 🚀 Complete CI/CD Pipeline Setup Guide

## Prerequisites Checklist

Before starting, ensure you have:

- ✅ Docker Desktop running
- ✅ Minikube cluster running (`minikube start`)
- ✅ Jenkins accessible at http://localhost:8080
- ✅ SonarQube accessible at http://localhost:9000
- ✅ Docker Hub account created
- ✅ Git repository (GitHub or GitLab)

---

## Step 1: Test Application Locally (15 minutes)

### 1.1 Test Backend Locally

```powershell
# Navigate to backend folder
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline\app\backend

# Install dependencies
npm install

# Run tests
npm test

# Start backend server
npm start

# Test in browser: http://localhost:5000/health
```

### 1.2 Test Frontend Locally

Open `app/frontend/index.html` in your browser and verify it loads.

### 1.3 Test with Docker Compose

```powershell
# Navigate to project root
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline

# Build and start containers
docker-compose up --build

# Access application: http://localhost:8080
# Backend API: http://localhost:5000/api/tasks

# Stop containers
docker-compose down
```

---

## Step 2: Configure Docker Hub (5 minutes)

### 2.1 Create Docker Hub Account

1. Go to https://hub.docker.com/
2. Sign up for free account
3. Verify your email

### 2.2 Update Configuration Files

Replace `YOUR_DOCKERHUB_USERNAME` in these files:

- `Jenkinsfile` (line 7)
- `.gitlab-ci.yml` (line 9)
- `kubernetes/backend-deployment.yaml` (line 26)
- `kubernetes/frontend-deployment.yaml` (line 26)

**Example:**
```yaml
# Before
image: YOUR_DOCKERHUB_USERNAME/task-manager-backend:latest

# After (if your username is "john")
image: john/task-manager-backend:latest
```

---

## Step 3: Build and Push Docker Images Manually (10 minutes)

### 3.1 Login to Docker Hub

```powershell
docker login
# Enter your Docker Hub username and password
```

### 3.2 Build Backend Image

```powershell
cd app\backend

# Build image (replace 'yourusername' with your Docker Hub username)
docker build -t yourusername/task-manager-backend:latest .

# Push to Docker Hub
docker push yourusername/task-manager-backend:latest
```

### 3.3 Build Frontend Image

```powershell
cd ..\frontend

# Build image
docker build -t yourusername/task-manager-frontend:latest .

# Push to Docker Hub
docker push yourusername/task-manager-frontend:latest
```

### 3.4 Verify Images

```powershell
# List local images
docker images | findstr task-manager

# Check Docker Hub
# Go to https://hub.docker.com/repositories
```

---

## Step 4: Deploy to Kubernetes (15 minutes)

### 4.1 Ensure Minikube is Running

```powershell
cd C:\Users\pc\Desktop\devops\Atelier-7-Kubernetes

# Check status
.\minikube.exe status

# If not running, start it
.\minikube.exe start
```

### 4.2 Deploy Application

```powershell
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline

# Create namespace
.\minikube.exe kubectl -- apply -f kubernetes/namespace.yaml

# Deploy backend
.\minikube.exe kubectl -- apply -f kubernetes/backend-deployment.yaml
.\minikube.exe kubectl -- apply -f kubernetes/backend-service.yaml

# Deploy frontend
.\minikube.exe kubectl -- apply -f kubernetes/frontend-deployment.yaml
.\minikube.exe kubectl -- apply -f kubernetes/frontend-service.yaml
```

### 4.3 Verify Deployment

```powershell
# Check pods
.\minikube.exe kubectl -- get pods -n task-manager

# Check services
.\minikube.exe kubectl -- get services -n task-manager

# Check deployment status
.\minikube.exe kubectl -- rollout status deployment/backend -n task-manager
.\minikube.exe kubectl -- rollout status deployment/frontend -n task-manager
```

### 4.4 Access Application

```powershell
# Get Minikube IP
.\minikube.exe ip

# Get service URL
.\minikube.exe service frontend-service -n task-manager --url

# Or open in browser automatically
.\minikube.exe service frontend-service -n task-manager
```

---

## Step 5: Configure Jenkins Pipeline (20 minutes)

### 5.1 Install Required Jenkins Plugins

1. Go to Jenkins: http://localhost:8080
2. Navigate to: **Manage Jenkins** → **Manage Plugins**
3. Install these plugins:
   - Docker Pipeline
   - Kubernetes CLI
   - SonarQube Scanner
   - Pipeline
   - Git

### 5.2 Configure Docker Hub Credentials

1. Go to: **Manage Jenkins** → **Manage Credentials**
2. Click: **(global)** → **Add Credentials**
3. Fill in:
   - **Kind**: Username with password
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password
   - **ID**: `dockerhub-credentials`
   - **Description**: Docker Hub Credentials
4. Click **OK**

### 5.3 Configure Kubernetes Access

```powershell
# Get Minikube kubectl config
.\minikube.exe kubectl -- config view --flatten

# Copy the output and save it
# You'll need this for Jenkins Kubernetes configuration
```

1. In Jenkins: **Manage Jenkins** → **Manage Credentials**
2. Add Kubernetes config as **Secret file**
3. ID: `kubeconfig`

### 5.4 Configure SonarQube

1. Go to SonarQube: http://localhost:9000
2. Login (admin/admin)
3. Generate token: **My Account** → **Security** → **Generate Token**
4. Copy the token

In Jenkins:
1. **Manage Jenkins** → **Configure System**
2. Find **SonarQube servers**
3. Add SonarQube:
   - **Name**: SonarQube
   - **Server URL**: http://localhost:9000
   - **Server authentication token**: (paste token)

### 5.5 Create Jenkins Pipeline Job

1. Click **New Item**
2. Enter name: `Task-Manager-Pipeline`
3. Select: **Pipeline**
4. Click **OK**
5. In **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your Git repository URL
   - **Script Path**: Jenkinsfile
6. Click **Save**

### 5.6 Run the Pipeline

1. Click **Build Now**
2. Watch the pipeline execute
3. Check console output for any errors

---

## Step 6: Configure GitLab CI/CD (Alternative) (15 minutes)

### 6.1 Push Code to GitLab

```powershell
cd C:\Users\pc\Desktop\devops\Atelier-8-CI-CD-Pipeline

git init
git add .
git commit -m "Initial commit - CI/CD pipeline"
git remote add origin YOUR_GITLAB_REPO_URL
git push -u origin main
```

### 6.2 Configure GitLab CI/CD Variables

1. Go to your GitLab project
2. Navigate to: **Settings** → **CI/CD** → **Variables**
3. Add these variables:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_PASSWORD`: Your Docker Hub password (masked)
   - `SONAR_HOST_URL`: http://localhost:9000
   - `SONAR_TOKEN`: Your SonarQube token (masked)
   - `KUBE_CONTEXT`: Your Kubernetes context

### 6.3 Register GitLab Runner

```powershell
cd C:\Users\pc\Desktop\devops\Atelier-2-GitLab

# Run the registration script
.\register-runner-NEW.bat

# When prompted:
# - GitLab URL: https://gitlab.com/
# - Registration token: (from GitLab project Settings → CI/CD → Runners)
# - Description: task-manager-runner
# - Tags: docker,kubernetes
# - Executor: shell
```

### 6.4 Trigger Pipeline

1. Push any change to GitLab
2. Go to: **CI/CD** → **Pipelines**
3. Watch the pipeline execute

---

## Step 7: Verify Complete Pipeline (10 minutes)

### 7.1 Make a Code Change

Edit `app/backend/server.js`:

```javascript
// Change line 17 to:
{ id: 1, title: 'CI/CD Pipeline is Working!', completed: false, createdAt: new Date() },
```

### 7.2 Commit and Push

```powershell
git add .
git commit -m "Test CI/CD pipeline"
git push
```

### 7.3 Watch the Magic! ✨

1. **Jenkins/GitLab** automatically detects the change
2. **Tests** run automatically
3. **SonarQube** analyzes code quality
4. **Docker images** are built and pushed
5. **Kubernetes** deployment updates automatically
6. **Application** is live with your changes!

### 7.4 Verify Deployment

```powershell
# Check pods are updated
.\minikube.exe kubectl -- get pods -n task-manager

# Access the application
.\minikube.exe service frontend-service -n task-manager

# You should see your new task!
```

---

## Troubleshooting

### Issue: Pods not starting

```powershell
# Check pod logs
.\minikube.exe kubectl -- logs <pod-name> -n task-manager

# Describe pod for events
.\minikube.exe kubectl -- describe pod <pod-name> -n task-manager
```

### Issue: Image pull errors

```powershell
# Verify images exist on Docker Hub
docker pull yourusername/task-manager-backend:latest

# Check image name in deployment YAML matches Docker Hub
```

### Issue: Jenkins can't connect to Docker

1. Ensure Docker Desktop is running
2. In Jenkins: **Manage Jenkins** → **Configure System**
3. Check Docker configuration

### Issue: SonarQube quality gate fails

1. Go to SonarQube: http://localhost:9000
2. Check the project analysis
3. Fix code quality issues
4. Re-run pipeline

### Issue: Kubernetes deployment fails

```powershell
# Check deployment status
.\minikube.exe kubectl -- get deployments -n task-manager

# Check events
.\minikube.exe kubectl -- get events -n task-manager --sort-by='.lastTimestamp'
```

---

## Testing the Complete Flow

### Scenario 1: Add New Feature

1. Create new branch: `git checkout -b feature/new-task-priority`
2. Add priority field to tasks
3. Commit and push
4. Pipeline runs on feature branch
5. Merge to main
6. Pipeline deploys to production

### Scenario 2: Fix Bug

1. Create hotfix branch
2. Fix the bug
3. Run tests locally
4. Push to trigger pipeline
5. Verify deployment

### Scenario 3: Rollback

If something goes wrong:

```powershell
# Rollback deployment
.\minikube.exe kubectl -- rollout undo deployment/backend -n task-manager
.\minikube.exe kubectl -- rollout undo deployment/frontend -n task-manager

# Or in Jenkins, trigger rollback job
```

---

## Success Criteria ✅

Your CI/CD pipeline is successful when:

- ✅ Code push triggers pipeline automatically
- ✅ All tests pass
- ✅ SonarQube quality gate passes
- ✅ Docker images build successfully
- ✅ Images push to Docker Hub
- ✅ Kubernetes deployment updates
- ✅ Application is accessible
- ✅ Zero downtime during deployment
- ✅ Rollback works if needed

---

## Next Steps

1. **Add more tests** (integration, e2e)
2. **Implement database** (PostgreSQL/MongoDB)
3. **Add monitoring** (Prometheus + Grafana)
4. **Set up staging environment**
5. **Implement blue-green deployment**
6. **Add security scanning** (Trivy, Snyk)
7. **Configure alerts** (Slack, email)

---

## Useful Commands Reference

### Docker

```powershell
# Build image
docker build -t image-name:tag .

# Push image
docker push image-name:tag

# List images
docker images

# Remove image
docker rmi image-name:tag

# Clean up
docker system prune -a
```

### Kubernetes

```powershell
# Apply configuration
.\minikube.exe kubectl -- apply -f file.yaml

# Get resources
.\minikube.exe kubectl -- get pods -n namespace
.\minikube.exe kubectl -- get services -n namespace
.\minikube.exe kubectl -- get deployments -n namespace

# Describe resource
.\minikube.exe kubectl -- describe pod pod-name -n namespace

# View logs
.\minikube.exe kubectl -- logs pod-name -n namespace

# Delete resource
.\minikube.exe kubectl -- delete -f file.yaml

# Rollback deployment
.\minikube.exe kubectl -- rollout undo deployment/name -n namespace
```

### Jenkins

```powershell
# Restart Jenkins
# Go to: http://localhost:8080/restart

# View build logs
# Click on build number → Console Output
```

---

**Congratulations! You now have a complete, professional-grade CI/CD pipeline!** 🎉

