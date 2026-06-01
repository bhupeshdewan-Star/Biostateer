import React from "react";
import { FileText, Mail, MapPin, Scale } from "lucide-react";

interface TermsAndConditionsProps {
  onBack?: () => void;
}

export default function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 relative select-text">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />
        
        {/* Back navigation */}
        {onBack && (
          <button 
            onClick={onBack}
            className="px-3 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-slate-100 text-xs font-semibold cursor-pointer transition active:scale-95"
          >
            ← Back
          </button>
        )}

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-bold font-display text-slate-100 tracking-tight flex items-center gap-2">
            <Scale className="text-brand-500 w-7 h-7" />
            Biostateer™ Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: June 1, 2026 | Version 1.3
          </p>
        </div>

        <div className="border-t border-slate-850 pt-4 space-y-5 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">1. Acceptance of Terms</h3>
            <p>
              By completing the registration process and logging into the Biostateer™ Clinical Analytics Platform, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, you are not authorized to request access or use any calculator, protocol assistant, or CDISC validator.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">2. License Grant</h3>
            <p>
              Subject to these Terms and your manual approval by the administrator, Dr. Bhupesh Dewan grants you a personal, non-exclusive, non-transferable, revocable evaluation license to access and test the platform for a period of **45 days** solely for peer review, software validation, and scientific benchmarking.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">3. Proprietary Covenants & Restrictions</h3>
            <p>
              Biostateer™ is proprietary software. All technology, mathematical code logic, and interfaces are intellectual property owned by Dr. Bhupesh Dewan. Under this agreement:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-450">
              <li><strong>No Reverse Engineering</strong>: You shall not reverse engineer, decompile, disassemble, or extract any source code, algorithms, or formulas from the frontend Vite bundle or FastAPI backend.</li>
              <li><strong>No Redistribution</strong>: You shall not redistribute, republish, rent, lease, or lend any portion of the platform.</li>
              <li><strong>No Model Replication</strong>: You shall not copy or replicate the visual styling, workflow structures, or analytical outputs.</li>
              <li><strong>No Automated Scraping</strong>: Anonymous bots, scrapers, crawlers, or credential stuffers are prohibited. All access must be manual and authorized.</li>
              <li><strong>No Commercial Use</strong>: You shall not use Biostateer™ outputs to support active commercial clinical trials or regulatory submissions without obtaining a commercial license.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">4. Statistical Validation Disclaimer</h3>
            <p>
              Every biostatistical calculation (T-Tests, ANOVA, ROC calibration, Survival analysis, Sample size spent boundaries) is benchmarked against R, SAS, and SPSS reference statistical implementations. However, because this is an evaluation version, all reports are dynamically watermarked and NOT certified for direct clinical decision-making or regulatory dossiers.
            </p>
          </section>

          <section className="space-y-2 font-semibold">
            <h3 className="font-bold text-slate-100 text-sm">5. Expiration & Account Suspensions</h3>
            <p>
              We reserve the right to suspend, terminate, or deny access to any evaluator at any time for violation of these covenants, credential sharing detection, or suspicious OTP requests. Evaluation accounts will expire automatically after 45 days unless extended.
            </p>
          </section>

          <section className="space-y-2 p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <FileText size={14} className="text-brand-400" />
              6. Ownership & Legal Entity
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Biostateer™ is proprietary clinical research software owned by:
            </p>
            <div className="pt-1.5 space-y-1 text-[11px] font-medium text-slate-350">
              <p>Dr. Bhupesh Dewan, Founder & Product Owner</p>
              <p className="flex items-center gap-1.5"><Mail size={12} className="text-brand-400" /> bdewan@biostateer.com</p>
              <p className="flex items-center gap-1.5"><MapPin size={12} className="text-brand-400" /> Mumbai, India</p>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-850 pt-4 text-center space-y-1 text-[10px] text-slate-500 select-none">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder & Product Owner: Dr. Bhupesh Dewan
          </p>
          <p>
            Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved. Proprietary Clinical Research Software.
          </p>
        </div>
      </div>
    </div>
  );
}
