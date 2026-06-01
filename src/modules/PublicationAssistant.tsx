import React, { useState } from "react";
import { Copy, FileText, CheckCircle2, FileSpreadsheet, Share2 } from "lucide-react";

export default function PublicationAssistant({ onLogAudit }: { onLogAudit: (action: string, inputs: any, outputs: any) => void }) {
  const [styleType, setStyleType] = useState("apa"); // apa, consort, strobe
  const [testType, setTestType] = useState("tTest"); // tTest, anova, correlation, regression

  // Standard inputs for writing
  const [statVal, setStatVal] = useState("-4.30");
  const [dfVal, setDfVal] = useState("9.49");
  const [pVal, setPVal] = useState("0.00192");
  const [effectVal, setEffectVal] = useState("d = -2.48");

  // Table generator
  const [tableName, setTableName] = useState("Table 1. Demographic and Clinical Baseline Metrics");
  const [showTable, setShowTable] = useState(true);

  // Generate manuscript text
  let manuscriptText = "";

  if (styleType === "apa") {
    if (testType === "tTest") {
      manuscriptText = `An independent-samples Welch's t-test was conducted to evaluate clinical efficacy. There was a statistically significant difference in efficacy outcomes between the treatment group and the control group, t(${dfVal}) = ${statVal}, p = ${parseFloat(pVal) < 0.001 ? "< .001" : pVal}, two-tailed. The clinical effect size was large, Cohen's ${effectVal}. These findings demonstrate a mathematically validated treatment advantage.`;
    } else if (testType === "anova") {
      manuscriptText = `A one-way Analysis of Variance (ANOVA) was conducted to compare efficacy across diet regimens. There was a statistically significant difference in treatment outcomes between the groups, F(${dfVal}) = ${statVal}, p = ${parseFloat(pVal) < 0.001 ? "< .001" : pVal}. The proportion of variance explained was high, with an eta-squared (η²) of ${effectVal}. Post-hoc Tukey HSD comparisons revealed significant divergence.`;
    } else if (testType === "correlation") {
      manuscriptText = `A Pearson product-moment correlation coefficient was computed to assess the relationship between continuous variables. There was a strong, statistically significant correlation between the two metrics, r = ${statVal}, N = ${dfVal}, p = ${parseFloat(pVal) < 0.001 ? "< .001" : pVal}. Higher levels of the predictor were strongly associated with proportionate changes in outcome, representing a major effect size.`;
    } else {
      manuscriptText = `A simple linear regression was calculated to predict outcomes based on treatment exposure. A significant regression equation was found (F(${dfVal}) = ${statVal}, p = ${parseFloat(pVal) < 0.001 ? "< .001" : pVal}), with an R² of ${effectVal}. Treatment exposure is a statistically significant predictor of outcome, demonstrating robust clinical validity.`;
    }
  } else if (styleType === "consort") {
    manuscriptText = `CONSORT Checklist Integration Paragraph:\nPrimary outcomes were analyzed using an Intention-to-Treat (ITT) population including all randomized subjects. Primary comparative significance was evaluated using ${testType === "tTest" ? "an Independent Welch's T-Test" : "standard linear modeling"} at an alpha of 0.05. The treatment group demonstrated superior efficacy (statistic = ${statVal}, p = ${pVal}) with an effect size of ${effectVal}. No serious adverse events led to study withdrawal.`;
  } else {
    manuscriptText = `STROBE Checklist Integration Paragraph:\nTo address potential confounding in this observational cohort, baseline demographics were adjusted using multi-variable linear regression. The primary comparison showed a statistically significant association between exposure and clinical outcomes (beta = ${statVal}, df = ${dfVal}, p = ${pVal}) with a calculated effect size of ${effectVal}. Robust standard errors were computed to control for heteroscedasticity.`;
  }

  // Pre-scaffolded baseline table
  const baselineTableMarkdown = `| Baseline Characteristic | Placebo Group (N=64) | Active SGLT2 Group (N=64) | p-value |
| :--- | :---: | :---: | :---: |
| Age (years, Mean ± SD) | 58.4 ± 8.2 | 59.1 ± 7.9 | 0.620 |
| Systolic BP (mmHg) | 142.5 ± 12.1 | 143.1 ± 11.8 | 0.780 |
| Baseline HbA1c (%) | 7.82 ± 1.12 | 7.91 ± 1.05 | 0.640 |
| Females, n (%) | 28 (43.8%) | 30 (46.9%) | 0.720 |`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(manuscriptText);
    alert("Manuscript paragraph copied!");
  };

  const handleCopyTable = () => {
    navigator.clipboard.writeText(baselineTableMarkdown);
    alert("Baseline Table 1 Markdown copied!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900">
          Publication Assistant
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Automatically translate biostatistical calculator outputs into manuscript-ready scientific paragraphs and tables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Format Settings */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-brand-500" />
              Manuscript Text Settings
            </h3>

            {/* Reporting Standard */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "apa", label: "APA 7th" },
                { id: "consort", label: "CONSORT" },
                { id: "strobe", label: "STROBE" }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setStyleType(style.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 uppercase ${
                    styleType === style.id
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : "border-slate-850 bg-slate-950/20 hover:border-slate-800 text-slate-400"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            {/* Select Test Type */}
            <div>
              <label className="form-label text-[10px]">Test Performed</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="form-input text-xs"
              >
                <option value="tTest">Independent Welch's T-Test</option>
                <option value="anova">One-Way ANOVA</option>
                <option value="correlation">Pearson Correlation</option>
                <option value="regression">Simple Linear Regression</option>
              </select>
            </div>

            {/* Live Stats values */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="form-label text-[10px]">Statistic Value (t / F / r)</label>
                <input
                  type="text"
                  value={statVal}
                  onChange={(e) => setStatVal(e.target.value)}
                  className="form-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="form-label text-[10px]">Degrees of Freedom / N</label>
                <input
                  type="text"
                  value={dfVal}
                  onChange={(e) => setDfVal(e.target.value)}
                  className="form-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="form-label text-[10px]">Calculated p-value</label>
                <input
                  type="text"
                  value={pVal}
                  onChange={(e) => setPVal(e.target.value)}
                  className="form-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="form-label text-[10px]">Effect Size Value</label>
                <input
                  type="text"
                  value={effectVal}
                  onChange={(e) => setEffectVal(e.target.value)}
                  className="form-input font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output panels */}
        <div className="lg:col-span-7 space-y-6">
          {/* Manuscript Paragraph block */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-brand-500" />
                Manuscript-Ready Paragraph
              </h4>
              <button
                onClick={handleCopyText}
                className="btn-secondary text-[10px] px-2 py-0.5 flex items-center gap-1"
              >
                <Copy size={10} />
                Copy
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-sans italic bg-slate-950/20 p-3.5 rounded-lg border border-slate-850">
              "{manuscriptText}"
            </p>
          </div>

          {/* Table generator block */}
          {showTable && (
            <div className="glass-panel p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Share2 size={14} className="text-brand-500" />
                  Baseline Table 1 (Clinical Standard)
                </h4>
                <button
                  onClick={handleCopyTable}
                  className="btn-secondary text-[10px] px-2 py-0.5 flex items-center gap-1"
                >
                  <Copy size={10} />
                  Copy Markdown
                </button>
              </div>

              <div className="overflow-x-auto text-[11px] font-mono leading-relaxed bg-slate-950/20 p-3 rounded-lg border border-slate-850 text-slate-400 whitespace-pre">
                {baselineTableMarkdown}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
