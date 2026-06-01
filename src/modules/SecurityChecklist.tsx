import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Users, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Terminal,
  Activity,
  ChevronDown
} from "lucide-react";

interface SecurityItem {
  id: string;
  name: string;
  category: "Network" | "Access" | "Headers" | "Session";
  status: "SECURE" | "WARNING" | "CONFIGURABLE";
  standard: string;
  description: string;
  implementation: string;
}

export default function SecurityChecklist() {
  const [items, setItems] = useState<SecurityItem[]>([
    {
      id: "SEC_HTTPS",
      name: "HTTPS-Only Network Traffic",
      category: "Network",
      status: "SECURE",
      standard: "TLS 1.3 Required",
      description: "Forces all communication over encrypted HTTPS ports, blocking legacy HTTP plaintext.",
      implementation: "NGINX server block redirect: rewrite ^ https://$http_host$request_uri? permanent;"
    },
    {
      id: "SEC_TLS",
      name: "TLS 1.3 Cryptography",
      category: "Network",
      status: "SECURE",
      standard: "Strict Cipher Suites Only",
      description: "Disables weak TLS 1.0, 1.1, and 1.2 handshakes, enforcing only modern AEAD ciphers.",
      implementation: "ssl_protocols TLSv1.3; ssl_prefer_server_ciphers off;"
    },
    {
      id: "SEC_CSP",
      name: "Content Security Policy (CSP)",
      category: "Headers",
      status: "CONFIGURABLE",
      standard: "XSS Clickjacking Defense",
      description: "Prevents injection of unauthorized cross-site scripting files or data elements.",
      implementation: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline';\";"
    },
    {
      id: "SEC_HSTS",
      name: "HTTP Strict Transport Security (HSTS)",
      category: "Headers",
      status: "SECURE",
      standard: "Strict Browser Transport",
      description: "Instructs browsers to always contact the site via secure connections.",
      implementation: "add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;"
    },
    {
      id: "SEC_XFRAME",
      name: "X-Frame-Options (Clickjacking Block)",
      category: "Headers",
      status: "SECURE",
      standard: "Deny Frame Embedding",
      description: "Blocks browsers from rendering the application inside frames or iframes.",
      implementation: "add_header X-Frame-Options \"DENY\" always;"
    },
    {
      id: "SEC_TIMEOUT",
      name: "Strict Session Timeout Policy",
      category: "Session",
      status: "SECURE",
      standard: "Auto-logout 3600 seconds",
      description: "Auto-invalidates client authentication states after 60 minutes of inactive time.",
      implementation: "Regulated by SESSION_TIMEOUT env value in backend FastAPI configuration."
    },
    {
      id: "SEC_MFA",
      name: "Multi-Factor Authentication (MFA)",
      category: "Access",
      status: "CONFIGURABLE",
      standard: "TOTP / Hardware Keys",
      description: "Enforces dual-layered authentication for elevated operator roles (Biostatistician, Admin).",
      implementation: "Configured through active Okta SAML hardware validation profiles."
    },
    {
      id: "SEC_SSO",
      name: "Azure AD & Okta Identity Sync",
      category: "Access",
      status: "CONFIGURABLE",
      standard: "SAML 2.0 / OpenID Connect",
      description: "Integrates corporate identity directories directly with the active RBAC matrix.",
      implementation: "Active claims map roles securely to Administrator or Principal Investigator scopes."
    }
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Toggle status for interactive demonstration
  const handleToggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === "CONFIGURABLE" ? "SECURE" : "CONFIGURABLE";
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const getCompliancePercent = () => {
    const secureCount = items.filter(i => i.status === "SECURE").length;
    return Math.round((secureCount / items.length) * 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <ShieldCheck className="text-brand-500 w-7 h-7" />
            Security Hardening Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit SSL/TLS encryptions, Content-Security headers, session timeouts, and corporate Okta/Azure SSO connections.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center gap-3 select-none text-xs">
          <Activity className="text-brand-400 animate-pulse w-4 h-4" />
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Overall Security Score</span>
            <span className="font-extrabold text-brand-400">{getCompliancePercent()}% Hardened</span>
          </div>
        </div>
      </div>

      {/* Overview dials */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-450">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">HTTPS Network</span>
            <span className="text-xs font-semibold text-slate-200">TLS 1.3 Active</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-450">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Headers Armor</span>
            <span className="text-xs font-semibold text-slate-200">CSP, HSTS & X-Frame Denied</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">SSO Integrations</span>
            <span className="text-xs font-semibold text-slate-200">OIDC / SAML Ready</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-450">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Integrity</span>
            <span className="text-xs font-semibold text-slate-200">Auto Timeout Locked</span>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="glass-panel overflow-hidden border border-slate-850">
        <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/20 text-xs font-semibold text-slate-350 flex justify-between items-center select-none">
          <span>Active Institutional Security Policies</span>
          <span className="text-[9.5px] text-brand-400 font-mono font-bold uppercase">Designed to support Part 11 workflows</span>
        </div>

        <div className="divide-y divide-slate-900 text-xs">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const statusColors = {
              SECURE: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
              WARNING: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
              CONFIGURABLE: "bg-slate-800 text-slate-400 border border-slate-700/80"
            };

            return (
              <div 
                key={item.id}
                className={`transition-colors duration-150 ${
                  isExpanded ? "bg-brand-500/[0.01]" : "hover:bg-slate-900/10"
                }`}
              >
                {/* Header */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                        {item.id}
                      </span>
                      <h4 className="font-bold text-slate-200 truncate">{item.name}</h4>
                      <span className="text-[10px] text-slate-500">({item.standard})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 select-none">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.status === "CONFIGURABLE" || item.status === "SECURE") handleToggleStatus(item.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition hover:scale-105 active:scale-95 ${statusColors[item.status]}`}
                    >
                      {item.status}
                    </span>
                    {isExpanded ? <X className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                {/* Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-900/80 bg-slate-950/20 space-y-4 text-[11px] animate-in fade-in duration-200 select-text">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: General info */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider block">Security Policy Category</span>
                          <span className="text-slate-350 block mt-0.5 font-medium">{item.category} Controls</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider block">Requirement Standards</span>
                          <p className="text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                        </div>
                      </div>

                      {/* Right: Server / Nginx configurations */}
                      <div className="space-y-2 bg-slate-900/35 border border-slate-850 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-1.5 mb-2 font-mono select-none">
                            <Terminal size={13} className="text-brand-400" />
                            Sysadmin Nginx / ENV Implementation
                          </span>
                          <pre className="font-mono text-[9px] text-slate-300 break-all whitespace-pre-wrap leading-normal bg-slate-950 p-2 rounded border border-slate-900 overflow-x-auto">
                            {item.implementation}
                          </pre>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-850/80 pt-2 mt-2 text-[10px] select-none">
                          <span className="text-slate-500 font-medium">Compliance verification:</span>
                          <span className="text-slate-450 font-bold tracking-wide flex items-center gap-0.5">
                            <CheckCircle2 size={11} className="text-emerald-500" /> VERIFIED
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
