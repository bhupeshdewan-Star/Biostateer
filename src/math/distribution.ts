/**
 * Biostateer™ High-Precision Mathematical & Distribution Library
 * 
 * Provides rigorous, high-precision mathematical approximations for:
 * - Normal Distribution CDF & Inverse CDF (PPF)
 * - Student's t-Distribution CDF & Inverse CDF (PPF)
 * - Chi-Square Distribution CDF
 * - F-Distribution CDF
 * 
 * Targets 99.99%+ validation accuracy against standard packages (R / SciPy).
 */

// --- 1. Basic Mathematical Helpers & Special Functions ---

/**
 * High-precision Error Function approximation (Abramowitz and Stegun 7.1.26)
 * Maximum error is less than 1.5e-7.
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Complementary Error Function
 */
export function erfc(x: number): number {
  return 1.0 - erf(x);
}

/**
 * Logarithm of the Gamma Function (Lanczos Approximation)
 * Extremely precise calculation of ln(Gamma(z)).
 */
export function logGamma(z: number): number {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019571e-6,
    1.5056327351493116e-7
  ];
  const g = 7;
  
  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1);
  }
  
  const t = z + g + 0.5;
  return Math.log(Math.sqrt(2 * Math.PI)) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/**
 * Gamma Function
 */
export function gamma(z: number): number {
  return Math.exp(logGamma(z));
}

/**
 * Regularized Lower Incomplete Gamma Function: P(a, x) = gamma(a, x) / Gamma(a)
 * Uses Series Expansion for x < a + 1 and Continued Fraction for x >= a + 1.
 */
export function regularizedGammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  
  const gln = logGamma(a);
  
  if (x < a + 1.0) {
    // Series expansion
    let ap = a;
    let sum = 1.0 / a;
    let del = sum;
    
    for (let n = 1; n <= 100; n++) {
      ap += 1;
      del = (del * x) / ap;
      sum += del;
      if (Math.abs(del) < sum * 1e-12) {
        return sum * Math.exp(-x + a * Math.log(x) - gln);
      }
    }
    return sum * Math.exp(-x + a * Math.log(x) - gln);
  } else {
    // Continued fraction (Lentz's method)
    let b = x + 1.0 - a;
    let c = 1.0 / 1e-30;
    let d = 1.0 / b;
    let h = d;
    
    for (let an = 1; an <= 100; an++) {
      const temp = -an * (an - a);
      b += 2.0;
      d = b + temp * d;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + temp / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1.0 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1.0) < 1e-12) {
        break;
      }
    }
    return 1.0 - h * Math.exp(-x + a * Math.log(x) - gln);
  }
}

/**
 * Regularized Lower Incomplete Beta Function: I_x(a, b)
 * Evaluated using continued fraction representation with Lentz's method (CodePlea / NR-aligned).
 */
export function regularizedBetaI(x: number, a: number, b: number): number {
  if (x < 0.0 || x > 1.0) throw new Error("x must be between 0 and 1 in regularizedBetaI");
  if (x === 0.0) return 0.0;
  if (x === 1.0) return 1.0;

  if (x > (a + 1.0) / (a + b + 2.0)) {
    return 1.0 - regularizedBetaI(1.0 - x, b, a);
  }

  const TINY = 1.0e-30;
  const lbeta_ab = logGamma(a) + logGamma(b) - logGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1.0 - x) * b - lbeta_ab) / a;

  let f = 1.0, c = 1.0, d = 0.0;

  for (let i = 0; i <= 200; ++i) {
    const m = Math.floor(i / 2);
    let numerator = 0.0;
    if (i === 0) {
      numerator = 1.0;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2.0 * m - 1.0) * (a + 2.0 * m));
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2.0 * m) * (a + 2.0 * m + 1.0));
    }

    d = 1.0 + numerator * d;
    if (Math.abs(d) < TINY) d = TINY;
    d = 1.0 / d;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < TINY) c = TINY;

    const cd = c * d;
    f *= cd;

    if (Math.abs(1.0 - cd) < 1.0e-15) {
      return front * (f - 1.0);
    }
  }

  return front * (f - 1.0);
}

// --- 2. Standard Statistical Distributions ---

/**
 * Normal Distribution Cumulative Distribution Function (CDF)
 * Calculates P(X <= x) for N(mean, sd).
 */
export function normalCDF(x: number, mean = 0, sd = 1): number {
  return 0.5 * (1.0 + erf((x - mean) / (sd * Math.sqrt(2.0))));
}

/**
 * Normal Distribution Percent Point Function (PPF / Inverse CDF)
 * Uses Acklam's high-precision rational approximation (precision relative error < 1.15e-9).
 */
export function normalPPF(p: number, mean = 0, sd = 1): number {
  if (p <= 0.0 || p >= 1.0) {
    throw new Error("p must be strictly between 0 and 1");
  }

  // Coefficients for the rational approximation
  const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;

  const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
  const b4 = 66.8013118877197, b5 = -13.2806815528857;

  const c1 = -0.00778489400243029, c2 = -0.322396458041136, c3 = -2.40075827716184;
  const c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;

  const d1 = 0.00778469570904146, d2 = 0.32246712907004, d3 = 2.445134137143;
  const d4 = 3.75440866190742;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q, r, z;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    z = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    z = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    z = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
         ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return mean + z * sd;
}

/**
 * Student's t-Distribution Cumulative Distribution Function (CDF)
 * Calculates P(T <= t) for specified degrees of freedom df.
 */
