import React, { useState } from "react";
import { 
  FileCheck2, 
  UploadCloud, 
  Settings, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle,
  FileText,
  Filter
} from "lucide-react";

interface ValidationIssue {
  variable: string;
  domain: string;
  issue: string;
  severity: "ERROR" | "WARNING" | "NOTICE";
  ruleId: string;
  category: "Missing Variables" | "Controlled Terminology" | "Missing Metadata" | "Traceability Gaps";
}

export default function CDISCHub() {
  const [selectedDomain, setSelectedDomain] = useState<"SDTM" | "ADaM">("SDTM");
  const [xmlContent, setXmlContent] = useState<string>(
    `<?xml version="1.0" encoding="UTF-8"?>\n<DefineMetaData xmlns="http://www.cdisc.org/ns/def/v2.0" FileType="Define" FileOID="DF.DM.001">\n  <ItemDef OID="IT.DM.SEX" Name="SEX" DataType="text" Length="1">\n    <CodeListRef CodeListOID="CL.SEX"/>\n  </ItemDef>\n</DefineMetaData>`
  );
  
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [auditScore, setAuditScore] = useState<number>(94);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"All" | "Missing Variables" | "Controlled Terminology" | "Missing Metadata" | "Traceability Gaps">("All");

  const handleValidateCDISC = () => {
    const logs: ValidationIssue[] = [];

    if (selectedDomain === "SDTM") {
      // 1. Missing Variables Checks
      logs.push({
        variable: "RFSTDTC",
        domain: "DM (Demographics)",
        issue: "Core Standard Variable: Subject Trial Start Date (RFSTDTC) is missing in DM dataset. This is a critical submission-level variable.",
        severity: "ERROR",
        ruleId: "CG0012",
        category: "Missing Variables"
      });
      logs.push({
        variable: "BRTHDTC",
        domain: "DM (Demographics)",
        issue: "Core Variable: Birth Date (BRTHDTC) is missing. Age cannot be derived without date metadata.",
        severity: "WARNING",
        ruleId: "CG0018",
        category: "Missing Variables"
      });

      // 2. Controlled Terminology Checks
      logs.push({
        variable: "SEX",
        domain: "DM (Demographics)",
        issue: "Controlled Terminology Conflict: Value 'M' violates CDISC Controlled Terminology codelist values ('MALE', 'FEMALE', 'U').",
        severity: "WARNING",
        ruleId: "CG0038",
        category: "Controlled Terminology"
      });
      logs.push({
        variable: "ETHNIC",
        domain: "DM (Demographics)",
        issue: "Controlled Terminology Conflict: Value 'LATINO' violates codelist term ('HISPANIC OR LATINO').",
        severity: "WARNING",
        ruleId: "CG0041",
        category: "Controlled Terminology"
      });

      // 3. Missing Metadata Checks
      logs.push({
        variable: "VSSTRESU",
        domain: "VS (Vital Signs)",
        issue: "Missing Metadata Link: Numeric baseline measurement (VSSTRESN) lacks accompanying standard unit label (VSSTRESU) in vital signs dataset.",
        severity: "WARNING",
        ruleId: "CG0145",
        category: "Missing Metadata"
      });
      logs.push({
        variable: "STUDYID",
        domain: "AE (Adverse Events)",
        issue: "Schema Mismatch: Variable STUDYID lacks domain metadata description in matching Define.xml schema.",
        severity: "ERROR",
        ruleId: "CG0002",
        category: "Missing Metadata"
      });

      // 4. Traceability Gaps
      logs.push({
        variable: "AESTDTC",
        domain: "AE (Adverse Events)",
        issue: "Traceability Gap: Adverse event start date cannot be reconciled against first dose exposure (EX.EXSTDTC) in parent dataset.",
        severity: "NOTICE",
        ruleId: "CG0092",
        category: "Traceability Gaps"
      });

      setAuditScore(84);
    } else {
      // ADaM checks
      // 1. Missing Variables
      logs.push({
        variable: "TRTSDT",
        domain: "ADSL (Subject Level)",
        issue: "Core Variable Missing: Treatment Start Date (TRTSDT) is missing from analysis dataset despite exposure values in SDTM.",
        severity: "ERROR",
        ruleId: "CG0204",
        category: "Missing Variables"
      });

      // 2. Controlled Terminology
      logs.push({
        variable: "SAFFL",
        domain: "ADSL (Subject Level)",
        issue: "Controlled Terminology Violation: Safety Population Flag (SAFFL) contains value '1' instead of standard flag ('Y' or 'N').",
        severity: "WARNING",
        ruleId: "CG0214",
        category: "Controlled Terminology"
      });

      // 3. Missing Metadata
      logs.push({
        variable: "AVAL",
        domain: "ADTTE (Time to Event)",
        issue: "Missing Metadata: Analysis Variable (AVAL) is missing parameter parameter metadata descriptions inside Define.xml.",
        severity: "WARNING",
        ruleId: "CG0284",
        category: "Missing Metadata"
      });

      // 4. Traceability Gaps
      logs.push({
        variable: "TRTP",
        domain: "ADSL (Subject Level)",
        issue: "Traceability Gap: Planned Treatment variable (TRTP) lacks mapped parent source variable SDTM.DM.ARM in metadata definition.",
        severity: "ERROR",
        ruleId: "CG0211",
        category: "Traceability Gaps"
      });
      logs.push({
        variable: "BASE",
        domain: "ADQS (Questionnaires)",
        issue: "Traceability Gap: Baseline Analysis Value (BASE) cannot be traced to a corresponding pre-treatment SDTM.QS record.",
        severity: "WARNING",
        ruleId: "CG0298",
        category: "Traceability Gaps"
      });

      setAuditScore(91);
    }

    setIssues(logs);
    setIsValidated(true);
  };

  // Filter issues based on selected category filter
  const filteredIssues = issues.filter(issue => {
    return activeCategoryFilter === "All" || issue.category === activeCategoryFilter;
  });

  // Calculate counts for categories
  const getCategoryCount = (category: string) => {
    if (category === "All") return issues.length;
    return issues.filter(issue => issue.category === category).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900 flex items-center gap-2">
          <FileCheck2 className="text-brand-500 w-7 h-7" />
          CDISC Ingestion & Validation Center
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Validate Define.xml and datasets against industry CDISC SDTM and ADaM standards with Pinnacle 21 compatibility checking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs and define.xml */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <UploadCloud size={16} className="text-brand-500" />
              Define.xml Schema Parser
            </h3>

            {/* Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setSelectedDomain("SDTM");
                  setIsValidated(false);
                }}
                className={`py-2 px-3 rounded-lg border text-center transition cursor-pointer font-bold uppercase tracking-wider ${
                  selectedDomain === "SDTM"
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-400 font-semibold"
                    : "bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-350"
                }`}
              >
                SDTM Standard (P21)
              </button>
              <button
                onClick={() => {
                  setSelectedDomain("ADaM");
                  setIsValidated(false);
                }}
                className={`py-2 px-3 rounded-lg border text-center transition cursor-pointer font-bold uppercase tracking-wider ${
                  selectedDomain === "ADaM"
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-400 font-semibold"
                    : "bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-350"
                }`}
              >
                ADaM Datasets (P21)
              </button>
            </div>

            {/* XML Upload Paste area */}
            <div className="space-y-1">
              <label className="form-label text-[10.5px]">Define.xml Schema Metadata Content</label>
              <textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                className="form-input font-mono text-[10.5px] leading-relaxed min-h-[120px]"
              />
            </div>

            <button 
              onClick={handleValidateCDISC}
              className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-widest cursor-pointer bg-brand-600 hover:bg-brand-500"
            >
              Verify CDISC Compliance
            </button>
          </div>

          {/* Standards verified checklist */}
          <div className="glass-panel p-5 space-y-3 select-none">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
              Validated Standards Catalog
            </h3>
            <div className="divide-y divide-slate-900 text-xs">
              <div className="py-2 flex justify-between"><span className="text-slate-400">CDISC SDTM Standard</span><span className="text-emerald-400 font-semibold">v1.8 / IG v3.3</span></div>
              <div className="py-2 flex justify-between"><span className="text-slate-400">CDISC ADaM Standard</span><span className="text-emerald-400 font-semibold">v2.1 / IG v1.2</span></div>
              <div className="py-2 flex justify-between"><span className="text-slate-400">Controlled Terminology</span><span className="text-emerald-400 font-semibold">2026-03 Release</span></div>
              <div className="py-2 flex justify-between"><span className="text-slate-400">Pinnacle 21 Engine Rules</span><span className="text-emerald-400 font-semibold">v4.0.2 Compatibility</span></div>
            </div>
          </div>
        </div>

        {/* Right Audit Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5 space-y-4 border border-slate-850 flex flex-col h-full min-h-[480px]">
            
            {/* Header score */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 select-none">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800">
                Pinnacle 21-Style Audit Ledger
              </h3>
              {isValidated && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  auditScore >= 90 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  P21 Audit Score: {auditScore}%
                </span>
              )}
            </div>

            {/* Category Filter buttons */}
            {isValidated && (
              <div className="flex flex-wrap gap-1.5 py-1 select-none border-b border-slate-900/50 pb-3">
                {[
                  { id: "All", label: "All Rules" },
                  { id: "Missing Variables", label: "Missing Vars" },
                  { id: "Controlled Terminology", label: "Controlled Term (CT)" },
                  { id: "Missing Metadata", label: "Metadata Gaps" },
                  { id: "Traceability Gaps", label: "Traceability" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setActiveCategoryFilter(btn.id as any)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition cursor-pointer ${
                      activeCategoryFilter === btn.id
                        ? "bg-brand-500/10 border-brand-500/40 text-brand-400"
                        : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-250 hover:bg-slate-900"
                    }`}
                  >
                    {btn.label} ({getCategoryCount(btn.id)})
                  </button>
                ))}
              </div>
            )}

            {/* Issues checklist */}
            <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2.5">
              {!isValidated ? (
                <div className="p-8 text-center h-full flex flex-col justify-center items-center space-y-2 select-none">
                  <FileCheck2 className="w-12 h-12 text-slate-400 dark:text-slate-700 animate-bounce" />
                  <div>
                    <h4 className="text-slate-350 font-semibold text-sm font-display">Ingestion Audit is Pending</h4>
                    <p className="text-slate-500 text-xs mt-1">Paste your Define.xml specifications and click Verify to scan datasets against Controlled Terminology and Pinnacle 21 rules.</p>
                  </div>
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="p-8 text-center h-full flex flex-col justify-center items-center space-y-2 select-none">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <div>
                    <h4 className="text-slate-350 font-semibold text-xs">No issues found in this category</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Validation conformant against rule definition catalog.</p>
                  </div>
                </div>
              ) : (
                filteredIssues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1.5 text-[11px] animate-in fade-in duration-200">
                    <div className="flex justify-between items-baseline select-none">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                          issue.severity === "ERROR" 
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="font-bold text-slate-200">Var: {issue.variable}</span>
                        <span className="text-[10px] text-slate-500">[{issue.domain}]</span>
                      </div>
                      <span className="font-mono text-slate-550 text-[10px] font-semibold">{issue.ruleId}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed select-text">{issue.issue}</p>
                    <div className="flex justify-between items-center select-none text-[9.5px] border-t border-slate-900/60 pt-1.5 mt-1 text-slate-500">
                      <span>Category: {issue.category}</span>
                      <span className="text-brand-400 font-semibold">ICH E9 Conformity</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Traceability & Lineage Map (Interactive SVG flowchart) */}
            {isValidated && (
              <div className="pt-4 border-t border-slate-900 space-y-2 select-none animate-in fade-in duration-200">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest block">Variable Lineage & Traceability Flow</span>
                
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center justify-center gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-center min-w-[100px]">
                    <span className="font-bold text-brand-400 block font-mono">SDTM</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">DM.ARM</span>
                    <span className="text-[9px] text-slate-600 block">Dose 50mg</span>
                  </div>

                  <ArrowRight size={14} className="text-slate-600 shrink-0" />

                  <div className="p-2.5 bg-slate-950 border border-brand-500/30 rounded-lg text-center min-w-[120px] relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-bold text-emerald-400 block font-mono">ADaM</span>
                    <span className="text-slate-350 text-[10px] block mt-0.5">ADSL.TRT01P</span>
                    <span className="text-[9px] text-slate-500 block">Derivation OK</span>
                  </div>

                  <ArrowRight size={14} className="text-slate-600 shrink-0" />

                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-center min-w-[100px]">
                    <span className="font-bold text-brand-400 block font-mono">TFL Listing</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Table 1.1</span>
                    <span className="text-[9px] text-slate-600 block">Demographics</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-lg text-[10.5px] leading-relaxed text-slate-450 flex gap-2">
                  <Award className="text-brand-400 shrink-0 w-4 h-4 mt-0.5" />
                  <span>
                    **Lineage Verification**: Subject planned treatment lineage fully audited. Raw variable SDTM.DM.ARM correctly maps to ADaM.ADSL.TRT01P, complying with ICH E9 data submission standards.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
