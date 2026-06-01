import React, { useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, Terminal, AlertTriangle, RefreshCw, Key, Users, Laptop, Lock, ShieldClose } from "lucide-react";

interface ThreatItem {
  id: string;
  timestamp: string;
  type: string;
  details: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "BLOCKED" | "RESOLVED";
}

export default function SecurityCenter({
  currentUser
}: {
  currentUser?: any;
}) {
  const [threats, setThreats] = useState<ThreatItem[]>([
    {
      id: "th-001",
      timestamp: "2026-06-01T10:20:00Z",
      type: "Rapid OTP verification requests",
      details: "IP 194.22.45.109 triggered 6 quick verification check codes on mobile +91 9876543210 within 60s.",
      severity: "HIGH",
      status: "BLOCKED"
    },
    {
      id: "th-002",
      timestamp: "2026-06-01T08:15:00Z",
      type: "Credential Stuffing Pattern",
      details: "Brute-force sequence detected from IP 185.109.12.8, attempting login across 12 lookalike biostatistician emails.",
      severity: "CRITICAL",
      status: "ACTIVE"
    },
    {
      id: "th-003",
      timestamp: "2026-05-31T22:40:00Z",
      type: "Concurrent Multiple IPs",
      details: "Account eval@biostateer.com logged in from Paris and Marseille within a 10-minute window (potential credential sharing).",
      severity: "MEDIUM",
      status: "RESOLVED"
    },
    {
      id: "th-004",
      timestamp: "2026-05-31T18:10:00Z",
      type: "Automated Scraping Attempt",
      details: "Rate-limiting triggered on CDISC Validation API domain. IP 88.192.3.45 blocked after 100 quick document ingestion requests.",
      severity: "HIGH",
      status: "BLOCKED"
    }
  ]);

  const [threatCount, setThreatCount] = useState(2); // Mock active count

  const handleResolveThreat = (id: string) => {
    setThreats(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: "RESOLVED" as const };
      }
      return t;
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "text-red-500 bg-red-500/10 border border-red-500/20";
      case "HIGH": return "text-rose-400 bg-rose-500/10 border border-rose-500/20";
      case "MEDIUM": return "text-amber-500 bg-amber-500/10 border border-amber-500/20";
      default: return "text-slate-400 bg-slate-800 border border-slate-700";
    }
  };

  const isEvaluatorOrReviewer = currentUser?.role === "Evaluation User" || currentUser?.role === "Reviewer";

  if (isEvaluatorOrReviewer) {
    // Gated read-only view for evaluators/reviewers (Priority 8)
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
              <Shield className="text-brand-500 w-7 h-7" />
              Your Security & Session Telemetry Console
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Review your authenticated browser properties, active logins, OTP token records, and FDA GxP compliance metrics.
            </p>
          </div>
          
          <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
            CFR PART 11 SESSION ACTIVE
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs select-none">
          
          {/* Active Session Card */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Laptop size={14} className="text-brand-400" />
              Active Login Telemetry
            </h3>

            <div className="divide-y divide-slate-900 leading-relaxed">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Operator Identity</span>
                <span className="font-semibold text-slate-200">{currentUser?.fullname || "Clinical Investigator"}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Clinical Role</span>
                <span className="font-semibold text-brand-400">{currentUser?.role || "Evaluator"}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Device Category</span>
                <span className="font-semibold text-slate-300">Local Web Browser Console</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Allocated Session Limit</span>
                <span className="font-semibold text-slate-350">8 Hours Inactivity Force-Logout</span>
              </div>
            </div>
          </div>

          {/* Security Compliance Card */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-450" />
              Audit Integrity Gaskets
            </h3>

            <div className="divide-y divide-slate-900 leading-relaxed">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Brute-Force Shield</span>
                <span className="text-emerald-450 font-bold">ACTIVE (5 Attempts Lock)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Session Hijack Protector</span>
                <span className="text-emerald-450 font-bold">ACTIVE (IP Lockout)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Credentials Persistence</span>
                <span className="font-semibold text-slate-300">Encrypted Tokenized Session</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">FDA Attestation Hash</span>
                <span className="font-mono text-slate-450">SHA-256 Linked-chain</span>
              </div>
            </div>
          </div>

        </div>

        {/* OTP Log Checklist */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-3 select-none">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Terminal size={14} className="text-brand-400" />
            Your Verification OTP Access Logs
          </h3>

          <div className="overflow-x-auto text-[11px]">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 font-bold">
                  <th className="py-2">Timestamp</th>
                  <th className="py-2">Destination</th>
                  <th className="py-2">Method</th>
                  <th className="py-2 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 text-slate-300 font-mono">
                <tr>
                  <td className="py-2">{new Date().toLocaleDateString()} 12:00 PM</td>
                  <td className="py-2">{currentUser?.mobile || "+1 555 1234"}</td>
                  <td className="py-2 uppercase">Mobile SMS OTP</td>
                  <td className="py-2 text-right text-emerald-400 font-bold">✓ VERIFIED (123456)</td>
                </tr>
                {currentUser?.email && (
                  <tr>
                    <td className="py-2">{new Date().toLocaleDateString()} 11:58 AM</td>
                    <td className="py-2">{currentUser.email}</td>
                    <td className="py-2 uppercase">Email Token Gateway</td>
                    <td className="py-2 text-right text-emerald-400 font-bold">✓ VERIFIED (OTP LINK)</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // Admin Dashboard view
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Shield className="text-brand-500 w-7 h-7" />
            Security & Threat Intelligence Center
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time monitoring of failed logins, credential stuffing, suspicious concurrent geolocations, and automated crawler blocks.
          </p>
        </div>
      </div>

      {/* Dials row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-450">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Threats Detected</span>
            <span className="text-sm font-extrabold text-slate-200">{threatCount} Suspicious Events</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-450 animate-pulse">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Rate-Limiting Events</span>
            <span className="text-sm font-extrabold text-slate-200">14 Blocks Today</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-450">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Integrity Checks</span>
            <span className="text-sm font-extrabold text-slate-200">100% Secure Handshakes</span>
          </div>
        </div>
      </div>

      {/* Threat List (Priority 8) */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 select-none flex items-center gap-1.5 border-b border-slate-850 pb-2">
          <Terminal size={14} className="text-brand-400" />
          Active Cryptographic Intrusion Audit Log
        </h3>

        <div className="divide-y divide-slate-900 space-y-4 pt-2">
          {threats.map((t) => {
            const isResolved = t.status === "RESOLVED";

            return (
              <div 
                key={t.id} 
                className={`pt-4 flex flex-col md:flex-row justify-between items-start gap-4 transition-opacity duration-200 ${
                  isResolved ? "opacity-60" : ""
                }`}
              >
                <div className="space-y-1.5 text-xs select-text">
                  <div className="flex items-center gap-2 select-none">
                    <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-slate-950 border border-slate-850 text-slate-400">
                      {t.id}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase ${getSeverityColor(t.severity)}`}>
                      {t.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(t.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <h4 className="font-extrabold text-slate-200 text-xs">{t.type}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-2xl">{t.details}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2 select-none text-[10px] font-bold font-mono">
                  {isResolved ? (
                    <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-550 border border-slate-850">
                      ✓ RESOLVED & LOGGED
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleResolveThreat(t.id)}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-850 text-brand-400 hover:bg-slate-900 transition active:scale-95 cursor-pointer"
                      >
                        RESOLVE INCIDENT
                      </button>
                      <button
                        onClick={() => {
                          handleResolveThreat(t.id);
                          setThreatCount(prev => Math.max(0, prev - 1));
                        }}
                        className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-450 border border-rose-500/25 hover:bg-rose-500/15 transition active:scale-95 cursor-pointer"
                      >
                        BLOCK IP ADDRESS
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-850 pt-4 text-center select-text text-[9.5px] text-slate-500 select-none">
        <p className="font-semibold text-slate-450">
          Biostateer™ Version 1.3.2 | Founder & Product Owner: Dr. Bhupesh Dewan
        </p>
      </div>

    </div>
  );
}
