# Biostateer™ Version 1.3 GCP Deployment Guide
## Enterprise Cloud Architecture, Security Hardening & Zero-Exposure Deployment

This guide documents the procedures for provisioning, deploying, and securing **Biostateer™ Version 1.3** as a secure cloud-hosted evaluation platform on **Google Cloud Platform (GCP)**.

---

## 🏛️ GCP Production Target Architecture

```text
                               +-----------------------------------+
                               |       https://biostateer.com      |
                               |     https://app.biostateer.com    |
                               +-----------------+-----------------+
                                                 |
                                                 v
                               +-----------------+-----------------+
                               |       Cloudflare CDN & Proxy      |
                               |    (SSL Termination / DNS / WAF)  |
                               +-----------------+-----------------+
                                                 |
                                                 v
                               +-----------------+-----------------+
                               |      Google Cloud Armor WAF       |
                               |     (SQLi, XSS, DDOS Protection)  |
                               +-----------------+-----------------+
                                                 |
                                                 v
                               +-----------------+-----------------+
                               |    Google HTTPS Load Balancer     |
                               +--------+-----------------+--------+
                                        |                 |
                      /api/ Redirect    |                 | (Static Assets)
               +------------------------+                 +------------------------+
               |                                                                   |
               v                                                                   v
+--------------+--------------+                                     +--------------+--------------+
|      Google Cloud Run       |                                     |      Google Cloud Run       |
|    (biostateer-api-prod)    |                                     |    (biostateer-client-prod) |
|    FastAPI Python API Engine|                                     |    Nginx React Web App      |
+--------------+--------------+                                     +-----------------------------+
               |
               | (Private VPC Connector)
               v
+--------------+--------------+
|    Serverless VPC Access    |
+--------------+--------------+
               |
               v (Internal IP Only)
+--------------+--------------+                                     +--------------+--------------+
|       Google Cloud SQL      |                                     | Google Cloud Storage (GCS)  |
|    (PostgreSQL 16 Instance) |                                     | (Encrypted Exports & Audits)|
+-----------------------------+                                     +-----------------------------+
```

---

## 🛠️ Step 1: Project Setup & API Enablement

### A. Project Creation & Billing Linkage
1. Log in to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the **Project Selector** dropdown, select **New Project**, and input:
   * **Project Name**: `biostateer-enterprise`
   * **Project ID**: `biostateer-enterprise-prod`
3. Link an active enterprise billing account:
   * Go to **Billing** -> **Link a Billing Account**, and attach the billing profile.

### B. Command-Line CLI Configuration
Verify gcloud CLI authentication on your terminal:
```bash
gcloud auth login
gcloud config set project biostateer-enterprise-prod
```

### C. Enable Google Core Service APIs
Run the following terminal command to enable all necessary APIs:
```bash
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    storage.googleapis.com \
    compute.googleapis.com \
    vpcaccess.googleapis.com \
    servicenetworking.googleapis.com \
    cloudkms.googleapis.com
```

---

## 🔑 Step 2: Secret Manager Hardening
Create and store production passwords and credentials securely. Do not write credentials to environment files or configuration codebases.

### A. Secrets Provisioning
Execute the following to instantiate the secrets:
```bash
# Generate database password
openssl rand -base64 32 | gcloud secret manager secrets create database-password --data-file=-

# Generate JWT signing key
openssl rand -hex 64 | gcloud secret manager secrets create jwt-secret --data-file=-

# Create SMTP Email API key (e.g. SendGrid)
echo "YOUR_SENDGRID_API_KEY_HERE" | gcloud secret manager secrets create smtp-api-key --data-file=-
```

### B. Grant IAM Permissions to Cloud Run Service Accounts
Cloud Run must have explicit read access to resolve these secrets during container boot:
```bash
# Retrieve service account ID
SA_EMAIL="service-${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com"

# Grant Secret Manager Accessor Role
gcloud secrets add-iam-policy-binding database-password \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding jwt-secret \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"
```

---

## 🗄️ Step 3: Google Cloud SQL PostgreSQL Environment

### A. VPC Private Network Creation
Ensure the database is not accessible from the public internet. Connect only through an internal VPC network:
```bash
# Create Private VPC
gcloud compute networks create biostateer-vpc --subnet-mode=custom

# Establish private network peer allocation
gcloud compute addresses create google-managed-services-biostateer-vpc \
    --global \
    --purpose=VPC_PEERING \
    --addresses=10.120.0.0 \
    --prefix-length=16 \
    --network=biostateer-vpc

# Create peering connection
gcloud services vpc-peerings connect \
    --service=servicenetworking.googleapis.com \
    --ranges=google-managed-services-biostateer-vpc \
    --network=biostateer-vpc
```

### B. Database Provisioning
Create a high-availability, auto-scaling PostgreSQL instance with point-in-time recovery:
```bash
gcloud beta sql instances create biostateer-postgres-prod \
    --database-version=POSTGRES_16 \
    --tier=db-custom-4-16384 \
    --region=us-central1 \
    --network=projects/biostateer-enterprise-prod/global/networks/biostateer-vpc \
    --no-assign-ip \
    --enable-bin-log \
    --backup-start-time=02:00 \
    --storage-type=SSD \
    --storage-auto-increase \
    --encryption-key-name=projects/biostateer-enterprise-prod/locations/us-central1/keyRings/biostateer-ring/cryptoKeys/db-key
```
* `--no-assign-ip`: Blocks all public IPv4 mappings.
* `--enable-bin-log`: Prepares transactional binary logging for Point-In-Time recovery.