export function studentTCDF(t: number, df: number): number {
  if (df <= 0) throw new Error("Degrees of freedom must be greater than 0");
  if (t === 0) return 0.5;

  const x = df / (df + t * t);
  const prob = 0.5 * regularizedBetaI(x, 0.5 * df, 0.5);

  return t < 0 ? prob : 1.0 - prob;
}

/**
 * Student's t-Distribution PPF (Inverse CDF)
 * Solves T for a given cumulative probability p and degrees of freedom df
 * using numerical Newton-Raphson refinement on top of Cornish-Fisher asymptotic formula.
 */
export function studentTPPF(p: number, df: number): number {
  if (p <= 0.0 || p >= 1.0) throw new Error("p must be between 0 and 1");
  if (df <= 0) throw new Error("df must be > 0");

  if (p === 0.5) return 0.0;

  const z = normalPPF(p);
  const z2 = z * z;
  const z4 = z2 * z2;

  let t = z + (z * (z2 + 1.0)) / (4.0 * df) 
            + (z * (5.0 * z4 + 16.0 * z2 + 3.0)) / (96.0 * df * df)
            + (z * (3.0 * z4 * z2 + 19.0 * z4 + 17.0 * z2 - 15.0)) / (384.0 * df * df * df);

  for (let i = 0; i < 15; i++) {
    const currentP = studentTCDF(t, df);
    const lnPDF = logGamma((df + 1.0) / 2.0) - logGamma(df / 2.0) 
                  - 0.5 * Math.log(df * Math.PI) - ((df + 1.0) / 2.0) * Math.log(1.0 + (t * t) / df);
    const pdf = Math.exp(lnPDF);
    
    const diff = currentP - p;
    if (Math.abs(diff) < 1e-12) break;
    t = t - diff / pdf;
  }

  return t;
}

/**
 * Chi-Square Distribution Cumulative Distribution Function (CDF)
 * Calculates P(X^2 <= x) for degrees of freedom df.
 */
export function chiSquareCDF(x: number, df: number): number {
  if (df <= 0) throw new Error("Degrees of freedom must be greater than 0");
  if (x <= 0) return 0.0;
  
  return regularizedGammaP(df / 2.0, x / 2.0);
}

/**
 * Chi-Square Distribution PPF (Inverse CDF)
 * Solves X^2 for p and df using Newton-Raphson solver.
 */
export function chiSquarePPF(p: number, df: number): number {
  if (p <= 0.0 || p >= 1.0) throw new Error("p must be between 0 and 1");
  if (df <= 0) throw new Error("df must be > 0");

  // Initial estimate using Wilson-Hilferty transformation
  const z = normalPPF(p);
  const term = 2.0 / (9.0 * df);
  let x = df * Math.pow(1.0 - term + z * Math.sqrt(term), 3);
  if (x < 0) x = 0.001;

  // Newton-Raphson refinement
  for (let i = 0; i < 15; i++) {
    const currentP = chiSquareCDF(x, df);
    const lnPDF = -logGamma(df / 2.0) - (df / 2.0) * Math.log(2.0) + (df / 2.0 - 1.0) * Math.log(x) - x / 2.0;
    const pdf = Math.exp(lnPDF);

    const diff = currentP - p;
    if (Math.abs(diff) < 1e-12) break;
    x = x - diff / pdf;
    if (x <= 0) x = 1e-8;
  }

  return x;
}

/**
 * F-Distribution Cumulative Distribution Function (CDF)
 * Calculates P(F <= f) for numerator df1 and denominator df2 degrees of freedom.
 */
export function fCDF(f: number, df1: number, df2: number): number {
  if (df1 <= 0 || df2 <= 0) throw new Error("Degrees of freedom must be greater than 0");
  if (f <= 0) return 0.0;

  const x = (df1 * f) / (df1 * f + df2);
  return regularizedBetaI(x, df1 / 2.0, df2 / 2.0);
}

/**
 * F-Distribution PPF (Inverse CDF)
 * Solves F for p and df1, df2 using Newton-Raphson solver.
 */
export function fPPF(p: number, df1: number, df2: number): number {
  if (p <= 0.0 || p >= 1.0) throw new Error("p must be between 0 and 1");
  if (df1 <= 0 || df2 <= 0) throw new Error("df must be > 0");

  // Initial approximation
  const z = normalPPF(p);
  const g1 = 2.0 / (9.0 * df1);
  const g2 = 2.0 / (9.0 * df2);
  const num = 1.0 - g1;
  const den = 1.0 - g2;
  const val = num * num + g1 * z * z; // Cornish-Fisher like approximation
  let f = (num / den) * Math.pow((1.0 - g2 + z * Math.sqrt(g1 + g2 - g1 * g2 * z * z)) / den, 3); // initial
  if (isNaN(f) || f <= 0) f = 1.0;

  // Newton-Raphson refinement
  for (let i = 0; i < 15; i++) {
    const currentP = fCDF(f, df1, df2);
    // Exact F-density
    const betaTerm = logGamma(df1 / 2.0) + logGamma(df2 / 2.0) - logGamma((df1 + df2) / 2.0);
    const lnPDF = (df1 / 2.0) * Math.log(df1) + (df2 / 2.0) * Math.log(df2) 
                  - betaTerm + (df1 / 2.0 - 1.0) * Math.log(f) 
                  - ((df1 + df2) / 2.0) * Math.log(df1 * f + df2);
    const pdf = Math.exp(lnPDF);

    const diff = currentP - p;
    if (Math.abs(diff) < 1e-12) break;
    f = f - diff / pdf;
    if (f <= 0) f = 1e-8;
  }

  return f;
}
