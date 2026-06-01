import React, { useState } from "react";
import { BookOpen, AlertCircle, FileText, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface Variable {
  symbol: string;
  definition: string;
}

interface FormulaTransparencyProps {
  formulaName: string;
  formula: string;
  variables: Variable[];
  assumptions: string;
  limitations: string;
  references: string[];
  validationAgainst: string[];
}

export function FormulaTransparency({
  formulaName,
  formula,
  variables,
  assumptions,
  limitations,
  references,
  validationAgainst
}: FormulaTransparencyProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel overflow-hidden border border-slate-900/60 light:border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-slate-900/20 light:bg-slate-50 hover:bg-slate-900/30 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-brand-400" />
          <span className="text-xs font-semibold text-slate-300 light:text-slate-700 tracking-wide uppercase">
            Formula Transparency Drawer — {formulaName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {validationAgainst.map((pkg, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono"
              >
                ✓ {pkg}
              </span>
            ))}
          </div>
          {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-850 light:border-slate-200 space-y-4 text-xs leading-relaxed text-slate-400">
          {/* 1. LaTeX Formula */}
          <div className="space-y-1">
            <span className="form-label text-[10px] text-slate-500">Mathematical Expression</span>
            <div className="math-eqn">
              {/* LaTeX Math simulation display */}
              <code className="text-brand-400 font-mono block select-all p-3 bg-slate-950/60 rounded text-center">
                {formula}
              </code>
            </div>
          </div>

          {/* 2. Variables Legend */}
          <div className="space-y-1.5">
            <span className="form-label text-[10px] text-slate-500">Variables Definitions</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              {variables.map((v, idx) => (
                <div key={idx} className="flex gap-2 p-1.5 bg-slate-950/10 border border-slate-900 rounded">
                  <span className="font-mono font-bold text-brand-400 shrink-0">{v.symbol}</span>
                  <span className="text-slate-300">{v.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Scientific Preconditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-850">
            <div className="space-y-1">
              <span className="form-label text-[10px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Required Scientific Assumptions
              </span>
              <p className="text-[11px] text-slate-300 bg-slate-950/10 p-2.5 rounded border border-slate-900">
                {assumptions}
              </p>
            </div>
            <div className="space-y-1">
              <span className="form-label text-[10px] text-slate-500 flex items-center gap-1">
                <AlertCircle size={12} className="text-amber-400" />
                Mathematical Limitations & Pitfalls
              </span>
              <p className="text-[11px] text-slate-300 bg-slate-950/10 p-2.5 rounded border border-slate-900">
                {limitations}
              </p>
            </div>
          </div>

          {/* 4. Historic References */}
          <div className="pt-2 border-t border-slate-850 space-y-1.5">
            <span className="form-label text-[10px] text-slate-500">Historical Scientific Citations</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              {references.map((ref, idx) => (
                <li key={idx} className="text-slate-300 font-serif leading-relaxed">
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
