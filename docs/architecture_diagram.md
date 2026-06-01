# Biostateer™ Version 1.2 — Deployment Architecture Diagram

This document illustrates the three primary deployment topologies for the Biostateer™ Clinical Analytics platform.

---

## 1. Standalone Desktop Research Mode (Local Edge)
Highly insulated, zero-database local installation. Perfect for offline statistical analysis.

```mermaid
graph LR
    User([Principal Investigator]) --> Client[React Client browser]
    Client --> EdgeEngine[Biostateer™ Edge Math Engine]
    EdgeEngine --> LocalCache[(Browser localStorage)]
```

---

## 2. Institutional Deployment (Hybrid Model)
Couples the browser client with a secure, containerized Python mathematical engine.

```mermaid
graph TD
    User([Biostatistician / CRA]) --> Client[React Client browser]
    Client --> |Health Check Ping every 8s| Client
    Client --> |1. Aggregated Math Matrices| FastAPI[Validated FastAPI Server - Port 8000]
    FastAPI --> |2. SciPy, StatsModels Engines| FastAPI
    FastAPI --> |3. Validated Results| Client
    Client --> |4. Immutable CFR 11 Audit Trail| LocalCache[(Browser localStorage)]
```

---

## 3. Enterprise Institutional Cluster (High-Throughput Model)
Full-scale clinical deployment with load-balanced Nginx proxies, multi-container clusters, and database persistence.

```mermaid
graph TD
    UserA([CRA]) --> Nginx[Nginx Reverse Proxy - SSL/TLS 1.3]
    UserB([Biostatistician]) --> Nginx
    
    Nginx --> |HTTPS API Routing| FastAPICluster{FastAPI Load Balancer}
    
    FastAPICluster --> Container1[FastAPI Math Node A]
    FastAPICluster --> Container2[FastAPI Math Node B]
    FastAPICluster --> Container3[FastAPI Math Node C]
    
    Container1 --> DB[(PostgreSQL Database Server)]
    Container2 --> DB
    Container3 --> DB
    
    DB --> BackupDB[(Secondary PostgreSQL Hot-Standby)]
    
    Container1 --> |CFR Part 11 Audit Trail Logs| DB
```

---

## ✍️ Verification Authority

**Dr. Bhupesh Dewan**
*Founder & Product Owner of Biostateer™*

*Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.*
