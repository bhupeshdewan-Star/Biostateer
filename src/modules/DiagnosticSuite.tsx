import React, { useState } from "react";
import { calculateDiagnosticMetrics } from "../math/statsEngine";
import { FormulaTransparency } from "../components/FormulaTransparency"; // Written by UIBuilder
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Activity, ShieldAlert, CheckCircle, BarChart2 } from "lucide-react";

export default function DiagnosticSuite({ onLogAudit }: { onLogAudit: (action: string, inputs: any, outputs: any) => void }) {
  const [tp, setTp] = useState<number>(80);
  const [fp, setFp] = useState<number>(10);
  const [fn, setFn] = useState<number>(20);
  const [tn, setTn] = useState<number>(90);

  const metrics = calculateDiagnosticMetrics(tp, fp, fn, tn);

  // ROC Curve Data
  // We represent the 2x2 point on the ROC space: (1 - Specificity, Sensitivity)
  const oneMinusSpec = Number((1.0 - metrics.specificity).toFixed(4));
  const sens = Number(metrics.sensitivity.toFixed(4));

  const rocData = [
    { x: 0, y: 0, ref: 0 },
    { x: oneMinusSpec, y: sens, ref: oneMinusSpec },
    { x: 1, y: 1, ref: 1 }
  ];

  const handleInputChange = (field: string, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    let newTp = tp, newFp = fp, newFn = fn, newTn = tn;

    if (field === "tp") { newTp = num; setTp(num); }
    else if (field === "fp") { newFp = num; setFp(num); }
    else if (field === "fn") { newFn = num; setFn(num); }
    else if (field === "tn") { newTn = num; setTn(num); }

    // Run audit logging
    const updatedMetrics = calculateDiagnosticMetrics(newTp, newFp, newFn, newTn);
    onLogAudit("Diagnostic 2x2 Analysis", { tp: newTp, fp: newFp, fn: newFn, tn: newTn }, updatedMetrics);
  };

  const percent = (val: number) => `${(val * 100).toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900">
          Diagnostic Statistics & ROC Suite
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Perform high-precision binary classifier diagnostics and plot publication-quality ROC Curves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: 2x2 Table Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <Activity size={16} className="text-brand-500" />
              Interactive 2x2 Contingency Table
            </h3>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4">
              <div></div>
              <div className="font-semibold text-slate-400">Condition Positive (Gold Standard)</div>
              <div className="font-semibold text-slate-400">Condition Negative (Gold Standard)</div>

              <div className="font-semibold text-slate-400 flex items-center justify-center">Test Positive</div>
              <div className="p-3 bg-slate-950/40 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-lg">
                <label className="form-label text-[10px] text-emerald-400">True Positive (TP)</label>
                <input
                  type="number"
                  value={tp}
                  onChange={(e) => handleInputChange("tp", e.target.value)}
                  className="form-input text-center font-mono mt-1 w-full bg-slate-900 border-none"
                />
              </div>
              <div className="p-3 bg-slate-950/40 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-lg">
                <label className="form-label text-[10px] text-rose-400">False Positive (FP)</label>
                <input
                  type="number"
                  value={fp}
                  onChange={(e) => handleInputChange("fp", e.target.value)}
                  className="form-input text-center font-mono mt-1 w-full bg-slate-900 border-none"
                />
              </div>

              <div className="font-semibold text-slate-400 flex items-center justify-center">Test Negative</div>
              <div className="p-3 bg-slate-950/40 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-lg">
                <label className="form-label text-[10px] text-rose-400">False Negative (FN)</label>
                <input
                  type="number"
                  value={fn}
                  onChange={(e) => handleInputChange("fn", e.target.value)}
                  className="form-input text-center font-mono mt-1 w-full bg-slate-900 border-none"
                />
              </div>
              <div className="p-3 bg-slate-950/40 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-lg">
                <label className="form-label text-[10px] text-emerald-400">True Negative (TN)</label>
                <input
                  type="number"
                  value={tn}
                  onChange={(e) => handleInputChange("tn", e.target.value)}
                  className="form-input text-center font-mono mt-1 w-full bg-slate-900 border-none"
                />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-center">
              Total Sample Cohort: <span className="font-mono font-semibold text-slate-300">{(tp + fp + fn + tn)}</span> subjects
            </div>
          </div>

          {/* Diagnostic Metrics Display */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800">
              Diagnostic Calculator Outputs
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sensitivity (TPR)</span>
                <span className="text-xl font-bold font-display text-emerald-400 mt-1 block">{percent(metrics.sensitivity)}</span>
              </div>
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Specificity (TNR)</span>
                <span className="text-xl font-bold font-display text-emerald-400 mt-1 block">{percent(metrics.specificity)}</span>
              </div>
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">PPV (Precision)</span>
                <span className="text-xl font-bold font-display text-slate-100 light:text-slate-900 mt-1 block">{percent(metrics.ppv)}</span>
              </div>
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">NPV</span>
                <span className="text-xl font-bold font-display text-slate-100 light:text-slate-900 mt-1 block">{percent(metrics.npv)}</span>
              </div>
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Overall Accuracy</span>
                <span className="text-xl font-bold font-display text-brand-400 mt-1 block">{percent(metrics.accuracy)}</span>
              </div>
              <div className="p-3 bg-slate-950/20 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">ROC Area Under Curve</span>
                <span className="text-xl font-bold font-display text-brand-400 mt-1 block">{metrics.rocAUC.toFixed(4)}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 light:border-slate-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Positive Likelihood Ratio (LR+)</span>
                <span className="font-mono text-slate-200 light:text-slate-800 font-semibold">{metrics.lrPositive.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Negative Likelihood Ratio (LR-)</span>
                <span className="font-mono text-slate-200 light:text-slate-800 font-semibold">{metrics.lrNegative.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: ROC Curve Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <BarChart2 size={16} className="text-brand-500" />
              Receiver Operating Characteristic (ROC) Curve
            </h3>

            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={rocData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorAUC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4d75ff" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4d75ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(tick) => tick.toFixed(1)}
                    label={{ value: "1 - Specificity (False Positive Rate)", position: "insideBottom", offset: -10, fill: "#94a3b8" }}
                    stroke="#475569"
                  />
                  <YAxis
                    dataKey="y"
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(tick) => tick.toFixed(1)}
                    label={{ value: "Sensitivity (True Positive Rate)", angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8" }}
                    stroke="#475569"
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const nameStr = String(name);
                      if (nameStr === "y") return [value, "Sensitivity"];
                      if (nameStr === "x") return [value, "1 - Specificity"];
                      return [value, nameStr];
                    }}
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                  />
                  {/* Shaded AUC area */}
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#4d75ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAUC)"
                    name="y"
                  />
                  {/* Reference line */}
                  <Area
                    type="monotone"
                    dataKey="ref"
                    stroke="#475569"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    fill="none"
                    name="Reference"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-slate-500 text-center italic mt-2">
              ROC Space: The blue line shows the classifier's performance. Diagonal dotted line represents random classifier (AUC = 0.5).
            </div>
          </div>

          {/* Formula Drawer */}
          <FormulaTransparency
            formulaName="Diagnostic Performance Metrics"
            formula="Sensitivity = \frac{TP}{TP + FN}, \quad Specificity = \frac{TN}{TN + FP}, \quad PPV = \frac{TP}{TP + FP}, \quad NPV = \frac{TN}{TN + FN}"
            variables={[
              { symbol: "TP", definition: "True Positives - correctly identified clinical cases" },
              { symbol: "TN", definition: "True Negatives - correctly identified healthy subjects" },
              { symbol: "FP", definition: "False Positives - healthy subjects misidentified as cases" },
              { symbol: "FN", definition: "False Negatives - clinical cases missed by the test" }
            ]}
            assumptions="Requires a gold-standard diagnostic validation cohort."
            limitations="PPV and NPV are heavily dependent on the prevalence of disease in the cohort."
            references={[
              "Altman, D. G., & Bland, J. M. (1994). Diagnostic tests. 1: Sensitivity and specificity. BMJ, 308(6943), 1552.",
              "Metz, C. E. (1978). Basic principles of ROC analysis. Seminars in Nuclear Medicine, 8(4), 283-298."
            ]}
            validationAgainst={["R caret", "SciPy sklearn.metrics", "SPSS ROC", "MedCalc"]}
          />
        </div>
      </div>
    </div>
  );
}
