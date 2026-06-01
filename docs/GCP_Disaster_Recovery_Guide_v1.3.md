# Biostateer™ Version 1.3 GCP Disaster Recovery Guide
## Zero-Data-Loss Backup Restoration, Rollback Procedures & Regional Failovers

This guide provides step-by-step procedures for mitigating disasters, recovering system services, rolling back deployments, and executing point-in-time database recoveries (PITR) for **Biostateer™ Version 1.3** on Google Cloud Platform.

---

## 📅 Disaster Recovery Objectives
* **Recovery Point Objective (RPO)**: $\le 5$ minutes (Loss limit for database records).
* **Recovery Time Objective (RTO)**: $\le 15$ minutes (Service restoration window).
* **Compliance Alignment**: 21 CFR Part 11 and GCP Enterprise standards.

---

## 🗄️ Section 1: Google Cloud SQL Backup & PITR Restoration

To recover from database corruptions, accidental drops, or data integrity anomalies:

### A. Point-In-Time Recovery (PITR) Execution
Point-In-Time recovery leverages transaction logs to restore your PostgreSQL instance to a precise millisecond timestamp:

```bash
# 1. Identify target instance and specific failure timestamp
# E.g. Recovery Target: June 1, 2026, at 10:45:00 UTC
TARGET_TIMESTAMP="2026-06-01T10:45:00Z"

# 2. Clone the database instance to a clean restore instance
gcloud sql instances clone biostateer-postgres-prod biostateer-postgres-restored \
    --point-in-time-recovery-timestamp=$TARGET_TIMESTAMP
```
* **Note**: Google Cloud SQL creates a separate virtual instance (`biostateer-postgres-restored`) ensuring the active corrupted instance remains frozen for forensics audits.

### B. Standard Daily Backup Restoration
If PITR logs are unavailable, restore from the latest automated nightly cold backup:
```bash
# 1. List active backups
gcloud sql backups list --instance=biostateer-postgres-prod

# 2. Extract target backup ID
# E.g. Backup ID: 1729384

# 3. Restore to target database
gcloud sql backups restore 1729384 \
    --restore-instance=biostateer-postgres-prod \
    --backup-instance=biostateer-postgres-prod \
    --quiet
```

---

## 📦 Section 2: Cloud Run Rollback Procedures

If a newly deployed container version introduces bugs, analytical discrepancies, or security vulnerabilities, execute an instantaneous traffic shift rollback:

```text
               [ Traffic: 100% ] ──> Cloud Run (v1.3.1 - Corrupted Version)
                                     [Manual Rollback Triggered]
                                                 │
                                                 ▼
               [ Traffic: 100% ] ──> Cloud Run (v1.3.0 - Stable Production)
```

1. Navigate to the **Cloud Run Console** -> **biostateer-api** (or `biostateer-frontend`).
2. Go to the **Revisions** tab.
3. Locate the previous known-stable revision (e.g. `biostateer-api-00021-v1-3-0`).
4. Click **Manage Traffic**.
5. Set traffic to **100%** on the stable revision and **0%** on the corrupted revision.
6. Click **Save**. The routing engine instantly shifts incoming client requests without dropping connections or requiring a new container build.

* Alternatively, execute via gcloud CLI:
```bash
gcloud run services update-traffic biostateer-api \
    --to-revisions=biostateer-api-00021-v1-3-0=100 \
    --region=us-central1
```

---

## 🪣 Section 3: Google Cloud Storage Bucket Recovery

To restore exported protocols, CDISC validation sheets, or audit trail archives from Google Cloud Storage:

### A. Object Versioning Recovery
Biostateer GCS buckets are configured with active versioning. If an operator deletes an export:
1. Open GCS Console -> click the exports bucket -> check **Show deleted objects**.
2. Locate the deleted file (it carries a "Delete Marker" as the latest version).
3. Delete the "Delete Marker" version. The previous valid report version instantly becomes active.

### B. Command-Line Batch Restore
```bash
# Restore specific file
gsutil cp gs://${PROJECT_ID}-biostateer-exports/reports/file.docx#1729384910384 gs://${PROJECT_ID}-biostateer-exports/reports/file.docx
```

---

## 🌐 Section 4: Regional Service Failover Strategy

In the event of a catastrophic GCP regional outage (e.g. `us-central1` zone failure):

```text
                  +---------------------------------------+
                  |         Cloudflare Global DNS         |
                  +-------------------+-------------------+
                                      |
                 ┌────────────────────┴────────────────────┐
                 ▼ (Primary - Active)                      ▼ (Secondary - Hot Standby)
        +--------+--------+                       +--------+--------+
        |   GCP us-central1   |                       |    GCP us-east4     |
        |  (Active Outage) |                       | (Hot Standby Fail) |
        +-----------------+                       +-----------------+
```

1. **Deploy Standby Images**: Maintain container replications in a secondary geographical region (e.g. `us-east4` or `europe-west3`).
2. **Synchronize Database**: Run a Read Replica in the secondary region.
3. **Failover Execution**:
   * Promote the secondary SQL database replica to Primary.
   * Route Cloud Run VPC connector bindings to the new database engine.
   * Update Cloudflare Global DNS origin servers to point to the `us-east4` HTTPS load balancer.
   * Complete validation tests to confirm zero-data-loss integrity before unlocking evaluator logins.
