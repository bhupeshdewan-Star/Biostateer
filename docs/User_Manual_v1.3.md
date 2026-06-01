# Biostateer™ Version 1.3 User Manual
## Enterprise Security, Access Control & Clinical Evaluation Platform

### 1. Introduction & Overview
Biostateer™ is a production-ready, clinical research & biostatistics intelligence platform tailored for:
* Pharmaceutical Companies
* Contract Research Organizations (CROs)
* Medical Colleges & Academic Investigators
* Regulatory Professionals (FDA/EMA submissions)
* Biostatisticians and Clinical Investigators

Version 1.3 introduces enterprise-grade Identity Gating, Waitlisting, CFR Part 11 Session Lifetimes, and Statistical Validation Badges, elevating the tool to a high-fidelity regulatory audit-ready software.

---

### 2. Gated Identity & Request Wizard
Anonymous or unauthorized access to the clinical analytical engine is completely disabled. All users must authenticate or submit an institutional request.

#### A. Public Gateway & Landing Page
When landing on Biostateer™, visitors see a high-fidelity product showcase detailing:
* **Precision Engine**: Double-precision statistical calculators.
* **CDISC Auditing**: SDTM/ADaM schema validation.
* **CFR Part 11 Trail**: Immutable activity ledgers.

#### B. Institutional Registration Wizard
To gain evaluation access, clinical researchers must complete a multi-step registration flow:
1. **Personal Information**: Full Name, Clinical Email, Mobile Number, Country, and City.
2. **Professional Profile**: Organization/University name, official Job Title, Department, Professional Category, LinkedIn Profile, and Institutional website.
3. **Security Credentials & Consent**: password complexity check, Cloudflare Turnstile human challenge, and click-through regulatory consents.

**Professional Categories Supported:**
* Biostatistician
* CRA (Clinical Research Associate)
* Medical Writer
* Principal Investigator
* Regulatory Affairs
* Medical Affairs
* Student / Academic Researcher
* CRO Professional / Pharma Professional

#### C. Evaluation Lifecycle Status Flow
All registered profiles undergo a rigorous security status workflow:
1. **Registered**: Demographics and profile saved.
2. **Email Verified**: Verification OTP code matching (`123456` in fallback mode).
3. **Pending Approval / Waitlisted**: Account locked under administrative review queue.
4. **Approved**: Granted access to the suite.
5. **Active**: Fully interactive statistical engine unlocked.

---

### 3. Evaluation License Control
Upon approval, reviewers are granted a **45-Day Evaluation License**.
* **Visual Telemetry Banner**: The dashboard top-ribbon persistently displays the active license status:
  `Evaluation License — XX Days Remaining`
* **Auto-Expiration**: Once the 45-day threshold passes, account status is transitioned to `Expired` automatically, disabling access to clinical suites.
* **Extension Options**: Administrators can extend access via the Command Center by 30 days, 60 days, 90 days, or a custom duration.

---

### 4. Gated Clinical Workspace Modules
Approved evaluators unlock the complete Biostateer™ workspace:

#### A. Statistical Analysis Center
Perform parametric and non-parametric clinical tests with instant **SAS/SPSS/R double-precision calibration badges**.
* **OLS Linear Regression**: Multi-variable curve fitting.
* **One-Way ANOVA**: Group variance and F-statistic.
* **Wilcoxon Rank-Sum**: Non-parametric paired ordinal analysis.

#### B. Stratified Survival Suite
* **Kaplan-Meier Estimator**: Survival curve probability distribution.
* **Log-Rank Test**: Hazard-rate variance comparison.
* **Cox Proportional Hazards**: Covariate risk modeling.

#### C. Diagnostic Accuracy Suite
* **Sensitivity & Specificity**: True-positive / True-negative metrics.
* **ROC/AUC Curves**: Receiver operating characteristics mapping.
* **Likelihood Ratios**: Diagnostic significance thresholds.

#### D. Randomization Hub
* **Block Randomization**: Enforces covariate-balanced cohort groups.
* **Stratified Allocation**: Accounts for prognostic factor baselines.
* **Double-Blind Controls**: Secure blinding codes generation.

#### E. CDISC Validation Hub
* **SDTM / ADaM Auditing**: Parses datasets for structure anomalies.
* **Define.xml Schema Validation**: Traces data lineages.

---

### 5. Automated Watermark Protection
To prevent unauthorized distribution during the peer-review evaluation window, all exports (PDF, DOCX, HTML, PPTX, PNG, SVG) are processed through an automated watermarking filter.

#### Export Watermark Signature:
```text
Evaluation Version
Biostateer™
Copyright © 2026 Dr. Bhupesh Dewan
All Rights Reserved
```
* **PDF / Word**: Diagonal transparent overlay text.
* **HTML / Reports**: Background repeating SVG overlay.
* **PNG / SVG Plots**: Fixed visual seal in output canvas.

---

### 6. CFR Part 11 Auditing & Electronic Signatures
Every single interaction, data upload, formula execution, and manual override is logged into the **Immutable Audit Trail Center**.
* **Inactivity Timer**: Forces active session logout after **8 hours of inactivity**.
* **Pre-expiry Prompt**: Renders a warning notification **15 minutes** before automated session termination.
* **Electronic Signatures**: Critical exports require double-factor verification (password/OTP re-entry) acting as the legal equivalent of a physical signature.

---

### 7. Support & Licensing Information
For institutional licensing, deployment setups (on-premise/SaaS), or extended reviews:
* **Product Owner**: Dr. Bhupesh Dewan (Mumbai, India)
* **Official Registry**: `admin@biostateer.com`
* **Regulatory Compliance**: ICH E6(R3) / ICH E9 aligned.
