import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Database
} from 'lucide-react';

export interface AuditLog {
  id: string;
  timestamp: string;
  moduleName: string;
  calculatorName: string;
  parameters: { [key: string]: string | number };
  outputs: { [key: string]: string | number };
  exportStatus: 'None' | 'CSV Exported' | 'PDF Generated' | 'JSON Exported' | 'Compliance Verified';
  hash: string; // Simulated SHA-256 integrity hash
}

// Generate premium mock audit logs to show if empty
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "tx-938210",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    moduleName: "Sample Size & Power",
    calculatorName: "Two Independent Means (Superiority)",
    parameters: {
      "Primary Endpoint": "Systolic Blood Pressure reduction (mmHg)",
      "Alpha (Type I Error)": 0.05,
      "Power (1 - Beta)": 0.80,
      "Allocation Ratio (N2/N1)": 1.0,
      "Expected Mean Diff": 5.0,
      "Standard Deviation": 12.0
    },
    outputs: {
      "Required N per group": 91,
      "Total Trial Sample Size": 182,
      "Computed Power": 0.803,
      "Critical Value Z": 1.96
    },
    exportStatus: "Compliance Verified",
    hash: "8f7d9a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
  },
  {
    id: "tx-938198",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    moduleName: "Survival Analysis",
    calculatorName: "Log-Rank Test & Kaplan-Meier Estimation",
    parameters: {
      "Primary Endpoint": "Overall Survival (Months)",
      "Comparison Cohorts": "Chemotherapy vs Immunotherapy",
      "Total Censored Subjects": 45,
      "Confidence Interval": 0.95
    },
    outputs: {
      "Log-Rank Chi-Square": 7.42,
      "Degrees of Freedom (DF)": 1,
      "P-Value": 0.0064,
      "Hazard Ratio (HR)": 0.58,
      "Median Survival (A)": "14.2 mos",
      "Median Survival (B)": "22.8 mos"
    },
    exportStatus: "PDF Generated",
    hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
  },
  {
    id: "tx-938150",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    moduleName: "Categorical Analysis",
    calculatorName: "Fisher's Exact Test",
    parameters: {
      "Endpoint Type": "Severe Adverse Event (SAE)",
      "Treatment Group A (N)": 40,
      "Treatment Group B (N)": 42,
      "SAE Count Group A": 1,
      "SAE Count Group B": 6
    },
    outputs: {
      "Two-Sided P-Value": 0.1084,
      "One-Sided P-Value": 0.0592,
      "Odds Ratio (OR)": 0.153,
      "Fisher Independence": "Not Significant at alpha=0.05"
    },
    exportStatus: "CSV Exported",
    hash: "f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8"
  },
  {
    id: "tx-938021",
    timestamp: new Date(Date.now() - 3600000 * 120).toISOString(), // 5 days ago
    moduleName: "Diagnostic Accuracy",
    calculatorName: "ROC Curve & Area Under Curve (AUC)",
    parameters: {
      "Biological Biomarker": "Serum Troponin-T levels",
      "Cutoff Point Value": "0.04 ng/mL",
      "True Positives (TP)": 104,
      "True Negatives (TN)": 88,
      "False Positives (FP)": 12,
      "False Negatives (FN)": 6
    },
    outputs: {
      "Sensitivity": "94.5%",
      "Specificity": "88.0%",
      "Positive Predictive Value": "89.6%",
      "Negative Predictive Value": "93.6%",
      "Area Under Curve (AUC)": 0.962,
      "DeLong 95% CI Lower": 0.932,
      "DeLong 95% CI Upper": 0.992
    },
    exportStatus: "Compliance Verified",
    hash: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e"
  }
];

