# Biostateer™ Version 1.2 — Comprehensive User Manual
*Enterprise Clinical & Biostatistics Intelligence Platform*

---

## SECTION 1 — Introduction
Biostateer™ is an enterprise-grade **Clinical Research & Biostatistics Intelligence Platform** designed to support statistical planning, clinical trial randomization, CDISC compliance validation, and regulatory documentation workflows. The platform serves biostatisticians, principal investigators, clinical research associates (CRAs), and regulatory affairs professionals in pharmaceutical, CRO, and academic research organizations.

---

## SECTION 2 — Installation
The system uses an **Edge Hybrid Architecture** composed of a React/TypeScript frontend client and a FastAPI/Python statistical backend server.

### Prerequisites
- **Node.js**: v20.0.0 or higher (v22.0.0 LTS recommended)
- **Python**: v3.11 or higher
- **PostgreSQL**: v15.0 or higher
- **System Memory**: 8 GB RAM minimum (32 GB recommended for high-throughput simulations)

### Step-by-Step Client Setup
1. Unzip or clone the workspace repository.
2. Open terminal in the root workspace directory.
3. Install node package dependencies:
   ```bash
   npm install
   ```
4. Build or launch the client in development mode:
   ```bash
   npm run dev
   ```

### Step-by-Step Validated Backend Setup
1. Navigate to `/backend` directory.
2. Set up a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install package requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and configure appropriate port settings.
5. Launch the FastAPI validated server:
   ```bash
   python main.py
   ```

---

## SECTION 3 — Deployment Options
Biostateer™ supports three major institutional deployment topologies:
1. **Standalone Desktop Research Mode**: Client-side edge calculations running in-browser with zero external database dependencies. Useful for offline, local preliminary investigations.
2. **Institutional Deployment**: Insulated local React client coupled with a containerized FastAPI Python validated math core running SciPy and StatsModels.
3. **Enterprise Institutional Cluster**: Balanced React frontend hosted via high-throughput web servers, communicating with a load-balanced Nginx reverse proxy routing API calls to a multi-container FastAPI cluster backed by PostgreSQL databases.

---

## SECTION 4 — User Roles and Permissions
Access control is governed by a rigid, module-specific **Role-Based Access Control (RBAC)** security matrix:
- **Administrator**: Unrestricted full access to all components, database migrations, security audits, and configuration settings.
- **Biostatistician**: Access to all descriptive, parametric, non-parametric, regression, survival, meta-analysis, and validation registries. Restricted from generating blind randomizations.
- **Principal Investigator**: Authorized to build conceptual RCT wizard matrices, draft protocols, review SAP dossiers, and append peer comments.
- **CRA**: Authorized to validate CDISC Define.xml schemas, ingest clinical trial spreadsheets, and compile permuted block randomizations.
- **Medical Affairs**: Read-only access to demographic descriptive statistics, tables, and study protocol drafts.
- **Regulatory Affairs**: Authorized to audit compliance dashboards, inspect the immutable audit trail center, and export signed validation registries.
- **Viewer**: Read-only access to high-level dashboards and summaries.

---

## SECTION 5 — Dashboard Overview
The **Executive Dashboard** acts as the central command center for clinical analytics. It displays overall study profiles, validation status indicators, recent audit logs, active CDISC validation scores, and links to all primary biostatistical calculators.

---

## SECTION 6 — Data Import Center
The **Data Import Hub** supports ingestion of multiple data formats including **CSV**, **TSV**, **XLSX**, and clipboard matrices. It performs data cleaning, baseline definition checks, and pushes formatted arrays directly to hypothesis testing modules, executing client-side data parsing without caching raw data elements to disk.

---

## SECTION 7 — CDISC Validation Hub
The **CDISC Ingestion Hub** parses Define.xml structures and checks variables against current CDISC Controlled Terminology standards. Features Pinnacle 21-style filters separating violations into:
- **Missing Variables**: Flags core required variables.
- **Controlled Terminology (CT)**: Scans codelist values.
- **Missing Metadata**: Flags undefined parameters in schemas.
- **Traceability Gaps**: Generates interactive lineage maps tracking ADaM variables to SDTM parents.

---

## SECTION 8 — Randomization Hub
The **Clinical Randomization Hub** generates cryptographic allocation schedules for clinical trials.
- **Methods**: Simple, Block, Stratified Block, Pocock-Simon Minimization, and Biased Coin allocation.
- **Blinding Protection**: Features emergency unblinding codes shielded behind cryptographic tokens.
- **Exports**: Schedules exportable in CSV, Excel, and PDF formats.

---

## SECTION 9 — Missing Data Management
The **Missing Data Imputation Center** allows biostatisticians to diagnose and handle incomplete datasets:
- **Diagnostics**: Little's MCAR Chi-Square tests to verify if values are Missing At Random (MAR).
- **Imputations**: LOCF (Last Observation Carried Forward), BOCF (Baseline Carried Forward), Mean imputation, and Multiple Imputations by Chained Equations (MICE).
- **Sensitivities**: Plots post-imputed mean variances side-by-side.

