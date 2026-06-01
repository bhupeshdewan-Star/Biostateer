-- ====================================================================
-- BIOSTATEER™ ENTERPRISE CLINICAL & BIOSTATISTICS INTELLECTUAL PLATFORM
-- DATABASE SCHEMA MIGRATION SCRIPT (POSTGRESQL) - VERSION 1.3
-- Owner: Dr. Bhupesh Dewan
-- Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ACCESS CONTROL TABLE (VERSION 1.3 UPGRADE)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(25) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    job_title VARCHAR(100) NOT NULL,
    linkedin_profile VARCHAR(255),
    research_area VARCHAR(150),
    institution_website VARCHAR(255),
    user_category VARCHAR(50) NOT NULL, -- 'Biostatistician', 'CRA', 'Medical Writer', 'Principal Investigator', etc.
    role VARCHAR(30) NOT NULL CHECK (role IN ('Administrator', 'Reviewer', 'Evaluation User', 'Guest')),
    password_hash VARCHAR(255) NOT NULL,
    approval_status VARCHAR(40) DEFAULT 'Pending Email Verification' CHECK (approval_status IN ('Pending Email Verification', 'Pending Review', 'Waitlisted', 'Approved', 'Rejected', 'Suspended')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    last_login TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    account_expires_at TIMESTAMP WITH TIME ZONE,
    terms_version VARCHAR(10) DEFAULT 'v1.3',
    privacy_version VARCHAR(10) DEFAULT 'v1.3',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(approval_status);

-- 2. LOGIN AUDIT TABLE
CREATE TABLE IF NOT EXISTS login_audit (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL,
    browser VARCHAR(150) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    login_status VARCHAR(30) NOT NULL -- 'SUCCESS', 'FAILED_PWD', 'PENDING_APPROVAL', 'SUSPENDED', etc.
);

CREATE INDEX idx_login_audit_user ON login_audit(user_id);

-- 3. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    module_used VARCHAR(100) NOT NULL,
    action_performed TEXT NOT NULL
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- 4. VISITOR SESSIONS TABLE
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id BIGSERIAL PRIMARY KEY,
    visitor_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mobile VARCHAR(25) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    session_count INTEGER DEFAULT 1,
    login_frequency INTEGER DEFAULT 1,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modules_used TEXT[], -- List of modules accessed
    reports_generated INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    browser VARCHAR(150) NOT NULL,
    os VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. REPORT EXPORTS TABLE
CREATE TABLE IF NOT EXISTS report_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('SAP Dossier', 'Study Protocol', 'Validation Report', 'CDISC Audit Summary')),
    format VARCHAR(10) NOT NULL CHECK (format IN ('DOCX', 'PDF', 'XLSX', 'MD', 'PPTX', 'PNG', 'SVG')),
    content TEXT NOT NULL,
    watermark_applied VARCHAR(150) DEFAULT 'Evaluation Version'
);

