# Biostateer™ Version 1.3 Deployment Guide
## Production Containerization, Cloud Infrastructure & DevOps Orchestration

### 1. Hardware & System Requirements

#### A. Minimum Requirements (Evaluation Sandbox / Dev)
* **Node.js**: 20+ LTS
* **Python**: 3.11+
* **RAM**: 8 GB
* **vCPU**: 4 Cores
* **Storage**: 20 GB SSD (Primary OS + Logging)
* **Database**: PostgreSQL 15+ or isolated SQLite sandboxes

#### B. Recommended Production Requirements (Enterprise CRO / Pharma)
* **Node.js**: 22 LTS
* **Python**: 3.11+ (Miniconda / Virtualenv isolated environment)
* **RAM**: 16 GB (Dual-channel)
* **vCPU**: 8 Cores (Optimized for multithreaded stats modeling)
* **Storage**: 50 GB NVMe SSD (Encrypted at rest via dm-crypt or KMS)
* **High Availability Database**: Google Cloud SQL / AWS RDS PostgreSQL 16 (Multi-AZ)

---

### 2. Multi-Cloud Target Platforms
Biostateer™ is engineered for native deployment across various virtualization layers:
1. **Google Cloud Platform (GCP)**: Cloud Run (Containerized Frontend & API) or Compute Engine GKE.
2. **Amazon Web Services (AWS)**: ECS (Fargate) or EKS (Elastic Kubernetes Service).
3. **Microsoft Azure**: Container Apps or Azure Kubernetes Service (AKS).
4. **DigitalOcean**: App Platform or Droplets behind managed Load Balancers.
5. **On-Premise Linux**: Bare-metal Ubuntu Server 22.04 LTS / RHEL 9.

---

### 3. Containerization Assets

#### A. Backend FastAPI Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for scipy, numpy, and matplotlib compile paths
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.5", "--port", "8000"]
```

#### B. Docker Compose Stack (`backend/docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:securepass@db:5432/biostateer
      - JWT_SECRET=change-this-to-a-cryptographically-secure-string-2026
      - ENVIRONMENT=production
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=securepass
      - POSTGRES_DB=biostateer
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

---

### 4. Reverse Proxy Configurations (`nginx.conf`)
Deploy Nginx as the TLS termination endpoint and reverse proxy to secure sessions:
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    server {
        listen 80;
        server_name app.biostateer.com;
        
        # Enforce TLS 1.3 Upgrade
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name app.biostateer.com;

        # TLS Credentials
        ssl_certificate /etc/letsencrypt/live/biostateer/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/biostateer/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers on;

        # Security Headers (Priority 8 Compliance)
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Content-Security-Policy "default-src 'self' http://localhost:8000; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none';" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Static Frontend Assets
        location / {
            root /var/www/biostateer/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # FastAPI API Gateway Redirect
        location /api/ {
            proxy_pass http://127.0.0.1:8000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

### 5. Kubernetes Orchestration (`deployment.yaml`)
For clinical high availability and auto-scaling pods:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: biostateer-api
  namespace: biostateer-prod
  labels:
    app: biostateer-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: biostateer-api
  template:
    metadata:
      labels:
        app: biostateer-api
    spec:
      containers:
      - name: api
        image: gcr.io/biostateer-gcp/backend:v1.3
        ports:
        - containerPort: 8000
        envFrom:
        - secretRef:
            name: biostateer-secrets
        resources:
          limits:
            cpu: "2"
            memory: 4Gi
          requests:
            cpu: "500m"
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: biostateer-api-service
  namespace: biostateer-prod
spec:
  selector:
    app: biostateer-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
```

---

### 6. Infrastructure-As-Code (`terraform/`)
Provision cloud components deterministically using Terraform (example for Google Cloud):
```hcl
provider "google" {
  project = "biostateer-gcp"
  region  = "us-central1"
}

resource "google_compute_instance" "biostateer_vm" {
  name         = "biostateer-production-server"
  machine_type = "e2-standard-4" # 4 vCPU, 16 GB RAM
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 50 # NVMe SSD Size GB
      type  = "pd-ssd"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Allocate Ephemeral/Static External IP
    }
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/id_rsa.pub")}"
  }
}
```

---

### 7. Continuous Integration & Deployment (`github-actions/`)
Define a deployment pipeline in `.github/workflows/deploy.yml`:
```yaml
name: Continuous Integration & Production Deployment

on:
  push:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-node-version: 20
          cache: 'npm'

      - name: Build Frontend Production Bundle
        run: |
          npm ci
          npm run build

      - name: Setup Python Environment
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Run Backend Unit Tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest

  dockerize-and-deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build and Push Docker API Image
        run: |
          docker build -t biostateer-api:v1.3 ./backend
          docker tag biostateer-api:v1.3 ${{ secrets.AWS_ECR_URI }}:v1.3
          docker push ${{ secrets.AWS_ECR_URI }}:v1.3

      - name: Deploy Task Definition to Amazon ECS
        run: |
          aws ecs update-service --cluster biostateer-cluster --service biostateer-api --force-new-deployment
```
