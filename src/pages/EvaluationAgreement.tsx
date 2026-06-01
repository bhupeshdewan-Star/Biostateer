import React, { useState } from "react";
import { ShieldCheck, FileText, AlertTriangle, ArrowRight } from "lucide-react";

interface EvaluationAgreementProps {
  onAccept: () => void;
}

export default function EvaluationAgreement({ onAccept }: EvaluationAgreementProps) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRestrictions, setAgreedRestrictions] = useState(false);
  const [agreedLiability, setAgreedLiability] = useState(false);

  const canSubmit = agreedTerms && agreedRestrictions && agreedLiability;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
        
        {/* Top banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-purple-600" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 animate-pulse">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-xl font-bold font-display text-slate-100 tracking-tight">
            Biostateer™ Evaluation License Agreement
          </h1>
          <p className="text-xs text-slate-400">
            Please review and accept the terms of the Clinical Biostatistics Evaluation License.
          </p>
        </div>

        {/* Scrollable Terms Core Box */}
        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl max-h-[220px] overflow-y-auto text-[11px] leading-relaxed text-slate-300 space-y-3 custom-scrollbar select-text">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-slate-850 pb-1.5">
            <FileText size={12} className="text-brand-400" />
            PART 1: SCIENTIFIC EVALUATION SCOPE
          </h4>
          <p>
            This Biostateer™ Evaluation Platform is provided solely for scientific evaluation, peer review, and academic validation purposes. You represent that you are a clinical investigator, biostatistician, or clinical research professional representing an authorized pharmaceutical, CRO, or academic medical research organization.
          </p>

          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-slate-850 pb-1.5">
            <AlertTriangle size={12} className="text-amber-500" />
            PART 2: PROPRIETARY RESTRICTIONS
          </h4>
          <p>
            Biostateer™ is proprietary software owned by Dr. Bhupesh Dewan. Under this evaluation license, the following actions are strictly and absolutely prohibited:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>No reverse engineering, decompilation, or disassembly of mathematical calculators or scripts.</li>
            <li>No redistribution, packaging, or public display of platform assets or code structures.</li>
            <li>No direct or indirect commercial use in active clinical trials without a commercial contract.</li>
            <li>No automated scraping, spidering, or bulk data extraction of clinical datasets or outputs.</li>
            <li>No model replication or copying of proprietary user interface designs.</li>
          </ul>

          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-slate-850 pb-1.5">
            <FileText size={12} className="text-brand-400" />
            PART 3: INTELLECTUAL PROPERTY & LIABILITY
          </h4>
          <p>
            All calculations, report synopses, and interface designs remain the sole property of Founder Dr. Bhupesh Dewan. The platform is provided "as-is" without warranty of any kind. Outputs are benchmarked against reference SAS, SPSS, and R pipelines and are NOT intended for direct clinical decision-making or regulatory submissions without prior institutional validation.
          </p>
        </div>

        {/* Terms Checkboxes */}
        <div className="space-y-3.5 pt-2 text-xs">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              checked={agreedTerms}
              onChange={() => setAgreedTerms(!agreedTerms)}
              className="mt-0.5 rounded border-slate-850 bg-slate-950 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="text-slate-350 leading-tight group-hover:text-slate-200 transition">
              I understand that Biostateer™ is an evaluation platform and is not intended for direct clinical decision making.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              checked={agreedRestrictions}
              onChange={() => setAgreedRestrictions(!agreedRestrictions)}
              className="mt-0.5 rounded border-slate-850 bg-slate-950 text-brand-500 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-slate-350 leading-tight group-hover:text-slate-200 transition">
              I agree to the strict restrictions, including no reverse engineering, decompilation, commercial resale, or automated scraping of the biostatistics calculators.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              checked={agreedLiability}
              onChange={() => setAgreedLiability(!agreedLiability)}
              className="mt-0.5 rounded border-slate-850 bg-slate-950 text-brand-500 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-slate-350 leading-tight group-hover:text-slate-200 transition">
              I accept the intellectual property protections claiming ownership for Dr. Bhupesh Dewan and acknowledging that all exports will be watermarked for evaluation.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="pt-2">
          <button
            disabled={!canSubmit}
            onClick={onAccept}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs transition active:scale-98 ${
              canSubmit 
                ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 cursor-pointer" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            Enter Biostateer™ Evaluation Portal
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mandatory Footer */}
        <div className="border-t border-slate-850 pt-4 text-center space-y-1.5 select-text text-[9.5px] text-slate-500">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder & Product Owner: Dr. Bhupesh Dewan
          </p>
          <p>
            Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved. proprietary Clinical Research Software.
          </p>
        </div>

      </div>
    </div>
  );
}
