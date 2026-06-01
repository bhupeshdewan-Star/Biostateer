import React, { useState } from "react";
import { Activity, Mail, Lock, Sliders, Dices, Sigma, Hourglass, ShieldAlert, Cpu, Heart, CheckCircle } from "lucide-react";

interface LoginPageProps {
  isBackendActive: boolean;
  onLoginSuccess: (user: any) => void;
  onRequestAccess: () => void;
  onForgotPassword: () => void;
}

export default function LoginPage({ isBackendActive, onLoginSuccess, onRequestAccess, onForgotPassword }: LoginPageProps) {
  const [showLanding, setShowLanding] = useState(true);
  const [loginMethod, setLoginMethod] = useState<"password" | "mobile" | "email_otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  const isLocked = failedAttempts >= 5;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setErrorMsg("Your account is locked due to 5 consecutive failed login attempts. Please contact Dr. Bhupesh Dewan.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    if (loginMethod === "password") {
      if (isBackendActive) {
        try {
          const res = await fetch("http://localhost:8000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              password: password,
              ip_address: "127.0.0.1",
              browser: navigator.userAgent,
              device_type: "Local Desktop"
            })
          });
          const data = await res.json();
          setIsLoading(false);

          if (res.ok) {
            onLoginSuccess(data.user);
          } else {
            setFailedAttempts(prev => prev + 1);
            setErrorMsg(data.detail || "Invalid email or password.");
          }
        } catch (err) {
          setIsLoading(false);
          setErrorMsg("Failed to communicate with the FastAPI server. Please check the network.");
        }
      } else {
        // Fallback simulated authentication (Priority 1)
        setTimeout(() => {
          setIsLoading(false);
          if (email === "admin@biostateer.com" && password === "admin123") {
            onLoginSuccess({
              id: "admin-uuid-001",
              username: "admin",
              fullname: "Dr. Bhupesh Dewan",
              email: "admin@biostateer.com",
              mobile: "+91 9876543210",
              country: "India",
              city: "Mumbai",
              organization: "Biostateer™ Clinical",
              job_title: "Founder & Product Owner",
              user_category: "Pharma Professional",
              role: "Administrator",
              approval_status: "Approved",
              registration_date: "2026-05-01T08:00:00Z",
              last_login: new Date().toISOString(),
              account_expires_at: null,
              terms_version: "v1.3",
              privacy_version: "v1.3"
            });
          } else if (email === "eval@biostateer.com" && password === "eval123") {
            const userData = {
              id: "user-uuid-003",
              username: "evaluator",
              fullname: "Clinical Evaluator",
              email: "eval@biostateer.com",
              mobile: "+33 6 1234 5678",
              country: "France",
              city: "Paris",
              organization: "Evaluation Institution",
              job_title: "Clinical Biostatistician",
              user_category: "Biostatistician",
              role: "Evaluation User",
              approval_status: "Approved",
              registration_date: "2026-05-28T09:30:00Z",
              last_login: new Date().toISOString(),
              account_expires_at: new Date(Date.now() + 42 * 24 * 3600 * 1000).toISOString(), // 42 days remaining
              terms_version: "v1.3",
              privacy_version: "v1.3"
            };
            if (rememberMe) {
              localStorage.setItem("biostateer_remembered_user", JSON.stringify({
                email: userData.email,
                fullname: userData.fullname,
                organization: userData.organization,
                role: userData.role,
                job_title: userData.job_title,
                user_category: userData.user_category
              }));
            } else {
              localStorage.removeItem("biostateer_remembered_user");
            }
            onLoginSuccess(userData);
          } else if (email === "reviewer@biostateer.com" && password === "reviewer123") {
            onLoginSuccess({
              id: "user-uuid-002",
              username: "reviewer",
              fullname: "Sarah Jenkins",
              email: "reviewer@biostateer.com",
              mobile: "+1 415 555 2671",
              country: "United States",
              city: "Boston",
              organization: "Harvard Biostat",
              job_title: "Senior Clinical Auditor",
              user_category: "Regulatory Affairs",
              role: "Reviewer",
              approval_status: "Approved",
              registration_date: "2026-05-15T12:00:00Z",
              last_login: new Date().toISOString(),
              account_expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
              terms_version: "v1.3",
              privacy_version: "v1.3"
            });
          } else {
            setFailedAttempts(prev => prev + 1);
            setErrorMsg("Invalid email or password. Use credentials listed in the v1.3 Administrator Manual.");
          }
        }, 1000);
      }
    } else {
      // OTP Verification check
      if (otpCode !== "123456") {
        setErrorMsg("Invalid 6-digit OTP code. Use '123456' for verification.");
        setIsLoading(false);
        return;
      }
      
      const userData = {
        id: "user-uuid-003",
        username: "evaluator",
        fullname: "Clinical Evaluator",
        email: "eval@biostateer.com",
        mobile: "+33 6 1234 5678",
        country: "France",
        city: "Paris",
        organization: "Evaluation Institution",
        job_title: "Clinical Biostatistician",
        user_category: "Biostatistician",
        role: "Evaluation User",
        approval_status: "Approved",
        registration_date: "2026-05-28T09:30:00Z",
        last_login: new Date().toISOString(),
        account_expires_at: new Date(Date.now() + 42 * 24 * 3600 * 1000).toISOString(),
        terms_version: "v1.3",
        privacy_version: "v1.3"
      };
      if (rememberMe) {
        localStorage.setItem("biostateer_remembered_user", JSON.stringify({
          email: userData.email,
          fullname: userData.fullname,
          organization: userData.organization,
          role: userData.role,
          job_title: userData.job_title,
          user_category: userData.user_category
        }));
      } else {
        localStorage.removeItem("biostateer_remembered_user");
      }
      onLoginSuccess(userData);
    }
  };

  const handleRequestOtp = () => {
    if (!mobile && !email) {
      setErrorMsg("Please enter email or mobile number first.");
      return;
    }
    setOtpRequested(true);
    setErrorMsg("");
    setTimeout(() => {
      // simulated OTP trigger
    }, 500);
  };

  if (showLanding) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-y-auto">
        {/* Landing Header */}
        <header className="h-16 border-b border-slate-900 bg-slate-950 shrink-0 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-brand-500/10 text-brand-400">
              <Activity size={18} className="animate-pulse" />
            </div>
            <span className="font-bold text-slate-100 font-display text-sm tracking-tight">
              Biostateer<span className="text-brand-500 text-xs">™</span>
            </span>
          </div>
          <button
            onClick={() => setShowLanding(false)}
            className="btn-primary px-4 py-1.5 text-xs font-bold shadow-lg shadow-brand-500/20 cursor-pointer"
          >
            Access Evaluation Dashboard
          </button>
        </header>

        {/* Hero Section (Priority 14) */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto space-y-8 z-10 relative">
          
          <div className="absolute inset-0 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold uppercase tracking-widest inline-block select-none animate-pulse">
              Clinical Research & Biostatistics Intelligence
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display leading-tight">
              Welcome to Biostateer<span className="text-brand-500">™</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade peer-review platform for clinical trials analysis, CDISC schema validation, sample size spent boundaries, and CFR Part 11 audit trails.
            </p>
          </div>

          {/* Key Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-6 select-none">
            <div className="p-5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-450 flex items-center justify-center mb-1">
                <Sigma size={16} />
              </div>
              <h3 className="font-bold text-slate-100 text-xs">Precision Engine</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Double-precision Welch T-Tests, ANOVA, survival Cox, and competing risks validated against SAS/SPSS reference codes.
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-1">
                <Dices size={16} />
              </div>
              <h3 className="font-bold text-slate-100 text-xs">P21 CDISC Audits</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Audits uploaded SDTM/ADaM datasets and Define.xml schemas for missing terminology, variables, and traceability gaps.
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1">
                <Sliders size={16} />
              </div>
              <h3 className="font-bold text-slate-100 text-xs">21 CFR Part 11 Trail</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Cryptographically secures activity logs through immutable append-only ledgers and electronic signature PIN sign-offs.
              </p>
            </div>
          </div>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md pt-4">
            <button
              onClick={onRequestAccess}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition active:scale-95 cursor-pointer"
            >
              Request Peer-Review Access
            </button>
            <button
              onClick={() => setShowLanding(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-200 font-bold text-xs transition active:scale-95 cursor-pointer"
            >
              Log In (Existing Users)
            </button>
          </div>

        </main>

        {/* Global Footer with Ownership Block */}
        <footer className="border-t border-slate-900 bg-slate-950 shrink-0 px-6 py-6 text-center select-text text-[9.5px] text-slate-500">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="font-semibold text-slate-400 text-xs font-display">
              Biostateer™ Version 1.3
            </p>
            <p className="font-semibold text-slate-350">
              Founder & Product Owner: Dr. Bhupesh Dewan (Mumbai, India)
            </p>
            <p>
              Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved. Proprietary Clinical Research Software.
            </p>
            <p className="max-w-2xl mx-auto leading-normal">
              Biostateer™ is proprietary software. Unauthorized copying, reverse engineering, redistribution, model replication, or commercial use is strictly prohibited. Evaluation license grants are gated behind strict administrator authorization.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Otherwise, render the Login Panels
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200 overflow-y-auto relative">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />

        {/* Back to landing */}
        <button
          onClick={() => setShowLanding(true)}
          className="absolute right-4 top-4 px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 text-[10px] font-bold cursor-pointer transition active:scale-95"
        >
          ← Product Overview
        </button>

        <div className="text-center space-y-2 select-none">
          <div className="w-10 h-10 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-1 animate-pulse">
            <Activity size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-100 font-display tracking-tight">
            Sign In Gateway
          </h2>
          <p className="text-[11px] text-slate-400">
            Secure peer-review verification center. Enforces manual admin review.
          </p>
        </div>

        {/* Gated Maintenance Mode (P1 Recommendation) */}
        {!isBackendActive && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 leading-normal select-none text-[10.5px] text-amber-500 animate-pulse">
            <ShieldAlert className="shrink-0 w-4 h-4 mt-0.5" />
            <div>
              <strong className="block font-bold">Local Fallback Active:</strong>
              Offline from validated servers. Local Precision fallback engine engaged. Authentication database resides in standalone clinical memory.
            </div>
          </div>
        )}

        {/* Access Method Tabs */}
        <div className="flex border-b border-slate-850 text-[10.5px] font-bold uppercase select-none">
          <button
            onClick={() => {
              setLoginMethod("password");
              setErrorMsg("");
            }}
            className={`flex-1 pb-2 border-b-2 text-center transition ${
              loginMethod === "password" 
                ? "border-brand-500 text-slate-200" 
                : "border-transparent text-slate-500 hover:text-slate-350 cursor-pointer"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => {
              setLoginMethod("mobile");
              setErrorMsg("");
            }}
            className={`flex-1 pb-2 border-b-2 text-center transition ${
              loginMethod === "mobile" 
                ? "border-brand-500 text-slate-200" 
                : "border-transparent text-slate-500 hover:text-slate-350 cursor-pointer"
            }`}
          >
            Mobile OTP
          </button>
          <button
            onClick={() => {
              setLoginMethod("email_otp");
              setErrorMsg("");
            }}
            className={`flex-1 pb-2 border-b-2 text-center transition ${
              loginMethod === "email_otp" 
                ? "border-brand-500 text-slate-200" 
                : "border-transparent text-slate-500 hover:text-slate-350 cursor-pointer"
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* Login Forms */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          
          {loginMethod === "password" ? (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Clinical Email Address</label>
                <div className="relative">
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@biostateer.com"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400 font-medium">Password</label>
                  <button type="button" onClick={onForgotPassword} className="text-[10px] text-brand-400 hover:text-brand-350 cursor-pointer transition font-semibold">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 select-none">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">
                  {loginMethod === "mobile" ? "Mobile Number" : "Clinical Email"}
                </label>
                <div className="flex gap-2">
                  <input
                    type={loginMethod === "mobile" ? "tel" : "email"}
                    value={loginMethod === "mobile" ? mobile : email}
                    onChange={(e) => {
                      if (loginMethod === "mobile") setMobile(e.target.value);
                      else setEmail(e.target.value);
                    }}
                    placeholder={loginMethod === "mobile" ? "+91 9876543210" : "eval@biostateer.com"}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl border border-slate-700 text-[10px] font-bold cursor-pointer transition active:scale-95"
                  >
                    {otpRequested ? "Resend" : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpRequested && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block uppercase text-[9.5px]">Enter 6-Digit OTP Code</label>
                  <input
                    type="text" required maxLength={6} value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-center tracking-[8px] text-sm font-bold text-slate-100 font-mono outline-none focus:border-brand-500 transition-all"
                  />
                  <p className="text-[9.5px] text-slate-500 font-semibold mt-1">
                    Simulated verification OTP is standard <span className="text-slate-350 underline font-bold">123456</span>.
                  </p>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <p className="text-[10px] font-bold text-rose-450 bg-rose-500/5 p-2 rounded border border-rose-500/10">
              ✗ {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-2 py-1 select-none">
            <input 
              type="checkbox" 
              id="remember_me" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-955 text-brand-500 focus:ring-brand-500 accent-brand-500 cursor-pointer" 
            />
            <label htmlFor="remember_me" className="text-[10px] text-slate-400 font-semibold cursor-pointer select-none">
              Remember Me (Auto-login for 30 days)
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLocked}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition active:scale-95 ${
              isLocked 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer shadow-lg shadow-brand-500/20"
            }`}
          >
            {isLoading ? "Authenticating Session..." : "Secure Dashboard Sign In"}
          </button>
        </form>

        {/* Google & Microsoft Mock SSO Buttons (Priority 1) */}
        <div className="space-y-2 border-t border-slate-850 pt-4 select-none">
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider block text-center mb-1">Corporate SAML Single Sign-On</span>
          
          <div className="grid grid-cols-2 gap-3 text-[10.5px]">
            <button
              onClick={() => setErrorMsg("Google SSO corporate sync requires verified Azure AD profiles in production.")}
              className="py-1.5 px-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-slate-300 transition cursor-pointer"
            >
              <span className="text-red-500 font-bold font-mono">G</span> Google Auth
            </button>
            
            <button
              onClick={() => setErrorMsg("Microsoft Azure AD sync requires institutional SAML configurations.")}
              className="py-1.5 px-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-slate-300 transition cursor-pointer"
            >
              <span className="text-brand-400 font-bold font-mono">M</span> Microsoft SSO
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center text-xs select-none border-t border-slate-850 pt-4">
          <span className="text-slate-500">Need peer credentials?</span>
          <button
            onClick={onRequestAccess}
            className="font-bold text-brand-400 hover:text-brand-350 cursor-pointer transition active:scale-95"
          >
            Request Access
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-850 pt-4 text-center select-text text-[9.5px] text-slate-500 select-none">
          <p className="font-semibold text-slate-400">
            Biostateer™ Version 1.3 | Founder & Product Owner: Dr. Bhupesh Dewan
          </p>
          <p>
            Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved. Proprietary Clinical Research Software.
          </p>
        </div>
      </div>
    </div>
  );
}
