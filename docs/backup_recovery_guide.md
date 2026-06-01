# Biostateer™ Version 1.2 — Backup & Recovery Guide

This document describes the backup policies, retention schedules, and restoration commands required to preserve clinical data and validation records.

---

## 📅 Data Retention Policy

Biostateer™ enforces a strict retention schedule for audit trails, validation reports, and study databases:

- **Daily Backups**: Dump and compress the full PostgreSQL study schema and log directories.
  - *Retention*: 30 Days.
- **Weekly Backups**: Standard database snapshots.
  - *Retention*: 12 Weeks.
- **Monthly Backups**: Secure regulatory-compliant archival.
  - *Retention*: 12 Months (or longer depending on study protocol requirements).

---

## 🛠️ PostgreSQL Backup Commands

System administrators should configure standard cron jobs to dump relational databases safely.

### Backup Command (Postgres CLI)
```bash
pg_dump -U biostat_admin -h 127.0.0.1 -d biostateer_db | gzip > /var/backups/biostateer/biostateer_db_backup_$(date +%F).sql.gz
```

### Audit Trail File Archiving (CFR Part 11)
```bash
tar -czf /var/backups/biostateer/audit_logs_backup_$(date +%F).tar.gz /data/audit/
```

---

## 🔄 Disaster Recovery Procedures

In the event of database corruption, system crashes, or migration rollbacks, execute the following commands inside the validated terminal.

### 1. Re-initialize empty database schema
Ensure the Postgres user credentials and extensions are active, then run:
```bash
psql -U postgres -c "CREATE DATABASE biostateer_db;"
```

### 2. Restore Relational Database from compressed backup
Decompress the latest backup file and pipe it directly to psql:
```bash
gunzip -c /var/backups/biostateer/biostateer_db_backup_2026-06-01.sql.gz | psql -U biostat_admin -d biostateer_db
```

### 3. Restore append-only audit trail logs
Extract the compressed file logs back to the secure environment directory:
```bash
tar -xzf /var/backups/biostateer/audit_logs_backup_2026-06-01.tar.gz -C /data/audit/
```

---

## ✍️ Verification Authority

**Dr. Bhupesh Dewan**
*Founder & Product Owner of Biostateer™*

*Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.*
