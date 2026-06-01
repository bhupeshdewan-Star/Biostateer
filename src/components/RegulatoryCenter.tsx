import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Download, 
  BookOpen, 
  Scale, 
  FileCheck2, 
  Eye, 
  CornerDownRight, 
  ClipboardCheck,
  CheckSquare,
  Square,
  MinusSquare
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  question: string;
  description: string;
  tip: string;
  state: 'completed' | 'pending' | 'na';
}

interface GuidelineFramework {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  items: ChecklistItem[];
}

const DEFAULT_GUIDELINES: GuidelineFramework[] = [
  {
    id: 'ich-e9',
    name: 'ICH E9',
    title: 'ICH E9: Statistical Principles for Clinical Trials',
    description: 'Core global regulatory guidelines standardizing biostatistical designs, populations, analyses, and multiplicity controls in drug trials.',
    icon: Scale,
    items: [
      {
        id: 'ich-1',
        question: 'Double-Blinding & Allocation Concealment',
        description: 'Document and detail measures to prevent selection and assessment bias (randomization block sizes, allocation concealment).',
        tip: 'Ensure the randomized code is secured and strictly inaccessible to enrollment personnel until the allocation sequence is executed.',
        state: 'pending'
      },
      {
        id: 'ich-2',
        question: 'Pre-specified Endpoints (Primary/Secondary)',
        description: 'Primary and secondary efficacy variables must be explicitly defined in the protocol before data collection.',
        tip: 'Clearly state primary endpoints to avoid retrospective "p-hacking" or outcome switching.',
        state: 'pending'
      },
      {
        id: 'ich-3',
        question: 'Mathematical Sample Size Justification',
        description: 'Provide statistical calculations for power, showing assumed variance, expected effect, alpha, and drop-out rates.',
        tip: 'State specific formula assumptions and justify estimated clinically meaningful treatment effects.',
        state: 'pending'
      },
      {
        id: 'ich-4',
        question: 'Randomization Block Size and Seed',
        description: 'Detail block sizes, stratification factors (e.g. center, age), and randomization software details.',
        tip: 'Do not use simple randomization for small sample sizes; employ permuted blocks to ensure balancing.',
        state: 'pending'
      },
      {
        id: 'ich-5',
        question: 'Intention-to-Treat (ITT) vs. Per-Protocol (PP)',
        description: 'Define exact subjects to be included in ITT (Full Analysis Set) and PP sets, specifying exclusions.',
        tip: 'Always analyze the ITT set as the primary efficacy population to preserve randomization integrity.',
        state: 'pending'
      },
      {
        id: 'ich-6',
        question: 'Missing Data Strategy & MMRM/Multiple Imputation',
        description: 'Describe pre-planned models to handle drop-outs and missing values, including sensitivity tests.',
        tip: 'Avoid obsolete single-imputation methods like LOCF. Use Mixed Models for Repeated Measures (MMRM) or Multiple Imputation (MI).',
        state: 'pending'
      },
      {
        id: 'ich-7',
        question: 'Family-Wise Multiplicity Adjustment',
        description: 'If multiple endpoints or interim analyses are planned, outline alpha-adjustment boundaries (Bonferroni, Hochberg, etc.).',
        tip: 'Use Dunnett for multiple comparison back to control, or O\'Brien-Fleming for serial interim analysis.',
        state: 'pending'
      },
      {
        id: 'ich-8',
        question: 'Pre-planned Interim Analysis spending boundaries',
        description: 'Detail timing and significance thresholds if data safety or early efficacy checks are conducted.',
        tip: 'Pre-specify interim analyses to prevent unblinding bias and uncontrolled alpha inflation.',
        state: 'pending'
      }
    ]
  },
  {
    id: 'fda-guidance',
    name: 'FDA Guidelines',
    title: 'FDA Statistical Considerations for Clinical Trials',
    description: 'United States FDA requirements for trial statistics, adaptive designs, non-inferiority margins, and real-world evidence.',
    icon: BookOpen,
    items: [
      {
        id: 'fda-1',
        question: 'Adaptive Designs Multiplicity Adjustment',
        description: 'Adjust for potential type-I error rate inflation when changing study paths based on accumulating data.',
        tip: 'Document firewalls and independent committees to prevent internal information leakage.',
        state: 'pending'
      },
      {
        id: 'fda-2',
        question: 'Non-inferiority Margin (Delta) Justification',
        description: 'Delta margin must be clinically justified using historical placebo-controlled trial data.',
        tip: 'The chosen margin delta must be strictly smaller than the active control\'s historically proven effect.',
        state: 'pending'
      },
      {
        id: 'fda-3',
        question: 'Homogeneity Assessment across Multi-Regional Trial sites',
        description: 'For multi-site trials, report tests evaluating treatment-by-center interaction effects.',
        tip: 'Verify site homogeneity by checking random-effects models or interaction coefficients (p > 0.05).',
        state: 'pending'
      },
      {
        id: 'fda-4',
        question: 'Real-World Evidence (RWE) Confounder controls',
        description: 'Define controls for selection and confounding biases in observational databases.',
        tip: 'Utilize Propensity Score Matching (PSM) or Inverse Probability Weighting (IPW).',
        state: 'pending'
      }
    ]
  },
  {
    id: 'consort',
    name: 'CONSORT',
    title: 'CONSORT Parallel Trial Reporting Standards',
    description: 'The standard framework for reporting randomized controlled trials, ensuring transparency in enrollment and design.',
    icon: FileCheck2,
    items: [
      {
        id: 'con-1',
        question: 'Trial Design and Allocation Ratio',
        description: 'Clearly describe parallel, factorial, crossover, or cluster designs, specifying allocation ratios (e.g. 1:1, 2:1).',
        tip: 'Include the design descriptor in the manuscript title for immediate database cataloging.',
        state: 'pending'
      },
      {
        id: 'con-2',
        question: 'Participant Flow Diagram (CONSORT Chart)',
        description: 'Prepare a flowchart detailing enrollment, allocation, loss to follow-up, and final analysis counts.',
        tip: 'Strictly document exact reasons for exclusion at every stage of patient flow.',
        state: 'pending'
      },
      {
        id: 'con-3',
        question: 'Baseline Demographics Summary',
        description: 'Present baseline clinical and demographic characteristics per group in a structured baseline table.',
        tip: 'Do not report significance p-values for baseline characteristics; focus on describing absolute clinical differences.',
        state: 'pending'
      },
      {
        id: 'con-4',
        question: 'Recruitment and Follow-up Timeline',
        description: 'Document exact dates defining the recruitment period, exposure window, and trial follow-up duration.',
        tip: 'Specify trial start, end, and termination dates to verify data timeline alignment.',
        state: 'pending'
      }
    ]
  },
  {
    id: 'strobe',
    name: 'STROBE',
    title: 'STROBE Observational Research Standards',
    description: 'Reporting guidelines for epidemiological and cohort/case-control studies to minimize bias and control confounders.',
    icon: Eye,
    items: [
      {
        id: 'str-1',
        question: 'Cohorts / Case-Controls Eligibility Criteria',
        description: 'Clearly define the inclusion/exclusion criteria for cohort selections or matched case-control recruitment.',
        tip: 'Match cases and controls strictly on confounders like age and gender to balance baseline risks.',
        state: 'pending'
      },
      {
        id: 'str-2',
        question: 'Confounder selection and identification',
        description: 'Specify all variables identified as potential confounders and outline the selection process.',
        tip: 'Use Directed Acyclic Graphs (DAGs) to identify back-door paths and choose adjustment covariates.',
        state: 'pending'
      },
      {
        id: 'str-3',
        question: 'Statistical Modeling & Adjusted Covariates',
        description: 'List covariates included in the regression models and explain how missing data was handled.',
        tip: 'Always report both raw/unadjusted and adjusted hazard/odds ratios side-by-side.',
        state: 'pending'
      }
    ]
  },
  {
    id: 'prisma',
    name: 'PRISMA',
    title: 'PRISMA Meta-Analysis reporting guidelines',
    description: 'Standard checklist for systematic reviews and meta-analyses pooling evidence across clinical trials.',
    icon: FileSpreadsheet,
    items: [
      {
        id: 'pri-1',
        question: 'Database Search Boolean Strategy',
        description: 'Document exact search queries, filters, database names, and date ranges.',
        tip: 'Include full Boolean search string examples for at least one major database (e.g. PubMed).',
        state: 'pending'
      },
      {
        id: 'pri-2',
        question: 'Heterogeneity Statistics (Cochran Q & I-squared)',
        description: 'Calculate and report metrics for statistical heterogeneity across pooled studies.',
        tip: 'If I^2 > 50%, heterogeneity is high. A random-effects meta-analysis model must be applied.',
        state: 'pending'
      },
      {
        id: 'pri-3',
        question: 'Publication Bias / Funnel Plot & Egger\'s Test',
        description: 'Evaluate asymmetry in study distributions to test for selective publication bias.',
        tip: 'Egger\'s regression test is highly recommended if 10 or more studies are included in the meta-analysis.',
        state: 'pending'
      }
    ]
  }
];

