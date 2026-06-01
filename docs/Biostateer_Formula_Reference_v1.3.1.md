# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Mathematical Formula Reference

---

### 1. Two-Way ANOVA Equations
* **Degrees of Freedom**:
  $$df_A = a - 1, \quad df_B = b - 1, \quad df_{AB} = (a-1)(b-1), \quad df_{Error} = N - ab$$
* **Mean Squares**:
  $$MS_A = \frac{SS_A}{df_A}, \quad MS_{Error} = \frac{SS_{Error}}{df_{Error}}$$
* **Partial Eta-Squared ($\eta^2_p$)**:
  $$\eta^2_p = \frac{SS_{Effect}}{SS_{Effect} + SS_{Error}}$$

---

### 2. Multivariate ANOVA Equations
* **Wilks' Lambda ($\Lambda$)**:
  $$\Lambda = \frac{\det(\mathbf{E})}{\det(\mathbf{H} + \mathbf{E})}$$
  Where $\mathbf{E}$ is the residual/error sum of squares and cross-products (SSCP) matrix and $\mathbf{H}$ is the hypothesis SSCP matrix.
* **Box's M Statistic**:
  $$M = (N - g) \ln(\det(\mathbf{S}_{pooled})) - \sum_{i=1}^g (n_i - 1) \ln(\det(\mathbf{S}_i))$$
  Where $\mathbf{S}_i$ is the covariance matrix of group $i$ and $\mathbf{S}_{pooled}$ is the pooled covariance matrix.

---

### 3. Bioequivalence TOST Equations
* **90% Confidence Interval for GMR**:
  $$\text{CI} = \exp\left( \ln(\text{GMR}) \pm t_{0.05, df} \cdot s_d \sqrt{\frac{2}{n}} \right)$$
  Where $s_d$ is the pooled residual standard deviation and $n$ is the crossover sample size.