-- 6. PROJECTS TABLE (High-Level Clinical Programs)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Archived', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. STUDIES TABLE (Individual Clinical Trials)
CREATE TABLE IF NOT EXISTS studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    phase VARCHAR(20) NOT NULL CHECK (phase IN ('Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Observational')),
    blinding VARCHAR(30) NOT NULL CHECK (blinding IN ('Open-Label', 'Single-Blind', 'Double-Blind', 'Triple-Blind')),
    status VARCHAR(25) DEFAULT 'Design' CHECK (status IN ('Design', 'Active', 'Suspended', 'Completed', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PROTOCOLS TABLE
CREATE TABLE IF NOT EXISTS protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    study_id UUID UNIQUE NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    primary_endpoint TEXT NOT NULL,
    secondary_endpoints TEXT[],
    review_status VARCHAR(20) DEFAULT 'Draft' CHECK (review_status IN ('Draft', 'In Review', 'Approved')),
    pi_signed BOOLEAN DEFAULT FALSE,
    pi_signed_at TIMESTAMP WITH TIME ZONE,
    sponsor_signed BOOLEAN DEFAULT FALSE,
    sponsor_signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. STATISTICAL ANALYSIS PLANS (SAPs) TABLE
CREATE TABLE IF NOT EXISTS saps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    study_id UUID UNIQUE NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
    target_sample_size INTEGER NOT NULL CHECK (target_sample_size > 0),
    block_size INTEGER NOT NULL CHECK (block_size IN (2, 4, 6, 8)),
    randomization_method VARCHAR(30) NOT NULL CHECK (randomization_method IN ('simple', 'block', 'stratified', 'minimization')),
    imputation_method VARCHAR(20) NOT NULL CHECK (imputation_method IN ('locf', 'bocf', 'mean', 'mice')),
    test_specs_json JSONB NOT NULL, -- Holds R, SAS, and Python boilerplate implementation scripts
    review_status VARCHAR(20) DEFAULT 'Draft' CHECK (review_status IN ('Draft', 'In Review', 'Approved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. STATISTICAL VALIDATION REGISTRY TABLE
CREATE TABLE IF NOT EXISTS validation_registry (
    id VARCHAR(30) PRIMARY KEY,
    formula_name VARCHAR(100) NOT NULL,
    version VARCHAR(15) NOT NULL,
    validated_against VARCHAR(100) NOT NULL,
    reviewer VARCHAR(100) NOT NULL,
    tolerance VARCHAR(15) NOT NULL,
    governing_equation TEXT NOT NULL,
    reference_value DOUBLE PRECISION NOT NULL,
    actual_value DOUBLE PRECISION NOT NULL,
    absolute_bias DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) DEFAULT 'VALIDATED' CHECK (status IN ('VALIDATED', 'PENDING_REVIEW')),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. APPEND-ONLY MUTABLE AUDIT TRAIL LEDGER (CFR PART 11 COMPLIANT)
CREATE TABLE IF NOT EXISTS audit_trail (
    id BIGSERIAL PRIMARY KEY,
    audit_id VARCHAR(20) UNIQUE NOT NULL, -- e.g. tx-192834
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    operator_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(30) NOT NULL,
    action_category VARCHAR(30) NOT NULL CHECK (action_category IN ('Study', 'Statistical', 'Protocol', 'AI', 'User')),
    module_name VARCHAR(100) NOT NULL,
    action_executed TEXT NOT NULL,
    parameters_json JSONB NOT NULL,
    outputs_json JSONB NOT NULL,
    export_status VARCHAR(30) NOT NULL,
    cryptographic_hash VARCHAR(64) NOT NULL, -- SHA-256 integrity hash linking logs
    system_version VARCHAR(15) NOT NULL DEFAULT 'v1.3.0'
);

CREATE INDEX idx_audit_category ON audit_trail(action_category);
CREATE INDEX idx_audit_timestamp ON audit_trail(timestamp);

-- Prevent updates or deletions on audit_trail table (CFR Part 11 Rule)
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

-- 12. PLATFORM VERSION & COMPLIANCE HISTORY TABLE
CREATE TABLE IF NOT EXISTS version_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(15) NOT NULL,
    build_number VARCHAR(25) NOT NULL,
    release_date DATE NOT NULL,
    classification VARCHAR(30) NOT NULL CHECK (classification IN ('Enterprise Preview', 'Beta', 'General Availability')),
    deployment_status VARCHAR(30) NOT NULL CHECK (deployment_status IN ('Production Candidate', 'Active')),
    validation_status VARCHAR(40) NOT NULL,
    release_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Version History
INSERT INTO version_history (version, build_number, release_date, classification, deployment_status, validation_status, release_notes)
VALUES (
    '1.3',
    '2026.06.01.02',
    '2026-06-01',
    'Enterprise Preview',
    'Production Candidate',
    'Pending Final Statistical Verification',
    'Upgrade identity frameworks, click-through evaluation gating licenses, Cloudflare turnstile integrations, automated waitlisting dashboards, security activity trackers, and statistical verification badges.'
);
