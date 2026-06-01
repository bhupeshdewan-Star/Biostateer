# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Bioequivalence Sizing & Scaling Guide

---

### 1. Two One-Sided Tests (TOST) Equivalence
Bioequivalence is established if the 90% confidence interval of the geometric mean ratio (GMR) of Test to Reference parameters (Cmax and AUC) lies completely within the acceptance limits $[80.00\%, 125.00\%]$. The TOST method conducts two simultaneous one-sided hypothesis tests:
* $H_{01}$: $GMR \le 0.80$ (Test is inferior)
* $H_{02}$: $GMR \ge 1.25$ (Test is superior)

Rejection of both null hypotheses at the $\alpha = 0.05$ significance level establishes average bioequivalence.

---

### 2. Replicate Designs & Scaled Bioequivalence (RSABE)
For highly variable drugs (where within-subject CV of the reference product $CV_{wR} \ge 30\%$), standard limits ($80.00\%-125.00\%$) are widened using Reference-Scaled Average Bioequivalence:
* **EMA/FDA RSABE Scale**: The acceptance limits are scaled based on the within-subject reference standard deviation $\sigma_{wR}$:
  $$\text{Scaled Limits} = \exp\left( \pm 0.760 \cdot \sigma_{wR} \right)$$
  For EMA, scaling is capped when $CV_{wR} > 50\%$, restricting the maximum widened limits to $69.84\% - 143.19\%$.
* **Narrow Therapeutic Index Drugs (NTID)**: For critical drugs (e.g., warfarin, cyclosporine), tighter bioequivalence limits are enforced ($90.00\% - 111.11\%$).
* **Sample Size Sensitivity**: The module computes comprehensive GMR vs. CV sensitivity grids, mapping required sample sizes from $CV = 10\%$ to $60\%$ and $GMR = 0.85$ to $1.15$ to optimize replicate trial designs.
