/**
 * Biostateer™ Clinical Research Intelligence Platform
 * Mathematical Validation Suite — Statistical Engines
 * 
 * Verifies parametric (Welch t-test, ANOVA), non-parametric (Mann-Whitney U),
 * correlations, linear regression, and survival analysis models against R, SAS, and SciPy.
 * Targets absolute error <= 1e-9 (Tolerance <= 1e-9).
 */

import { runValidationSuite } from "../validationSuite";
import type { ValidationSummary } from "../validationSuite";

export interface StatValidationResult {
  name: string;
  category: string;
  parameter: string;
  expected: number;
  observed: number;
  delta: number;
  tolerance: number;
  status: "PASS" | "WARNING" | "FAIL";
}

export function runStatisticsValidation(): StatValidationResult[] {
  const results: StatValidationResult[] = [];
  
  // Run the core built-in validation suite and map results
  const summary: ValidationSummary = runValidationSuite();

  summary.logs.forEach((log) => {
    results.push({
      name: log.name,
      category: log.category,
      parameter: log.metricTested,
      expected: log.referenceVal,
      observed: log.engineVal,
      delta: log.difference,
      tolerance: log.tolerance,
      status: log.status === "PASSED" ? "PASS" : "FAIL"
    });
  });

  return results;
}
