/**
 * Biostateer™ Clinical Research Intelligence Platform
 * Mathematical Validation Suite — Pharmacokinetics (PK NCA)
 * 
 * Directly imports and invokes the production computeNCA engine from PKAnalysisHub.tsx
 * to validate computed NCA values against Phoenix WinNonlin references.
 */

import { computeNCA } from "../../modules/PKAnalysisHub";
import type { PKProfile } from "../../modules/PKAnalysisHub";

export interface PKValidationResult {
  name: string;
  parameter: string;
  expected: number;
  observed: number;
  delta: number;
  tolerance: number;
  status: "PASS" | "WARNING" | "FAIL";
}

export function runPKValidation(): PKValidationResult[] {
  const results: PKValidationResult[] = [];

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

  // --- Benchmark Dataset 1: Standard Oral 500mg (Phoenix WinNonlin SAD Cohort A) ---
  const dataset1: PKProfile[] = [
    { time: 0, concentration: 0 },
    { time: 0.5, concentration: 12.4 },
    { time: 1, concentration: 24.8 },
    { time: 2, concentration: 45.2 },
    { time: 4, concentration: 32.1 },
    { time: 6, concentration: 18.5 },
    { time: 8, concentration: 9.6 },
    { time: 12, concentration: 3.4 },
    { time: 16, concentration: 1.1 },
    { time: 24, concentration: 0.2 }
  ];

  const nca1 = computeNCA(dataset1, 500);

  addTest("Oral SAD Cohort A (500mg)", "Cmax", 45.20, nca1.cmax);
  addTest("Oral SAD Cohort A (500mg)", "Tmax", 2.00, nca1.tmax);
  addTest("Oral SAD Cohort A (500mg)", "AUC(0-t)", 236.713757, nca1.auc0t, 1e-4);
  addTest("Oral SAD Cohort A (500mg)", "Kel (Lambda-z)", 0.255874, nca1.lambdaZ, 1e-4);
  addTest("Oral SAD Cohort A (500mg)", "T1/2 (Half-life)", 2.708944, nca1.halfLife, 1e-4);
  addTest("Oral SAD Cohort A (500mg)", "AUC(0-inf)", 237.495393, nca1.auc0inf, 1e-4);
  addTest("Oral SAD Cohort A (500mg)", "Adjusted R² Terminal Fit", 0.993811, nca1.rSquared, 1e-4);

  // --- Benchmark Dataset 2: SAD Cohort B (IV Infusion 250mg) ---
  const dataset2: PKProfile[] = [
    { time: 0, concentration: 0 },
    { time: 1, concentration: 85.2 },
    { time: 2, concentration: 120.4 },
    { time: 3, concentration: 95.8 },
    { time: 4, concentration: 68.2 },
    { time: 6, concentration: 35.1 },
    { time: 8, concentration: 18.0 },
    { time: 12, concentration: 4.8 },
    { time: 24, concentration: 0.3 }
  ];

  const nca2 = computeNCA(dataset2, 250);

  addTest("IV SAD Cohort B (250mg)", "Cmax", 120.40, nca2.cmax);
  addTest("IV SAD Cohort B (250mg)", "Tmax", 2.00, nca2.tmax);
  addTest("IV SAD Cohort B (250mg)", "AUC(0-t)", 544.547974, nca2.auc0t, 1e-4);
  addTest("IV SAD Cohort B (250mg)", "Kel (Lambda-z)", 0.274147, nca2.lambdaZ, 1e-4);
  addTest("IV SAD Cohort B (250mg)", "T1/2 (Half-life)", 2.528382, nca2.halfLife, 1e-4);
  addTest("IV SAD Cohort B (250mg)", "AUC(0-inf)", 545.642279, nca2.auc0inf, 1e-4);

  return results;
}
