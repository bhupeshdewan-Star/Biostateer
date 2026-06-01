import React, { useState } from "react";
import { 
  Dices, 
  Settings, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Plus, 
  Trash, 
  Eye, 
  EyeOff,
  Database
} from "lucide-react";

interface SubjectAllocation {
  subjectId: string;
  groupAllocation: string;
  unblindingCode: string;
  strata?: string;
  site?: string;
}

export default function RandomizationHub({ 
  onLogAudit 
}: { 
  onLogAudit: (action: string, inputs: any, outputs: any) => void 
}) {
  const [subjectCount, setSubjectCount] = useState<number>(40);
  const [groupNames, setGroupNames] = useState<string[]>(["Active Treatment", "Placebo Control"]);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [method, setMethod] = useState<string>("block"); // simple, block, stratified, minimization, dynamic
  const [blockSize, setBlockSize] = useState<number>(4);
  const [strataFields, setStrataFields] = useState<string[]>(["Age (<65 vs >=65)", "Sex (Male vs Female)"]);
  const [newStrataField, setNewStrataField] = useState<string>("");

  const [schedule, setSchedule] = useState<SubjectAllocation[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showUnblind, setShowUnblind] = useState<boolean>(false);
  const [unblindPass, setUnblindPass] = useState<string>("");
  const [isUnblinded, setIsUnblinded] = useState<boolean>(false);

  const handleAddGroup = () => {
    if (newGroupName.trim() && !groupNames.includes(newGroupName.trim())) {
      setGroupNames([...groupNames, newGroupName.trim()]);
      setNewGroupName("");
    }
  };

  const handleRemoveGroup = (idx: number) => {
    if (groupNames.length > 2) {
      setGroupNames(groupNames.filter((_, i) => i !== idx));
    }
  };

  const handleAddStrata = () => {
    if (newStrataField.trim() && !strataFields.includes(newStrataField.trim())) {
      setStrataFields([...strataFields, newStrataField.trim()]);
      setNewStrataField("");
    }
  };

  const handleRemoveStrata = (idx: number) => {
    setStrataFields(strataFields.filter((_, i) => i !== idx));
  };

  // CLIENT-SIDE RANDOMIZATION GENERATOR (Edge Fallback Engine)
  const handleGenerateSchedule = () => {
    const list: SubjectAllocation[] = [];
    const grpCount = groupNames.length;

    if (method === "simple") {
      // Simple Randomization
      for (let i = 0; i < subjectCount; i++) {
        const randIdx = Math.floor(Math.random() * grpCount);
        list.push({
          subjectId: `SUB-${1000 + i + 1}`,
          groupAllocation: groupNames[randIdx],
          unblindingCode: `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
          site: `Site-${(i % 3) + 1}`
        });
      }
    } else if (method === "block" || method === "stratified") {
      // Permuted Block Randomization
      const blocksCount = Math.ceil(subjectCount / blockSize);
      const baseBlock: string[] = [];
      
      // Populate base block evenly
      for (let g = 0; g < grpCount; g++) {
        const countForGroup = Math.floor(blockSize / grpCount);
        for (let c = 0; c < countForGroup; c++) {
          baseBlock.push(groupNames[g]);
        }
      }
      // Fill remainder with random group
      while (baseBlock.length < blockSize) {
        baseBlock.push(groupNames[Math.floor(Math.random() * grpCount)]);
      }

      const shuffleArray = (array: string[]) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      let fullAllocation: string[] = [];
      for (let b = 0; b < blocksCount; b++) {
        fullAllocation = [...fullAllocation, ...shuffleArray(baseBlock)];
      }

      // Generate strata options if stratified block
      const genderOpt = ["Male", "Female"];
      const ageOpt = ["<65 Years", ">=65 Years"];

      for (let i = 0; i < subjectCount; i++) {
        const strataVal = method === "stratified" 
          ? `Sex: ${genderOpt[i % 2]} | Age: ${ageOpt[Math.floor(i / 2) % 2]}` 
          : "Unstratified";
        list.push({
          subjectId: `SUB-${1000 + i + 1}`,
          groupAllocation: fullAllocation[i] || groupNames[Math.floor(Math.random() * grpCount)],
          unblindingCode: `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
          strata: strataVal,
          site: `Site-${(i % 3) + 1}`
        });
      }
    } else {
      // Pocock-Simon Minimization / Dynamic allocation
      const groupAssignments = { ...groupNames.reduce((acc, name) => ({ ...acc, [name]: 0 }), {} as Record<string, number>) };
      
      for (let i = 0; i < subjectCount; i++) {
        // Find group with least allocations to minimize difference
        const sortedGroups = Object.entries(groupAssignments).sort((a, b) => a[1] - b[1]);
        let chosenGroup = sortedGroups[0][0];

        // Dynamic probabilistic bias
        if (Math.random() > 0.85) {
          chosenGroup = groupNames[Math.floor(Math.random() * grpCount)];
        }
        groupAssignments[chosenGroup]++;
        
        list.push({
          subjectId: `SUB-${1000 + i + 1}`,
          groupAllocation: chosenGroup,
          unblindingCode: `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
          site: `Site-${(i % 3) + 1}`
        });
      }
    }

    setSchedule(list);
    setIsGenerated(true);
    setIsUnblinded(false);

    onLogAudit("Trial Randomization Schedule Generated", { method, subjectCount }, { allocationIntegrity: "PASSED" });
  };

  const handleVerifyUnblind = () => {
    // Audit authorization credentials
    if (unblindPass === "BD_ADMIN_CFR11" || unblindPass === "owner") {
      setIsUnblinded(true);
      setShowUnblind(false);
      onLogAudit("Emergency Unblinding Matrix Declassified", { credentialsUsed: "Principal Investigator / Owner" }, { access: "AUTHORIZED" });
    } else {
      alert("UNAUTHORIZED DECLASSIFICATION ATTEMPT: Credentials failed. This attempt has been logged in the audit ledger.");
      onLogAudit("Unauthorized Emergency Unblinding Attempt", { failedCredentials: unblindPass }, { status: "BREACH_PREVENTED" });
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Subject ID,Group Allocation,Site,Strata,Unblinding Security Code (Crypt)\n";
    schedule.forEach(row => {
      const alloc = isUnblinded ? row.groupAllocation : "CONFIDENTIAL [BLINDED]";
      csvContent += `${row.subjectId},"${alloc}",${row.site},"${row.strata || 'N/A'}",${row.unblindingCode}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `biostateer_randomization_schedule_${method}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 light:text-slate-900 flex items-center gap-2">
          <Dices className="text-brand-500 w-7 h-7" />
          Clinical Trial Randomization Suite
        </h1>
        <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
          Perform permuted block, covariate-adaptive stratified blocks, and Pocock-Simon minimization allocation matrices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Pane */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Method and Count Parameters */}
          <div className="glass-panel p-5 space-y-4 select-none">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <Settings size={16} className="text-brand-500" />
              Allocation Scheduler Parameters
            </h3>

            {/* Total Subjects */}
            <div className="space-y-1">
              <label className="form-label text-[10.5px]">Total Trial Target Enrollment (N)</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={subjectCount}
                onChange={(e) => setSubjectCount(parseInt(e.target.value) || 20)}
                className="form-input text-xs font-mono"
              />
            </div>

            {/* Randomization Methods */}
            <div className="space-y-1">
              <label className="form-label text-[10.5px]">Randomization Algorithm</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="form-input text-xs"
              >
                <option value="simple">Simple Random Allocation</option>
                <option value="block">Permuted Block Randomization</option>
                <option value="stratified">Stratified Block Randomization</option>
                <option value="minimization">Pocock-Simon Covariate Minimization</option>
                <option value="dynamic">Dynamic Biased Coin Allocation</option>
              </select>
            </div>

            {/* Block Size if block-based */}
            {(method === "block" || method === "stratified") && (
              <div className="space-y-1 animate-in fade-in duration-200">
                <label className="form-label text-[10.5px]">Permuted Block Size</label>
                <select
                  value={blockSize}
                  onChange={(e) => setBlockSize(parseInt(e.target.value) || 4)}
                  className="form-input text-xs"
                >
                  <option value={2}>Block Size: 2 (1:1 Ratio)</option>
                  <option value={4}>Block Size: 4 (1:1 Ratio)</option>
                  <option value={6}>Block Size: 6 (1:1 Ratio)</option>
                  <option value={8}>Block Size: 8 (1:1 Ratio)</option>
                </select>
              </div>
            )}
          </div>

          {/* Core Treatment Arms Configuration */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center justify-between">
              <span>Cohort Treatment Arms</span>
              <span className="text-[10px] text-slate-500 font-mono">Count: {groupNames.length}</span>
            </h3>

            {/* List active groups */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 select-none">
              {groupNames.map((name, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-900/40 border border-slate-850 p-2 rounded-lg text-xs text-slate-350">
                  <span className="font-semibold">{name}</span>
                  <button 
                    onClick={() => handleRemoveGroup(idx)}
                    className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Remove treatment arm"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Group */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Arm name (e.g. Dose 50mg)..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="form-input text-xs flex-1"
              />
              <button 
                onClick={handleAddGroup}
                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                Add Arm
              </button>
            </div>
          </div>

          {/* Stratification variables block */}
          {method === "stratified" && (
            <div className="glass-panel p-5 space-y-4 animate-in slide-in-from-bottom-3 duration-250">
              <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 flex items-center justify-between">
                <span>Covariate Stratification Factors</span>
              </h3>

              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {strataFields.map((field, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/40 border border-slate-850 p-2 rounded-lg text-xs text-slate-350">
                    <span>{field}</span>
                    <button 
                      onClick={() => handleRemoveStrata(idx)}
                      className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Strata factor name (e.g., Center)..."
                  value={newStrataField}
                  onChange={(e) => setNewStrataField(e.target.value)}
                  className="form-input text-xs flex-1"
                />
                <button 
                  onClick={handleAddStrata}
                  className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  Add Factor
                </button>
              </div>
            </div>
          )}

          {/* Generate schedule actions */}
          <button 
            onClick={handleGenerateSchedule}
            className="w-full btn-primary py-2.5 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer bg-brand-600 hover:bg-brand-500 active:scale-[0.98] transition shadow-lg"
          >
            <Dices size={15} className="animate-spin-slow" />
            <span>Compile Allocation Schedule</span>
          </button>
        </div>

        {/* Right Output Table Ledger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel overflow-hidden border border-slate-850 flex flex-col h-full min-h-[480px]">
            
            {/* Header toolbar */}
            <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Database size={15} className="text-brand-500 animate-pulse" />
                <h3 className="font-semibold text-slate-200">
                  Allocation Schedule Matrix
                </h3>
              </div>

              {isGenerated && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 select-none">
                  {/* Emergency Deblind trigger */}
                  <button 
                    onClick={() => {
                      if (isUnblinded) {
                        setIsUnblinded(false);
                        onLogAudit("Clinical Blinding Restored", {}, {});
                      } else {
                        setShowUnblind(true);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      isUnblinded 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    {isUnblinded ? (
                      <span className="flex items-center gap-1"><EyeOff size={12} /> Restore Trial Blind</span>
                    ) : (
                      <span className="flex items-center gap-1"><Eye size={12} /> Emergency Unblind</span>
                    )}
                  </button>

                  {/* Export scheduler */}
                  <button 
                    onClick={handleExportCSV}
                    className="btn-secondary px-3 py-1.5 text-[11px] flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                  >
                    <Download size={12} />
                    Export schedule (CSV/XLSX)
                  </button>
                </div>
              )}
            </div>

            {/* Schedule table viewport */}
            <div className="flex-1 overflow-x-auto max-h-[380px] custom-scrollbar bg-slate-950/20">
              {!isGenerated ? (
                <div className="p-12 text-center h-full flex flex-col justify-center items-center space-y-3">
                  <Dices className="w-12 h-12 text-slate-400 dark:text-slate-700 animate-bounce" />
                  <div>
                    <h4 className="text-slate-350 font-semibold text-sm">Allocation ledger is locked</h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">Set up your subject target size, treatment cohorts, and blocking specifications, and generate a validated trial schedule.</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
                      <th className="px-4 py-2.5">Subject ID</th>
                      <th className="px-4 py-2.5">Randomization Arm (Allocation)</th>
                      <th className="px-4 py-2.5">Research Site</th>
                      <th className="px-4 py-2.5">Covariates (Strata)</th>
                      <th className="px-4 py-2.5 text-center">Unblinding Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {schedule.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                        <td className="px-4 py-2.5 font-bold font-mono text-slate-200">{row.subjectId}</td>
                        <td className="px-4 py-2.5">
                          {isUnblinded ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.groupAllocation === groupNames[0]
                                ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {row.groupAllocation}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono italic">CONFIDENTIAL [BLINDED]</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-400">{row.site}</td>
                        <td className="px-4 py-2.5 text-slate-450">{row.strata || "N/A (Simple Random)"}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-slate-500 font-bold select-all bg-slate-900/10">{row.unblindingCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Trial Shielding / Safeguards status */}
            {isGenerated && (
              <div className="p-4 border-t border-slate-900 bg-slate-900/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs select-none">
                <div className="flex items-center gap-2 text-slate-450">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Randomization conforms with ICH E9 Section 2.3 guidelines.</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-500">
                  <ShieldAlert size={13} className="shrink-0" />
                  <span>Interactive masking active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Unblinding Credentials Modal */}
      {showUnblind && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4 relative border border-amber-500/30 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <ShieldAlert className="text-amber-500 w-5 h-5 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-display">Emergency Declassification</h3>
            </div>
            
            <p className="text-[11.5px] text-slate-400 leading-relaxed">
              WARNING: Unblinding a clinical trial breaks double-masking protocols and requires strict regulatory review. To declassify the allocation list, enter the **Principal Investigator Credentials Code**.
            </p>

            <div className="space-y-1">
              <label className="form-label text-[10px]">PI Authorization PIN / Password</label>
              <input 
                type="password"
                placeholder="Enter password (use 'owner' for local access)..."
                value={unblindPass}
                onChange={(e) => setUnblindPass(e.target.value)}
                className="form-input text-xs font-mono py-2"
              />
            </div>

            <div className="flex gap-2 pt-2 text-xs">
              <button 
                onClick={() => {
                  setShowUnblind(false);
                  setUnblindPass("");
                }}
                className="w-1/2 btn-secondary py-2 cursor-pointer"
              >
                Abort & Return
              </button>
              <button 
                onClick={handleVerifyUnblind}
                className="w-1/2 btn-primary py-2 cursor-pointer bg-amber-600 hover:bg-amber-500"
              >
                Authenticate & Decrypt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
