import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, Download } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Biostateer™ Stability Boundary caught an exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleExportRescueData = () => {
    try {
      const rescued: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("biostateer_") || key === "custom_dataset")) {
          rescued[key] = localStorage.getItem(key);
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rescued, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `biostateer_rescue_data_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to compile local recovery data: " + e);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-6 font-sans text-slate-100 select-none">
          <div className="relative glass-panel max-w-lg w-full p-8 border border-rose-500/20 overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 pulse-bg w-40 h-40 bg-rose-500 rounded-full blur-[70px] opacity-10"></div>
            
            {/* Header Icon */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertOctagon size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">
                  System Stability Alert
                </span>
                <h2 className="text-xl font-bold tracking-tight font-display text-slate-100 mt-1">
                  Biostateer™ Engine Exception
                </h2>
              </div>
            </div>

            {/* Error Message Details */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-rose-400">
                {this.state.error?.name || "Exception"}: {this.state.error?.message || "Unknown rendering or numerical overflow occurred."}
              </p>
              {this.state.errorInfo && (
                <pre className="text-[10px] text-slate-400 font-mono overflow-auto max-h-[120px] custom-scrollbar whitespace-pre-wrap mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              To prevent study data loss, you can download your local session backup or perform a hot-reload of the calculation engine modules.
            </p>

            {/* Actions Grid */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition active:scale-95 cursor-pointer shadow-md"
              >
                <RefreshCw size={14} />
                <span>Recover Interface</span>
              </button>
              
              <button
                onClick={this.handleExportRescueData}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                <span>Download Workspace Backup</span>
              </button>
            </div>

            <div className="text-[9px] text-slate-500 text-center border-t border-slate-900 pt-4">
              Biostateer™ Enterprise Core v1.0.0 | © 2026 Dr. Bhupesh Dewan
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
