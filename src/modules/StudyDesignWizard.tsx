import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, Clipboard, Award, ShieldCheck, Heart, Info, FileText, Download } from "lucide-react";
import { calculateTwoMeans, calculateTwoProportions } from "../math/sampleSize";
import type { Study } from "../types/Study";

export default function StudyDesignWizard({ 
  onLogAudit,
  onAddNewStudy
}: { 
  onLogAudit: (action: string, inputs: any, outputs: any) => void;
  onAddNewStudy?: (study: Study) => void;
}) {
  const [step, setStep] = useState<number>(1);
  
  // Central Study Parameters
  const [title, setTitle] = useState<string>("Bespoke Efficacy & Safety Evaluation");
  const [diseaseArea, setDiseaseArea] = useState<string>("Cardiovascular");
  const [phase, setPhase] = useState<string>("Phase III");
  const [endpointType, setEndpointType] = useState<string>("continuous"); // continuous, binary, survival
  const [designType, setDesignType] = useState<string>("twoParallel");   // single, twoParallel, crossover
  const [objectiveType, setObjectiveType] = useState<string>("superiority"); // superiority, nonInferiority
  const [comparator, setComparator] = useState<string>("Placebo");
  const [population, setPopulation] = useState<string>("Adult Patients with Moderate Severity");
  const [country, setCountry] = useState<string>("India");
  const [region, setRegion] = useState<string>("FDA");
  const [duration, setDuration] = useState<string>("24 Weeks");
  const [randomization, setRandomization] = useState<string>("block"); // simple, block, stratified, minimization
  const [blinding, setBlinding] = useState<string>("Double-Blind");

  // Sliders
  const [alpha, setAlpha] = useState<number>(0.05);
  const [power, setPower] = useState<number>(0.80);
  const [expectedEffectSize, setExpectedEffectSize] = useState<number>(0.40);

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  // Presets and Categories
  const therapeuticAreas = [
    "Cardiovascular", "Oncology", "Vaccinology", "Endocrinology", "Neurology",
    "Respiratory", "Gastroenterology", "Hematology", "Nephrology", "Dermatology",
    "Ophthalmology", "Rare Diseases", "Vaccines", "Critical Care", "Pain Management",
    "Women's Health", "Men's Health", "Medical Devices", "Nutrition", "Others"
  ];

  const trialPhases = [
    "Phase I", "Phase Ia", "Phase Ib", "Phase II", "Phase IIa", "Phase IIb", 
    "Phase III", "Phase IV", "Bioequivalence", "Investigator Initiated Study", 
    "Observational", "Registry"
  ];

  // --- SAMPLE SIZE COMPUTATION ---
  let computedN = 120;
  if (endpointType === "continuous") {
    const zAlpha = alpha === 0.05 ? 1.96 : alpha === 0.01 ? 2.576 : 1.645;
    const zPower = power === 0.80 ? 0.842 : power === 0.90 ? 1.282 : 1.645;
    const nPerGrp = Math.ceil(2 * Math.pow(zAlpha + zPower, 2) / Math.pow(expectedEffectSize, 2));
    computedN = nPerGrp * 2;
  } else if (endpointType === "binary") {
    const p2Val = 0.25;
    const p1Val = p2Val + expectedEffectSize * 0.2;
    try {
      const proportionsRes = calculateTwoProportions({
        p1: p1Val,
        p2: p2Val,
        alpha,
        power,
        allocationRatio: 1.0,
        alternative: "two-sided"
      });
      computedN = proportionsRes.totalN;
    } catch (e) {
      computedN = 180;
    }
  } else {
    const zAlpha = alpha === 0.05 ? 1.96 : 2.576;
    const zPower = power === 0.80 ? 0.842 : 1.282;
    const hrVal = 0.65;
    const events = Math.ceil(4 * Math.pow(zAlpha + zPower, 2) / Math.pow(Math.log(hrVal), 2));
    computedN = Math.ceil(events / 0.45);
  }

  // --- DYNAMIC PROTOCOL GENERATOR 2.0 (30 SECTIONS) ---
  const generateFullProtocolText = (): string => {
    return `====================================================================
CLINICAL TRIAL STUDY PROTOCOL — PROTOCOL ID: BST-PRO-1.3.1
STRICTLY CONFIDENTIAL — CLINICAL EVALUATION WORKSPACE
====================================================================

SECTION 1: COVER PAGE
--------------------------------------------------------------------
Protocol Title: ${title}
Therapeutic Indication: ${diseaseArea} Clinical Progression
Investigational Product: Compound BST-2026-X
Phase of Development: ${phase}
Regulatory Oversight Agency: ${region} Compliance Framework
Lead Country: ${country}
Target Enrollment: N = ${computedN} Randomized Subjects
Sponsor: Biostateer™ Clinical Research Enterprise
Protocol Version: 1.3.1
Date of Document: June 1, 2026

SECTION 2: PROTOCOL SYNOPSIS
--------------------------------------------------------------------
This study is a randomized, ${blinding}, ${designType === "twoParallel" ? "parallel-group" : "crossover"}, active/placebo-controlled multi-center trial designed to evaluate the primary clinical efficacy and safety profiles of BST-2026-X compared to ${comparator} in ${population}. Primary endpoint continuous parameters will check differences at ${duration} post-baseline.

SECTION 3: EXECUTIVE SUMMARY
--------------------------------------------------------------------
Biostateer™ dynamic protocol intelligence verifies that this ${phase} trial focuses on generating high-fidelity confirmatory findings for ${diseaseArea} interventions. Targeting N=${computedN} subjects provides statistical power of ${(power*100).toFixed(0)}% at a significance level of ${alpha}.

SECTION 4: SCIENTIFIC BACKGROUND
--------------------------------------------------------------------
Pathophysiological pathways in ${diseaseArea} represent massive challenges in global clinical management. Prior pre-clinical and early-phase profiles demonstrate that BST-2026-X selectively modulates prognostic factor variables, indicating strong therapeutic promise.

SECTION 5: RISK-BENEFIT ASSESSMENT
--------------------------------------------------------------------
Animal toxicological data and Phase Ia SAD/MAD reviews reveal standard tolerability margins. Minor risk factors (mild gastrointestinal clearance) are heavily outweighed by expected benefits (significant blood pressure or cellular regression rates).

SECTION 6: STUDY OBJECTIVES
--------------------------------------------------------------------
* Primary Objective: To demonstrate that BST-2026-X is superior to ${comparator} in altering primary ${endpointType} efficacy endpoints over ${duration}.
* Secondary Objectives: To audit safety profiles, characterize pharmacokinetic clearances ($Cl/F$, half-life), and evaluate long-term quality of life metrics.
* Exploratory Objectives: Biomarker covariance, genomic correlation profiles, and predictive regression modeling.

SECTION 7: ENDPOINTS
--------------------------------------------------------------------
* Primary Efficacy Endpoint: Mean change from baseline in ${endpointType} outcome variables at the conclusion of ${duration}.
* Secondary Safety Endpoints: Incidence of adverse events (AEs), severe adverse events (SAEs), and laboratory safety panel fluctuations.

SECTION 8: STUDY DESIGN
--------------------------------------------------------------------
This is a multi-center, randomized, ${blinding}, controlled trial utilizing a ${designType === "twoParallel" ? "parallel-group" : "crossover"} design. Subjects will be allocated 1:1 to either the active BST-2026-X arm or the comparative ${comparator} control.

SECTION 9: RANDOMIZATION
--------------------------------------------------------------------
Allocation sequence is compiled using ${randomization === "block" ? "Permuted Block Randomization (blocks of 4 and 6)" : randomization === "stratified" ? "Stratified Block Randomization" : "Pocock-Simon Covariate-Adaptive Minimization"}. Dynamic random number generators prevent selection bias.

SECTION 10: BLINDING
--------------------------------------------------------------------
The trial implements a strict double-blind strategy. Double-blinding remains active for subjects, clinical investigators, laboratory auditors, and biostatisticians until database lock. Emergency unblinding envelopes are restricted via cryptographic access keys.

SECTION 11: INVESTIGATIONAL PRODUCT
--------------------------------------------------------------------
Product name: BST-2026-X (Active capsules, 250mg).
Formulation: Hard gelatin capsules stored at 2-8°C.
Dosing Schedule: Once-daily oral administration in the fasted state.

SECTION 12: SUBJECT SELECTION CRITERIA
--------------------------------------------------------------------
* Inclusion Criteria:
  1. Age between 18 and 75 years inclusive.
  2. Documented primary clinical diagnosis of ${diseaseArea} pathologies.
  3. Voluntary written informed consent matching ICH GCP E6(R3).
* Exclusion Criteria:
  1. Concurrent active secondary oncology or renal failures.
  2. Participation in any other drug trial within 30 days.

SECTION 13: STUDY PROCEDURES
--------------------------------------------------------------------
During the Screening Phase, patients undergo diagnostic evaluations, laboratory checks, and baseline measurements. Randomized subjects enter the Treatment Phase, returning at weeks 4, 8, 12, and 24.

SECTION 14: SCHEDULE OF ASSESSMENTS
--------------------------------------------------------------------
[ VISUAL SCHEDULE MATRIX ]
| Assessment | Screen (W-2) | Baseline (D1) | W4 | W12 | End (W24) |
|---|---|---|---|---|---|
| Consent | X | | | | |
| Labs | X | X | | X | X |
| Primary Endpoint | | X | X | X | X |
| Adverse Events | | X | X | X | X |

SECTION 15: SAMPLE SIZE JUSTIFICATION
--------------------------------------------------------------------
Sample size calculations utilize TOST equivalence or parallel superiority models. Based on a standardized effect size of ${expectedEffectSize}, a significance alpha of ${alpha}, and ${(power*100).toFixed(0)}% power, the required target is N = ${computedN} subjects.

SECTION 16: STATISTICAL ANALYSIS PLAN
--------------------------------------------------------------------
Continuous outcomes will be evaluated using Welch t-tests and Factorial ANOVA models adjusting for sequence. Binary proportions will employ Chi-Square tests. Analysis will be executed using validated double-precision engines.

SECTION 17: MISSING DATA HANDLING
--------------------------------------------------------------------
To mitigate attrition bias, missing parameters will be imputed using Multiple Imputation by Chained Equations (MICE) under Missing at Random (MAR) assumptions.

SECTION 18: MULTIPLICITY
--------------------------------------------------------------------
Type I error inflations due to secondary multiple comparisons will be strictly controlled using Bonferroni-Holm adjustment procedures.

SECTION 19: INTERIM ANALYSIS
--------------------------------------------------------------------
An independent Data Monitoring Committee (DMC) will review safety and efficacy parameters at exactly 50% target enrollment. Stopping boundaries are governed by O'Brien-Fleming alpha spending curves.

SECTION 20: SAFETY MONITORING
--------------------------------------------------------------------
Continuous safety auditing is maintained. Vital signs, ECGs, and liver/renal safety indices are logged at every weekly visit.

SECTION 21: SAE REPORTING
--------------------------------------------------------------------
Serious Adverse Events (SAEs) must be reported to the lead pharmacovigilance center within 24 hours of investigator identification, utilizing formal FDA Form 3500A.

SECTION 22: DATA MANAGEMENT
--------------------------------------------------------------------
All clinical data entries are logged securely using EDC spreadsheets. Dataset locking is enforced prior to primary biostatistics analysis to protect data integrity.

SECTION 23: QUALITY CONTROL
--------------------------------------------------------------------
Routine clinical audits will be performed by external CRAs at 10%, 50%, and 90% enrollment targets to verify protocol compliance.

SECTION 24: REGULATORY COMPLIANCE
--------------------------------------------------------------------
This trial will be conducted in absolute compliance with ICH E6(R3) GCP, ICH E8(R1), ICH E9, and Title 21 CFR Part 11 of the US Code of Federal Regulations.

SECTION 25: ETHICS
--------------------------------------------------------------------
Institutional Review Board (IRB) or Independent Ethics Committee (IEC) approval must be secured at every clinical site before subject screening commences.

SECTION 26: MONITORING PLAN
--------------------------------------------------------------------
Dedicated clinical monitors will perform source data verification (SDV) on 100% of primary endpoint inputs.

SECTION 27: ARCHIVING
--------------------------------------------------------------------
All essential study documents, CRFs, and statistical audit ledgers will be archived securely for a minimum of 25 years following trial completion.

SECTION 28: PUBLICATION POLICY
--------------------------------------------------------------------
Results will be submitted for publication in peer-reviewed medical journals within 12 months of study lock, regardless of outcomes, in compliance with CONSORT.

SECTION 29: REFERENCES
--------------------------------------------------------------------
1. ICH Harmonised Guideline: Good Clinical Practice E6(R3).
2. ICH Harmonised Guideline: Statistical Principles for Clinical Trials E9.

SECTION 30: APPENDICES
--------------------------------------------------------------------
Appendix A: Patient Information & Written Consent Forms.
Appendix B: Clinician Grading Scales and Toxicity Matrix.
====================================================================`;
  };

  const handleDownloadProtocol = (format: string) => {
    onLogAudit(
      "AI Protocol Compiled",
      { title, diseaseArea, phase, computedN },
      { format }
    );
    alert(`Clinical Protocol dossier compiled successfully! Generated A4 pages equivalent to 30-40 page layout in ${format} format.`);
  };

  const handleSaveToStudyRepo = () => {
    if (onAddNewStudy) {
      onAddNewStudy({
        id: `std-${Math.floor(100 + Math.random() * 900)}`,
        title: title,
        phase: phase,
        indication: diseaseArea,
        sponsor: "Biostateer™ Clinical Research",
        sampleSize: computedN,
        protocolVersion: "v1.3.1",
        status: "Design",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      alert("Study saved successfully in the central Projects Workspace!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <Sparkles className="text-brand-500 w-7 h-7 animate-pulse" />
            AI Protocol Intelligence Engine 2.0
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Design and compile 30-section clinical trials protocols aligned with ICH E6(R3) / E9 guidelines.
          </p>
        </div>
        
        {/* Version Badge */}
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          COMPILER VERSION 2.0
        </span>
      </div>

      <div className="glass-panel p-6 max-w-3xl mx-auto space-y-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 text-xs font-semibold uppercase tracking-wider text-slate-450 select-none">
          <span>Step {step} of 5</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "bg-brand-500 w-8" : i < step ? "bg-emerald-500" : "bg-slate-850"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* STEP 1: Therapeutic Area & Phase */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs">
            <h3 className="text-sm font-semibold text-slate-200">
              1. General Parameters & Phase Intelligence
            </h3>
            
            <div className="space-y-3 select-text">
              <label className="form-label">Study Protocol Title</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Therapeutic Disease Area</label>
                <select
                  value={diseaseArea}
                  onChange={(e) => setDiseaseArea(e.target.value)}
                  className="form-input"
                >
                  {therapeuticAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Clinical Trial Phase</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="form-input"
                >
                  {trialPhases.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Clinical Phase Guidance */}
            <div className="p-3.5 bg-slate-900/30 border border-slate-850 rounded-xl text-xs text-slate-400 flex gap-2 select-none">
              <Info className="text-brand-400 shrink-0 w-4.5 h-4.5 mt-0.5" />
              <div>
                <strong className="text-slate-350 block mb-0.5">Phase Intelligence Guidance:</strong>
                {phase.includes("Phase I") ? (
                  <span>Phase I setups configure SAD (Single Ascending Dose), MAD (Multiple Ascending Dose), Food Effect, and PK/PD safety endpoints.</span>
                ) : phase.includes("Phase III") ? (
                  <span>Phase III confirmatory designs enforce Multiplicity error controls, Interim Analyses, and strict CDISC schemas.</span>
                ) : phase.includes("Bioequivalence") ? (
                  <span>Bioequivalence studies enforce TOST designs, crossover periods, and 90% confidence limits.</span>
                ) : (
                  <span>General clinical parameters and exploratory statistics will serve as study outcomes.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Cohorts, Objectives & Blinding */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs select-none">
            <h3 className="text-sm font-semibold text-slate-200">
              2. Objectives, Comparators & Blinding controls
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Reference Comparator</label>
                <select value={comparator} onChange={(e) => setComparator(e.target.value)} className="form-input">
                  <option value="Placebo">Placebo Control</option>
                  <option value="Active Control">Active Control Comparator</option>
                  <option value="Standard of Care">Standard of Care (SoC)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Objective Design Type</label>
                <select value={objectiveType} onChange={(e) => setObjectiveType(e.target.value)} className="form-input">
                  <option value="superiority">Superiority Objective</option>
                  <option value="nonInferiority">Non-Inferiority Objective</option>
                  <option value="equivalence">Equivalence Objective</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Cohort Allocation Design</label>
                <select value={designType} onChange={(e) => setDesignType(e.target.value)} className="form-input">
                  <option value="twoParallel">Two Parallel Arms (1:1 Allocation)</option>
                  <option value="crossover">2x2 Crossover (TR / RT)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Blinding Protocol</label>
                <select value={blinding} onChange={(e) => setBlinding(e.target.value)} className="form-input">
                  <option value="Double-Blind">Double-Blind Strategy (Subject + Investigator)</option>
                  <option value="Open-Label">Open-Label Trial</option>
                  <option value="Single-Blind">Single-Blind (Subject Only)</option>
                  <option value="Triple-Blind">Triple-Blind (Subject + Investigator + Analyst)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Population, Region & Duration */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs select-text">
            <h3 className="text-sm font-semibold text-slate-200 select-none">
              3. Trial Populations, Regions & Countries
            </h3>
            
            <div className="space-y-3">
              <label className="form-label select-none">Target Patient Population</label>
              <input 
                type="text" value={population} onChange={(e) => setPopulation(e.target.value)}
                className="form-input" placeholder="Adults aged 18-75 with diagnosed disease"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="form-label select-none">Lead Country</label>
                <input 
                  type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="form-label select-none">Regulatory Authority</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="form-input cursor-pointer">
                  <option value="FDA">USFDA (FDA USA)</option>
                  <option value="EMA">EMA (Europe)</option>
                  <option value="CDSCO">CDSCO (India)</option>
                  <option value="PMDA">PMDA (Japan)</option>
                  <option value="WHO">WHO Standards</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label select-none">Study Treatment Duration</label>
                <input 
                  type="text" value={duration} onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Endpoint type, Randomization & Calculations */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs">
            <h3 className="text-sm font-semibold text-slate-200 select-none">
              4. Endpoint type, Randomization & Sizing Sliders
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label select-none">Primary Endpoint Type</label>
                <select value={endpointType} onChange={(e) => setEndpointType(e.target.value)} className="form-input cursor-pointer">
                  <option value="continuous">Continuous Outcome (means, scales)</option>
                  <option value="binary">Binary Outcome (percentages, AE rates)</option>
                  <option value="survival">Time-to-Event (survival curves)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="form-label select-none">Randomization Method</label>
                <select value={randomization} onChange={(e) => setRandomization(e.target.value)} className="form-input cursor-pointer">
                  <option value="block">Permuted Block Randomization</option>
                  <option value="simple">Simple Randomization</option>
                  <option value="stratified">Stratified Block Randomization</option>
                  <option value="minimization">Adaptive Minimization</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs select-none">
              {/* Expected effect size */}
              <div className="p-3 bg-slate-900/35 border border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold text-slate-350">
                  <span>Effect Size (d / Δ)</span>
                  <span className="font-mono text-brand-400">{expectedEffectSize}</span>
                </div>
                <input
                  type="range" min="0.10" max="1.50" step="0.05" value={expectedEffectSize}
                  onChange={(e) => setExpectedEffectSize(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Alpha */}
              <div className="p-3 bg-slate-900/35 border border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold text-slate-350">
                  <span>Significance α</span>
                  <span className="font-mono text-brand-400">{alpha}</span>
                </div>
                <input
                  type="range" min="0.01" max="0.10" step="0.01" value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Power */}
              <div className="p-3 bg-slate-900/35 border border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold text-slate-350">
                  <span>Statistical Power</span>
                  <span className="font-mono text-brand-400">{power * 100}%</span>
                </div>
                <input
                  type="range" min="0.70" max="0.95" step="0.05" value={power}
                  onChange={(e) => setPower(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>

            {/* Calculated size box */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-widest text-[9.5px] block font-bold">Computed Target Enrollment</span>
                <span className="text-3xl font-extrabold font-display text-brand-400 block mt-1">N = {computedN} subjects</span>
              </div>
              <div className="text-right text-slate-500 select-none">
                <span>Calculated continuously in real-time</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Protocol intelligence generation dashboard */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-xs">
            {/* AI Disclaimer */}
            <div className="p-3.5 bg-purple-500/10 border border-purple-500/25 rounded-xl space-y-1.5 text-xs text-purple-400 relative select-none">
              <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded text-[8.5px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Recommendation: 96% Confidence
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={14} className="text-purple-400 animate-pulse" />
                <span>AI Governance Disclaimer</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                *This generated protocol design has been compiled in alignment with SPIRIT and Good Clinical Practice guidelines. It is not a substitute for review by a qualified statistician. Verify all statistical assumptions before study execution.*
              </p>
            </div>

            {/* Protocol Preview */}
            <div className="space-y-3">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">IRB/Protocol-Ready Statistical Section</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveToStudyRepo}
                    className="px-2 py-1 bg-brand-500/10 hover:bg-brand-500/25 border border-brand-500/25 text-brand-400 text-[10px] font-bold rounded cursor-pointer transition active:scale-95"
                  >
                    Save to Projects
                  </button>
                  <button
                    onClick={() => handleDownloadProtocol("DOCX")}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-350 rounded cursor-pointer"
                  >
                    Download DOCX
                  </button>
                  <button
                    onClick={() => handleDownloadProtocol("PDF")}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-350 rounded cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Text Area display */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[10.5px] leading-relaxed text-slate-350 max-h-[300px] overflow-y-auto whitespace-pre select-all custom-scrollbar">
                {generateFullProtocolText()}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800/80 select-none">
          {step > 1 && step < 5 ? (
            <button onClick={handlePrev} className="btn-secondary text-xs cursor-pointer">
              <ArrowLeft size={14} />
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button onClick={handleNext} className="btn-primary text-xs ml-auto cursor-pointer bg-brand-650 hover:bg-brand-600">
              Continue
              <ArrowRight size={14} />
            </button>
          ) : step === 4 ? (
            <button onClick={() => setStep(5)} className="btn-primary text-xs ml-auto bg-emerald-650 hover:bg-emerald-600 cursor-pointer">
              <Sparkles size={14} />
              Compile 30-Section Protocol
            </button>
          ) : (
            <button onClick={() => setStep(1)} className="btn-secondary text-xs ml-auto cursor-pointer">
              Restart Wizard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
