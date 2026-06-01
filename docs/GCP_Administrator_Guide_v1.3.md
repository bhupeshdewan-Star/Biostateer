# Biostateer™ Version 1.3 GCP Administrator Guide
## Closed Beta Governance, Waitlist Management & Product Telemetry

This guide is designed for Clinical Administrators, Principal Investigators, and Peer Auditors governing **Biostateer™ Version 1.3** on the production evaluation cluster.

---

## 🔒 Closed Beta Evaluation Governance

To protect Biostateer™ intellectual property, restrict public leakage of analytical tools, and manage review cohorts, the cloud instance is configured under a **Closed Beta Evaluation Model**:
* **Maximum Cohort Bounds**: Restricted to a maximum of **100–200 simultaneous active evaluators**.
* **Zero Anonymous Entry**: All analytical suites, protocol templates, and CDISC validators are completely gated. Anonymous API triggers will return immediate HTTP `401 Unauthorized` codes.
* **Auto-Watermarked Outputs**: All downloaded calculation matrices and protocols contain diagonal legal overlays to prevent raw redistribution or commercial usage.

---

## 🎛️ Step 1: Waitlist Management & Account Approvals

All newly registered clinicians undergo a strict waitlist validation queue:

```text
[ Clinician Registers ] 
          │
          ▼
[ Pending Review / Waitlisted Queue ] ──(Admin Reviewer Verifies Credentials)
          │
          ├───────────────────────────┐
          ▼ (If Legitimate)           ▼ (If Malicious / Invalid)
[ Account Approved & Active ]      [ Account Rejected ]
```

### A. Verifying Demographics & Affiliations
1. Navigate to the **Admin Dashboard** panel (`activeModule: admin-dashboard`).
2. Search waitlisted users or filter by `Status: Pending Review`.
3. Inspect profile telemetry details:
   * Match the **Email domain** (e.g. `@sanofi.com`, `@harvard.edu`) against the registered **Institution website** to verify professional authenticity.
   * Review their **Job Title** and **User Category** (CRA, Biostatistician, Regulatory Affairs) to align access scopes.
   * Inspect the user's **LinkedIn profile link** to verify credential authenticity.

### B. Execution of Access Decisions
* **Approve**: Generates a cryptographically signed database entry and triggers an email notification containing their access credentials. Sets status to `Approved`.
* **Waitlist / Hold**: Keeps the profile in queue for the next evaluation cohort cycle.
* **Suspend**: Block active users instantly if suspicious network activities (such as account sharing or rapid geoconcurrency errors) are flagged.

---

## ⏳ Step 2: 45-Day Evaluation License Management

Approved peer evaluators receive a **45-day evaluation license** bound to their user ID.

### A. Expiry Audits & Automated Locks
* **Visual Warning Ribbon**: The top header bar alerts evaluators of their remaining access (Yellow for $\le 7$ days, Amber for $\le 3$ days, Red flashing alert for $\le 24$ hours).
* **Automated Suspensions**: Once the database field `account_expires_at` falls past the current timestamp, access is instantly revoked, and user status is set to `Expired`.

### B. Extending Licenses
If a clinical trial coordinator or academic researcher requires additional evaluation cycles:
1. Open the user profile drawer in the **Admin Dashboard**.
2. Select **Extend License Parameters**.
3. Choose one of the preset values:
   * **Extend 30 Days**: Standard peer-review extension.
   * **Extend 60 Days**: Institutional partner trial evaluation window.
   * **Extend 90 Days**: Long-term clinical trial protocol planning.
   * **Custom Date**: Select specific dates matching validation audit milestones.
4. Click **Commit Extension**. The platform automatically logs the renewal event in the append-only audit ledger.

---

## 📈 Step 3: Analytics Review & Telemetry

Open **Admin Analytics** (`activeModule: admin-analytics`) to monitor evaluation engagements:
* **Professional Segment Proportions**: Tracks which clinician profiles (Biostatisticians, CRAs, Regulatory Auditors) are using the tools.
* **Geographic Distributed Maps**: Monitors acquisition points to ensure evaluation coverage aligns with multi-center clinical trials.
* **Calculator Activity Standings**: Identifies popular workspaces (e.g. Stratified Survival Suite, Diagnostic Accuracy Hub) to measure statistical utility.
* **Product Session Durations**: Measures average operator interaction limits (average target: 24.5 minutes).

---

## 🕵️ Step 4: Security Threat & Activity Log Auditing

The **Security Center** dashboard compiles real-time network threat assessments to protect database tables:
1. **Failed Login Attempts**: Identify and block potential dictionary or brute-force accounts.
2. **Blocked Accounts**: Review accounts locked due to consecutive authentication errors.
3. **Suspicious Activity Telemetry**:
   * **Multiple IP Warnings**: Flags profiles accessing the platform from multiple distinct geographic regions concurrently (account sharing).
   * **Impossible Travel Warnings (Geoconcurrency)**: Identifies session hijackers logging in from geographically impossible regions in short intervals.
   * **Rapid OTP Requests**: Blocks SMS/Email floods.

---

## 💬 Step 5: Closed Feedback Collection & Loop Closure
Biostateer™ Version 1.3 includes an integrated feedback widget designed to collect evaluator inputs directly from the user interface:
1. Reviewers submit recommendations, issues, or feature requests.
2. Inputs are logged directly in the PostgreSQL database and parsed by administrators.
3. The platform generates structured telemetry exports enabling product owners to review biostatistics validation reports and implement requested features before general publication.
