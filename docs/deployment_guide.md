# Biostateer™ Version 1.2 — Deployment & Administration Guide
*Architecture: Enterprise Edge Hybrid Model (React Client + FastAPI Backend)*

This guide provides institutional system administrators with technical instructions to deploy, configure, and maintain the Biostateer™ v1.2 environment in clinical and pharmaceutical networks.

---

## 1. System Requirements

### A. Minimum Requirements (Standalone Desktop)
- **Node.js**: v20.0.0 or higher
- **Python**: v3.11 or higher
- **System Memory**: 8 GB RAM
- **Processor**: 4 vCPUs
- **Disk Storage**: 20 GB SSD

### B. Recommended Production Requirements (Institutional Enterprise)
- **Node.js**: v22.0.0 LTS
- **Python**: v3.11+
- **System Memory**: 32 GB RAM (optimized for multiple MICE imputation steps)
- **Processor**: 8+ vCPUs
- **Disk Storage**: 100+ GB SSD (high-speed data access)

---

## 2. Production Topologies

### A. Standalone Desktop Research Mode
- **Topology**: React Client + Local Edge Math Engine.
- **Data Flow**: Direct browser-level calculations utilizing standard double-precision JS math. Audit logs and datasets persist locally inside the browser's encrypted `localStorage`. Zero external dependencies.

### B. Institutional Deployment (Hybrid Model)
- **Topology**: React Client + validated local FastAPI service.
- **Data Flow**: React client routes complex, high-throughput biostatistical calculations (such as Competing Risks and Multiple Imputations) to a local containerized FastAPI server, which returns validated NumPy and SciPy results. Simple descriptives are handled at the edge.

### C. Enterprise Institutional Cluster
- **Topology**: React Client + load-balanced Nginx Reverse Proxy + multi-container FastAPI cluster + PostgreSQL relational database.
- **Data Flow**: Nginx terminates SSL/TLS 1.3 handshakes, enforces CSP headers, and routes static assets. API queries are balanced across a cluster of three FastAPI Docker nodes backed by a PostgreSQL database with a secondary hot-standby database replication.

---

## 3. Nginx Reverse Proxy Configurations

Institutional deployments should configure Nginx to route traffic and enforce strict browser-security headers:

```nginx
server {
    listen 443 ssl http2;
    server_name biostateer.institution.org;

    ssl_certificate /etc/ssl/certs/biostateer.crt;
    ssl_certificate_key /etc/ssl/private/biostateer.key;
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Security Headers (Phase 6)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8000; frame-ancestors 'none';" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # React Frontend Static Assets
    location / {
        root /var/www/biostateer/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to FastAPI cluster
    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000;
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
```

---

## 4. Validated Containerized Setups (Docker Compose)

Sysadmins can containerize the validated backend service layer to insulate dependencies and statistical libraries.

### Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (`backend/docker-compose.yml`)
```yaml
version: '3.8'

services:
  biostat-backend:
    build: .
    container_name: biostateer-validated-engine
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - ENV=production
      - LOG_LEVEL=info
    restart: always
```

---
© 2026 Dr. Bhupesh Dewan (Owner of Biostateer™). All Rights Reserved.
