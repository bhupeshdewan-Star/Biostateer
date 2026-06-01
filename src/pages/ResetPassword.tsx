import React, { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, Check, X } from "lucide-react";

interface ResetPasswordProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function ResetPassword({ email, onBack, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Password complexity rules (Priority 1)
  const rules = {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isComplex = Object.values(rules).every(Boolean);
  const matches = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = isComplex && matches && !isLoading;

  const getStrengthPercent = () => {
    const passed = Object.values(rules).filter(Boolean).length;
    return (passed / 5) * 100;
  };

  const getStrengthColor = () => {
    const percent = getStrengthPercent();
    if (percent <= 40) return "bg-rose-500";
    if (percent <= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    const percent = getStrengthPercent();
    if (percent <= 40) return "WEAK CAPABILITIES";
    if (percent <= 80) return "MEDIUM COMPLEXITY";
    return "STRONG SECURITY CONFIGURATION";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />

        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold font-display text-slate-100">
            Establish Secure Access
          </h1>
          <p className="text-xs text-slate-400">
            Define a high-complexity passphrase for account recovery on <span className="text-slate-200 font-semibold">{email}</span>.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-[10px] font-semibold mt-1 ${matches ? "text-emerald-450" : "text-rose-450"}`}>
                  {matches ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Password Strength Meter */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                <span>Strength Assessment:</span>
                <span className={getStrengthPercent() === 100 ? "text-emerald-400 animate-pulse" : ""}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${getStrengthPercent()}%` }}
                />
              </div>

              {/* Strict Requirements Checklist */}
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[10px] text-slate-400 font-semibold border-t border-slate-900 mt-1 select-none">
                <span className="flex items-center gap-1">
                  {rules.length ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-rose-500" />}
                  At least 12 characters
                </span>
                <span className="flex items-center gap-1">
                  {rules.upper ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-rose-500" />}
                  Uppercase letter [A-Z]
                </span>
                <span className="flex items-center gap-1">
                  {rules.lower ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-rose-500" />}
                  Lowercase letter [a-z]
                </span>
                <span className="flex items-center gap-1">
                  {rules.number ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-rose-500" />}
                  Number [0-9]
                </span>
                <span className="flex items-center gap-1 col-span-2">
                  {rules.special ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-rose-500" />}
                  Special symbol (!@#$%^&*)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition active:scale-98 ${
                canSubmit
                  ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer shadow-lg shadow-brand-500/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Saving secure keys..." : "Register Secure Access Password"}
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-200">
                Password updated successfully!
              </p>
              <p className="text-[11px] text-slate-400 leading-normal">
                Your secure access key has been updated and seeded inside the secure authentication registries.
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition cursor-pointer"
            >
              Return to Login Panel
            </button>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold transition cursor-pointer"
          >
            Cancel and Return
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-850 pt-4 text-center text-[9.5px] text-slate-500">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder: Dr. Bhupesh Dewan
          </p>
        </div>
      </div>
    </div>
  );
}
