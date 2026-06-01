import React from "react";
import { BarChart3, TrendingUp, Globe2, Activity, PieChart, Users, Cpu, FileSpreadsheet, CheckCircle, Clock } from "lucide-react";

export default function AdminAnalytics() {
  // Mock aggregated analytics data based on Priority 7 requirements
  const userMetrics = {
    total: 142,
    pending: 12,
    approved: 110,
    waitlisted: 15,
    expired: 5,
    activeToday: 42
  };

  const countries = [
    { country: "United States", count: 48, percentage: 34 },
    { country: "India", count: 32, percentage: 22 },
    { country: "France", count: 18, percentage: 13 },
    { country: "Japan", count: 14, percentage: 10 },
    { country: "United Kingdom", count: 12, percentage: 8 },
    { country: "Germany", count: 10, percentage: 7 },
    { country: "Others", count: 8, percentage: 6 }
  ];

  const categories = [
    { category: "Biostatisticians", count: 52 },
    { category: "Clinical Research Associates (CRA)", count: 28 },
    { category: "Principal Investigators (PI)", count: 22 },
    { category: "Regulatory Affairs", count: 18 },
    { category: "Medical Affairs", count: 12 },
    { category: "Academic & Students", count: 10 }
  ];

  const moduleUsage = [
    { name: "Stratified Survival Suite", count: 342, type: "Advanced" },
    { name: "CDISC Ingestion & P21 Validation", count: 286, type: "Standards" },
    { name: "Clinical Trial Randomization Hub", count: 220, type: "Design" },
    { name: "Diagnostic Accuracy Suite", count: 198, type: "Diagnostic" },
    { name: "Missing Data Imputation MCAR/MICE", count: 145, type: "Cleaning" },
    { name: "Sample Size Spent Boundary Curves", count: 122, type: "Design" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-brand-500 w-7 h-7" />
            Product Analytics Command Center
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time telemetry tracking clinical registries, demographic distributions, average session duration, and calculators popularity rankings.
          </p>
        </div>
      </div>

      {/* Dials row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/10 rounded-lg text-brand-400">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Registrations</span>
            <span className="text-sm font-extrabold text-slate-200">{userMetrics.total} Users</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-450">
            <Activity size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Reviewers</span>
            <span className="text-sm font-extrabold text-slate-200">{userMetrics.activeToday} Evaluators</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-450">
            <CheckCircle size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Approved Access</span>
            <span className="text-sm font-extrabold text-slate-200">{userMetrics.approved} Accounts</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Session Time</span>
            <span className="text-sm font-extrabold text-slate-200">24.5 Minutes</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Rankings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Geographic Analytics (P7 Country Distribution) */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 select-none flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Globe2 size={14} className="text-brand-400" />
            Geographic Acquisition Demographics
          </h3>
          
          <div className="space-y-3.5 select-text text-xs">
            {countries.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-[11px]">
                  <span className="text-slate-300">{c.country}</span>
                  <span className="text-slate-500">{c.count} Registrations ({c.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Segment Distribution (P7 Demographics) */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 select-none flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <PieChart size={14} className="text-purple-400" />
            Professional Demographics Index
          </h3>

          <div className="space-y-3.5 select-text text-xs">
            {categories.map((cat, idx) => {
              const colors = ["bg-brand-500", "bg-purple-500", "bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-slate-600"];
              const percentage = Math.round((cat.count / 142) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-semibold text-[11px]">
                    <span className="text-slate-350">{cat.category}</span>
                    <span className="text-slate-500">{cat.count} Accounts ({percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Usage Analytics (P7 Statistical Rankings) */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 select-none flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Cpu size={14} className="text-brand-400" />
            Statistical Module & Calculator Popularity Rankings
          </h3>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-slate-950/40 text-slate-500 font-bold border-b border-slate-900 uppercase text-[9px] tracking-wider">
                  <th className="p-3">Calculation Workspace Module</th>
                  <th className="p-3">Category Classification</th>
                  <th className="p-3 text-right">Executions Audited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300 font-semibold">
                {moduleUsage.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/20">
                    <td className="p-3 font-bold text-slate-200 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-550">#{idx + 1}</span>
                      {m.name}
                    </td>
                    <td className="p-3 text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-[9.5px]">
                        {m.type}
                      </span>
                    </td>
                    <td className="p-3 text-right text-brand-400 font-mono font-bold">
                      {m.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Exporter reports footnote */}
      <div className="border-t border-slate-850 pt-4 text-center select-text text-[9.5px] text-slate-500 select-none">
        <p className="font-semibold text-slate-400">
          Biostateer™ Version 1.3 | Founder & Product Owner: Dr. Bhupesh Dewan
        </p>
      </div>

    </div>
  );
}
