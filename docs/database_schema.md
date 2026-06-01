# Biostateer™ Version 1.2 — Database Schema Documentation

This document describes the PostgreSQL relational database schema defined in `/backend/app/schema.sql` for institutional clinical deployments.

---

## 📊 Relational Database Schema Model

### 1. `users` Table
Stores authentication profiles and RBAC security roles.
- **id** (UUID, Primary Key): Unique user identifier.
- **username** (VARCHAR(50), Unique): Security access name.
- **email** (VARCHAR(100), Unique): Corporate email address.
- **password_hash** (VARCHAR(255)): Protected access token.
- **role** (VARCHAR(30)): Designated RBAC permission scope (e.g. `Administrator`, `Biostatistician`, `Principal Investigator`, `CRA`, `Medical Affairs`, `Regulatory Affairs`, `Viewer`).
- **is_active** (BOOLEAN): Status toggle.
- **created_at / updated_at**: Standard timestamps.

### 2. `projects` Table
Higher-level categorization grouping matching clinical trials.
- **id** (UUID, Primary Key): Project identifier.
- **name** (VARCHAR(100), Unique): Project naming catalog.
- **description** (TEXT): Operational scope definitions.
- **owner_id** (UUID, Foreign Key): Links to `users.id`.
- **status** (VARCHAR(20)): Active, Archived, or Completed states.

### 3. `studies` Table
Represents individual clinical trial parameters.
- **id** (UUID, Primary Key): Study identifier.
- **project_id** (UUID, Foreign Key): References `projects.id`.
- **title** (TEXT): Official study title.
- **phase** (VARCHAR(20)): Trial phase classification (Phase I to IV, Observational).
- **blinding** (VARCHAR(30)): Allocation concealment (Open-Label to Triple-Blind).
- **status** (VARCHAR(25)): Operational state (Design, Active, Completed).

### 4. `protocols` Table
Details core clinical synopses and electronic signatures.
- **id** (UUID, Primary Key): Protocol identifier.
- **study_id** (UUID, Foreign Key, Unique): References `studies.id`.
- **title / objective / primary_endpoint** (TEXT): Pre-specified outcome variables.
- **pi_signed / pi_signed_at**: Principal Investigator signature markers.
- **sponsor_signed / sponsor_signed_at**: Sponsor authorization stamps.

### 5. `saps` Table
Maps statistical design frameworks, algorithms, and specs.
- **id** (UUID, Primary Key): SAP identifier.
- **study_id** (UUID, Foreign Key, Unique): References `studies.id`.
- **target_sample_size** (INTEGER): Target subject counts.
- **randomization_method / imputation_method** (VARCHAR): Allocation and missing data parameters.
- **test_specs_json** (JSONB): Contains R, SAS, and Python boilerplate implementation scripts.

### 6. `reports` Table
Stores generated Word (DOCX), PDF, Excel, and Markdown outputs.
- **id** (UUID, Primary Key): Report identifier.
- **study_id** (UUID, Foreign Key): References `studies.id`.
- **type / format / content** (TEXT): File outputs.
- **generated_by** (UUID, Foreign Key): References `users.id`.

### 7. `validation_registry` Table
Tracks validated mathematical formulas and double-precision error bounds.
- **id** (VARCHAR(30), Primary Key): e.g. `TTEST_001`.
- **formula_name / governing_equation** (TEXT): Mathematical definitions.
- **reference_value / actual_value** (DOUBLE PRECISION): Verification outputs.
- **absolute_bias** (DOUBLE PRECISION): Tolerance deviation ($\le 10^{-15}$).

### 8. `audit_trail` Table (CFR Part 11 Append-Only)
Immutable transaction log capturing platform actions.
- **id** (BIGSERIAL, Primary Key): Autoincrementing index.
- **audit_id** (VARCHAR(20), Unique): e.g. `tx-938210`.
- **operator_name / user_role** (VARCHAR): User identity.
- **action_category** (VARCHAR): `Study`, `Statistical`, `Protocol`, `AI`, or `User`.
- **action_executed / parameters_json / outputs_json**: Operational details.
- **cryptographic_hash** (VARCHAR(64)): Tamper-evident link.

---

## 🔒 Append-Only Trigger Locks
The database enforces CFR Part 11 ledger integrity by explicitly locking down the `audit_trail` table against updates or deletions using PostgreSQL PL/pgSQL triggers:

```sql
CREATE OR REPLACE FUNCTION prevent_audit_manipulation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit trail modifications or deletions are strictly prohibited under FDA 21 CFR Part 11 regulations.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lock_audit_trail_update
BEFORE UPDATE ON audit_trail
FOR EACH ROW EXECUTE FUNCTION prevent_audit_manipulation();

CREATE TRIGGER trg_lock_audit_trail_delete
BEFORE DELETE ON audit_trail
FOR EACH ROW EXECUTE FUNCTION prevent_audit_manipulation();
```

---
© 2026 Dr. Bhupesh Dewan (Owner of Biostateer™). All Rights Reserved.
