import React from "react";

export default function ModuleLoadingPlaceholder({ moduleName }: { moduleName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 select-none animate-in fade-in duration-300">
      {/* Premium Glassmorphic Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-250 dark:border-slate-850"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
        <div className="w-8 h-8 rounded-full bg-slate-100/40 dark:bg-slate-950/40 backdrop-blur-md border border-slate-250 dark:border-slate-850 shadow-inner flex items-center justify-center text-[10px] font-bold text-purple-400 font-mono">
          BS
        </div>
      </div>
      
      <div className="space-y-1.5 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-[9.5px] font-bold uppercase tracking-widest animate-pulse">
          Decrypting Secure Workspace
        </p>
        {moduleName && (
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 font-display">
            {moduleName}
          </h4>
        )}
      </div>

      <div className="text-[9.5px] text-slate-400 dark:text-slate-600 font-mono font-bold">
        Biostateer™ Enterprise v1.3.2 • Active Sandbox
      </div>
    </div>
  );
}
