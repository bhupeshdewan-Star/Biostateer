# Biostateer™ Version 1.2 — Official Release Notes
*Release Date: June 1, 2026*
*Build Number: 2026.06.01.01*

Biostateer™ has been successfully upgraded to **Version 1.2**, transforming the platform from a trials calculator to a comprehensive **Clinical Research & Biostatistics Intelligence Platform**.

---

## 🌟 Key Upgrades & Enhancements

### 1. Deployment & Infrastructure
- **Validated vs. Local Precision Mode**: Programmed a CORS connection health pinger in the header, automatically displaying validated API indicators or high-precision local fallback warnings.
- **PostgreSQL Schemas**: Created full relational SQL tables for users, projects, protocols, saps, validation, and version records, incorporating PL/pgSQL database trigger locks to secure logs from editing.

### 2. Clinical Biostatistics Math
- **Calibration Plots**: Plotted nominal predicted probabilities against observed risk proportions along with ideal calibration references.
- **Hosmer-Lemeshow Statistics**: Added Goodness-of-Fit statistical calculations ($\chi^2$ and p-values) to evaluate model calibration.
- **DeLong AUC ROC Contrast**: Expanded biomarker ROC comparison, calculating correlated AUC $Z$-scores and significance bounds.

### 3. Data Auditing & CDISC Standards
- **CDISC Pinnacle 21 Filters**: Upgraded CDISC parsers, allowing users to filter dataset and Define.xml checks by **Missing Variables**, **Controlled Terminology (CT)**, **Missing Metadata**, and **Traceability Gaps**.
- **CFR Part 11 Audit Trail Center**: Built an append-only transaction ledger with cryptographic SHA-256 chain verification and electronic signature PIN sign-off forms.

### 4. AI & Regulatory Hardening
- **Qualified Statistician Disclaimer**: Appends strict alert boxes to every AI Copilot recommendation, stating computed confidence levels and the mandatory review disclaimer.
- **Word Reports Exporter**: Added Word **DOCX** download actions inside SAP dossier generators.
- **Regulatory Language Review**: Replaced absolute compliance claims with precise hedging language ("Designed to support Part 11-aligned workflows" and "Benchmarked against reference statistical implementations").

---

## ✍️ Ownership & Copyrights

**Biostateer™**
*Founder & Product Owner: Dr. Bhupesh Dewan*

*Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.*
