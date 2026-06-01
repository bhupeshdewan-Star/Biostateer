# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Advanced Biostatistics Manual

---

### 1. Two-Way Factorial ANOVA
Factorial ANOVA partitions the total sum of squares ($SS_{Total}$) into individual main effects and interaction effects:
$$SS_{Total} = SS_A + SS_B + SS_{AB} + SS_{Error}$$

* **Factor A Main Effect**: Examines the overall variance attributable to the first independent group factor (e.g., Treatment vs. Placebo).
* **Factor B Main Effect**: Examines the variance attributable to the second independent group factor (e.g., Age Cohort).
* **Interaction Effect ($A \times B$)**: Tests whether the effect of Factor A depends on the level of Factor B.
* **Partial Eta-Squared ($\eta^2_p$)**: Quantifies the effect size of each source:
  $$\eta^2_p = \frac{SS_{Effect}}{SS_{Effect} + SS_{Error}}$$
* **F-Ratios**: Tested against the critical F-distribution with respective degrees of freedom:
  $$F_A = \frac{MS_A}{MS_{Error}}, \quad F_B = \frac{MS_B}{MS_{Error}}, \quad F_{AB} = \frac{MS_{AB}}{MS_{Error}}$$

---

### 2. Bivariate Multivariate ANOVA (MANOVA)
When clinical trials assess multiple correlated dependent variables simultaneously, Univariate ANOVA inflation is avoided using Bivariate MANOVA:
* **Hypothesis (H) and Error (E) Matrices**: Constructed from sums of squares and cross-products (SSCP) of the dependent variable vectors.
* **Wilks' Lambda ($\Lambda$)**: Evaluates the ratio of the determinant of error to the total determinant:
  $$\Lambda = \frac{\det(\mathbf{E})}{\det(\mathbf{H} + \mathbf{E})}$$
  Rao's F-approximation translates Wilks' Lambda to a standard F-statistic to calculate the precise p-value.
* **Pillai's Trace, Hotelling's Trace, and Roy's Largest Root**: Additional robust multivariate statistics outputted to confirm model stability.
* **Box's M Test**: Evaluates the homoscedasticity of covariance matrices across cohorts (strict $p > 0.001$ threshold).
* **Bartlett's Sphericity**: Assesses if the bivariate dependent variables are sufficiently correlated to justify MANOVA, testing if the correlation matrix is significantly different from the identity matrix.
* **Mahalanobis Distances**: Identifies multivariate outliers in the data grid relative to the pooled covariance centroid.
