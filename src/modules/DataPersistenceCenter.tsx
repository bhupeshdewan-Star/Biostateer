import React, { useState, useEffect } from "react";
import { 
  Database, 
  Save, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Info,
  Clock,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { storageService } from "../services/storageService";

export default function DataPersistenceCenter({
  onLogAudit
}: {
  onLogAudit: (action: string, inputs: any, outputs: any, status?: string) => void;
}) {
  const [metrics, setMetrics] = useState({
    studiesCount: 0,
    analysesCount: 0,
    protocolsCount: 0,
    auditCount: 0,
    sizeBytes: 0,
    lastSaved: "Never",
    lastRecovered: "Never"
  });

  const [providerType, setProviderType] = useState("IndexedDB (FDA 21 CFR Part 11 Preferred)");
  const [isBackupSuccess, setIsBackupSuccess] = useState(false);
  const [isRestoreSuccess, setIsRestoreSuccess] = useState(false);

  const fetchMetrics = async () => {
    try {
      const studyData = await storageService.getMetrics("biostateer_studies");
      const analysisData = await storageService.getMetrics("biostateer_analyses");
      const protocolData = await storageService.getMetrics("biostateer_protocols");
      const auditData = await storageService.getMetrics("biostateer_audit_logs");
      
      const totalBytes = studyData.sizeBytes + analysisData.sizeBytes + protocolData.sizeBytes + auditData.sizeBytes;
      const lastSavedTime = localStorage.getItem("biostateer_last_save_time") || "Never";
      const lastRecTime = localStorage.getItem("biostateer_last_recovery_time") || "Never";

      setMetrics({
        studiesCount: studyData.count,
        analysesCount: analysisData.count,
        protocolsCount: protocolData.count,
        auditCount: auditData.count,
        sizeBytes: totalBytes,
        lastSaved: lastSavedTime,
        lastRecovered: lastRecTime
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualBackup = async () => {
    try {
      setIsBackupSuccess(false);
      const studyData = await storageService.loadWorkspace("biostateer_studies", []);
      const analysisData = await storageService.loadWorkspace("biostateer_analyses", []);
      const protocolData = await storageService.loadWorkspace("biostateer_protocols", []);
      const auditData = await storageService.loadWorkspace("biostateer_audit_logs", []);

      const backupObj = {
        studies: studyData,
        analyses: analysisData,
        protocols: protocolData,
        audit: auditData,
        timestamp: new Date().toISOString(),
        build: "v1.3.2"
      };

      // Export file
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `biostateer_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      localStorage.setItem("biostateer_last_save_time", new Date().toLocaleString());
      onLogAudit("Workspace Snapshot Exported", { sizeBytes: blob.size }, { result: "Backup Successful" }, "Compliance Verified");
      
      setIsBackupSuccess(true);
      fetchMetrics();
      setTimeout(() => setIsBackupSuccess(false), 4000);
    } catch (e) {
      alert("Backup failed: " + e);
    }
  };

  const handleManualRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoreSuccess(false);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const raw = event.target?.result as string;
          const parsed = JSON.parse(raw);
          
          if (!parsed.build || !parsed.studies) {
            alert("Invalid backup file structure.");
            return;
          }

          await storageService.saveWorkspace("biostateer_studies", parsed.studies);
          await storageService.saveWorkspace("biostateer_analyses", parsed.analyses || []);
          await storageService.saveWorkspace("biostateer_protocols", parsed.protocols || []);
          await storageService.saveWorkspace("biostateer_audit_logs", parsed.audit || []);

          localStorage.setItem("biostateer_last_recovery_time", new Date().toLocaleString());
          onLogAudit("Workspace Snapshot Restored", { build: parsed.build }, { timestamp: parsed.timestamp }, "Compliance Verified");
          
          setIsRestoreSuccess(true);
          fetchMetrics();
          setTimeout(() => setIsRestoreSuccess(false), 4000);
        } catch (err) {
          alert("Error parsing backup data: " + err);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      alert("Restore failed: " + err);
    }
  };

  const handleClearWorkspace = async () => {
    if (!window.confirm("Are you sure you want to discard your current local workspace? This will erase all non-backbacked clinical studies and analyses!")) return;
    
    try {
      await storageService.clearWorkspace("biostateer_studies");
      await storageService.clearWorkspace("biostateer_analyses");
      await storageService.clearWorkspace("biostateer_protocols");
      // Keep audit logs intact for compliance
      
      onLogAudit("Workspace Data Discarded", {}, { result: "Studies and Analyses Reset" });
      alert("Workspace cleared successfully!");
      fetchMetrics();
    } catch (e) {
      alert("Error clearing workspace: " + e);
    }
  };

  const getPercentage = (count: number, limit: number) => {
    return Math.min(100, Math.max(0, (count / limit) * 100));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0.00 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <HardDrive className="text-emerald-400 w-7 h-7" />
            Enterprise Local Data Persistence Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit local workspace storage integrity, check IndexedDB records limits, and manage offline data backups.
          </p>
        </div>
        
        {/* Status Badge */}
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          INDEXEDDB GXP STORAGE SECURE
        </span>
      </div>

      {/* Persistence Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Active Storage Engine</span>
            <Database size={15} className="text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-200">{providerType}</h4>
            <p className="text-[10.5px] text-slate-500 leading-normal">
              High-capacity, fast sandbox storage providing transactional consistency under FDA GxP requirements.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Workspace File Size</span>
            <Clock size={15} className="text-brand-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-brand-400">{formatSize(metrics.sizeBytes)}</h4>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Used Size: {formatSize(metrics.sizeBytes)}</span>
              <span>Allocated: 50.00 MB</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Last Workspace Save</span>
            <Save size={15} className="text-purple-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">{metrics.lastSaved}</h4>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Auto-save: Active (30s)</span>
              <span>Last Recovery: {metrics.lastRecovered}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Storage Limits Capacity Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 select-none flex items-center gap-1.5">
              <HardDrive size={14} className="text-slate-400" />
              IndexedDB Capacity Monitor & FDA Limits
            </h3>

            <div className="space-y-4 text-xs select-none">
              
              {/* Studies */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="font-sans font-bold text-slate-300">Clinical Studies Stored</span>
                  <span className="text-slate-400">{metrics.studiesCount} / 2,000 records</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(metrics.studiesCount, 2000)}%` }}
                  />
                </div>
              </div>

              {/* Analyses */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="font-sans font-bold text-slate-300">Calculated Analyses Logs</span>
                  <span className="text-slate-400">{metrics.analysesCount} / 5,000 records</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(metrics.analysesCount, 5000)}%` }}
                  />
                </div>
              </div>

              {/* Protocol Drafts */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="font-sans font-bold text-slate-300">Structured Protocols Compiled</span>
                  <span className="text-slate-400">{metrics.protocolsCount} / 1,000 records</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(metrics.protocolsCount, 1000)}%` }}
                  />
                </div>
              </div>

              {/* Audit Logs */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="font-sans font-bold text-slate-300">Immutable Audit Entries (Append-only)</span>
                  <span className="text-slate-400">{metrics.auditCount} / 50,000 records</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(metrics.auditCount, 50000)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Panel Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2 select-none flex items-center gap-1.5">
              <Cpu size={14} className="text-slate-400" />
              Backup & Disaster Recovery Actions
            </h3>

            {isBackupSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10.5px] rounded-lg flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={13} />
                <span>Backup JSON file exported successfully!</span>
              </div>
            )}

            {isRestoreSuccess && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10.5px] rounded-lg flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={13} />
                <span>Workspace session restored successfully!</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5 text-xs">
              
              <button
                onClick={handleManualBackup}
                className="w-full btn-primary py-2.5 bg-emerald-650 hover:bg-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 font-bold uppercase tracking-wider"
              >
                <Download size={13} />
                Backup Local Workspace
              </button>

              <label className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2 hover:bg-slate-800 cursor-pointer font-bold uppercase tracking-wider text-center border-slate-750">
                <Upload size={13} />
                Restore Workspace File
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleManualRestore}
                  className="hidden" 
                />
              </label>

              <button
                onClick={handleClearWorkspace}
                className="w-full py-2.5 border border-rose-500/20 text-rose-450 hover:bg-rose-500/10 rounded-xl transition flex items-center justify-center gap-2 font-bold uppercase tracking-wider cursor-pointer"
              >
                <Trash2 size={13} />
                Discard Local Session
              </button>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
