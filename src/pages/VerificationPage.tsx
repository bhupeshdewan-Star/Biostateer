import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Activity, Mail } from "lucide-react";

interface VerificationPageProps {
  email: string;
  isBackendActive: boolean;
  onVerifySuccess: (status: string) => void;
  onBackToLogin: () => void;
}

export default function VerificationPage({ email, isBackendActive, onVerifySuccess, onBackToLogin }: VerificationPageProps) {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpResent, setOtpResent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setErrorMsg("OTP must be a 6-digit numeric code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    if (isBackendActive) {
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: email,
            otp: otp,
            ip_address: "127.0.0.1",
            browser: navigator.userAgent,
            device_type: "Local Desktop"
          })
        });
        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
          onVerifySuccess(data.approval_status);
        } else {
          setErrorMsg(data.detail || "Verification failed. Please check the OTP code.");
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMsg("Failed to communicate with the FastAPI server. Please check the network.");
      }
    } else {
      // Local Precision Fallback verification logic
      setTimeout(() => {
        setIsLoading(false);
        if (otp === "123456" || otp === "654321") {
          onVerifySuccess("Pending Review");
        } else {
          setErrorMsg("Invalid OTP code. Use '123456' for verification.");
        }
      }, 1000);
    }
  };

  const handleResend = async () => {
    setOtpResent(true);
    if (isBackendActive) {
      try {
        await fetch("http://localhost:8000/api/v1/auth/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: email, type: "email" })
        });
      } catch (err) {
        console.error("Resend error", err);
      }
    }
    setTimeout(() => setOtpResent(false), 5000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
            <Mail size={24} />
          </div>
          <h1 className="text-xl font-bold font-display text-slate-100">
            Verify Email Identity
          </h1>
          <p className="text-xs text-slate-400 leading-normal">
            A secure 6-digit One-Time Password (OTP) has been sent to your clinical registration inbox:
            <span className="text-slate-200 font-bold block mt-1">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          
          <div className="space-y-1.5 text-center">
            <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Enter 6-Digit Verification Code</label>
            <input 
              type="text" 
              required
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setErrorMsg("");
              }}
              placeholder="123456"
              className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-center tracking-[12px] text-lg font-bold text-slate-100 font-mono w-full outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:tracking-[2px]"
            />
            {errorMsg && (
              <p className="text-[10px] text-rose-450 font-bold text-center mt-1">
                ✗ {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition active:scale-98 ${
              otp.length === 6 && !isLoading
                ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer shadow-lg shadow-brand-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Validating OTP..." : "Verify Identity Token"}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="flex justify-between items-center text-xs select-none border-t border-slate-850 pt-4">
          <button
            onClick={onBackToLogin}
            className="text-slate-400 hover:text-slate-200 font-semibold transition cursor-pointer"
          >
            ← Return to Login
          </button>
          
          <button
            onClick={handleResend}
            disabled={otpResent}
            className={`font-bold transition ${
              otpResent ? "text-slate-600 cursor-not-allowed" : "text-brand-400 hover:text-brand-350 cursor-pointer"
            }`}
          >
            {otpResent ? "Code simulated! (Wait...)" : "Resend 6-Digit Code"}
          </button>
        </div>

        {/* Local Precision Helper Badge */}
        {!isBackendActive && (
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-amber-500 flex items-center gap-2 leading-tight select-none">
            <Activity size={16} className="text-amber-500 shrink-0" />
            <span>
              <strong>Local Mode Hint:</strong> Use the standard verification OTP code <span className="font-bold text-slate-200 underline">123456</span> to complete registration verification.
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-850 pt-4 text-center text-[9.5px] text-slate-500">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder & Product Owner: Dr. Bhupesh Dewan
          </p>
        </div>

      </div>
    </div>
  );
}
