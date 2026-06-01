/**
 * Biostateer™ High-Precision Clinical Trial Sample Size & Power Engine
 * 
 * Provides rigorous sample size calculations and power analysis for various study designs,
 * supporting bidirectional solving (solving for N given Power, or solving for Power given N).
 */

import { normalCDF, normalPPF } from "./distribution";

// --- 1. Continuous Outcomes ---

/**
 * Calculates sample size or power for a One-Sample Mean design.
 */
export function calculateOneMean({
  meanDiff,
  sd,
  alpha = 0.05,
  power = 0.80,
  n = null,
  alternative = "two-sided"
}: {
  meanDiff: number;
  sd: number;
  alpha?: number;
  power?: number;
  n?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  const zAlpha = normalPPF(alternative === "two-sided" ? 1.0 - alpha / 2.0 : 1.0 - alpha);
  const delta = Math.abs(meanDiff);

  if (n === null) {
    // Solve for N
    const zBeta = normalPPF(power!);
    const val = ((zAlpha + zBeta) * sd) / delta;
    const computedN = Math.ceil(val * val);
    return { n: computedN, power };
  } else {
    // Solve for Power
    const zBeta = (delta * Math.sqrt(n)) / sd - zAlpha;
    const computedPower = normalCDF(zBeta);
    return { n, power: computedPower };
  }
}

/**
 * Calculates sample size or power for an Independent Two-Sample Means design.
 * Supports custom allocation ratio (r = n2 / n1).
 */
export function calculateTwoMeans({
  meanDiff,
  sd,
  alpha = 0.05,
  power = 0.80,
  allocationRatio = 1.0,
  n1 = null,
  alternative = "two-sided"
}: {
  meanDiff: number;
  sd: number;
  alpha?: number;
  power?: number;
  allocationRatio?: number;
  n1?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  const zAlpha = normalPPF(alternative === "two-sided" ? 1.0 - alpha / 2.0 : 1.0 - alpha);
  const delta = Math.abs(meanDiff);
  const r = allocationRatio;

  if (n1 === null) {
    // Solve for N1
    const zBeta = normalPPF(power!);
    const val = (zAlpha + zBeta) * sd;
    const n1Raw = ((r + 1.0) * (val * val)) / (r * delta * delta);
    const computedN1 = Math.ceil(n1Raw);
    const computedN2 = Math.ceil(computedN1 * r);
    return { n1: computedN1, n2: computedN2, totalN: computedN1 + computedN2, power };
  } else {
    // Solve for Power
    const zBeta = Math.sqrt((r * n1 * delta * delta) / ((r + 1.0) * sd * sd)) - zAlpha;
    const computedPower = normalCDF(zBeta);
    const computedN2 = Math.ceil(n1 * r);
    return { n1, n2: computedN2, totalN: n1 + computedN2, power: computedPower };
  }
}

/**
 * Calculates sample size or power for a Paired Means design.
 */
export function calculatePairedMeans({
  meanDiff,
  sdDiff,
  alpha = 0.05,
  power = 0.80,
  n = null,
  alternative = "two-sided"
}: {
  meanDiff: number;
  sdDiff: number;
  alpha?: number;
  power?: number;
  n?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  return calculateOneMean({
    meanDiff,
    sd: sdDiff,
    alpha,
    power,
    n,
    alternative
  });
}


// --- 2. Binary Outcomes ---

/**
 * Calculates sample size or power for a One-Sample Proportion design.
 */
export function calculateOneProportion({
  p0,
  p1,
  alpha = 0.05,
  power = 0.80,
  n = null,
  alternative = "two-sided"
}: {
  p0: number;
  p1: number;
  alpha?: number;
  power?: number;
  n?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  const zAlpha = normalPPF(alternative === "two-sided" ? 1.0 - alpha / 2.0 : 1.0 - alpha);
  const diff = Math.abs(p1 - p0);

  if (n === null) {
    // Solve for N (Standard Wald formula with different variance assumptions under null and alternative)
    const zBeta = normalPPF(power!);
    const num = zAlpha * Math.sqrt(p0 * (1.0 - p0)) + zBeta * Math.sqrt(p1 * (1.0 - p1));
    const computedN = Math.ceil((num * num) / (diff * diff));
    return { n: computedN, power };
  } else {
    // Solve for Power
    const num = diff * Math.sqrt(n) - zAlpha * Math.sqrt(p0 * (1.0 - p0));
    const zBeta = num / Math.sqrt(p1 * (1.0 - p1));
    const computedPower = normalCDF(zBeta);
    return { n, power: computedPower };
  }
}

/**
 * Calculates sample size or power for a Two-Sample Proportions design.
 * Uses Fleiss/standard formula (uncorrected).
 */
export function calculateTwoProportions({
  p1,
  p2,
  alpha = 0.05,
  power = 0.80,
  allocationRatio = 1.0,
  n1 = null,
  alternative = "two-sided"
}: {
  p1: number;
  p2: number;
  alpha?: number;
  power?: number;
  allocationRatio?: number;
  n1?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  const zAlpha = normalPPF(alternative === "two-sided" ? 1.0 - alpha / 2.0 : 1.0 - alpha);
  const r = allocationRatio;
  const diff = Math.abs(p1 - p2);

  // Mean proportion
  const pBar = (p1 + r * p2) / (r + 1.0);
  const qBar = 1.0 - pBar;

  if (n1 === null) {
    // Solve for N1
    const zBeta = normalPPF(power!);
    const num = zAlpha * Math.sqrt((r + 1.0) * pBar * qBar) + zBeta * Math.sqrt(r * p1 * (1.0 - p1) + p2 * (1.0 - p2));
    const n1Raw = (num * num) / (r * diff * diff);
    const computedN1 = Math.ceil(n1Raw);
    const computedN2 = Math.ceil(computedN1 * r);
    return { n1: computedN1, n2: computedN2, totalN: computedN1 + computedN2, power };
  } else {
    // Solve for Power
    const num = diff * Math.sqrt(r * n1) - zAlpha * Math.sqrt((r + 1.0) * pBar * qBar);
    const zBeta = num / Math.sqrt(r * p1 * (1.0 - p1) + p2 * (1.0 - p2));
    const computedPower = normalCDF(zBeta);
    const computedN2 = Math.ceil(n1 * r);
    return { n1, n2: computedN2, totalN: n1 + computedN2, power: computedPower };
  }
}


// --- 3. Survival Outcomes ---

/**
 * Calculates number of events and sample size for Survival Outcomes (Log-Rank test).
 * Uses Schoenfeld's formula.
 */
export function calculateSurvival({
  hazardRatio,
  pEventGroup1,
  pEventGroup2,
  alpha = 0.05,
  power = 0.80,
  allocationRatio = 1.0,
  n1 = null,
  alternative = "two-sided"
}: {
  hazardRatio: number;
  pEventGroup1: number; // expected event probability in Group 1
  pEventGroup2: number; // expected event probability in Group 2
  alpha?: number;
  power?: number;
  allocationRatio?: number;
  n1?: number | null;
  alternative?: "two-sided" | "one-sided";
}) {
  const zAlpha = normalPPF(alternative === "two-sided" ? 1.0 - alpha / 2.0 : 1.0 - alpha);
  const r = allocationRatio;
  const lnHR = Math.log(hazardRatio);

  if (n1 === null) {
    const zBeta = normalPPF(power!);
    // Schoenfeld's required events formula
    const numEvents = Math.ceil(((r + 1.0) * (r + 1.0) * (zAlpha + zBeta) * (zAlpha + zBeta)) / (r * lnHR * lnHR));
    
    // Average event rate
    const pBarEvent = (pEventGroup1 + r * pEventGroup2) / (r + 1.0);
    const totalN = Math.ceil(numEvents / pBarEvent);
    const computedN1 = Math.ceil(totalN / (r + 1.0));
    const computedN2 = Math.ceil(computedN1 * r);

    return {
      eventsRequired: numEvents,
      n1: computedN1,
      n2: computedN2,
      totalN: computedN1 + computedN2,
      power
    };
  } else {
    // Solve for Power
    const pBarEvent = (pEventGroup1 + r * pEventGroup2) / (r + 1.0);
    const totalN = n1 * (r + 1.0);
    const actualEvents = totalN * pBarEvent;
    
    const zBeta = Math.sqrt((actualEvents * r * lnHR * lnHR) / ((r + 1.0) * (r + 1.0))) - zAlpha;
    const computedPower = normalCDF(zBeta);
    const computedN2 = Math.ceil(n1 * r);
    return {
      eventsRequired: Math.ceil(actualEvents),
      n1,
      n2: computedN2,
      totalN: n1 + computedN2,
      power: computedPower
    };
  }
}


// --- 4. Advanced Clinical Trial Designs ---

/**
 * Calculates sample size for a Non-Inferiority Trial (Continuous Endpoint).
 */
export function calculateNonInferiority({
  meanDiff, // expected true difference (Group A - Group B)
  niMargin, // non-inferiority margin (delta_NI, positive boundary)
  sd,
  alpha = 0.025, // non-inferiority is typically 1-sided alpha = 0.025
  power = 0.80,
  allocationRatio = 1.0,
  n1 = null
}: {
  meanDiff: number;
  niMargin: number;
  sd: number;
  alpha?: number;
  power?: number;
  allocationRatio?: number;
  n1?: number | null;
}) {
  const zAlpha = normalPPF(1.0 - alpha); // One-sided alpha
  const r = allocationRatio;
  const denominator = meanDiff - niMargin; // (true difference - margin)

  if (Math.abs(denominator) < 1e-6) throw new Error("Denominator (meanDiff - niMargin) cannot be zero");

  if (n1 === null) {
    const zBeta = normalPPF(power!);
    const val = (zAlpha + zBeta) * sd;
    const n1Raw = ((r + 1.0) * (val * val)) / (r * denominator * denominator);
    const computedN1 = Math.ceil(n1Raw);
    const computedN2 = Math.ceil(computedN1 * r);
    return { n1: computedN1, n2: computedN2, totalN: computedN1 + computedN2, power };
  } else {
    const zBeta = Math.sqrt((r * n1 * denominator * denominator) / ((r + 1.0) * sd * sd)) - zAlpha;
    const computedPower = normalCDF(zBeta);
    const computedN2 = Math.ceil(n1 * r);
    return { n1, n2: computedN2, totalN: n1 + computedN2, power: computedPower };
  }
}

/**
 * Calculates sample size for an Equivalence Trial (Continuous Endpoint, TOST Method).
 */
export function calculateEquivalence({
  meanDiff,
  eqMargin, // equivalence margin (-eqMargin, +eqMargin)
  sd,
  alpha = 0.05, // equivalence is typically two 1-sided tests at alpha = 0.05
  power = 0.80,
  allocationRatio = 1.0,
  n1 = null
}: {
  meanDiff: number;
  eqMargin: number;
  sd: number;
  alpha?: number;
  power?: number;
  allocationRatio?: number;
  n1?: number | null;
}) {
  const zAlpha = normalPPF(1.0 - alpha);
  const r = allocationRatio;
  const delta = Math.abs(meanDiff);
  const margin = Math.abs(eqMargin);

  if (delta >= margin) throw new Error("Expected mean difference must be strictly within the equivalence margin");

  // TOST approximation (solving for N)
  if (n1 === null) {
    const zBeta = normalPPF((power! + 1.0) / 2.0); // conservative approximation for power
    const diff = margin - delta;
    const val = (zAlpha + zBeta) * sd;
    const n1Raw = ((r + 1.0) * (val * val)) / (r * diff * diff);
    const computedN1 = Math.ceil(n1Raw);
    const computedN2 = Math.ceil(computedN1 * r);
    return { n1: computedN1, n2: computedN2, totalN: computedN1 + computedN2, power };
  } else {
    // Solve for Power
    const diff = margin - delta;
    const zBeta = Math.sqrt((r * n1 * diff * diff) / ((r + 1.0) * sd * sd)) - zAlpha;
    const computedPower = 2.0 * normalCDF(zBeta) - 1.0;
    const computedN2 = Math.ceil(n1 * r);
    return { n1, n2: computedN2, totalN: n1 + computedN2, power: Math.max(0, computedPower) };
  }
}

/**
 * Adjusts a standard sample size for a Cluster Randomized Trial.
 * Incorporates Cluster Size (m) and Intracluster Correlation Coefficient (ICC).
 */
export function adjustForCluster({
  standardN,
  averageClusterSize,
  icc
}: {
  standardN: number;
  averageClusterSize: number;
  icc: number;
}) {
  // Design Effect (DE) = 1 + (m - 1) * ICC
  const de = 1.0 + (averageClusterSize - 1.0) * icc;
  const adjustedN = Math.ceil(standardN * de);
  return {
    designEffect: de,
    adjustedN,
    clustersRequired: Math.ceil(adjustedN / averageClusterSize)
  };
}

/**
 * Applies inflation factor for Group Sequential Designs.
 * Incorporates standard O'Brien-Fleming boundary inflation factor depending on number of interim analyses.
 */
export function adjustForGroupSequential({
  standardN,
  interimAnalyses
}: {
  standardN: number;
  interimAnalyses: number;
}) {
  // Standard inflation factors for O'Brien-Fleming boundaries at alpha = 0.05, 80% power:
  // 1 interim (2 stages total): ~1.008
  // 2 interims (3 stages total): ~1.017
  // 3 interims (4 stages total): ~1.024
  // 4+ interims: logarithmic interpolation
  let inflationFactor = 1.0;
  if (interimAnalyses === 1) inflationFactor = 1.008;
  else if (interimAnalyses === 2) inflationFactor = 1.017;
  else if (interimAnalyses === 3) inflationFactor = 1.024;
  else if (interimAnalyses > 3) inflationFactor = 1.024 + 0.005 * Math.log(interimAnalyses - 2);

  const adjustedN = Math.ceil(standardN * inflationFactor);
  return {
    inflationFactor,
    adjustedN
  };
}

export interface BioequivalenceTOSTResult {
  n: number;
  power: number;
  sw: number;
  varianceMultiplier: number;
}

/**
 * Calculates sample size or power for a Bioequivalence Trial using the TOST method.
 * Supports 2x2 Crossover, 2x3 Replicate, and 2x4 Replicate designs.
 */
export function calculateBioequivalenceTOST({
  cv,
  gmr,
  alpha = 0.05,
  power = 0.80,
  design = "crossover_2x2",
  n = null
}: {
  cv: number;
  gmr: number;
  alpha?: number;
  power?: number;
  design?: "crossover_2x2" | "replicate_2x3" | "replicate_2x4";
  n?: number | null;
}): BioequivalenceTOSTResult {
  const theta1 = 0.80;
  const theta2 = 1.25;

  const sw = Math.sqrt(Math.log(cv * cv + 1));
  let varianceMultiplier = 2.0;
  let sequenceCount = 2;

  if (design === "replicate_2x3") {
    varianceMultiplier = 1.5;
    sequenceCount = 2;
  } else if (design === "replicate_2x4") {
    varianceMultiplier = 1.0;
    sequenceCount = 2;
  }

  const delta = Math.abs(Math.log(gmr));
  const limit = Math.log(theta2);
  const zAlpha = normalPPF(1.0 - alpha);

  if (n === null) {
    let currentN = sequenceCount;
    let solvedPower = 0;
    while (currentN < 1000) {
      const se = sw * Math.sqrt(varianceMultiplier / currentN);
      const t1 = (limit - delta) / se - zAlpha;
      const t2 = (limit + delta) / se - zAlpha;
      
      solvedPower = normalCDF(t1) + normalCDF(t2) - 1.0;
      if (solvedPower >= power) {
        break;
      }
      currentN += sequenceCount;
    }
    return { n: currentN, power: Math.max(0, solvedPower), sw, varianceMultiplier };
  } else {
    const se = sw * Math.sqrt(varianceMultiplier / n);
    const t1 = (limit - delta) / se - zAlpha;
    const t2 = (limit + delta) / se - zAlpha;
    const solvedPower = normalCDF(t1) + normalCDF(t2) - 1.0;
    return { n, power: Math.max(0, solvedPower), sw, varianceMultiplier };
  }
}
