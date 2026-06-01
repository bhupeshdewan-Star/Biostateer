# Biostateer™ Version 1.2 — Security Hardening Checklist

This document details the checklist and configurations implemented to secure the Biostateer™ environment inside enterprise clinical networks.

---

## 🔒 Security Hardening Standards Matrix

| Hardening Parameter | Status | Standard Implemented | Nginx / Configuration Directives |
| :--- | :--- | :--- | :--- |
| **HTTPS Only** | **ACTIVE** | Redirection of Port 80 to 443 | `return 301 https://$host$request_uri;` |
| **TLS 1.3 Encryption**| **ACTIVE** | Strict AEAD Ciphers | `ssl_protocols TLSv1.3;` |
| **CSP Headers** | **ACTIVE** | Script and domain limits | `add_header Content-Security-Policy "default-src 'self' ...";` |
| **HSTS Encryption** | **ACTIVE** | Preloaded Browser Lock | `add_header Strict-Transport-Security "max-age=63072000; ...";` |
| **X-Frame-Options** | **ACTIVE** | Clickjacking denial | `add_header X-Frame-Options "DENY" always;` |
| **Session Timeout** | **ACTIVE** | 3600s automatic invalidation| `SESSION_TIMEOUT=3600` (FastAPI environment configuration) |
| **MFA Support** | **READY** | SAML Hardware integration | Okta / Azure AD authentication configurations |

---

## 🛠️ Nginx Reverse Proxy Configuration Example

The following block illustrates an enterprise Nginx setup routing static compiled React client assets and proxying statistical API endpoints safely.

```nginx
# HTTPS Server Block (Port 443)
server {
    listen 443 ssl http2;
    server_name biostateer.institution.org;

    # SSL Certs and TLS 1.3 Configuration
    ssl_certificate /etc/ssl/certs/biostateer.crt;
    ssl_certificate_key /etc/ssl/private/biostateer.key;
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers off;

    # High-Performance Security Headers (Phase 6)
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:8000; frame-ancestors 'none';" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # React Frontend Static Compiled Assets
    location / {
        root /var/www/biostateer/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy to validated FastAPI python engine
    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP traffic to secure HTTPS block
server {
    listen 80;
    server_name biostateer.institution.org;
    return 301 https://$server_name$request_uri;
}
```

---

## ✍️ Audit Certification

This checklist and associated network configurations verify that Biostateer™ v1.2 satisfies institutional security standards.

**Lead Authorizing Official:**
**Dr. Bhupesh Dewan**
*Founder & Product Owner of Biostateer™*

*Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.*
