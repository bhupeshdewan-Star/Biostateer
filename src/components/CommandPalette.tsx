import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, Sparkles, History, CornerDownLeft, X, ArrowUp, ArrowDown } from 'lucide-react';

interface CalculatorItem {
  id: string;
  name: string;
  category: string;
  moduleId: string;
  description: string;
  keywords: string[];
}

const CALCULATOR_DATABASE: CalculatorItem[] = [
  // Descriptives
  { id: 'table1', name: 'Demographic Table 1 Summary Generator', category: 'Descriptives & Diagnostics', moduleId: 'desc-stats', description: 'Generates structured demographics Table 1 (Mean/SD, Median/IQR, N/%)', keywords: ['baseline', 'demographics', 'table 1', 'summary', 'mean', 'median'] },
  { id: 'summary-stats', name: 'Continuous & Discrete Descriptives', category: 'Descriptives & Diagnostics', moduleId: 'desc-stats', description: 'Calculate Skewness, Kurtosis, Variance, and Normality tests (Shapiro-Wilk)', keywords: ['normality', 'skewness', 'shapiro-wilk', 'kurtosis', 'variance'] },
  
  // Diagnostics
  { id: 'roc-auc', name: 'ROC Curve & AUC Analyzer', category: 'Descriptives & Diagnostics', moduleId: 'diagnostic', description: 'Plot ROC curve, calculate Area Under the Curve (AUC) with DeLong confidence intervals', keywords: ['roc', 'auc', 'delong', 'sensitivity', 'cutoff', 'diagnostic accuracy'] },
  { id: 'sens-spec', name: 'Sensitivity & Specificity Calculator', category: 'Descriptives & Diagnostics', moduleId: 'diagnostic', description: 'Sensitivity, specificity, positive/negative predictive values (PPV/NPV) and Likelihood Ratios', keywords: ['sens', 'spec', 'ppv', 'npv', 'prevalence', 'likelihood ratio'] },
  
  // Parametric
  { id: 't-test-ind', name: 'Independent Student\'s t-test', category: 'Hypothesis Testing', moduleId: 'parametric', description: 'Compare means of two independent groups with Welch\'s correction option', keywords: ['t-test', 'independent', 'means', 'welch', 'student'] },
  { id: 't-test-paired', name: 'Paired Samples t-test', category: 'Hypothesis Testing', moduleId: 'parametric', description: 'Compare means of two paired/repeated measurements', keywords: ['paired t-test', 'repeated measures', 'before after'] },
  { id: 'anova-one', name: 'One-Way ANOVA & post-hoc Tukey HSD', category: 'Hypothesis Testing', moduleId: 'parametric', description: 'Compare means of three or more independent groups with post-hoc multiple comparisons', keywords: ['anova', 'f-test', 'tukey', 'post-hoc', 'pairwise'] },
  { id: 'ancova', name: 'ANCOVA (Analysis of Covariance)', category: 'Hypothesis Testing', moduleId: 'parametric', description: 'Compare group means while adjusting for continuous confounding covariates', keywords: ['ancova', 'covariate', 'confounder', 'adjustment'] },
  
  // Non-parametric
  { id: 'mann-whitney', name: 'Mann-Whitney U Test (Wilcoxon Rank-Sum)', category: 'Hypothesis Testing', moduleId: 'nonparametric', description: 'Non-parametric alternative to independent t-test for ordinal or skewed data', keywords: ['mann-whitney', 'wilcoxon rank sum', 'non-parametric', 'rank sum', 'median comparison'] },
  { id: 'wilcoxon-signed', name: 'Wilcoxon Signed-Rank Test', category: 'Hypothesis Testing', moduleId: 'nonparametric', description: 'Non-parametric alternative to paired t-test for paired measurements', keywords: ['wilcoxon signed rank', 'paired', 'median', 'non-parametric'] },
  { id: 'kruskal-wallis', name: 'Kruskal-Wallis H Test', category: 'Hypothesis Testing', moduleId: 'nonparametric', description: 'Non-parametric alternative to one-way ANOVA for three or more independent groups', keywords: ['kruskal wallis', 'dunn test', 'post-hoc', 'median'] },
  { id: 'friedman', name: 'Friedman Chi-Squared Test', category: 'Hypothesis Testing', moduleId: 'nonparametric', description: 'Non-parametric alternative to repeated measures ANOVA', keywords: ['friedman', 'repeated non-parametric', 'ranks'] },
  
  // Categorical
  { id: 'chi-square', name: 'Pearson Chi-Square Test of Independence', category: 'Hypothesis Testing', moduleId: 'categorical', description: 'Determine association between two categorical variables (r x c contingency tables)', keywords: ['chi square', 'contingency table', 'independence', 'expected counts'] },
  { id: 'fisher-exact', name: 'Fisher\'s Exact Test', category: 'Hypothesis Testing', moduleId: 'categorical', description: 'Exact test for association in 2x2 or RxC tables, ideal for small sample sizes', keywords: ['fisher exact', 'contingency', 'small sample'] },
  { id: 'mcnemar', name: 'McNemar\'s Test', category: 'Hypothesis Testing', moduleId: 'categorical', description: 'Paired categorical outcome analysis (e.g., matched case-control or pre-post binary)', keywords: ['mcnemar', 'paired proportion', 'matched case control'] },
  
  // Regression
  { id: 'lin-reg', name: 'Multiple Linear Regression', category: 'Advanced Modeling & Survival', moduleId: 'regression', description: 'Model a continuous outcome with diagnostic residuals, R-squared, and coefficients', keywords: ['linear regression', 'ols', 'coefficients', 'residuals', 'multicollinearity'] },
  { id: 'log-reg', name: 'Binary Logistic Regression', category: 'Advanced Modeling & Survival', moduleId: 'regression', description: 'Model a binary outcome, returning Odds Ratios (OR), Wald stats, and ROC diagnostics', keywords: ['logistic regression', 'odds ratio', 'binary outcome', 'wald'] },
  
  // Survival
  { id: 'km-survival', name: 'Kaplan-Meier Survival Estimator', category: 'Advanced Modeling & Survival', moduleId: 'survival', description: 'Calculate survival probability over time, plot KM curve, estimate median survival time', keywords: ['kaplan-meier', 'survival rate', 'censoring', 'median survival'] },
  { id: 'log-rank', name: 'Log-Rank Test', category: 'Advanced Modeling & Survival', moduleId: 'survival', description: 'Compare survival curves between two or more treatment/exposure cohorts', keywords: ['log-rank', 'survival comparison', 'chi-square'] },
  { id: 'cox-hazards', name: 'Cox Proportional Hazards Model', category: 'Advanced Modeling & Survival', moduleId: 'survival', description: 'Analyze survival data, estimating adjusted Hazard Ratios (HR) with continuous covariates', keywords: ['cox hazard', 'hazard ratio', 'proportional hazard', 'adjusted survival'] },
  
  // Sample Size
  { id: 'ss-means', name: 'Sample Size: Two Independent Means', category: 'Study Design & Execution', moduleId: 'sample-size', description: 'Calculate sample size for parallel superiority trials comparing continuous means', keywords: ['sample size', 'power analysis', 'superiority', 'means', 'effect size'] },
  { id: 'ss-prop', name: 'Sample Size: Two Independent Proportions', category: 'Study Design & Execution', moduleId: 'sample-size', description: 'Calculate sample size for comparing two independent binary rate proportions', keywords: ['sample size rate', 'power proportions', 'fisher rate'] },
  { id: 'ss-noninf', name: 'Sample Size: Non-inferiority & Equivalence', category: 'Study Design & Execution', moduleId: 'sample-size', description: 'Design non-inferiority trials with delta margins for continuous or binary endpoints', keywords: ['non-inferiority margin', 'equivalence', 'delta margin'] },
  
  // Clinical Trials
  { id: 'rct-block', name: 'Permuted Block Randomization Generator', category: 'Study Design & Execution', moduleId: 'rct-design', description: 'Generate randomization allocation logs using permuted blocks with seed customization', keywords: ['block randomization', 'allocation', 'allocation sequence', 'random seeds'] },
  
  // Agreement
  { id: 'bland-altman', name: 'Bland-Altman Agreement Analysis', category: 'Specialized Analytics', moduleId: 'agreement', description: 'Compute bias, limits of agreement (LoA), and visual diagnostic scatterplots', keywords: ['bland-altman', 'agreement', 'bias', 'instrument comparison'] },
  { id: 'icc-reliability', name: 'Intraclass Correlation Coefficient (ICC)', category: 'Specialized Analytics', moduleId: 'agreement', description: 'Evaluate inter-rater and intra-rater reliability for continuous ratings', keywords: ['icc', 'reliability', 'inter-rater', 'shrout-fleiss'] },
  
  // Bayesian
  { id: 'bayesian-conjugate', name: 'Bayesian Beta-Binomial Conjugate Prior', category: 'Specialized Analytics', moduleId: 'bayesian', description: 'Update prior Beta estimates with trial success/failure data to compute posteriors', keywords: ['conjugate prior', 'beta binomial', 'bayesian posterior', 'credible interval'] }
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (moduleId: string, calculatorId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCalculator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<CalculatorItem[]>(CALCULATOR_DATABASE);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<CalculatorItem[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biostateer_recent_searches');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        const items = ids
          .map(id => CALCULATOR_DATABASE.find(item => item.id === id))
          .filter((item): item is CalculatorItem => !!item);
        setRecentSearches(items.slice(0, 4));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, [isOpen]);

  // Handle outside clicks to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Trigger search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(CALCULATOR_DATABASE);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const matches = CALCULATOR_DATABASE.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keywords.some(kw => kw.toLowerCase().includes(query))
      );
    });

    setFilteredItems(matches);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const listLength = searchQuery ? filteredItems.length : (recentSearches.length + filteredItems.length);
          const next = prev + 1 >= listLength ? 0 : prev + 1;
          ensureVisible(next);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const listLength = searchQuery ? filteredItems.length : (recentSearches.length + filteredItems.length);
          const next = prev - 1 < 0 ? listLength - 1 : prev - 1;
          ensureVisible(next);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeList = getCombinedList();
        if (activeList[selectedIndex]) {
          handleItemSelection(activeList[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedIndex, filteredItems, recentSearches, searchQuery]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchQuery('');
    }
  }, [isOpen]);

  const getCombinedList = () => {
    if (searchQuery.trim()) {
      return filteredItems;
    }
    // Combine recents and all databases when query is empty
    return [...recentSearches, ...CALCULATOR_DATABASE];
  };

  const handleItemSelection = (item: CalculatorItem) => {
    // Add to recent searches
    try {
      const saved = localStorage.getItem('biostateer_recent_searches');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      ids = [item.id, ...ids.filter(id => id !== item.id)].slice(0, 10);
      localStorage.setItem('biostateer_recent_searches', JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }

    onSelectCalculator(item.moduleId, item.id);
    onClose();
  };

  const ensureVisible = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.search-item');
    const targetItem = items[index] as HTMLElement;
    if (!targetItem) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const itemTop = targetItem.offsetTop;
    const itemBottom = itemTop + targetItem.clientHeight;

    if (itemTop < containerTop) {
      container.scrollTop = itemTop;
    } else if (itemBottom > containerBottom) {
      container.scrollTop = itemBottom - container.clientHeight;
    }
  };

  if (!isOpen) return null;

  const combinedList = getCombinedList();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 transition-all duration-300">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-4 duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a calculator name, test, or statistical keyword (e.g. 'anova')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results list */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[350px] custom-scrollbar bg-slate-50/50 dark:bg-slate-950"
        >
          {combinedList.length === 0 ? (
            <div className="p-8 text-center">
              <Calculator className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No calculators match your search.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-semibold text-brand-500 hover:underline"
              >
                Clear query and browse all
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Category labels and logical segregation */}
              {searchQuery ? (
                <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Found Matches ({filteredItems.length})
                </div>
              ) : (
                recentSearches.length > 0 && (
                  <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Recent Calculations
                  </div>
                )
              )}

              {combinedList.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isRecent = !searchQuery && index < recentSearches.length;

                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleItemSelection(item)}
                    className={`search-item w-full flex items-start gap-3 p-3 rounded-lg text-left transition duration-150 ${
                      isSelected 
                        ? 'bg-brand-500/10 dark:bg-brand-500/15 border-l-2 border-brand-500 pl-2.5 text-slate-950 dark:text-white' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-md shrink-0 mt-0.5 ${
                      isSelected ? 'bg-brand-500/20 text-brand-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                    }`}>
                      {isRecent ? (
                        <History className="w-4 h-4" />
                      ) : (
                        <Calculator className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.name}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px] font-medium select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                <ArrowUp className="w-2.5 h-2.5 inline" />
              </kbd>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                <ArrowDown className="w-2.5 h-2.5 inline" />
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs font-mono">
                Enter
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs font-mono">
                Esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-brand-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fuzzy Index Loaded</span>
          </span>
        </div>
      </div>
    </div>
  );
};
