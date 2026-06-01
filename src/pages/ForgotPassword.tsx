import React, { useState } from "react";
import { Mail, ArrowRight, ShieldCheck, Activity } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
  onNavigateToReset: (email: string) => void;
}

export default function ForgotPassword({ onBack, onNavigateToReset }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call to register password reset
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
          <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold font-display text-slate-100">
            Recover Access Keys
          </h1>
          <p className="text-xs text-slate-400">
            Provide your registered clinical email to verify credentials and reset access.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Clinical Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition active:scale-98 ${
                email && !isLoading
                  ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Validating Account..." : "Request Access Recovery Link"}
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Access recovery instructions simulated successfully!
              </p>
              <p className="text-[11px] text-slate-400 leading-normal">
                An active token and link have been compiled to <span className="text-slate-200 font-bold">{email}</span>. Click the button below to update your password credentials.
              </p>
            </div>
            <button
              onClick={() => onNavigateToReset(email)}
              className="w-full py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition cursor-pointer"
            >
              Proceed to Reset Password
            </button>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold transition cursor-pointer"
          >
            ← Return to Sign In Gateway
          </button>
        </div>

        {/* Footers */}
        <div className="border-t border-slate-850 pt-4 text-center text-[9.5px] text-slate-500">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder: Dr. Bhupesh Dewan
          </p>
        </div>
      </div>
    </div>
  );
}
