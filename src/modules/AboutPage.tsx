import React from "react";
import { ShieldCheck, Award, Lock, BookOpen, AlertTriangle, Cpu, Globe, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100">
          About Biostateer™
        </h1>
        <p className="text-[10px] text-brand-400 font-semibold font-mono mt-1 select-text">
          Biostateer™ Enterprise Clinical Research Intelligence Platform | Version 1.3.1 | Build: 2026.06.01 | Validation Registry Version: 1.0
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Review the biostatistical foundations, validation philosophy, relational tech stack, and international regulatory alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Information) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mission & Vision */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-400 border-b border-slate-850 pb-2 flex items-center gap-2">
              <Award size={16} className="text-brand-400" />
              Corporate Mission & Vision
            </h2>
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed select-text">
              <p>
                <strong>Mission:</strong> To empower pharmaceutical companies, CROs, academic medical centers, and biostatisticians with a seamless, highly secure, and mathematically validated intelligence platform that accelerates trial planning, CDISC data audits, and regulatory-candidate statistical reports.
              </p>
              <p>
                <strong>Vision:</strong> To establish the global gold standard for clinical trials decision support, uniting cutting-edge React edge layouts with validated Python/R mathematical execution nodes while ensuring absolute CFR Part 11 auditing compliance.
              </p>
            </div>
          </div>

          {/* Validation Philosophy (P10 Requirements) */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-450 border-b border-slate-850 pb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Double-Precision Validation Philosophy
            </h2>
            <div className="space-y-3 text-xs text-slate-350 leading-relaxed select-text">
              <p>
                Clinical biostatistics demands absolute numerical precision. At Biostateer™, every mathematical equation—ranging from basic Welch independent T-tests to stratified Cox proportional hazard limits and Fine-Gray Competing Risks—is subjected to a strict double-precision validation framework.
              </p>
              <p>
                Our algorithms are cross-validated against reference implementations in <strong>R (v4.5)</strong>, <strong>SAS (v9.4)</strong>, and <strong>SPSS (v29)</strong>. Calculations must achieve identical mathematical tolerance thresholds with an absolute bias limit of <strong>±0.0001</strong> (typically matching down to $10^{-15}$ precision bounds) before they are certified inside the statistical registry.
              </p>
            </div>
          </div>

          {/* Platform Architecture & Tech Stack (P10 Requirements) */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-450 border-b border-slate-850 pb-2 flex items-center gap-2">
              <Cpu size={16} className="text-brand-400" />
              Hybrid Edge Tech Stack & Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-350 select-text">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="font-bold text-slate-200 block border-b border-slate-900 pb-1 uppercase tracking-widest text-[9.5px]">Vite-React Edge Client</span>
                <p>Designed using React 18, TypeScript, TailwindCSS variables, and Lucide icons. Operates local-first, caching data in-memory or securely routing queries without caching sensitive details to browser disks.</p>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="font-bold text-slate-200 block border-b border-slate-900 pb-1 uppercase tracking-widest text-[9.5px]">FastAPI Validated Core</span>
                <p>Built with Python 3.11+, FastAPI, NumPy, SciPy (v1.12), StatsModels, Lifelines, and Pingouin (v0.5). Executes high-precision matrix math routed through containerized cloud clusters.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (IP, Details & Regulatory Alignments) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Founder Credentials & Intellectual Property */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 border-b border-slate-850 pb-1.5 flex items-center gap-1.5 select-none">
              <Lock size={13} className="text-brand-400" />
              IP & Founder Credentials
            </h3>
            
            <div className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                BD
              </div>
              <div>
                <h4 className="font-extrabold text-slate-200 text-xs">Dr. Bhupesh Dewan</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Founder & Product Owner</p>
                <p className="text-[10px] text-slate-500">Mumbai, India</p>
              </div>
            </div>

            <div className="text-[10.5px] text-slate-400 leading-normal space-y-2 pt-2 border-t border-slate-850 select-text">
              <p><strong>Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.</strong></p>
              <p>Biostateer™ is proprietary clinical research software. Unauthorized copying, reverse engineering, redistribution, or commercial reuse is strictly prohibited under international copyright frameworks.</p>
            </div>
          </div>

          {/* Regulatory Alignments Checklist (P10 Requirements) */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 select-none">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 border-b border-slate-850 pb-1.5 flex items-center gap-1.5">
              <Globe size={13} className="text-brand-400" />
              Regulatory Compliance Alignment
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-350">
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> ICH E6(R3)
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> ICH E9 (Stats)
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> FDA Title 21
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> EMA Guideline
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> CONSORT Statement
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> SPIRIT Checklist
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> STROBE Rules
              </span>
              <span className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1.5 rounded-lg">
                <CheckCircle2 size={11} className="text-emerald-500" /> PRISMA Rules
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