### C. Tables Instantiation
Connect to the private instance through a Cloud SQL Proxy tunnel, and pipe the schema:
```bash
# Launch Proxy Tunnel
./cloud-sql-proxy --private biostateer-enterprise-prod:us-central1:biostateer-postgres-prod &

# Seed relational tables (CFR triggers, audit ledgers, indices)
psql "sslmode=disable dbname=biostateer user=postgres host=127.0.0.1" -f backend/app/schema.sql
```

---

## 📦 Step 4: Containerizing & Deploying Cloud Run Services

### A. Create Serverless VPC Access Connector
Required for Cloud Run to communicate with private Cloud SQL via VPC:
```bash
gcloud compute networks vpc-access connectors create biostateer-vpc-connector \
    --region=us-central1 \
    --network=biostateer-vpc \
    --range=10.130.0.0/28
```

### B. Build and Push Container Images
Compile and deploy your source containers directly to Google Container Registry (GCR):
```bash
# Build Frontend
docker build -t gcr.io/biostateer-enterprise-prod/frontend:v1.3.0 .
docker push gcr.io/biostateer-enterprise-prod/frontend:v1.3.0

# Build Backend
docker build -t gcr.io/biostateer-enterprise-prod/backend:v1.3.0 ./backend
docker push gcr.io/biostateer-enterprise-prod/backend:v1.3.0
```

### C. Deploy Services to Cloud Run
1. **API Backend Service**:
```bash
gcloud run deploy biostateer-api \
    --image=gcr.io/biostateer-enterprise-prod/backend:v1.3.0 \
    --region=us-central1 \
    --platform=managed \
    --vpc-connector=biostateer-vpc-connector \
    --set-env-vars=ENV=production \
    --set-secrets=JWT_SECRET=jwt-secret:latest,DATABASE_URL=database-url:latest \
    --allow-unauthenticated
```
2. **Web Client Frontend Service**:
```bash
gcloud run deploy biostateer-frontend \
    --image=gcr.io/biostateer-enterprise-prod/frontend:v1.3.0 \
    --region=us-central1 \
    --platform=managed \
    --allow-unauthenticated
```

---

## 🌐 Step 5: Custom Domain, Cloudflare CDN & SSL Configuration

To serve the platform on **https://biostateer.com** and **https://app.biostateer.com**:

### A. Custom Domain Mapping in GCP
Map custom domains to the deployed frontend using the HTTPS Load Balancer or Cloud Run custom mapping:
```bash
gcloud beta run domain-mappings create \
    --service=biostateer-frontend \
    --domain=app.biostateer.com \
    --region=us-central1
```

### B. DNS Record Configurations
In your domain registrar (or Cloudflare dashboard), configure the following DNS records:

| Record Type | Host | Points To / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `GCP_HTTPS_LOAD_BALANCER_IP` | Auto | Proxied (Orange) |
| **CNAME** | `app` | `ghs.googlehosted.com.` | Auto | Proxied (Orange) |
| **TXT** | `_dnsauth` | *GCP verification TXT value* | Auto | DNS Only |

### C. SSL/TLS Settings in Cloudflare
To guarantee end-to-end security:
1. Go to the Cloudflare dashboard -> **SSL/TLS** tab.
2. Select **Full (Strict)** mode: Enforces valid SSL cert audits between Cloudflare and Google Cloud.
3. Enable **Edge Certificates** -> **Always Use HTTPS**: Forces standard client upgrades.

---

## 🛡️ Step 6: Security Hardening (WAF & Cloud Armor)

Deploy Google Cloud Armor to protect the API gateway against standard vectors (SQL injection, XSS) and malicious clients:

```bash
# Create Security Policy
gcloud compute security-policies create biostateer-waf-policy \
    --description="Enterprise WAF rules for biostateer platform"

# Rule 1: SQL Injection Protection (OWASP Rule)
gcloud compute security-policies rules create 1000 \
    --security-policy=biostateer-waf-policy \
    --expression="evaluatePreconfiguredExpr('sqli-stable')" \
    --action=deny-403 \
    --description="Mitigate SQL injection attacks"

# Rule 2: Cross-Site Scripting Protection
gcloud compute security-policies rules create 1010 \
    --security-policy=biostateer-waf-policy \
    --expression="evaluatePreconfiguredExpr('xss-stable')" \
    --action=deny-403 \
    --description="Mitigate XSS attacks"

# Rule 3: Rate Limiting Protection (100 requests/minute max)
gcloud compute security-policies rules create 1020 \
    --security-policy=biostateer-waf-policy \
    --src-ip-ranges="*" \
    --action=rate-based-ban \
    --rate-limit-threshold-count=100 \
    --rate-limit-threshold-interval-sec=60 \
    --ban-duration-sec=600 \
    --description="Rate limit to 100 requests per min"

# Attach Security Policy to HTTPS Load Balancer Backend
gcloud compute backend-services update biostateer-backend-service \
    --security-policy=biostateer-waf-policy \
    --global
```

---

## 📊 Step 7: Cloud Monitoring & Logging Setup

### A. Cloud Logging Filters
Create a central logging sink to store all audit metrics and access history inside a cold-storage GCS bucket (for CFR Part 11 storage):
```bash
gcloud logging sinks create biostateer-audit-sink \
    storage.googleapis.com/${var.gcp_project_id}-biostateer-exports \
    --log-filter="resource.type=cloud_run_revision AND jsonPayload.message=~'CFR Part 11'"
```

### B. Metric Alerts Setup
1. Go to **Monitoring** -> **Alerting** -> **Create Policy**.
2. Select metric `run.googleapis.com/container/cpu/utilizations` and establish a threshold at **85%**.
3. Wire notification channels to email alert addresses (`admin@biostateer.com`).
