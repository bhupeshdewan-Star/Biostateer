import React, { useState } from "react";
import { Users, ShieldAlert, CheckCircle2, XCircle, Search, Sliders, Globe, Clock, BarChart2, ShieldCheck, Database } from "lucide-react";

interface AdminUser {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  country: string;
  organization: string;
  job_title: string;
  user_category: string;
  role: string;
  approval_status: string;
  registration_date: string;
  last_login: string;
  account_expires_at: string | null;
}

interface AdminDashboardProps {
  onLogAudit: (action: string, inputs: any, outputs: any) => void;
}

export default function AdminDashboard({ onLogAudit }: AdminDashboardProps) {
  // Simulated relational users sync (Priority 3 & 4)
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "admin-uuid-001",
      fullname: "Dr. Bhupesh Dewan",
      email: "admin@biostateer.com",
      mobile: "+91 9876543210",
      country: "India",
      organization: "Biostateer™ Clinical",
      job_title: "Founder & Product Owner",
      user_category: "Pharma Professional",
      role: "Administrator",
      approval_status: "Approved",
      registration_date: "2026-05-01T08:00:00Z",
      last_login: "2026-06-01T10:00:00Z",
      account_expires_at: null
    },
    {
      id: "user-uuid-002",
      fullname: "Sarah Jenkins",
      email: "reviewer@biostateer.com",
      mobile: "+1 415 555 2671",
      country: "United States",
      organization: "Harvard Biostat",
      job_title: "Senior Clinical Auditor",
      user_category: "Regulatory Affairs",
      role: "Reviewer",
      approval_status: "Approved",
      registration_date: "2026-05-15T12:00:00Z",
      last_login: "2026-05-31T14:20:00Z",
      account_expires_at: "2026-07-30T12:00:00Z"
    },
    {
      id: "user-uuid-003",
      fullname: "Clinical Evaluator",
      email: "eval@biostateer.com",
      mobile: "+33 6 1234 5678",
      country: "France",
      organization: "Evaluation Institution",
      job_title: "Clinical Biostatistician",
      user_category: "Biostatistician",
      role: "Evaluation User",
      approval_status: "Approved",
      registration_date: "2026-05-28T09:30:00Z",
      last_login: "2026-06-01T09:00:00Z",
      account_expires_at: "2026-07-12T09:30:00Z"
    },
    {
      id: "user-uuid-004",
      fullname: "Akira Tanaka",
      email: "tanaka@osaka-med.jp",
      mobile: "+81 6 6371 1111",
      country: "Japan",
      organization: "Osaka Medical University",
      job_title: "Assistant Professor",
      user_category: "Academic Researcher",
      role: "Evaluation User",
      approval_status: "Pending Review",
      registration_date: "2026-06-01T02:15:00Z",
      last_login: "—",
      account_expires_at: null
    },
    {
      id: "user-uuid-005",
      fullname: "Elena Rostova",
      email: "e.rostova@cro-select.com",
      mobile: "+7 495 123 4567",
      country: "Russia",
      organization: "Select CRO Europe",
      job_title: "Lead CRA",
      user_category: "CRA",
      role: "Evaluation User",
      approval_status: "Waitlisted",
      registration_date: "2026-05-30T16:45:00Z",
      last_login: "—",
      account_expires_at: null
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Status transitions
  const handleUpdateStatus = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let expiry = u.account_expires_at;
        if (newStatus === "Approved") {
          // Set 45-day evaluation expiration timer (Priority 5)
          const date = new Date();
          date.setDate(date.getDate() + 45);
          expiry = date.toISOString();
        } else if (newStatus === "Waitlisted" || newStatus === "Suspended" || newStatus === "Rejected") {
          expiry = null;
        }

        const updated = { ...u, approval_status: newStatus, account_expires_at: expiry };
        if (selectedUser?.id === userId) setSelectedUser(updated);

        // CFR Part 11 Audit Trail log (Priority 3)
        onLogAudit(
          `User Access Status Set to ${newStatus.toUpperCase()}`,
          { userId, email: u.email },
          { approvalStatus: newStatus, licenseExpiresAt: expiry }
        );
        return updated;
      }
      return u;
    }));
  };

  // License Extensions (Priority 5)
  const handleExtendLicense = (userId: string, days: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let currentExpiry = new Date();
        if (u.account_expires_at) {
          currentExpiry = new Date(u.account_expires_at);
          if (currentExpiry < new Date()) currentExpiry = new Date();
        }
        currentExpiry.setDate(currentExpiry.getDate() + days);
        const updated = { ...u, account_expires_at: currentExpiry.toISOString() };
        if (selectedUser?.id === userId) setSelectedUser(updated);

        onLogAudit(
          `Evaluation License Extended by ${days} Days`,
          { userId, email: u.email },
          { extendedExpiresAt: u.account_expires_at }
        );
        return updated;
      }
      return u;
    }));
  };

  const getDaysRemaining = (expiryStr: string | null) => {
    if (!expiryStr) return "N/A (Unlimited)";
    const diff = new Date(expiryStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days <= 0 ? "EXPIRED" : `${days} Days Remaining`;
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || u.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4 select-none">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Users className="text-brand-500 w-7 h-7" />
            User Management & Administrative Auditing
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Review waitlists, authorize clinical access parameters, track visitor session registries, and manage evaluation license expiration.
          </p>
        </div>
      </div>

      {/* Main split dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: User Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 p-4 bg-slate-900 border border-slate-850 rounded-xl select-none">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, country, or organization..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 pl-9 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-center gap-2">
              <Sliders size={13} className="text-slate-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-850 text-slate-350 rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* User List Table */}
          <div className="glass-panel overflow-hidden border border-slate-850">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse select-none">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-500 font-bold border-b border-slate-900 uppercase text-[9px] tracking-wider">
                    <th className="p-3">User & Org</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">License</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300 font-semibold">
                  {filteredUsers.map(u => {
                    const statusColors: Record<string, string> = {
                      Approved: "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20",
                      "Pending Review": "bg-amber-500/10 text-amber-450 border border-amber-500/20 animate-pulse",
                      Waitlisted: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                      Suspended: "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                    };

                    return (
                      <tr 
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className={`hover:bg-slate-900/40 transition cursor-pointer ${
                          selectedUser?.id === u.id ? "bg-brand-500/[0.03]" : ""
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-bold text-slate-200">{u.fullname}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{u.organization}</div>
                        </td>
                        <td className="p-3 text-slate-400">{u.user_category}</td>
                        <td className="p-3 text-slate-400">
                          <div className="flex items-center gap-1">
                            <Globe size={11} className="text-slate-500" />
                            {u.country}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${statusColors[u.approval_status]}`}>
                            {u.approval_status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono">
                          {getDaysRemaining(u.account_expires_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: User Details Drawer Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 border-b border-slate-850 pb-2 mb-2 select-none flex items-center gap-2">
              <Database size={14} className="text-brand-400" />
              Evaluator Profile Auditor
            </h3>

            {selectedUser ? (
              <div className="space-y-4 select-text text-[11px] leading-relaxed">
                
                {/* Header Profile Name */}
                <div className="space-y-1 select-none">
                  <h2 className="text-sm font-extrabold text-slate-200">{selectedUser.fullname}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedUser.job_title} | {selectedUser.user_category}</p>
                </div>

                {/* Profile detail grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3">
                  <div>
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase block select-none">Email address</span>
                    <span className="text-slate-350 font-semibold break-all">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase block select-none">Mobile Contact</span>
                    <span className="text-slate-350 font-semibold">{selectedUser.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase block select-none">Organization</span>
                    <span className="text-slate-350 font-semibold">{selectedUser.organization}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase block select-none">Registration Date</span>
                    <span className="text-slate-350 font-semibold">
                      {new Date(selectedUser.registration_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase block select-none">License Expiry status</span>
                    <span className="text-slate-300 font-mono font-bold">
                      {selectedUser.account_expires_at 
                        ? new Date(selectedUser.account_expires_at).toLocaleString() 
                        : "N/A (Unlimited)"}
                    </span>
                  </div>
                </div>

                {/* Actions Block (Priority 3) */}
                <div className="border-t border-slate-850 pt-4 space-y-3 select-none">
                  <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider block">Access Control Action Panel</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, "Approved")}
                      disabled={selectedUser.approval_status === "Approved"}
                      className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                        selectedUser.approval_status === "Approved" 
                          ? "bg-slate-800 text-slate-500 border-slate-750 cursor-not-allowed" 
                          : "bg-emerald-500/10 text-emerald-450 border-emerald-500/25 hover:bg-emerald-500/15 cursor-pointer"
                      }`}
                    >
                      <CheckCircle2 size={12} /> APPROVE
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, "Waitlisted")}
                      disabled={selectedUser.approval_status === "Waitlisted"}
                      className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                        selectedUser.approval_status === "Waitlisted" 
                          ? "bg-slate-800 text-slate-500 border-slate-750 cursor-not-allowed" 
                          : "bg-purple-500/10 text-purple-400 border-purple-500/25 hover:bg-purple-500/15 cursor-pointer"
                      }`}
                    >
                      <Clock size={12} /> WAITLIST
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, "Suspended")}
                      disabled={selectedUser.approval_status === "Suspended"}
                      className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                        selectedUser.approval_status === "Suspended" 
                          ? "bg-slate-800 text-slate-500 border-slate-750 cursor-not-allowed" 
                          : "bg-rose-500/10 text-rose-450 border-rose-500/25 hover:bg-rose-500/15 cursor-pointer"
                      }`}
                    >
                      <ShieldAlert size={12} /> SUSPEND
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, "Rejected")}
                      disabled={selectedUser.approval_status === "Rejected"}
                      className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                        selectedUser.approval_status === "Rejected" 
                          ? "bg-slate-800 text-slate-500 border-slate-750 cursor-not-allowed" 
                          : "bg-slate-950 text-slate-450 border-slate-850 hover:bg-slate-900 cursor-pointer"
                      }`}
                    >
                      <XCircle size={12} /> REJECT
                    </button>
                  </div>
                </div>

                {/* Expiration Extensions (Priority 5) */}
                {selectedUser.approval_status === "Approved" && (
                  <div className="border-t border-slate-850 pt-4 space-y-2 select-none">
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider block">Evaluation License Extender</span>
                    <div className="grid grid-cols-3 gap-1.5 text-[9.5px] font-extrabold font-mono">
                      <button
                        onClick={() => handleExtendLicense(selectedUser.id, 30)}
                        className="py-1 px-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 hover:bg-slate-900 cursor-pointer text-center"
                      >
                        +30 DAYS
                      </button>
                      <button
                        onClick={() => handleExtendLicense(selectedUser.id, 60)}
                        className="py-1 px-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 hover:bg-slate-900 cursor-pointer text-center"
                      >
                        +60 DAYS
                      </button>
                      <button
                        onClick={() => handleExtendLicense(selectedUser.id, 90)}
                        className="py-1 px-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 hover:bg-slate-900 cursor-pointer text-center"
                      >
                        +90 DAYS
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 select-none">
                <BarChart2 className="w-10 h-10 mx-auto text-slate-750 mb-2" />
                <p>Select any registered clinical evaluator from the table grid to inspect details and manage access permissions.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
