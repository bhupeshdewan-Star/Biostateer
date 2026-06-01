# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Comprehensive User Manual

---

### 1. Platform Introduction & Gated Workspace Registration
Biostateer™ is a secure, enterprise-grade Clinical Research & Biostatistics Intelligence Platform designed for clinical biostatisticians, contract research organizations (CROs), medical academic centers, and regulatory compliance reviewers. 

Anonymous usage is restricted. Accessing any analytical or design module requires a multi-step gated entry sequence:
1. **Institutional Registration**: Visitors must fill out a comprehensive corporate profile, including Job Title (e.g., Lead Statistician, CRA, Principal Investigator, Regulatory Officer), Official Email Domain (personal domains like gmail.com are automatically flagged), Mobile Number, and Organization Webpage.
2. **Identity Verification**: Two-factor verification tags are checked via corporate Email and Mobile OTP tokens.
3. **Evaluation Agreement**: Prior to workspace initialization, users must digitally sign the evaluation and reverse-engineering license agreement.
4. **Administrative Review**: Accounts remain in a `Pending Approval` state until designated platform administrators approve, reject, or waitlist the investigator.
5. **Session Monitoring**: Active sessions have an 8-hour absolute token duration. A 15-minute warning dialog alerts users before automated sign-out occurs due to inactivity under FDA 21 CFR Part 11 rules.

---

### 2. Active Research Spreadsheet Grid
The Statistical Analysis Center houses the flagship **Active Research Grid** spreadsheet interface. Unlike static file uploads, this workspace operates as an interactive in-memory data management grid:
* **Bulk Data Import & Excel Pastes**: Copy rows and columns from local Microsoft Excel or Google Sheets workbooks and paste them directly into the grid using standard `Ctrl+V` shortcuts.
* **Dynamic Column Customization**: Insert or delete rows and columns, rename variable types, and toggle sorting/filtering rules across cell vectors.
* **Derived Mathematical Formulas**: Add custom variable columns computed from active rows. For example, by specifying a formula like `BMI = Weight / (Height / 100) ** 2`, the grid dynamically evaluates and writes the resulting vector to all cells.
* **Data Lock & Lock Status Indicators**: Prior to running statistical tests, freeze the spreadsheet grid to lock variables. This ensures complete data integrity for regulatory compliance and audit trails.

---

### 3. Statistical Analysis Suite
The platform supports standard and advanced clinical trial analytical designs:
* **Parametric Workspaces**: Run One-Way ANOVA, Welch's T-Test, and Two-Way Factorial ANOVA (evaluating main effects of treatment and demographic groups, plus interaction effects and partial eta-squared indices).
* **Multivariate Workspace (MANOVA)**: Run Bivariate MANOVA evaluating dual endpoints with rigorous assumption tests (Bartlett's Sphericity, Box's M Covariance Homogeneity, and Mahalanobis Outliers).
* **Validation Badges**: Every calculation contains a dedicated validation registry stamp detailing mathematical formulas, SAS/R benchmark comparison targets, and the actual precision difference (guaranteed $< 10^{-12}$).

---

### 4. Pharmacokinetic (PK) & Bioequivalence (BE) Analysis
Dedicated modules allow research teams to assess drug formulations:
* **PK Analysis Hub (NCA)**: Executes Non-compartmental Analysis (NCA) utilizing high-precision Linear/Log-linear Trapezoidal integrals, providing half-life, area-under-the-curve ($AUC_{0-t}$, $AUC_{0-\infty}$), clearance ($CL/F$), volume of distribution ($V_z/F$), and mean residence time ($MRT$).
* **Bioequivalence Hub (TOST)**: Power studies and evaluate average bioequivalence using Two One-Sided Tests (TOST) for crossovers (2x2) and replicates (2x3, 2x4). Supports Highly Variable Drug Scaling (RSABE) and Narrow Therapeutic Index Drug (NTID) limits with USFDA, EMA, MHRA, and CDSCO compliance reports.
