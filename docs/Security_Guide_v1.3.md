# Biostateer™ Version 1.3 Security & Compliance Guide
## CFR Part 11, Data Integrity, Network Architecture & Access Controls

### 1. 21 CFR Part 11 Compliance Framework
Biostateer™ is architected to align with the FDA's **21 CFR Part 11** guidelines for electronic records and signatures.

#### A. Session Lifetime & Automated Inactivity Monitors
To prevent unauthorized terminal access in shared clinical workstations:
* **8-Hour Absolute Session Cap**: Regardless of activity, sessions expire after 8 hours to prompt fresh authentication.
* **8-Hour Inactivity Trigger**: Renders a lock overlay if no keyboard or mouse events are registered within an 8-hour window.
* **15-Minute warning Ribbon**: Exactly 15 minutes before the session expires, a visual banner warns:
  `CFR Part 11 Notice — Session Expres in XX Minutes due to inactivity.`

#### B. Cryptographically Bound Electronic Signatures
For sensitive database records and exported analysis reports (such as clinical protocols or SAP generations), the system enforces double-factor electronic signatures:
* Evaluators must re-input their password or clinical OTP to sign exports.
* The system stamps the metadata audit footer with:
  `Digitally signed by [Name], [Category] | UTC [Timestamp] | Hash [SHA256]`

---

### 2. HTTP Network Security & TLS Rules

#### A. Perfect Forward Secrecy (TLS 1.3 Only)
Production servers must deny legacy protocols (SSL v3, TLS 1.0, TLS 1.1) and prefer TLS 1.3 exclusively.
* **Ciphers Permitted**:
  `ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305-SHA256`
* **HSTS (HTTP Strict Transport Security)**: Mandatory header with `max-age=63072000; includeSubDomains; preload` to enforce secure socket tunnels.

#### B. Secure Session Cookie Directives
All JWT and refresh tokens stored in cookies must carry strict browser directives:
* `HttpOnly`: Block all client-side JavaScript access to protect against Cross-Site Scripting (XSS).
* `Secure`: Transmit only over encrypted HTTPS connections.
* `SameSite=Strict`: Protect against Cross-Site Request Forgery (CSRF) by preventing cookie transmission on cross-origin requests.

---

### 3. Content Security Policy (CSP) Specifications
To mitigate XSS injections, dynamic script evaluations (`eval()`), inline styles, and unauthorized frames are blocked via server HTTP headers:
```text
Content-Security-Policy: 
  default-src 'self' http://localhost:8000;
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data:; 
  frame-ancestors 'none'; 
  form-action 'self';
```
* `frame-ancestors 'none'`: Prevents clickjacking by blocking the platform from rendering inside `<frame>`, `<iframe>`, `<embed>`, or `<object>` containers.

---

### 4. JWT Validation & Rotation Policies

#### A. Dual-Token Architecture
1. **Access Token**: Short-lived (15 minutes), digitally signed with HMAC-SHA256 containing role credentials (`role`, `username`, `email`).
2. **Refresh Token**: Long-lived (7 days), stored securely in an `HttpOnly` cookie and cross-verified against the backend PostgreSQL `visitor_sessions` database table.

#### B. Replay Protection & Rotation
* Each refresh token can only be used once (token rotation). Upon calling `/auth/refresh`, the database invalidates the old refresh token and returns a newly minted pair.
* If a compromised refresh token is presented twice, the entire user session family is instantly revoked to prevent hijack replay attacks.

---

### 5. Brute Force Protection & Lockout Controls

#### A. Account Lockout Threshold
* **Consecutive Failures Cap**: Five (5) consecutive failed login attempts trigger an immediate block.
* **Lockout Mechanics**: The account status transitions to `Suspended`. Dynamic login attempts are completely denied at the API gateway layer.
* **Administrative Override**: Only a registered Clinical Administrator can reactivate a suspended account after verifying institutional identity credentials.

#### B. Multi-IP and Account Sharing Telemetry
* If a single active session matches concurrent geolocations or distinct IP regions, the threat engine logs an alert in `activity_logs` and flags `Account Sharing Suspicion` inside the Security Command Center dashboard.
* **IP Rate Limiting**: The FastAPI gateway enforces an active threshold of 100 API calls per minute per IP address, routing violators to standard `429 Too Many Requests` responses.
