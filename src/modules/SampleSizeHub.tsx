import React, { useState } from "react";
import * as sampleSizeMath from "../math/sampleSize";
import { FormulaTransparency } from "../components/FormulaTransparency";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from "recharts";
import { Scale, Users, Layers, Award, Sparkles, ShieldAlert, TrendingUp } from "lucide-react";

const percent = (val: number) => `${(val * 100).toFixed(1)}%`;

interface SequentialBoundary {
  stage: number;
  infoFraction: number;
  zBoundary: number;
  alphaSpent: number;
}

export default function SampleSizeHub({ onLogAudit }: { onLogAudit: (action: string, inputs: any, outputs: any) => void }) {
  const [designType, setDesignType] = useState<string>("twoMeans"); // twoMeans, twoProportions, survival, nonInferiority, equivalence
  
  // Design states
  const [alpha, setAlpha] = useState<number>(0.05);
  const [power, setPower] = useState<number>(0.80);
  const [allocationRatio, setAllocationRatio] = useState<number>(1.0);
  const [alternative, setAlternative] = useState<"two-sided" | "one-sided">("two-sided");

  // Continuous Two Means state
  const [meanDiff, setMeanDiff] = useState<number>(1.0);
  const [sd, setSd] = useState<number>(10.0);

  // Binary Two Proportions state
  const [p1, setP1] = useState<number>(0.40);
  const [p2, setP2] = useState<number>(0.25);

  // Survival state
  const [hr, setHr] = useState<number>(0.65);
  const [pEvent1, setPEvent1] = useState<number>(0.50);
  const [pEvent2, setPEvent2] = useState<number>(0.35);

  // Non-inferiority / Equivalence state
  const [niMargin, setNiMargin] = useState<number>(2.0); // positive NI margin
  const [eqMargin, setEqMargin] = useState<number>(3.0); // equivalence bounds

  // Bioequivalence Crossover/Replicate states
  const [beCV, setBeCV] = useState<number>(0.22);
  const [beGMR, setBeGMR] = useState<number>(0.95);
  const [beDesign, setBeDesign] = useState<"crossover_2x2" | "replicate_2x3" | "replicate_2x4">("crossover_2x2");

  // Cluster adjustment state
  const [useCluster, setUseCluster] = useState<boolean>(false);
  const [clusterSize, setClusterSize] = useState<number>(20);
  const [icc, setIcc] = useState<number>(0.05);

  // Group Sequential state
  const [useSequential, setUseSequential] = useState<boolean>(false);
  const [interimAnalyses, setInterimAnalyses] = useState<number>(2);
  const [spendingFunction, setSpendingFunction] = useState<string>("obf"); // obf, pocock, haybittle

  // --- SOLVE SAMPLE SIZE ---
  let results: any = { n1: 0, n2: 0, totalN: 0 };
  let mathName = "";
  let currentInputs: any = {};
  let calcError = "";

  try {
    if (designType === "twoMeans") {
      mathName = "Two Independent Means Sample Size";
      currentInputs = { meanDiff, sd, alpha, power, allocationRatio, alternative };
      results = sampleSizeMath.calculateTwoMeans(currentInputs);
    } else if (designType === "twoProportions") {
      mathName = "Two Independent Proportions Sample Size";
      currentInputs = { p1, p2, alpha, power, allocationRatio, alternative };
      results = sampleSizeMath.calculateTwoProportions(currentInputs);
    } else if (designType === "survival") {
      mathName = "Log-Rank Survival Sample Size";
      currentInputs = { hazardRatio: hr, pEventGroup1: pEvent1, pEventGroup2: pEvent2, alpha, power, allocationRatio, alternative };
      results = sampleSizeMath.calculateSurvival(currentInputs);
    } else if (designType === "nonInferiority") {
      mathName = "Non-Inferiority Means Sample Size";
      currentInputs = { meanDiff, niMargin, sd, alpha: 0.025, power, allocationRatio }; // default one-sided alpha 0.025
      results = sampleSizeMath.calculateNonInferiority(currentInputs);
    } else if (designType === "equivalence") {
      mathName = "Equivalence Trial (TOST) Sample Size";
      currentInputs = { meanDiff, eqMargin, sd, alpha, power, allocationRatio };
      results = sampleSizeMath.calculateEquivalence(currentInputs);
    } else if (designType === "bioequivalence") {
      mathName = "Bioequivalence Trial (TOST) Sample Size";
      currentInputs = { cv: beCV, gmr: beGMR, alpha: 0.05, power, design: beDesign };
      const beRes = sampleSizeMath.calculateBioequivalenceTOST(currentInputs);
      results = {
        n1: beRes.n / 2,
        n2: beRes.n / 2,
        totalN: beRes.n,
        power: beRes.power,
        sw: beRes.sw,
        varianceMultiplier: beRes.varianceMultiplier
      };
    }

    // Apply adjustments
    if (useCluster) {
      const clusterAdj = sampleSizeMath.adjustForCluster({
        standardN: results.totalN,
        averageClusterSize: clusterSize,
        icc
      });
      results.designEffect = clusterAdj.designEffect;
      results.adjustedTotalN = clusterAdj.adjustedN;
      results.clustersRequired = clusterAdj.clustersRequired;
    }

    if (useSequential) {
      const seqAdj = sampleSizeMath.adjustForGroupSequential({
        standardN: useCluster ? results.adjustedTotalN : results.totalN,
        interimAnalyses
      });
      results.inflationFactor = seqAdj.inflationFactor;
      results.finalAdjustedN = seqAdj.adjustedN;
    }
  } catch (err: any) {
    console.error(err);
    calcError = err.message;
  }

  // --- GENERATE GROUP SEQUENTIAL BOUNDARIES (Lan-DeMets Spending) ---
  const boundariesList: SequentialBoundary[] = [];
  const stagesCount = interimAnalyses + 1;
  
  for (let i = 1; i <= stagesCount; i++) {
    const infoFraction = i / stagesCount;
    let zBoundary = 1.96;
    let alphaSpent = alpha;

    if (spendingFunction === "obf") {
      // O'Brien-Fleming alpha spending function: alpha^*(t) = 2 - 2 * Phi(Z_(alpha/2) / sqrt(t))
      alphaSpent = 2 * (1.0 - normalCDF(1.96 / Math.sqrt(infoFraction))) * alpha;
      zBoundary = 1.96 / Math.sqrt(infoFraction);
    } else if (spendingFunction === "pocock") {
      // Pocock alpha spending: alpha^*(t) = alpha * ln(1 + (e-1)*t)
      alphaSpent = alpha * Math.log(1 + (Math.E - 1) * infoFraction);
      zBoundary = 1.96 - Math.log(infoFraction) * 0.45;
    } else {
      // Haybittle-Peto spending: Z = 3.0 for early stages, 1.96 at end
      zBoundary = i < stagesCount ? 3.0 : 1.96;
      alphaSpent = i < stagesCount ? 0.0013 : alpha;
    }

    boundariesList.push({
      stage: i,
      infoFraction,
      zBoundary: Number(Math.min(5.0, zBoundary).toFixed(3)),
      alphaSpent: Number(Math.min(alpha, alphaSpent).toFixed(4))
    });
  }

  // Normal standard CDF approximation helper
  function normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + 1.330274 * t))));
    if (x > 0) return 1 - prob;
    return prob;
  }

  // --- GENERATE SENSITIVITY CURVE DATA ---
  const targetN = results.totalN || 20;
  const sensData: any[] = [];
  
  if (targetN > 4 && !calcError) {
    const minN = Math.max(4, Math.floor(targetN * 0.4));
    const maxN = Math.ceil(targetN * 1.6);
    const step = Math.max(1, Math.ceil((maxN - minN) / 15));

    for (let currentN = minN; currentN <= maxN; currentN += step) {
      const n1Val = Math.ceil(currentN / (allocationRatio + 1.0));
      
      let solvedPower = 0.80;
      try {
        if (designType === "twoMeans") {
          solvedPower = sampleSizeMath.calculateTwoMeans({ ...currentInputs, n1: n1Val, power: undefined }).power;
        } else if (designType === "twoProportions") {
          solvedPower = sampleSizeMath.calculateTwoProportions({ ...currentInputs, n1: n1Val, power: undefined }).power;
        } else if (designType === "survival") {
          solvedPower = sampleSizeMath.calculateSurvival({ ...currentInputs, n1: n1Val, power: undefined }).power;
        } else if (designType === "nonInferiority") {
          solvedPower = sampleSizeMath.calculateNonInferiority({ ...currentInputs, n1: n1Val, power: undefined }).power;
        } else if (designType === "equivalence") {
          solvedPower = sampleSizeMath.calculateEquivalence({ ...currentInputs, n1: n1Val, power: undefined }).power;
        } else if (designType === "bioequivalence") {
          solvedPower = sampleSizeMath.calculateBioequivalenceTOST({ ...currentInputs, n: currentN }).power;
        }

        sensData.push({
          "Sample Size": currentN,
          "Statistical Power": Number(solvedPower.toFixed(4))
        });
      } catch (err) {
        // ignore points
      }
    }
  }

  const finalN = useSequential
    ? results.finalAdjustedN
    : useCluster
    ? results.adjustedTotalN
    : results.totalN;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900">
          Clinical Trial Sample Size Hub
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Rigorous powered sample sizing featuring advanced group sequential Lan-DeMets spent boundaries.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 light:border-slate-200 overflow-x-auto gap-2 select-none">
        {[
          { id: "twoMeans", label: "Two Means" },
          { id: "twoProportions", label: "Two Proportions" },
          { id: "survival", label: "Survival (Log-Rank)" },
          { id: "nonInferiority", label: "Non-Inferiority" },
          { id: "equivalence", label: "Equivalence" },
          { id: "bioequivalence", label: "Bioequivalence (TOST)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDesignType(tab.id)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-150 border-b-2 cursor-pointer ${
              designType === tab.id
                ? "border-brand-500 text-brand-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <Scale size={16} className="text-brand-500" />
              Statistical Parameters
            </h3>

            {/* Standard inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Type I Error (α)</label>
                <input
                  type="number"
                  step="0.005"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.05)}
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">Target Power (1-β)</label>
                <input
                  type="number"
                  step="0.05"
                  value={power}
                  onChange={(e) => setPower(parseFloat(e.target.value) || 0.80)}
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">Allocation Ratio (r)</label>
                <input
                  type="number"
                  step="0.1"
                  value={allocationRatio}
                  onChange={(e) => setAllocationRatio(parseFloat(e.target.value) || 1.0)}
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">Hypothesis</label>
                <select
                  value={alternative}
                  onChange={(e: any) => setAlternative(e.target.value)}
                  className="form-input"
                >
                  <option value="two-sided">Two-Sided</option>
                  <option value="one-sided">One-Sided</option>
                </select>
              </div>
            </div>

            {/* Continuous Means inputs */}
            {designType === "twoMeans" && (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">Mean Difference (δ)</label>
                  <input
                    type="number"
                    value={meanDiff}
                    onChange={(e) => setMeanDiff(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">Standard Deviation (σ)</label>
                  <input
                    type="number"
                    value={sd}
                    onChange={(e) => setSd(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            )}

            {/* Binary Proportions inputs */}
            {designType === "twoProportions" && (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">Prop. Group 1 (p1)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={p1}
                    onChange={(e) => setP1(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">Prop. Group 2 (p2)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={p2}
                    onChange={(e) => setP2(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            )}

            {/* Survival inputs */}
            {designType === "survival" && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">Hazard Ratio (HR)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={hr}
                    onChange={(e) => setHr(parseFloat(e.target.value) || 0.65)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Event Rate G1 (pE1)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={pEvent1}
                    onChange={(e) => setPEvent1(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Event Rate G2 (pE2)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={pEvent2}
                    onChange={(e) => setPEvent2(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Non-inferiority inputs */}
            {designType === "nonInferiority" && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">True Diff (δ)</label>
                  <input
                    type="number"
                    value={meanDiff}
                    onChange={(e) => setMeanDiff(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">NI Margin (Δ)</label>
                  <input
                    type="number"
                    value={niMargin}
                    onChange={(e) => setNiMargin(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">SD (σ)</label>
                  <input
                    type="number"
                    value={sd}
                    onChange={(e) => setSd(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Equivalence inputs */}
            {designType === "equivalence" && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">True Diff (δ)</label>
                  <input
                    type="number"
                    value={meanDiff}
                    onChange={(e) => setMeanDiff(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">EQ Margin (Δ)</label>
                  <input
                    type="number"
                    value={eqMargin}
                    onChange={(e) => setEqMargin(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">SD (σ)</label>
                  <input
                    type="number"
                    value={sd}
                    onChange={(e) => setSd(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Bioequivalence inputs */}
            {designType === "bioequivalence" && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200">
                <div>
                  <label className="form-label">Intra-subject CV</label>
                  <input
                    type="number"
                    step="0.01"
                    value={beCV}
                    onChange={(e) => setBeCV(parseFloat(e.target.value) || 0.22)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Expected GMR</label>
                  <input
                    type="number"
                    step="0.01"
                    value={beGMR}
                    onChange={(e) => setBeGMR(parseFloat(e.target.value) || 0.95)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Study Design</label>
                  <select
                    value={beDesign}
                    onChange={(e: any) => setBeDesign(e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="crossover_2x2">2x2 Crossover</option>
                    <option value="replicate_2x3">2x3 Replicate (TRT/RTR)</option>
                    <option value="replicate_2x4">2x4 Replicate (TRTR/RTRT)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Cluster Adjustments */}
          <div className="glass-panel p-5 space-y-4 select-none">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
                <Layers size={16} className="text-brand-500" />
                Cluster Randomized Adjustments
              </h3>
              <input
                type="checkbox"
                checked={useCluster}
                onChange={(e) => setUseCluster(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-brand-500 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
            </div>

            {useCluster && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="form-label text-[10px]">Average Cluster Size (m)</label>
                  <input
                    type="number"
                    value={clusterSize}
                    onChange={(e) => setClusterSize(parseInt(e.target.value) || 1)}
                    className="form-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="form-label text-[10px]">Intracluster Corr (ICC)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={icc}
                    onChange={(e) => setIcc(parseFloat(e.target.value) || 0)}
                    className="form-input font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Group Sequential Adjustments */}
          <div className="glass-panel p-5 space-y-4 select-none">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
                <Award size={16} className="text-brand-500 animate-pulse" />
                Group Sequential Interim Adjustments
              </h3>
              <input
                type="checkbox"
                checked={useSequential}
                onChange={(e) => setUseSequential(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-brand-500 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
            </div>

            {useSequential && (
              <div className="grid grid-cols-2 gap-2 pt-2 animate-in fade-in duration-200">
                <div>
                  <label className="form-label text-[10px]">Planned Interim Reviews</label>
                  <select
                    value={interimAnalyses}
                    onChange={(e) => setInterimAnalyses(parseInt(e.target.value) || 1)}
                    className="form-input text-xs"
                  >
                    <option value="1">1 Interim (2 stages total)</option>
                    <option value="2">2 Interims (3 stages total)</option>
                    <option value="3">3 Interims (4 stages total)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-[10px]">Spending Function</label>
                  <select
                    value={spendingFunction}
                    onChange={(e) => setSpendingFunction(e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="obf">O'Brien-Fleming (LD)</option>
                    <option value="pocock">Pocock (LD)</option>
                    <option value="haybittle">Haybittle-Peto</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Results & Plot */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Outputs Summary Panel */}
          <div className="glass-panel p-5 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 pulse-bg w-40 h-40 bg-brand-500 rounded-full blur-[65px] opacity-10"></div>
            
            {calcError ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-start gap-2 select-text my-auto">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 animate-bounce" />
                <div>
                  <span className="font-bold block">Precondition Violation</span>
                  <span className="leading-relaxed mt-0.5 block">{calcError}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between select-none">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Required Sample Size (N)
                    </span>
                    <span className="text-5xl font-extrabold font-display text-brand-400 mt-2 block">
                      {finalN}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      Target: {percent(power)} Power
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-800/80 light:border-slate-200 pt-4 text-xs select-text">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Cohort A (N1)</span>
                    <span className="font-mono text-slate-200 light:text-slate-800 font-bold mt-0.5 block">{results.n1 || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Cohort B (N2)</span>
                    <span className="font-mono text-slate-200 light:text-slate-800 font-bold mt-0.5 block">{results.n2 || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Standard N</span>
                    <span className="font-mono text-slate-400 font-bold mt-0.5 block">{results.totalN || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Multiplier</span>
                    <span className="font-mono text-slate-400 mt-0.5 block font-bold text-brand-400">
                      {useSequential && results.inflationFactor ? `x${results.inflationFactor.toFixed(3)}` : "1.00"}
                    </span>
                  </div>
                </div>

                {useCluster && (
                  <div className="bg-slate-900/40 light:bg-slate-50 p-2.5 rounded-lg border border-slate-880 text-xs mt-3 flex justify-between items-center text-slate-400 select-text">
                    <span>Design Effect Factor (DE): <span className="font-mono text-slate-200 light:text-slate-800 font-bold">{results.designEffect?.toFixed(3)}</span></span>
                    <span>Clusters Required: <span className="font-mono text-brand-400 font-bold">{results.clustersRequired}</span></span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Group Sequential boundaries table if active */}
          {useSequential && (
            <div className="glass-panel p-5 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              <span className="text-[10.5px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-1.5 select-none">
                <TrendingUp size={14} className="text-brand-500" />
                Lan-DeMets Alpha Spending Boundary Matrix
              </span>
              
              <div className="divide-y divide-slate-850 text-[11px] select-text">
                <div className="grid grid-cols-4 py-2 font-bold text-slate-500 uppercase tracking-wider text-[9px] select-none">
                  <span>Stage (Interim)</span>
                  <span className="text-center">Info Fraction</span>
                  <span className="text-right">Z-Boundary (Cutoff)</span>
                  <span className="text-right">Cumulative Alpha Spent</span>
                </div>
                {boundariesList.map(bound => (
                  <div key={bound.stage} className="grid grid-cols-4 py-2 hover:bg-slate-900/10">
                    <span className="font-semibold text-slate-200">Stage {bound.stage} {bound.stage === stagesCount ? "(Final)" : `(Interim ${bound.stage})`}</span>
                    <span className="text-center font-mono text-slate-400">{(bound.infoFraction * 100).toFixed(0)}%</span>
                    <span className="text-right font-mono font-bold text-brand-450">{bound.zBoundary}</span>
                    <span className="text-right font-mono text-emerald-450 font-bold">{bound.alphaSpent.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sensitivity plot / line chart */}
          {sensData.length > 0 && !useSequential && (
            <div className="glass-panel p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-500 animate-pulse" />
                Sample Size Sensitivity Power Curve
              </h3>

              <div className="h-[240px] w-full mt-4 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sensData}
                    margin={{ top: 10, right: 30, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="Sample Size"
                      stroke="#475569"
                      label={{ value: "Total Sample Size (N)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                      stroke="#475569"
                      label={{ value: "Power (1 - Beta)", angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, "Statistical Power"]}
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Statistical Power"
                      stroke="#4d75ff"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <ReferenceDot
                      x={results.totalN}
                      y={power}
                      r={5}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[10px] text-slate-500 text-center italic select-none">
                Green dot highlights target boundary: <span className="font-mono text-emerald-400 font-semibold">{results.totalN} subjects</span> yields <span className="font-mono text-emerald-400 font-semibold">{percent(power)} power</span>.
              </div>
            </div>
          )}

          {designType === "bioequivalence" && (
            <div className="glass-panel p-5 space-y-4 animate-in slide-in-from-bottom duration-250">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-500" />
                Bioequivalence GMR vs Intra-subject CV Sizing Matrix (N)
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Calculated total sample sizes (N) to achieve at least {percent(power)} power at 5% alpha. Values are rounded to sequence-balanced multiples of 2.
              </p>
              
              <div className="overflow-x-auto border border-slate-850 rounded-xl">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-350 uppercase tracking-wider font-semibold border-b border-slate-850 select-none font-bold">
                      <th className="p-2 text-left bg-slate-900/30">CV \ GMR</th>
                      {[0.90, 0.92, 0.95, 0.98, 1.00, 1.02, 1.05].map(g => (
                        <th key={g} className="p-2 font-mono">{(g * 100).toFixed(0)}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/40 text-slate-300 font-mono text-[11px]">
                    {[0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40].map(cv => (
                      <tr key={cv} className="hover:bg-slate-900/10">
                        <td className="p-2 text-left font-bold bg-slate-900/20 text-slate-400">{(cv * 100).toFixed(0)}% CV</td>
                        {[0.90, 0.92, 0.95, 0.98, 1.00, 1.02, 1.05].map(gmr => {
                          const solved = sampleSizeMath.calculateBioequivalenceTOST({
                            cv,
                            gmr,
                            alpha: 0.05,
                            power,
                            design: beDesign as any
                          });
                          const isCurrent = Math.abs(cv - beCV) < 0.015 && Math.abs(gmr - beGMR) < 0.015;
                          
                          return (
                            <td 
                              key={gmr} 
                              className={`p-2 ${isCurrent ? "bg-brand-500/15 font-extrabold text-brand-400 border border-brand-500/25" : ""}`}
                            >
                              {solved.n}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CDSCO / FDA Regulatory Guides */}
              <div className="p-4 bg-slate-900/35 border border-slate-850 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                  <ShieldAlert size={14} className="text-brand-500" />
                  FDA / EMA / CDSCO Regulatory Sizing Guidance
                </h4>
                <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1 leading-relaxed">
                  <li>
                    <strong className="text-slate-300">Narrow Therapeutic Index Drugs (NTID):</strong> FDA and EMA guidelines recommend a tighter bioequivalence limit (<span className="text-brand-400 font-bold">90.00% - 111.11%</span>) for drugs like Warfarin or Digoxin, which requires substantially higher sample sizes.
                  </li>
                  <li>
                    <strong className="text-slate-300">Reference Scaled Average Bioequivalence (RSABE):</strong> For highly variable drugs (<span className="text-slate-300">CV &ge; 30%</span>), scaling bounds based on reference variance allows wider bioequivalence limits (up to <span className="text-brand-400 font-bold">69.84% - 143.19%</span>), which dramatically reduces required N.
                  </li>
                  <li>
                    <strong className="text-slate-300">Drop-out Inflation:</strong> CDSCO/EMA guidelines require inflating sample sizes by <span className="text-brand-400 font-bold">10% - 20%</span> to account for subject withdrawals, ensuring the study does not lose statistical power (e.g. at 15% drop-out, final N should be: <span className="text-brand-400 font-mono font-bold">{Math.ceil(finalN / 0.85)}</span>).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Formula transparency */}
          <FormulaTransparency
            formulaName={mathName}
            formula={
              designType === "twoMeans"
                ? "N_1 = \\frac{(r+1) (Z_{1-\\alpha/2} + Z_{1-\\beta})^2 \\sigma^2}{r \\delta^2}"
                : designType === "twoProportions"
                ? "N_1 = \\frac{\\left(Z_{1-\\alpha/2}\\sqrt{(r+1)\\bar{p}(1-\\bar{p})} + Z_{1-\\beta}\\sqrt{r p_1(1-p_1) + p_2(1-p_2)}\\right)^2}{r (p_1 - p_2)^2}"
                : designType === "survival"
                ? "E = \\frac{(r+1)^2 (Z_{1-\\alpha/2} + Z_{1-\\beta})^2}{r (\\ln(\\text{HR}))^2}"
                : designType === "bioequivalence"
                ? "\\text{Power} = 2 \\cdot \\Phi\\left( \\frac{\\ln(1.25) - |\\ln(\\text{GMR})|}{s_w \\sqrt{m/N}} - Z_{1-\\alpha} \\right) - 1"
                : "N_1 = \\frac{(r+1) (Z_{1-\\alpha} + Z_{1-\\beta})^2 \\sigma^2}{r (\\delta - \\Delta)^2}"
            }
            variables={[
              { symbol: "Z_1-alpha/2", definition: "Normal standard critical boundary for Type I error (e.g. 1.96 for 5% two-sided)" },
              { symbol: "Z_1-beta", definition: "Normal standard critical boundary for power (e.g. 0.84 for 80% power)" },
              { symbol: "r", definition: "Allocation ratio of subjects (N2 / N1, typically 1.0)" },
              { symbol: "delta / HR", definition: "Expected clinical difference or Hazard Ratio respectively" }
            ]}
            assumptions="Assumes random group allocation, representative trial population, and steady drop-out rates."
            limitations="Assumes constant event rates and proportional hazards across follow-up in survival designs."
            references={[
              "Chow, S. C., Shao, J., & Wang, H. (2017). Sample Size Calculations in Clinical Research. CRC Press.",
              "Lan, K. K., & DeMets, D. L. (1983). Discrete sequential boundaries for clinical trials. Biometrika, 70(3), 659-663."
            ]}
            validationAgainst={["R gsDesign", "PASS 2026", "SAS PROC POWER", "SciPy statsmodels.stats.power"]}
          />
        </div>
      </div>
    </div>
  );
}
