/**
 * Biostateer™ Clinical Research Intelligence Platform
 * Mathematical Validation Suite — Bioequivalence (BE TOST)
 * 
 * Directly imports and invokes the production computeTOST engine from BioequivalenceHub.tsx
 * to validate computed bioequivalence outputs against USFDA guidance benchmarks.
 */

import { computeTOST } from "../../modules/BioequivalenceHub";

export interface BEValidationResult {
  name: string;
  parameter: string;
  expected: number;
  observed: number;
  delta: number;
  tolerance: number;
  status: "PASS" | "WARNING" | "FAIL";
}

export function runBEValidation(): BEValidationResult[] {
  const results: BEValidationResult[] = [];

  const addTest = (
    name: string,
    param: string,
    expected: number,
    observed: number,
    tolerance = 1e-9
  ) => {
    const delta = Math.abs(expected - observed);
    let status: "PASS" | "WARNING" | "FAIL" = "FAIL";
    if (delta <= tolerance) {
      status = "PASS";
    } else if (delta <= 1e-4) {
      status = "WARNING";
    }
    results.push({ name, parameter: param, expected, observed, delta, tolerance, status });
  };

  // --- Benchmark Dataset 1: Standard 2x2 Crossover (USFDA Bioequivalence template) ---
  // CV = 24%, GMR = 0.98, N = 24
  const tost1 = computeTOST("crossover2x2", 0.98, 24, 24, false, "USFDA");

  addTest("USFDA 2x2 Crossover", "Degrees of Freedom", 22.0, tost1.df);
  addTest("USFDA 2x2 Crossover", "t-critical (1-sided)", 1.717144, tost1.tCrit, 1e-6);
  addTest("USFDA 2x2 Crossover", "90% CI Lower Bound", 0.871527, tost1.ciLower, 1e-5);
  addTest("USFDA 2x2 Crossover", "90% CI Upper Bound", 1.101974, tost1.ciUpper, 1e-5);

  // --- Benchmark Dataset 2: Replicate Crossover with RSABE Scaled bounds ---
  // CV = 38% (Highly Variable), GMR = 1.02, N = 32
  const tost2 = computeTOST("replicate2x4", 1.02, 38, 32, false, "EMA");

  addTest("RSABE Scaling (CV=38%)", "Within-subject SD", 0.367261, tost2.sWr, 1e-5);
  addTest("RSABE Scaling (CV=38%)", "Scaled Lower Limit", 0.720389, tost2.scaledLower, 1e-5);
  addTest("RSABE Scaling (CV=38%)", "Scaled Upper Limit", 1.388139, tost2.scaledUpper, 1e-5);

  return results;
}
