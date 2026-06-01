# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Cloud Deployment & DevOps Manual

---

### 1. Architecture & Containerization
Biostateer™ is structured as a cloud-native application containerized using Docker:
* **Vite/React Frontend Container**: Compiled into static HTML/CSS/JS and served using a hardened Nginx server image.
* **Node.js/Python Backend Container**: Executes API routers, authentication sequences, and triggers the Python validation execution sandbox.
* **Docker Multi-Stage Build**:
  ```dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  ```

---

### 2. Google Cloud Platform (GCP) Target Environment
* **Google Cloud Run**: Deploys serverless containers for both frontend and backend.
* **Google Cloud SQL (PostgreSQL)**: Fully managed relational database storing user records, registrations, audit trails, and data locks.
* **VPC Connector**: Configures private VPC peering between Cloud Run and Cloud SQL, ensuring that database traffic never traverses the public internet.
* **Cloud Load Balancing & SSL**: Integrates Google Cloud Load Balancing with managed SSL/TLS certificates and Cloud Armor WAF rules to block SQL injection and cross-site scripting (XSS).
