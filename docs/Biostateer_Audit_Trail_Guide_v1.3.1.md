# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — CFR Part 11 Audit Trail & Security Guide

---

### 1. Immutable Audit Ledger
Biostateer™ implements an automated audit logging hook. Every user interaction is captured as a secure transaction record:
* **Logged Fields**: Transaction ID, Timestamp (UTC), Operator Name, Email, IP Address, Specific Action (e.g. `Spreadsheet Data Paste`, `ANOVA Calculation`, `Spreadsheet Lock`), Module Name, Input Parameters, Output Metrics, and cryptographic SHA-256 validation tag.
* **Integrity Tagging**: Each record computes a SHA-256 hash of its contents combined with the preceding record's hash, forming an immutable database chain to block retrospective manipulation.

---

### 2. Session Integrity & Electronic Signatures
* **Electronic Signatures**: To export clinical protocols or statistical reports, users must enter their account password to generate a secure SHA-256 digital signature stamp containing the date, time, and role.
* **Auto-Logout Gateway**: Restricts active sessions to 8 hours of continuous use. If no mouse or keyboard events occur for 15 minutes, a warning dialog is triggered; at 0 minutes, the session is cleared from client-side memory.
