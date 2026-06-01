import React, { useState } from "react";
import { 
  Sparkles, 
  FileText, 
  Download, 
  Copy, 
  Settings, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare, 
  Plus, 
  Check, 
  Users, 
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface CommentRecord {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export default function ProtocolAssistant({ 
  onLogAudit 
}: { 
  onLogAudit: (action: string, inputs: any, outputs: any) => void 
}) {
  const [activeTemplate, setActiveTemplate] = useState<string>("superiority");
  const [studyTitle, setStudyTitle] = useState("Evaluation of Active SGLT2 Inhibitor in Cardiovascular Outcomes");
  const [objective, setObjective] = useState("To evaluate the superiority of the active SGLT2 inhibitor in reducing cardiovascular mortality compared to placebo control.");
  const [primaryEndpoint, setPrimaryEndpoint] = useState("Time from randomization to occurrence of cardiovascular death (Months).");
  
  // Lifecycle & Collaboration states (Modification 8)
  const [reviewStatus, setReviewStatus] = useState<"Draft" | "In Review" | "Approved">("Draft");
  const [piSigned, setPiSigned] = useState<boolean>(false);
  const [sponsorSigned, setSponsorSigned] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentRecord[]>([
    { id: "1", author: "Dr. Bhupesh Dewan", role: "Owner / PI", text: "Please review the missing data imputation section. Ensure MICE is selected as the primary analysis rather than LOCF fallback.", timestamp: new Date(Date.now() - 3600000).toISOString() }
  ]);
  const [newComment, setNewComment] = useState("");

  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Template Loader
  const handleLoadTemplate = (templateKey: string) => {
    setActiveTemplate(templateKey);
    setIsGenerated(false);

    if (templateKey === "superiority") {
      setStudyTitle("Evaluation of Active SGLT2 Inhibitor in Cardiovascular Outcomes");
      setObjective("To evaluate the superiority of the active SGLT2 inhibitor in reducing cardiovascular mortality compared to placebo control.");
      setPrimaryEndpoint("Time from randomization to occurrence of cardiovascular death (Months).");
    } else if (templateKey === "noninferiority") {
      setStudyTitle("Non-Inferiority Bioequivalence Study of Generic BP Therapy");
      setObjective("To demonstrate that generic Beta-Blocker is non-inferior to brand-name therapeutic agents in SBP reduction.");
      setPrimaryEndpoint("Change in mean sitting systolic blood pressure (mmHg) from baseline to Week 12.");
    } else {
      setStudyTitle("Generic Bioequivalence Pharmacokinetic 2x2 Crossover Study");
      setObjective("To establish pharmacokinetic bioequivalence (AUC, Cmax) of Generic Formulation A vs Brand B.");
      setPrimaryEndpoint("Area under the plasma concentration-time curve (AUC 0-t) and maximum plasma concentration (Cmax).");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const log: CommentRecord = {
        id: Date.now().toString(),
        author: "Clinical Reviewer",
        role: "Biostatistician",
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      };
      setComments([...comments, log]);
      setNewComment("");
      onLogAudit("Contextual Comment Added to SAP Dossier", { comment: log.text }, {});
    }
  };

  // --- STATISTICAL PROGRAMMING SPECIFICATIONS SNIPPETS (Modification 9) ---
  const getProgrammingSpecs = () => {
    if (activeTemplate === "superiority" || activeTemplate === "crossover") {
      return {
        r: `library(survival)\n# Fit Cox Proportional Hazards Model\ncox_model <- coxph(Surv(time, status) ~ treatment + age + baseline_egfr, data = adtte)\nsummary(cox_model)`,
        sas: `PROC PHREG DATA=adtte;\n  MODEL time*status(0) = treatment age egfr / RL;\nRUN;`,
        python: `from lifelines import CoxPHFitter\ncph = CoxPHFitter()\ncph.fit(adtte, duration_col='time', event_col='status', formula='treatment + age + egfr')\ncph.print_summary()`
      };
    } else {
      return {
        r: `library(stats)\n# Welch Two Sample t-test against non-inferiority margin\nt.test(aval ~ treatment, data = adsl, alternative = "greater", mu = -2.0)`,
        sas: `PROC TTEST DATA=adsl H0=-2.0 SIDES=U;\n  CLASS treatment;\n  VAR aval;\nRUN;`,
        python: `from scipy import stats\n# Welch T-test\nt_stat, p_val = stats.ttest_ind(group_a, group_b, equal_var=False)`
      };
    }
  };

  const handleGenerateDossier = () => {
    setIsGenerated(true);
    onLogAudit("Clinical SAP Dossier Compiled", { title: studyTitle }, { reviewStatus: "Draft" });
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(studyTitle + "\n" + objective + "\n" + primaryEndpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = (format: "md" | "docx" | "pptx" | "sap-package") => {
    const specs = getProgrammingSpecs();
    const mdContent = `# Biostateer™ Regulatory Study Dossier: ${studyTitle}
*Review Status: ${reviewStatus}*
*Sign-offs: PI Approved: ${piSigned ? "YES" : "NO"} | Sponsor Approved: ${sponsorSigned ? "YES" : "NO"}*
*CDISC Alignment: SDTM v1.8 / ADaM v2.1*

## 1. Study Design Overview
- **Primary Objective**: ${objective}
- **Primary Endpoint**: ${primaryEndpoint}
- **Randomization Scheme**: Block Randomization (blocks of 4 and 6)

## 2. Visit Window & Protocol Deviations (Modification 9)
- **Target Visit Windows**: Baseline (Day 1), Visit 2 (Day 30 ± 3 Days), Visit 3 (Day 90 ± 7 Days), End of Study (Day 180 ± 14 Days).
- **Derived Variables**: Baseline value defined as last non-missing measurement before dose administration.
- **Protocol Deviations**: Missing primary endpoints, taking restricted concurrent medications, or visit intervals exceeding window tolerances will be classified as major protocol deviations and excluded from Per-Protocol analyses.

## 3. Programming Implementation Guidelines (Modification 9)
### R Package Code
\`\`\`r
${specs.r}
\`\`\`
### SAS Procedure Code
\`\`\`sas
${specs.sas}
\`\`\`
### Python Code
\`\`\`python
${specs.python}
\`\`\`

---
© 2026 Dr. Bhupesh Dewan (Owner of Biostateer™). All Rights Reserved.`;

    const blob = new Blob([mdContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `biostateer_study_dossier_${activeTemplate}.${format === "docx" ? "docx" : format === "pptx" ? "pptx" : "md"}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    onLogAudit(`Dossier Export Event Triggered`, { format, title: studyTitle }, { status: "SUCCESS" });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900 flex items-center gap-2">
          <FileText className="text-brand-500 w-7 h-7" />
          Protocol & SAP Assistant
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Draft FDA/ICH E9-compliant protocols, Statistical Analysis Plans (SAP), and programming specs with team collaboration commenting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <Settings size={16} className="text-brand-500" />
              Trial Templates Selector
            </h3>

            {/* Template select */}
            <div className="grid grid-cols-3 gap-2 text-[10.5px]">
              {[
                { key: "superiority", label: "Superiority" },
                { key: "noninferiority", label: "Non-Inferiority" },
                { key: "crossover", label: "Bioeq Crossover" }
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleLoadTemplate(t.key)}
                  className={`py-2 px-1 rounded-lg border transition text-center cursor-pointer font-semibold ${
                    activeTemplate === t.key
                      ? "bg-brand-500/10 border-brand-500/40 text-brand-400"
                      : "bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-350"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="form-label text-[10px]">Study Protocol Title</label>
              <input
                type="text"
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            {/* Objective */}
            <div className="space-y-1">
              <label className="form-label text-[10px]">Primary Objective</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="form-input text-xs min-h-[70px] resize-none"
              />
            </div>

            {/* Primary endpoint */}
            <div className="space-y-1">
              <label className="form-label text-[10px]">Primary Outcome Endpoint</label>
              <textarea
                value={primaryEndpoint}
                onChange={(e) => setPrimaryEndpoint(e.target.value)}
                className="form-input text-xs min-h-[50px] resize-none"
              />
            </div>

            <button 
              onClick={handleGenerateDossier}
              className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-widest cursor-pointer bg-brand-600 hover:bg-brand-500"
            >
              Compile SAP Dossier
            </button>
          </div>

          {/* Electronic sign-off ledger (Modification 8) */}
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Users size={16} className="text-brand-500" />
              Sign-off Approval Ledger
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-900/30 p-2.5 rounded-lg border border-slate-850">
                <div>
                  <span className="font-semibold text-slate-200 block">Principal Investigator</span>
                  <span className="text-[10px] text-slate-500 block">Dr. Bhupesh Dewan (Owner)</span>
                </div>
                <button
                  onClick={() => {
                    setPiSigned(!piSigned);
                    onLogAudit("PI Approval Status Switched", { status: !piSigned }, {});
                  }}
                  className={`px-3 py-1 rounded font-bold text-[10px] cursor-pointer transition ${
                    piSigned ? "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30" : "bg-slate-800 text-slate-450 hover:bg-slate-700"
                  }`}
                >
                  {piSigned ? "SIGNED" : "SIGN OFF"}
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-900/30 p-2.5 rounded-lg border border-slate-850">
                <div>
                  <span className="font-semibold text-slate-200 block">Sponsor Authority</span>
                  <span className="text-[10px] text-slate-500 block">Lead Clinical Director</span>
                </div>
                <button
                  onClick={() => {
                    setSponsorSigned(!sponsorSigned);
                    onLogAudit("Sponsor Approval Status Switched", { status: !sponsorSigned }, {});
                  }}
                  className={`px-3 py-1 rounded font-bold text-[10px] cursor-pointer transition ${
                    sponsorSigned ? "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30" : "bg-slate-800 text-slate-450 hover:bg-slate-700"
                  }`}
                >
                  {sponsorSigned ? "SIGNED" : "SIGN OFF"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Document output & Programming specifications */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Document panel */}
          <div className="glass-panel p-5 space-y-4 border border-slate-850 flex flex-col h-full min-h-[460px]">
            
            {/* Header toolbar */}
            <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs select-none">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-brand-500 animate-pulse" />
                <h3 className="font-semibold text-slate-200">
                  Clinical Protocol Dossier Draft
                </h3>
              </div>

              {isGenerated && (
                <div className="flex gap-2 select-none w-full md:w-auto">
                  {/* Status selector */}
                  <select
                    value={reviewStatus}
                    onChange={(e: any) => {
                      setReviewStatus(e.target.value);
                      onLogAudit("SAP Review Lifecycle Switched", { newStatus: e.target.value }, {});
                    }}
                    className="bg-slate-900 border border-slate-850 text-slate-350 rounded px-2.5 py-1 text-[10.5px] cursor-pointer"
                  >
                    <option value="Draft">Draft Mode</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved Status</option>
                  </select>

                  {/* Exports menu */}
                  <button 
                    onClick={() => handleDownloadReport("docx")}
                    className="btn-secondary px-3 py-1.5 text-[10.5px] flex items-center gap-1 cursor-pointer bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20"
                  >
                    <Download size={11} />
                    Export Word (DOCX)
                  </button>
                </div>
              )}
            </div>

            {/* Document body text */}
            <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-3 bg-slate-950/20 p-3.5 rounded-xl text-xs leading-relaxed text-slate-300">
              {!isGenerated ? (
                <div className="p-8 text-center h-full flex flex-col justify-center items-center space-y-2 select-none">
                  <FileText className="w-12 h-12 text-slate-400 dark:text-slate-700 animate-bounce" />
                  <div>
                    <h4 className="text-slate-350 font-semibold text-sm">Study Dossier is locked</h4>
                    <p className="text-slate-500 text-xs mt-1">Select your study endpoints, objective parameters, and block structures, and compile a validated clinical dossier.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 select-text">
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-400 font-bold block">1. STUDY PROTOCOL TITLE</span>
                    <p className="font-semibold text-slate-200">{studyTitle}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-400 font-bold block">2. CLINICAL OBJECTIVE</span>
                    <p>{objective}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-400 font-bold block">3. PRIMARY OUTCOME ENDPOINT & WINDWING (Modification 9)</span>
                    <p>{primaryEndpoint}</p>
                    <p className="text-slate-450 text-[11px] italic mt-1 bg-slate-900/50 p-2 rounded">
                      *Visit Windows*: Baseline (Day 1), Visit 2 (Day 30 ± 3 Days), Visit 3 (Day 90 ± 7 Days), Visit 4 (Day 180 ± 14 Days). Derived values calculated using baseline-observation-carried-forward (BOCF) as a worst-case scenario sensitivity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Programming specifications block (Modification 9) */}
            {isGenerated && (
              <div className="pt-4 border-t border-slate-900 space-y-2 select-none">
                <span className="text-[10.5px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <FileCode size={14} className="text-brand-500" />
                  Boilerplate Programming Specifications
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="font-bold text-slate-400 block mb-1">R Code</span>
                    <pre className="font-mono text-[9px] text-brand-350 truncate">{getProgrammingSpecs().r}</pre>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="font-bold text-slate-400 block mb-1">SAS Procedure</span>
                    <pre className="font-mono text-[9px] text-brand-350 truncate">{getProgrammingSpecs().sas}</pre>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="font-bold text-slate-400 block mb-1">Python Model</span>
                    <pre className="font-mono text-[9px] text-brand-350 truncate">{getProgrammingSpecs().python}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Contextual commenting and team chat (Modification 8) */}
            {isGenerated && (
              <div className="pt-4 border-t border-slate-900 space-y-3">
                <span className="text-[10.5px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <MessageSquare size={13} className="text-brand-500" />
                  Contextual Team Comments
                </span>

                <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                  {comments.map(c => (
                    <div key={c.id} className="p-2 bg-slate-900/40 border border-slate-850 rounded-lg text-[10.5px] text-slate-350">
                      <div className="flex justify-between items-baseline select-none">
                        <span className="font-bold text-slate-200">{c.author} <span className="text-slate-500 font-normal">({c.role})</span></span>
                        <span className="text-[9px] text-slate-500">{new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="mt-1 leading-normal text-slate-400 select-text">{c.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 select-none">
                  <input
                    type="text"
                    placeholder="Add scientific comment to this section..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="form-input text-xs flex-1"
                  />
                  <button 
                    onClick={handleAddComment}
                    className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
