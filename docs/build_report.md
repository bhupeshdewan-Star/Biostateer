# Biostateer™ Version 1.2 — Production Build Report
*Build Status: SUCCESSFUL*

This document provides compilation statistics, bundle dimensions, and asset details compiled under Vite for clinical distribution.

---

## ⚙️ Compilation Environment Manifest

- **Compiler**: Vite v8.0.14
- **TypeScript**: tsc v5.4
- **Time Elapsed**: 839 ms
- **Errors**: 0
- **Warnings**: 0

---

## 📦 Bundled Assets Dimensions

The compilation pipeline converts structured React layouts and TypeScript calculators into highly optimized, minified production assets.

| Asset File Path | Size (KB) | Gzip Size (KB) | Functional Description |
| :--- | :--- | :--- | :--- |
| **dist/index.html** | 0.77 KB | 0.46 KB | Entry point landing page. |
| **dist/assets/index-D2LvEzdw.css** | 73.84 KB | 11.27 KB | HSL dark-mode tailwind variables and layouts. |
| **dist/assets/index-CjEERqfG.js** | 1002.32 KB | 270.07 KB | Minified application logic, biostatistics math, and charts. |

---

## 🪵 Production Build Terminal Outputs

```bash
> biostat-antigravity@0.0.0 build
> tsc -b && vite build

vite v8.0.14 building client environment for production...
transforming...✓ 2330 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.77 kB │ gzip:   0.46 kB
dist/assets/index-D2LvEzdw.css     73.84 kB │ gzip:  11.27 kB
dist/assets/index-CjEERqfG.js   1,002.32 kB │ gzip: 270.07 kB

✓ built in 839ms
```

---

## ✍️ Verification Authority

**Dr. Bhupesh Dewan**
*Founder & Product Owner of Biostateer™*

*Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.*
