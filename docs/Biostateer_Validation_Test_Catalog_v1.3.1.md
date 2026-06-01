# Biostateer™ Enterprise Clinical Research & Biostatistics Intelligence Platform
## Version 1.3.1 — Validation Test Catalog

---

### 1. Standard Reference Datasets
Biostateer™ compiles a built-in catalog of validation datasets to perform automated self-tests:
* **BST-VAL-TT-001 (Welch's T-Test)**:
  * *Inputs*: Two groups of clinical observations ($n_1 = 15, n_2 = 15$).
  * *Expected T-statistic*: $2.301548$ (R `stats::t.test` calibration).
  * *Precision delta*: $< 10^{-14}$.
* **BST-VAL-AOV-001 (One-Way ANOVA)**:
  * *Inputs*: Three treatment arms, continuous endpoint.
  * *Expected F-value*: $4.120531$ (SAS `PROC GLM` calibration).
  * *Precision delta*: $< 10^{-13}$.
* **BST-VAL-AOV-002 (Two-Way ANOVA)**:
  * *Inputs*: Treatment (Factor A) and Gender (Factor B) with continuous endpoint.
  * *Expected Main and Interaction Effects*: Calibrated against R `stats::aov` factorial option.
* **BST-VAL-MAN-001 (Bivariate MANOVA)**:
  * *Inputs*: Parallel groups ($n = 20$ each), dual correlated endpoints (e.g. Systolic and Diastolic BP).
  * *Expected Wilks' Lambda ($\Lambda$)*: Calibrated against R `stats::manova` outputs.
  * *Box's M Test*: Homoscedasticity p-value matched with SciPy calibration.
