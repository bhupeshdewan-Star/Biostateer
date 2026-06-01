import React, { useState, useEffect } from 'react';
import {
  TableProperties,
  Target,
  Sigma,
  Sliders,
  Grid,
  TrendingUp,
  Hourglass,
  Scale,
  Dices,
  Globe,
  FileCheck2,
  Brain,
  Layers,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Search,
  MessageSquareCode,
  History,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Activity,
  Home,
  Info,
  UploadCloud,
  Users,
  ShieldCheck,
  LogOut,
  FileText,
  Lock,
  Database
} from 'lucide-react';

export interface ModuleItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

export interface ModuleGroup {
  category: string;
  items: ModuleItem[];
  adminOnly?: boolean;
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    category: 'Workspace Command Center',
    items: [
      { id: 'dashboard', name: 'Executive Dashboard', icon: Home, description: 'Clinical Trials Analytics Command Center' },
      { id: 'data-import', name: 'Clinical Data Import', icon: UploadCloud, description: 'Ingest and parse spreadsheets, SPSS, and PDF protocols' },
      { id: 'cdisc-validation', name: 'CDISC Ingestion & P21', icon: FileSpreadsheet, description: 'Validate Define.xml and datasets against SDTM and ADaM rules' },
      { id: 'audit-trail-center', name: 'Audit Trail Center', icon: History, description: 'CFR Part 11 Immutable Ledger & Signature Center' },
      { id: 'security-checklist', name: 'Security Hardening', icon: FileCheck2, description: 'SSL, TLS, CSP, MFA, Azure AD, Okta, and SAML controls' },
      { id: 'release-management', name: 'Release Management', icon: Settings, description: 'Version, build, validation classification, and deployment states' },
      { id: 'data-persistence', name: 'Data Persistence Center', icon: Database, description: 'High-capacity workspace backup, restore, and IndexedDB controls' },
      { id: 'system-health', name: 'System Diagnostics & Health', icon: Activity, description: 'Frontend, backend, statistical engine, and security diagnostics' }
    ]
  },
  {
    category: 'Administrative Gate Suite',
    adminOnly: true,
    items: [
      { id: 'admin-dashboard', name: 'User Access Approvals', icon: Users, description: 'Approve, waitlist, or suspend evaluator accounts' },
      { id: 'admin-analytics', name: 'Platform Analytics', icon: TableProperties, description: 'Acquisition demographics, country data, and calculations usage stats' },
      { id: 'security-center', name: 'Intrusion Threat Audit', icon: ShieldCheck, description: 'Monitor failed logins, OTP spikes, and geoconcurrency alerts' }
    ]
  },
  {
    category: 'Descriptives & Diagnostics',
    items: [
      { id: 'desc-stats', name: 'Descriptive & Baseline', icon: TableProperties, description: 'Summary stats, demographics, and baseline table generators' },
      { id: 'diagnostic', name: 'Diagnostic Accuracy', icon: Target, description: 'Sensitivity, Specificity, ROC, DeLong, NRI, and DCA Net Benefit' },
      { id: 'missing-data', name: 'Missing Data Imputation', icon: Sliders, description: 'Little\'s MCAR test, LOCF, BOCF, and Multiple Imputations (MICE)' }
    ]
  },
  {
    category: 'Hypothesis Testing',
    items: [
      { id: 'parametric', name: 'Parametric Tests', icon: Sigma, description: 't-tests, ANOVA, ANCOVA, and post-hoc pairwise comparisons' },
      { id: 'nonparametric', name: 'Non-parametric Tests', icon: Sliders, description: 'Mann-Whitney, Wilcoxon, Kruskal-Wallis, and Friedman tests' },
      { id: 'categorical', name: 'Categorical Analysis', icon: Grid, description: 'Chi-Square, Fisher\'s exact, McNemar, and relative risk profiles' },
    ]
  },
  {
    category: 'Advanced Modeling & Survival',
    items: [
      { id: 'regression', name: 'Regression & Modeling', icon: TrendingUp, description: 'Linear, logistic, Poisson, and generalized linear modeling' },
      { id: 'survival', name: 'Survival Analysis', icon: Hourglass, description: 'Kaplan-Meier estimates, Log-Rank, Cox, and Fine-Gray Competing Risks' },
      { id: 'multivariate', name: 'Multivariate Statistics', icon: Cpu, description: 'PCA, Factor Analysis, MANOVA, and dimensional reductions' },
    ]
  },
  {
    category: 'Study Design & Execution',
    items: [
      { id: 'sample-size', name: 'Sample Size & Power', icon: Scale, description: 'Continuous, binary, survival, and Lan-DeMets alpha spending bounds' },
      { id: 'clinical-randomization', name: 'Clinical Trial Randomization', icon: Dices, description: 'Block randomization, Stratified Block, Pocock-Simon Minimization' },
      { id: 'rct-design', name: 'Study Design Wizard 2.0', icon: Target, description: 'Flagship conceptualizer mapping study parameters to protocol drafts' },
    ]
  },
  {
    category: 'PK & Bioequivalence Suites',
    items: [
      { id: 'pk-analysis', name: 'PK Analysis Hub', icon: Cpu, description: 'Non-compartmental PK analysis, trapezoidal AUC, half-lives, MRT' },
      { id: 'bioequivalence', name: 'Bioequivalence Hub', icon: TableProperties, description: 'TOST bioequivalence tests, crossovers, replicates, and RSABE' }
    ]
  },
  {
    category: 'Specialized Analytics',
    items: [
      { id: 'agreement', name: 'Agreement & Reliability', icon: FileCheck2, description: 'Bland-Altman plots, Intraclass Correlation Coefficients (ICC), and Kappa' },
      { id: 'bayesian', name: 'Bayesian Biostatistics', icon: Brain, description: 'Conjugate priors, Bayes factors, and credible intervals' },
      { id: 'meta-analysis', name: 'Meta-Analysis & Egger', icon: Layers, description: 'Fixed/random effects pooled estimates, heterogeneity stats, and funnel plots' },
    ]
  },
  {
    category: 'Regulatory Agreement Documents',
    items: [
      { id: 'privacy-policy', name: 'Privacy Policy', icon: FileText, description: 'Evaluation demographics data-collection rules v1.3' },
      { id: 'terms-conditions', name: 'Terms & Conditions', icon: Lock, description: 'Reverse engineering prohibitions and ownership licenses' },
      { id: 'about', name: 'About Biostateer™', icon: Info, description: 'Founder credentials, Mumbai headquarters, validation specs' }
    ]
  }
];

