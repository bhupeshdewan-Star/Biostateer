# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Non-compartmental Pharmacokinetics (NCA) Guide

---

### 1. NCA Integrals & Mathematical Definitions
Non-compartmental analysis (NCA) calculates drug exposure profiles without assuming compartmental models:
* **Linear-Log Trapezoidal Rule**: 
  * Linear trapezoidal method is applied during the absorption phase (when concentration is increasing, $C_{i} \ge C_{i-1}$):
    $$AUC_{i-1 \to i} = \frac{C_{i-1} + C_i}{2} \cdot (t_i - t_{i-1})$$
  * Log-linear trapezoidal method is applied during the elimination phase (when concentration is decreasing, $C_i < C_{i-1}$):
    $$AUC_{i-1 \to i} = \frac{C_{i-1} - C_i}{\ln(C_{i-1} / C_i)} \cdot (t_i - t_{i-1})$$
* **Area Under the Concentration-Time Curve ($AUC_{0-t}$)**: Sum of all trapezoids from $t_0$ to the last measurable time $t_{last}$.
* **Extrapolated Area ($AUC_{0-\infty}$)**:
    $$AUC_{0-\infty} = AUC_{0-t} + \frac{C_{last}}{K_{el}}$$
    Where $K_{el}$ is the terminal elimination rate constant, calculated via ordinary least squares (OLS) linear regression of the log-transformed terminal concentrations.

---

### 2. Clearance and Volume of Distribution
* **Terminal Half-life ($t_{1/2}$)**:
  $$t_{1/2} = \frac{\ln(2)}{K_{el}}$$
* **Apparent Clearance ($CL/F$)**:
  $$CL/F = \frac{\text{Dose}}{AUC_{0-\infty}}$$
* **Apparent Volume of Distribution ($V_z/F$)**:
  $$V_z/F = \frac{CL/F}{K_{el}}$$
* **Mean Residence Time ($MRT$)**:
  $$MRT = \frac{AUMC_{0-\infty}}{AUC_{0-\infty}}$$
  Where $AUMC_{0-\infty}$ is the area under the first moment curve.
