import React from "react";
import { 
  Settings, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Activity, 
  Calendar, 
  Terminal,
  FileCode,
  FileCheck2,
  Lock
} from "lucide-react";

export default function ReleaseManagement() {
  const versionDetails = {
    version: "1.2.0",
    buildNumber: "2026.06.01.01",
    releaseDate: "June 1, 2026",
    classification: "Enterprise Preview",
    deploymentStatus: "Production Candidate",
    validationStatus: "Pending Final Statistical Verification"
  };

  const systems = [
    { name: "Client-side Edge Math Runtime", type: "React Webpack/Vite", status: "STABLE", version: "v1.2" },
    { name: "Python Validated Math Service", type: "FastAPI / Uvicorn", status: "ACTIVE", version: "v1.2" },
    { name: "CFR Part 11 Audit Trail Hook", type: "PostgreSQL Append-Only", status: "SECURE", version: "v1.2" },
    { name: "Pinnacle 21 CDISC Auditor", type: "Define.xml Validator", status: "ACTIVE", version: "v1.0" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
          <Layers className="text-brand-500 w-7 h-7 animate-pulse" />
          Release Management Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review version markers, build states, validated mathematical classifications, and deployment status logs.
        </p>
      </div>

      {/* Version Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        
        {/* Core Release Details */}
        <div className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 pulse-bg w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-10"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Version & Build</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-2">
              v{versionDetails.version}
            </h3>
            <span className="text-[10.5px] font-mono text-brand-400 block mt-1.5">Build ID: {versionDetails.buildNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-4 border-t border-slate-900 pt-2.5">
            <Calendar size={13} className="text-slate-500" />
            <span>Released: {versionDetails.releaseDate}</span>
          </div>
        </div>

        {/* Deployment Status */}
        <div className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 pulse-bg w-32 h-32 bg-amber-500 rounded-full blur-[60px] opacity-10"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Deployment Status</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {versionDetails.deploymentStatus}
              </span>
            </div>
            <span className="text-[11px] text-slate-450 block mt-2.5">Classification: {versionDetails.classification}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-4 border-t border-slate-900 pt-2.5">
            <Lock size={13} className="text-slate-500" />
            <span>Access Guard: Active</span>
          </div>
        </div>

        {/* Validation Status */}
        <div className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 pulse-bg w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-10"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Validation Status</span>
            <div className="mt-2.5">
              <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 leading-relaxed block text-center">
                {versionDetails.validationStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-4 border-t border-slate-900 pt-2.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Double-Precision Audits: Passed</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: System status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-2">
              <Cpu size={16} className="text-brand-500" />
              Environment Modules Checklist
            </h3>

            <div className="divide-y divide-slate-900 text-xs">
              {systems.map((sys, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-250 block">{sys.name}</span>
                    <span className="text-[9.5px] text-slate-500">{sys.type}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold border ${
                    sys.status === "STABLE" || sys.status === "SECURE"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-2 select-none">
              <Terminal size={16} className="text-brand-500" />
              Build Specifications & Meta Logs
            </h3>

            <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl space-y-2 text-xs select-text font-mono">
              <div className="flex justify-between border-b border-slate-850 pb-1.5 font-bold text-slate-400 select-none">
                <span>Compilation Parameter</span>
                <span>System Manifest Value</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">React Client Platform:</span>
                <span className="text-slate-200">Vite v8.0.14 / React 18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validated Python Core:</span>
                <span className="text-slate-200">FastAPI v0.110 (Uvicorn 0.28)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Relational Database:</span>
                <span className="text-slate-200">PostgreSQL v16.2 Dialect</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-1.5 mt-1 text-[10.5px]">
                <span className="text-slate-400">Mathematical Tolerance:</span>
                <span className="text-emerald-450 font-bold">Absolute Bias &lt; 0.0001</span>
              </div>
            </div>

            <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-lg text-[10.5px] leading-relaxed text-slate-400 flex gap-2 select-none">
              <FileCheck2 className="text-brand-400 shrink-0 w-4 h-4 mt-0.5" />
              <span>
                **Designed to support Part 11-aligned workflows**: All system builds are audited through immutable cryptographic hash chains and registered under Dr. Bhupesh Dewan's corporate licenses.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
