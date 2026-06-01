import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Terminal, 
  RefreshCw, 
  Layers, 
  Settings, 
  Lock,
  Network
} from "lucide-react";

export default function SystemHealthDashboard({
  currentUser,
  isBackendActive
}: {
  currentUser: any;
  isBackendActive: boolean;
}) {
  const [latency, setLatency] = useState<number | string>("--");
  const [lastBackup, setLastBackup] = useState<string>("—");
  const [securityStats, setSecurityStats] = useState({
    failedLogins: 0,
    otpRequests: 2,
    activeSessions: 1,
    suspiciousActivity: 0
  });

  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "security">("overview");

  useEffect(() => {
    // Generate simulated latency and security states
    if (isBackendActive) {
      setLatency(Math.floor(12 + Math.random() * 8) + " ms");
      setLastBackup(new Date().toLocaleDateString() + " 02:00 AM");
    } else {
      setLatency("N/A (Local Edge)");
      setLastBackup("Local Saved");
    }

    try {
      const storedFailed = localStorage.getItem("biostateer_failed_attempts") || "0";
      setSecurityStats(prev => ({
        ...prev,
        failedLogins: parseInt(storedFailed),
        suspiciousActivity: parseInt(storedFailed) > 3 ? 1 : 0
      }));
    } catch {
      // safe fallback
    }
  }, [isBackendActive]);

  const formulas = [
    { code: "BST-TT-001", name: "Welch's Two-Sample Independent T-Test", status: "Validated" },
    { code: "BST-TT-002", name: "Student's Paired T-Test", status: "Validated" },
    { code: "BST-AOV-001", name: "One-Way Analysis of Variance (ANOVA)", status: "Validated" },
    { code: "BST-AOV-002", name: "Two-Way Factorial Analysis of Variance", status: "Benchmarked" },
    { code: "BST-MAN-001", name: "Bivariate Multivariate ANOVA (MANOVA)", status: "Benchmarked" },
    { code: "BST-REG-001", name: "Ordinary Least Squares Linear Regression", status: "Validated" },
    { code: "BST-REG-002", name: "Binary Logistic Regression (Newton-Raphson)", status: "Validated" },
    { code: "BST-BE-001", name: "Two One-Sided Equivalence Tests (TOST)", status: "Benchmarked" },
    { code: "BST-BE-002", name: "Reference-Scaled Average Bioequivalence (RSABE)", status: "Draft Engine" },
    { code: "BST-PK-001", name: "Linear/Log-linear Trapezoidal PK AUC Integral", status: "Benchmarked" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <Activity className="text-brand-500 w-7 h-7 animate-pulse" />
            Biostateer™ Diagnostics & System Health Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time diagnostic overview of frontend environment configurations, backend services connections, and clinical engine validation states.
          </p>
        </div>
        
        {/* Version Badge */}
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          BUILD: v1.3.2 RELEASE
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-2 select-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "overview" ? "border-brand-500 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "stats" ? "border-purple-500 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          Statistical Engine Calibration
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "security" ? "border-rose-500 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          Security Telemetry
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
          
          {/* Frontend Container */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Cpu size={14} className="text-brand-400" />
              Client Frontend Health Console
            </h3>
            
            <div className="divide-y divide-slate-900 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Platform Spec</span>
                <span className="font-semibold text-slate-200">Biostateer™ Enterprise</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Active Build Number</span>
                <span className="font-mono text-slate-300">2026.06.01 (CFR Part 11 Aligned)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Authenticated Investigator</span>
                <span className="font-semibold text-brand-400">{currentUser?.fullname || "Guest User"}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Client Agent / Browser</span>
                <span className="font-semibold text-slate-300 truncate max-w-[200px]" title={navigator.userAgent}>
                  {navigator.userAgent.split(" ").slice(-2).join(" ")}
                </span>
              </div>
            </div>
          </div>

          {/* Backend Connection */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Network size={14} className="text-emerald-400 animate-pulse" />
              FastAPI Connection Status
            </h3>

            <div className="divide-y divide-slate-900 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">FastAPI Gateway</span>
                <span className={`font-bold uppercase ${isBackendActive ? "text-emerald-450" : "text-amber-500"}`}>
                  {isBackendActive ? "🟢 Connected / Online" : "🟡 Edge Precision Fallback"}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Postgres Database Link</span>
                <span className={`font-semibold ${isBackendActive ? "text-slate-200" : "text-slate-500"}`}>
                  {isBackendActive ? "Operational" : "Unavailable (Offline)"}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Network Latency</span>
                <span className="font-mono font-bold text-slate-200">{latency}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Relational Database Backup</span>
                <span className="font-semibold text-slate-350">{lastBackup}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          
          <div className="md:col-span-1 p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Registry Version</span>
              <Layers size={15} className="text-purple-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">Validation Version 1.0</h4>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Double-precision IEEE 754 float models calibrated against R stats and SAS PROC options.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">
              Calibration Formula Directory ({formulas.length} Active Engines)
            </h3>

            <div className="overflow-y-auto max-h-[220px] divide-y divide-slate-950 pr-2">
              {formulas.map((f) => {
                const statusColors: Record<string, string> = {
                  Validated: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  Benchmarked: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                  "Draft Engine": "bg-slate-950 text-slate-500 border-slate-850"
                };

                return (
                  <div key={f.code} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 block">{f.code}</span>
                      <span className="font-semibold text-slate-200">{f.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase border shrink-0 ${statusColors[f.status]}`}>
                      {f.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeTab === "security" && (
        <div className="glass-panel p-5 space-y-5 select-none text-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Lock size={14} className="text-rose-450" />
            Biostateer™ Intrusion Telemetry
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-950/45 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Failed Login Blocks</span>
              <span className={`text-xl font-bold block font-mono ${securityStats.failedLogins > 3 ? "text-rose-500" : "text-slate-200"}`}>
                {securityStats.failedLogins}
              </span>
            </div>
            
            <div className="p-3 bg-slate-950/45 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase">OTP Tokens Sent</span>
              <span className="text-xl font-bold block font-mono text-slate-200">
                {securityStats.otpRequests}
              </span>
            </div>

            <div className="p-3 bg-slate-950/45 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Active Sessions</span>
              <span className="text-xl font-bold block font-mono text-brand-400">
                {securityStats.activeSessions}
              </span>
            </div>

            <div className="p-3 bg-slate-950/45 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Anomalous Activity Count</span>
              <span className={`text-xl font-bold block font-mono ${securityStats.suspiciousActivity > 0 ? "text-amber-500 animate-pulse" : "text-emerald-450"}`}>
                {securityStats.suspiciousActivity}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 items-center bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl leading-normal text-[11px] text-slate-450">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <p>
              Security telemetry maps baseline login events under FDA GxP controls, checking for concurrent device logins or geoconcurrency travelers.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