interface SidebarProps {
  activeModule: string;
  setActiveModule: (id: string) => void;
  onOpenCommandPalette: () => void;
  activePanel: 'none' | 'copilot' | 'audit' | 'regulatory';
  setActivePanel: (panel: 'none' | 'copilot' | 'audit' | 'regulatory') => void;
  userRole: string;
  userFullName: string;
  userOrganization?: string;
  userCategory?: string;
  userJobTitle?: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  onOpenCommandPalette,
  activePanel,
  setActivePanel,
  userRole,
  userFullName,
  userOrganization,
  userCategory,
  userJobTitle,
  onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const getInitials = (name: string) => {
    if (!name) return "BD";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      className={`relative h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight text-lg">
                Biostateer<span className="text-brand-500 text-xs font-semibold align-super">™</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Enterprise Biostatistics</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto p-1.5 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
        )}

        {/* Collapse Button */}
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Trigger Bar */}
      <div className="px-3 py-2">
        {isCollapsed ? (
          <button 
            onClick={onOpenCommandPalette}
            className="mx-auto flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 w-10 h-10 transition-all cursor-pointer"
            title="Search Calculators (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-sm border border-slate-200/50 dark:border-slate-880/80 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search modules...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600">
              Ctrl K
            </kbd>
          </button>
        )}
      </div>

      {/* Main Modules Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {MODULE_GROUPS.map((group, groupIdx) => {
          // Strict Role-Based Administrative Filter (Priority 3 & 12)
          if (group.adminOnly && userRole !== "Administrator") return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-6">
                  {group.category}
                </h3>
              )}
              
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveModule(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group relative cursor-pointer ${
                      isActive 
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border-l-2 border-brand-500 rounded-l-none'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title={isCollapsed ? `${item.name}: ${item.description}` : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="truncate">
                        <p className="text-sm truncate">{item.name}</p>
                      </div>
                    )}
                    
                    {isCollapsed && (
                      <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-950 text-white text-xs rounded py-1.5 px-3 z-50 shadow-xl border border-slate-880 transition-all origin-left whitespace-nowrap pointer-events-none">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{item.description}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Premium Auxiliary Panels Section */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {!isCollapsed && (
          <h3 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-6">
            Consultation & Audits
          </h3>
        )}

        {/* AI Copilot Panel Toggle */}
        <button
          onClick={() => setActivePanel(activePanel === 'copilot' ? 'none' : 'copilot')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activePanel === 'copilot'
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border-l-2 border-purple-500 rounded-l-none'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title={isCollapsed ? 'AI Copilot' : undefined}
        >
          <MessageSquareCode className={`w-4 h-4 shrink-0 ${activePanel === 'copilot' ? 'text-purple-500' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="text-sm">AI Copilot Consultant</span>}
        </button>

        {/* Audit Trail Panel Toggle */}
        <button
          onClick={() => setActivePanel(activePanel === 'audit' ? 'none' : 'audit')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activePanel === 'audit'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-l-2 border-amber-500 rounded-l-none'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title={isCollapsed ? 'Audit Trail' : undefined}
        >
          <History className={`w-4 h-4 shrink-0 ${activePanel === 'audit' ? 'text-amber-500' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="text-sm">Immutable Audit Trail</span>}
        </button>

        {/* Regulatory Center Toggle */}
        <button
          onClick={() => setActivePanel(activePanel === 'regulatory' ? 'none' : 'regulatory')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activePanel === 'regulatory'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500 rounded-l-none'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title={isCollapsed ? 'Regulatory Center' : undefined}
        >
          <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activePanel === 'regulatory' ? 'text-emerald-500' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="text-sm">Regulatory Guideline Center</span>}
        </button>
      </div>

      {/* Footer / User Settings / Theme Toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {getInitials(userFullName || "Guest User")}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title={userFullName}>{userFullName || "Guest User"}</p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate" title={userJobTitle ? `${userJobTitle}${userCategory ? ` (${userCategory})` : ''}` : (userCategory || "Evaluator")}>
                  {userJobTitle || userCategory || "Evaluator"}
                </p>
                <p className="text-[8px] font-semibold text-brand-500 dark:text-brand-450 truncate" title={userOrganization}>{userOrganization || "Biostateer™ Workspace"}</p>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">Role: {userRole || "Guest User"}</p>
              </div>
              
              {/* Secure click-to-logout (Priority 11 & 12) */}
              <button 
                onClick={onLogout}
                className="p-1.5 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-400 transition cursor-pointer"
                title="Secure Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div 
              onClick={onLogout}
              className="mx-auto w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs cursor-pointer hover:scale-105 transition"
              title="Secure Sign Out"
            >
              <LogOut size={13} className="text-white hover:text-rose-200 transition" />
            </div>
          )}

          {/* Theme & Collapse Controls */}
          {!isCollapsed ? (
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={handleToggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="mx-auto p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Expandable Theme Switcher inside Footer when collapsed */}
        {isCollapsed && (
          <button 
            onClick={handleToggleTheme}
            className="mx-auto p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 w-8 h-8 flex items-center justify-center transition cursor-pointer"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </aside>
  );
};
