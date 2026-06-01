import React, { useState } from "react";
import { UploadCloud, ShieldCheck, Lock, Unlock, Settings, Trash2, Info, FileSpreadsheet } from "lucide-react";

export default function DataRepository() {
  const [datasets, setDatasets] = useState([
    {
      id: "repo-001",
      name: "SGLT2_Cardio_ADTTE.csv",
      type: "ADaM Dataset",
      version: "v1.0",
      rowCount: 340,
      columnsCount: 18,
      locked: true,
      lastModified: "May 31, 2026",
      operator: "Sarah Jenkins"
    },
    {
      id: "repo-002",
      name: "VS_BloodPressure_SDTM.xlsx",
      type: "SDTM Dataset",
      version: "v1.2",
      rowCount: 120,
      columnsCount: 14,
      locked: false,
      lastModified: "May 30, 2026",
      operator: "Dr. Bhupesh Dewan"
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: "log-1", date: "2026-05-31 14:20:15", user: "Sarah Jenkins", action: "Locked SGLT2_Cardio_ADTTE.csv (Frozen for Protocol SAP)" },
    { id: "log-2", date: "2026-05-31 10:15:30", user: "Dr. Bhupesh Dewan", action: "Uploaded VS_BloodPressure_SDTM.xlsx Version 1.2" }
  ]);

  const toggleDatasetLock = (id: string) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        const nextLock = !ds.locked;
        const newLog = {
          id: `log-${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          user: "Administrator",
          action: `${nextLock ? "Locked" : "Unlocked"} ${ds.name} dataset in active workspace.`
        };
        setAuditLogs(l => [newLog, ...l]);
        return { ...ds, locked: nextLock };
      }
      return ds;
    }));
  };

  const handleDeleteDataset = (id: string, name: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== id));
    const newLog = {
      id: `log-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: "Administrator",
      action: `Deleted ${name} from Data Repository.`
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 flex items-center gap-2">
            <UploadCloud className="text-brand-500 w-7 h-7" />
            Clinical Data & SDTM Repository
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Store, version, audit, and lock clinical datasets prior to executing regulatory hypothesis tests.
          </p>
        </div>

        <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
          DATA REPOSITORY VERSION 1.0
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Dataset Table Column */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-panel p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Registered Trial Datasets
              </h3>
            </div>

            <div className="space-y-3.5 select-text">
              {datasets.map((ds) => (
                <div
                  key={ds.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3.5 bg-slate-950/20 hover:bg-slate-900/40 border border-slate-850 rounded-xl transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-200 text-[12.5px]">{ds.name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-[9px] text-slate-400 font-bold uppercase font-mono">
                        {ds.version}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[9px] font-bold uppercase font-mono">
                        {ds.type}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[10.5px] text-slate-500 font-semibold flex-wrap">
                      <span>Rows: <strong className="text-slate-400">{ds.rowCount}</strong></span>
                      <span>Columns: <strong className="text-slate-400">{ds.columnsCount}</strong></span>
                      <span>Operator: <strong className="text-slate-400">{ds.operator}</strong></span>
                      <span>Modified: <strong className="text-slate-400">{ds.lastModified}</strong></span>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex gap-2 mt-3.5 md:mt-0 select-none">
                    <button 
                      onClick={() => toggleDatasetLock(ds.id)} 
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                        ds.locked 
                          ? "bg-rose-500/10 text-rose-450 border-rose-500/20" 
                          : "bg-slate-900 text-slate-350 border-slate-800 hover:bg-slate-850"
                      }`}
                    >
                      {ds.locked ? <Lock size={12} /> : <Unlock size={12} />}
                      {ds.locked ? "LOCKED (FROZEN)" : "LOCK DATASET"}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteDataset(ds.id, ds.name)} 
                      disabled={ds.locked}
                      className={`p-1.5 rounded-lg border transition ${
                        ds.locked 
                          ? "text-slate-600 border-slate-900 cursor-not-allowed" 
                          : "text-rose-500 border-rose-500/10 hover:bg-rose-500/10 cursor-pointer"
                      }`}
                      title={ds.locked ? "Locked datasets cannot be deleted." : "Delete Dataset"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {datasets.length === 0 && (
                <p className="text-slate-500 text-center py-6 font-semibold">No datasets registered in the data repository.</p>
              )}
            </div>
          </div>

        </div>

        {/* Audit trail / logs Column */}
        <div className="lg:col-span-4 space-y-6 select-none">
          
          <div className="glass-panel p-5 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">
              Repository Audit Trail
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar text-[10px] select-text">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950/45 border border-slate-850 rounded-lg space-y-1">
                  <div className="flex justify-between font-mono font-bold text-slate-500">
                    <span>{log.user}</span>
                    <span>{log.date}</span>
                  </div>
                  <p className="text-slate-300 leading-normal font-semibold mt-0.5">{log.action}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
