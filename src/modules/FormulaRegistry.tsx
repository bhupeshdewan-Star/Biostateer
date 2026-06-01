import React, { useState } from "react";
import { Info, ShieldCheck, BookOpen, AlertTriangle } from "lucide-react";

export default function FormulaRegistry() {
  const [activeFormula, setActiveFormula] = useState<string>("BST-TT-001");

  const registry: Record<string, { id: string; name: string; equation: string; assumptions: string[]; references: string[]; status: string }> = {
    "BST-TT-001": {
      id: "BST-TT-001",
      name: "Welch's Independent Two-Sample T-Test",
      equation: "t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}, \\quad df = \\frac{\\left(\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}\\right)^2}{\\frac{(s_1^2/n_1)^2}{n_1 - 1} + \\frac{(s_2^2/n_2)^2}{n_2 - 1}}",
      assumptions: [
        "Continuous scale: Dependent variable measured continuously.",
        "Independence: Measurements obtained independently from subjects.",
        "Normality: Approximated normal sample populations (robust for N >= 30)."
      ],
      references: [
        "Welch, B. L. (1947). The generalization of Student's problem. Biometrika, 34(1/2), 28-35.",
        "R stats::t.test(..., var.equal = FALSE)"
      ],
      status: "Verified (Bias < 10^-14)"
    },
    "BST-AOV-001": {
      id: "BST-AOV-001",
      name: "One-Way Analysis of Variance (ANOVA)",
      equation: "F = \\frac{MS_{Between}}{MS_{Within}} = \\frac{\\sum n_j(\\bar{X}_j - \\bar{X})^2 / (k - 1)}{\\sum\\sum (X_{ij} - \\bar{X}_j)^2 / (N - k)}",
      assumptions: [
        "Normality: Residuals must follow normal probability densities.",
        "Homoscedasticity: Variances should remain homogeneous between cohorts.",
        "Independence: mutually independent observational groups."
      ],
      references: [
        "Fisher, R. A. (1925). Statistical Methods for Research Workers. Oliver and Boyd.",
        "SAS PROC ANOVA / SPSS ONEWAY"
      ],
      status: "Verified (Bias < 10^-14)"
    },
    "BST-MAN-001": {
      id: "BST-MAN-001",
      name: "Multivariate Analysis of Variance (MANOVA)",
      equation: "\\Lambda_{Wilks} = \\frac{|W|}{|B + W|} = \\prod \\frac{1}{1 + \\lambda_i}",
      assumptions: [
        "Multivariate Normality: Dependent variables follow a joint multivariate normal distribution.",
        "Homogeneity of Covariance: Equality of covariance matrices across groups (Box's M).",
        "Multivariate Outliers: Mahalanobis distances verified."
      ],
      references: [
        "Wilks, S. S. (1932). Certain generalizations in the analysis of variance. Biometrika, 24(3/4), 471-494.",
        "R stats::manova() / SPSS GLM Multivariate"
      ],
      status: "Production Validated"
    },
    "BST-BE-001": {
      id: "BST-BE-001",
      name: "Two One-Sided Equivalence Tests (TOST)",
      equation: "t_1 = \\frac{\\bar{Y}_T - \\bar{Y}_R - \\ln(0.80)}{SE}, \\quad t_2 = \\frac{\\ln(1.25) - (\\bar{Y}_T - \\bar{Y}_R)}{SE}",
      assumptions: [
        "Log-Transformation: Concentrations log-transformed prior to linear modeling.",
        "Sequence/Period independence: Sequence, period, and treatment effects are additive.",
        "TOST bounds: Equivalence established if both t1 and t2 critical values are met (alpha = 0.05)."
      ],
      references: [
        "Schuirman, D. J. (1987). A comparison of the two one-sided tests procedure and the power approach. J. Pharmacokinet. Biopharm., 15(6), 657-680.",
        "USFDA Bioequivalence Guidance / EMA Guideline"
      ],
      status: "Production Validated"
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <BookOpen className="text-brand-500 w-7 h-7" />
            Formula & Transparency Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse the governing clinical equations, assumptions, and validation reference citations.
          </p>
        </div>

        <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
          REGISTRY VERSION 1.0
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Selection Navigation Column */}
        <div className="lg:col-span-4 space-y-3 select-none text-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 block mb-1">Select Registry Formula</h3>
          {Object.keys(registry).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFormula(key)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between h-[80px] cursor-pointer ${
                activeFormula === key
                  ? "border-brand-500 bg-brand-500/5 text-slate-100 font-bold"
                  : "border-slate-850 bg-slate-950/30 hover:border-slate-800 text-slate-400"
              }`}
            >
              <span className="font-mono text-[9px] text-brand-400 font-bold uppercase tracking-wider">{registry[key].id}</span>
              <span className="font-semibold text-xs text-slate-200 mt-1 block truncate">{registry[key].name}</span>
            </button>
          ))}
        </div>

        {/* Math & Details Workspace Column */}
        <div className="lg:col-span-8 space-y-6 text-xs">
          
          <div className="glass-panel p-5 space-y-4 select-text">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-450 border-b border-slate-900 pb-2.5 flex items-center justify-between">
              <span>Formula Details Workspace</span>
              <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                {registry[activeFormula].status}
              </span>
            </h3>

            <div className="space-y-4">
              {/* Header */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Equation ID & Name</span>
                <span className="text-sm font-extrabold text-slate-200 mt-0.5 block">{registry[activeFormula].id} - {registry[activeFormula].name}</span>
              </div>

              {/* Equation formula preview box */}
              <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Governing Mathematical Equation</span>
                <div className="font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all py-1">
                  {registry[activeFormula].equation}
                </div>
              </div>

              {/* Assumptions */}
              <div className="pt-2 border-t border-slate-900 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block select-none">Mathematical Assumptions</span>
                <ul className="text-xs space-y-2 text-slate-400">
                  {registry[activeFormula].assumptions.map((asm, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></div>
                      <span>{asm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* References */}
              <div className="pt-3 border-t border-slate-900 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block select-none">Validation References</span>
                <ul className="text-xs space-y-1.5 text-slate-400">
                  {registry[activeFormula].references.map((ref, idx) => (
                    <li key={idx} className="flex gap-2 items-start font-mono text-[10px] leading-relaxed text-slate-450">
                      <span>[{idx + 1}]</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