const FRAMEWORK_ICONS: Record<string, React.ComponentType<any>> = {
  'ich-e9': Scale,
  'fda-guidance': BookOpen,
  'consort': FileCheck2,
  'strobe': Eye,
  'prisma': FileSpreadsheet
};

export const RegulatoryCenter: React.FC = () => {
  const [frameworks, setFrameworks] = useState<GuidelineFramework[]>([]);
  const [activeTab, setActiveTab] = useState('ich-e9');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Load compliance states from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('biostateer_regulatory_guidelines');
      if (stored) {
        setFrameworks(JSON.parse(stored));
      } else {
        localStorage.setItem('biostateer_regulatory_guidelines', JSON.stringify(DEFAULT_GUIDELINES));
        setFrameworks(DEFAULT_GUIDELINES);
      }
    } catch (e) {
      console.error(e);
      setFrameworks(DEFAULT_GUIDELINES);
    }
  }, []);

  const handleStateChange = (frameworkId: string, itemId: string, newState: 'completed' | 'pending' | 'na') => {
    const updated = frameworks.map(fw => {
      if (fw.id !== frameworkId) return fw;
      return {
        ...fw,
        items: fw.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, state: newState };
        })
      };
    });

    localStorage.setItem('biostateer_regulatory_guidelines', JSON.stringify(updated));
    setFrameworks(updated);
  };

  const getProgress = (framework: GuidelineFramework) => {
    const totalApplicable = framework.items.filter(item => item.state !== 'na').length;
    if (totalApplicable === 0) return 100;
    const completed = framework.items.filter(item => item.state === 'completed').length;
    return Math.round((completed / totalApplicable) * 100);
  };

  const handleExportReport = () => {
    try {
      const report = frameworks.map(fw => ({
        framework: fw.name,
        progress: `${getProgress(fw)}%`,
        items: fw.items.map(i => ({
          id: i.id,
          question: i.question,
          status: i.state.toUpperCase()
        }))
      }));

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", `biostateer_compliance_audit_report_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to export compliance report: " + e);
    }
  };

  const activeFw = frameworks.find(fw => fw.id === activeTab);

  if (frameworks.length === 0) return null;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 p-6 flex flex-col gap-6 select-none max-w-full">
      {/* Header and Compliance export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0">
            <ClipboardCheck className="w-6 h-6 text-brand-500" />
            <span>Biostateer™ Regulatory Compliance Center</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and self-audit study designs against global clinical standards (ICH E9, FDA, CONSORT, STROBE, PRISMA).
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md transition shrink-0 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance Audit</span>
        </button>
      </div>

      {/* Tabs list container */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 gap-2 scrollbar-none">
        {frameworks.map((fw) => {
          const Icon = FRAMEWORK_ICONS[fw.id] || HelpCircle;
          const isActive = activeTab === fw.id;
          const progress = getProgress(fw);

          return (
            <button
              key={fw.id}
              onClick={() => {
                setActiveTab(fw.id);
                setExpandedItemId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{fw.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                progress === 100 
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {progress}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area */}
      {activeFw && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Left panel: Info summary and overall progress */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm h-fit">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Active Guideline Overview</span>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {activeFw.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {activeFw.description}
            </p>

            {/* Dynamic progress indicators */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Completed Tasks Progress</span>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{getProgress(activeFw)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${getProgress(activeFw)}%` }}
                />
              </div>
            </div>

            {/* Stats Summary Panel */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-850">
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-500">
                  {activeFw.items.filter(i => i.state === 'completed').length}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase">Done</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-850">
                <span className="block text-xs font-bold text-amber-600 dark:text-amber-500">
                  {activeFw.items.filter(i => i.state === 'pending').length}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase">Pending</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-850">
                <span className="block text-xs font-bold text-slate-500">
                  {activeFw.items.filter(i => i.state === 'na').length}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase">N/A</span>
              </div>
            </div>
          </div>

          {/* Right panel: Large interactive checklist list */}
          <div className="lg:col-span-2 space-y-3">
            {activeFw.items.map((item) => {
              const isExpanded = expandedItemId === item.id;
              
              return (
                <div 
                  key={item.id}
                  className={`bg-white dark:bg-slate-950 border rounded-xl overflow-hidden shadow-xs transition duration-200 ${
                    isExpanded 
                      ? 'border-brand-500 dark:border-brand-500/50' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Collapsed view summary */}
                  <div className="p-4 flex items-start gap-3 select-none">
                    
                    {/* Multi-state interactive click cycle */}
                    <button
                      onClick={() => {
                        const nextStates: { [key: string]: 'completed' | 'pending' | 'na' } = {
                          'pending': 'completed',
                          'completed': 'na',
                          'na': 'pending'
                        };
                        handleStateChange(activeFw.id, item.id, nextStates[item.state]);
                      }}
                      className="mt-0.5 shrink-0 transition hover:scale-105"
                      title="Click to cycle state [Pending -> Completed -> Not Applicable]"
                    >
                      {item.state === 'completed' && <CheckSquare className="w-5 h-5 text-emerald-500" />}
                      {item.state === 'pending' && <Square className="w-5 h-5 text-amber-500" />}
                      {item.state === 'na' && <MinusSquare className="w-5 h-5 text-slate-400" />}
                    </button>

                    <div 
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${item.state === 'completed' ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.question}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          item.state === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          item.state === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {item.state}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 text-xs shrink-0 self-center font-medium bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800/80 px-2 py-1 rounded transition-colors"
                    >
                      {isExpanded ? 'Hide Guideline' : 'View Rule'}
                    </button>

                  </div>

                  {/* Expanded documentation rules and biostatistical advice tips */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/50 space-y-3 animate-in slide-in-from-top-2 duration-150">
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Standard Regulatory Mandate</span>
                        <p className="text-xs text-slate-600 dark:text-slate-355 leading-relaxed select-text">
                          {item.description}
                        </p>
                      </div>

                      {/* Expert Tip Area */}
                      <div className="p-3 bg-brand-500/[0.03] dark:bg-brand-500/[0.04] border border-brand-500/10 dark:border-brand-500/15 rounded-lg flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">Enterprise Biostatistician Tip</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic select-text">
                            {item.tip}
                          </p>
                        </div>
                      </div>

                      {/* State Modifier controls inside expansion */}
                      <div className="flex gap-2 justify-end pt-1.5">
                        {(['pending', 'completed', 'na'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStateChange(activeFw.id, item.id, s)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                              item.state === s
                                ? s === 'completed' ? 'bg-emerald-500 text-white font-bold' :
                                  s === 'pending' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-500 text-white font-bold'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {s === 'na' ? 'N/A' : s}
                          </button>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