---

## SECTION 10 — Diagnostic Accuracy Suite
The **Diagnostic Accuracy Hub** analyzes biological biomarker performance:
- **Core**: Sensitivity, Specificity, PPV, NPV, overall accuracy, LR+, and LR−.
- **ROC / AUC**: receiver operating characteristic curves with DeLong correlated ROC comparisons.
- **Calibration Plots**: Plots nominal predicted probabilities against observed event rates, reporting Hosmer-Lemeshow goodness-of-fit stats.
- **Clinical Benefit**: Net Benefit DCA curves and Net Reclassification Index (NRI) matrices.

---

## SECTION 11 — Meta-Analysis Hub
The **Meta-Analysis Hub** pools treatment effects across clinical literature:
- **Algorithms**: Mantel-Haenszel fixed-effects and DerSimonian-Laird random-effects estimators.
- **Heterogeneity**: Cochran's $Q$, Higgin's $I^2$, $\tau^2$ statistics.
- **Asymmetry & Bias**: Egger and Begg publication bias checks.
- **Visuals**: Renders interactive, high-fidelity SVG Forest and Funnel plots.

---

## SECTION 12 — Survival Analysis Suite
The **Stratified Survival Suite** conducts time-to-event assessments:
- **Estimates**: Kaplan-Meier survival curves and Nelson-Aalen cumulative step hazards.
- **Hypothesis**: Stratified log-rank tests comparing survival divergence.
- **Regression**: Stratified Cox proportional hazards regression and Fine-Gray Competing Risks modeling.

---

## SECTION 13 — Sample Size Hub
The **Sample Size & Power Hub** performs pre-study estimations:
- **Efficacy**: Continuous means, binary proportions, and Cox survival boundaries.
- **Interim Analysis**: Lan-DeMets alpha spending calculations plotting sequential boundary boundaries (O'Brien-Fleming, Pocock).

---

## SECTION 14 — Study Design Wizard 2.0
The **Study Design Wizard** allows principal investigators to conceptualize trials, input clinical endpoints, select active comparators, calculate sample sizes in real-time, and draft protocol synopses.

---

## SECTION 15 — Protocol Assistant
The **Protocol & SAP Assistant** compiles regulatory study dossiers. It specifies target visit windows, pre-planned protocol deviation rules, derived variable parameters, and collaboration comments.

---

## SECTION 16 — SAP Generator
The **Statistical Analysis Plan (SAP) Generator** generates boilerplate programming specifications in **R**, **SAS**, and **Python** to streamline clinical database setups.

---

## SECTION 17 — AI Copilot
The **AI Biostatistics Copilot** parses biostatistics queries, returning detailed mathematical advice. Every response is bound inside an amber container displaying calculated AI confidence levels and strict qualified statistician disclaimers.

---

## SECTION 18 — Validation Registry
The **Statistical Validation Registry** tracks governing mathematical equations and tolerances against R/SAS references, proving double-precision compliance.

---

## SECTION 19 — Audit Trail Center
The **FDA CFR Part 11 Audit Trail Center** is an immutable append-only ledger tracking all platform actions, secured through cryptographic SHA-256 chain checks and digital signature sign-offs.

---

## SECTION 20 — Regulatory Compliance Center
The **Regulatory Guideline Center** features checklist panels detailing compliance parameters for global clinical frameworks (ICH E9, FDA Adaptive Designs, CONSORT, STROBE, PRISMA).

---

## SECTION 21 — Exporting Reports
Dossiers, validation records, and audit logs can be compiled and downloaded in **DOCX**, **PDF**, **XLSX**, and **Markdown** formats, complete with version indicators.

---

## SECTION 22 — Backup & Recovery
Institutional administrators should configure standard cron backups:
- **Daily Backups**: Dump PostgreSQL schemas and audit trail logs.
- **Recovery**: Restored via command line:
  ```bash
  psql -U biostat_admin -d biostateer_db -f biostateer_db_backup.sql
  ```

---

## SECTION 23 — Troubleshooting
- **Badges show Local Precision Mode**: The React client cannot contact `http://localhost:8000/`. Confirm the FastAPI server is running.
- **Access Restricted screen**: Switch your role selector in the header to a profile with permitted scopes.

---

## SECTION 24 — Known Limitations
- MICE imputations on large datasets (> 100,000 subjects) can generate browser lag in standalone mode; use validated backend mode instead.
- PDF exports require system-level print margins for optimal grid rendering.

---

## SECTION 25 — Version History
- **v1.0.0 (May 2026)**: Ingestion & Box/violin visual drawer layouts.
- **v1.2.0 (June 2026 - Current)**: Complete CFR Part 11 auditing center, PostgreSQL integration models, Pinnacle 21 audits, calibration plots, validation package compilers, and strict AI disclaimers.

---
© 2026 Dr. Bhupesh Dewan (Owner of Biostateer™). All Rights Reserved.