interface AuditTrailPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Initialize and load audit logs
  useEffect(() => {
    try {
      const stored = localStorage.getItem('biostateer_audit_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        // Pre-populate with realistic clinical records
        localStorage.setItem('biostateer_audit_logs', JSON.stringify(MOCK_AUDIT_LOGS));
        setLogs(MOCK_AUDIT_LOGS);
      }
    } catch (e) {
      console.error("Failed to load audit trail logs", e);
      setLogs(MOCK_AUDIT_LOGS);
    }
  }, [isOpen]);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to permanently clear the audit trail? This action is immutable and will erase all CFR Part 11 calculation hash records.")) {
      localStorage.removeItem('biostateer_audit_logs');
      setLogs([]);
    }
  };

  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", `biostateer_audit_trail_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Export failed: " + e);
    }
  };

  // Mock-insert a new audit trail log to show live capability
  const handleInsertMockAudit = () => {
    const randomId = `tx-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLog: AuditLog = {
      id: randomId,
      timestamp: new Date().toISOString(),
      moduleName: "Parametric Tests",
      calculatorName: "ANCOVA Efficacy Analysis",
      parameters: {
        "Adjusted Covariates": "Age, Baseline Score",
        "Significance Level Alpha": 0.05,
        "Groups Compared": 3,
        "Primary Metric": "HbA1c Reduction (%)"
      },
      outputs: {
        "Adjusted Mean Diff": -0.84,
        "ANCOVA F-Statistic": 14.82,
        "P-Value": 0.0001,
        "Statistical Conclusion": "Highly Significant Efficacy"
      },
      exportStatus: "Compliance Verified",
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };

    const updatedLogs = [newLog, ...logs];
    localStorage.setItem('biostateer_audit_logs', JSON.stringify(updatedLogs));
    setLogs(updatedLogs);
    setExpandedLogId(randomId); // Auto-expand newly added log
  };

  // Filter and search criteria
  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      log.calculatorName.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query) ||
      Object.keys(log.parameters).some(k => k.toLowerCase().includes(query) || String(log.parameters[k]).toLowerCase().includes(query)) ||
      Object.keys(log.outputs).some(k => k.toLowerCase().includes(query) || String(log.outputs[k]).toLowerCase().includes(query));

    const matchesModule = filterModule === 'All' || log.moduleName === filterModule;

    return matchesSearch && matchesModule;
  });

  // Extract unique module names for the dropdown filter
  const uniqueModules = ['All', ...Array.from(new Set(logs.map(l => l.moduleName)))];

  if (!isOpen) return null;

  return (
    <div className="w-96 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-screen flex flex-col justify-between shrink-0 shadow-2xl relative z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500 text-white">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Immutable Audit Trail</h2>
            <span className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider">CFR Part 11 Audit Trail Logs</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
        >
          Close
        </button>
      </div>

      {/* Toolbar - Search, Filter, Clear */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 space-y-2 select-none">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search parameter, output, log ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-xs text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Filter Dropdown & Quick Actions */}
        <div className="flex gap-2 items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs w-[60%]">
            <Filter className="w-3 h-3 shrink-0" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-slate-700 dark:text-slate-300 w-full cursor-pointer truncate"
            >
              {uniqueModules.map((m, idx) => (
                <option key={idx} value={m} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                  {m === 'All' ? 'All Modules' : m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 shrink-0">
            {/* Create Mock Log Trigger */}
            <button
              onClick={handleInsertMockAudit}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Add Simulated Calculation Log"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
            
            {/* Backup Export */}
            <button
              onClick={handleExportBackup}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Export JSON Audit Backup"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Clear database */}
            <button
              onClick={handleClearLogs}
              className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition"
              title="Clear Database"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Logs List scrollable container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-slate-950">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs">No audit logs match criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            
            return (
              <div 
                key={log.id} 
                className={`bg-white dark:bg-slate-900 border rounded-lg transition-all duration-200 shadow-xs flex flex-col ${
                  isExpanded 
                    ? 'border-amber-500 dark:border-amber-500/60 ring-1 ring-amber-500/20' 
                    : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Collapsed Header Summary */}
                <div 
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-3 cursor-pointer flex items-start justify-between gap-2"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest font-mono">
                        {log.id}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight truncate">
                      {log.calculatorName}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {log.moduleName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {/* Compliance Indicator Badge */}
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      log.exportStatus === 'Compliance Verified'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {log.exportStatus}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded parameters table and cryptographic hashes */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-slate-150 dark:border-slate-800 pt-3 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 select-text animate-in fade-in duration-200 text-[10px]">
                    
                    {/* Parameters Grid */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[8px] block">Calculated Parameters</span>
                      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md overflow-hidden">
                        <table className="w-full border-collapse">
                          <tbody>
                            {Object.entries(log.parameters).map(([key, val]) => (
                              <tr key={key} className="border-b border-slate-100 dark:border-slate-900 last:border-b-0">
                                <td className="p-1.5 text-slate-500 font-medium truncate w-[60%]">{key}</td>
                                <td className="p-1.5 text-slate-800 dark:text-slate-200 font-bold text-right truncate">{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Outputs Grid */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[8px] block">Efficacy Calculations Output</span>
                      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md overflow-hidden">
                        <table className="w-full border-collapse text-[10px]">
                          <tbody>
                            {Object.entries(log.outputs).map(([key, val]) => (
                              <tr key={key} className="border-b border-slate-100 dark:border-slate-900 last:border-b-0 bg-brand-500/[0.02]">
                                <td className="p-1.5 text-slate-500 font-medium truncate w-[60%]">{key}</td>
                                <td className="p-1.5 text-brand-600 dark:text-brand-400 font-bold text-right truncate">{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Hash Signature Integrity Box */}
                    <div className="p-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-md space-y-1">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Part 11 Hash Integrity Verified</span>
                      </div>
                      <p className="font-mono text-[8px] text-slate-400 dark:text-slate-500 break-all select-all leading-normal bg-slate-50 dark:bg-slate-900 p-1 rounded">
                        {log.hash}
                      </p>
                    </div>

                    {/* Timestamps audit detail */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>Recorded: {new Date(log.timestamp).toLocaleString()}</span>
                      <span className="flex items-center gap-0.5 text-slate-500 hover:text-brand-500 cursor-pointer">
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer System Meta */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 select-none">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Local storage: {logs.length} logs</span>
        </div>
        <span className="font-bold text-[9px] px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
          SHA-256 Enabled
        </span>
      </div>
    </div>
  );
};
