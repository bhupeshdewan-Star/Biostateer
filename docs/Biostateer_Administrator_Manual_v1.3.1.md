# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Enterprise Administrator Manual

---

### 1. Administrative Gatekeeper Controls
Administrators serve as the primary security gatekeepers for Biostateer™ workspaces. The administrative control center provides a full suite of user management options:
* **Waitlist Pipeline**: New registrations are automatically held in the waitlist queue. Administrators can select user rows and toggle statuses between `Approved`, `Rejected`, `Suspended`, `Waitlisted`, or `Active`.
* **Telemetry Slidout Panels**: Select any user record to review a complete visual slideout tracking visitor metadata. This includes geographical region, IP address, user-agent string, exact registration timestamp, total sign-in frequency, and counts of analytical reports generated.
* **Evaluation Extensions**: Control active evaluation licenses (default 45-day duration) by extending access by +30, +60, or +90 days, or entering a custom calendar termination date.

---

### 2. Regulatory Compliance & Data Controls
To meet GxP and FDA requirements, administrators manage system-wide compliance controls:
* **CFR Part 11 Session Lifetimes**: System-wide configuration options to enforce automatic security logout after 8 hours of inactivity, preceded by a warning overlay at 15 minutes.
* **Audit Ledger Explorers**: Track every write, calculation, user-status change, and report generation in an immutable database audit log. Logs can be live-filtered by operator, date, action, or module, and exported as verified CSV/JSON metadata records.
* **Security hardeners**: Automated triggers block accounts after 5 failed login attempts and flag suspicious events like concurrent active logins from different locations (impossible travel detection).
