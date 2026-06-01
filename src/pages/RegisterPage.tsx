import React, { useState } from "react";
import { ShieldCheck, User, Mail, Globe, MapPin, Briefcase, Activity, Check, ArrowRight } from "lucide-react";

interface RegisterPageProps {
  isBackendActive: boolean;
  onRegisterSuccess: (email: string) => void;
  onBackToLogin: () => void;
}

export default function RegisterPage({ isBackendActive, onRegisterSuccess, onBackToLogin }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [institutionWebsite, setInstitutionWebsite] = useState("");
  const [userCategory, setUserCategory] = useState("Biostatistician");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedUsage, setAgreedUsage] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    "Biostatistician",
    "CRA",
    "Medical Writer",
    "Principal Investigator",
    "Regulatory Affairs",
    "Medical Affairs",
    "Student",
    "Academic Researcher",
    "CRO Professional",
    "Pharma Professional",
    "Other"
  ];

  // Password rules
  const rules = {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  const isComplex = Object.values(rules).every(Boolean);

  const canNextStep = () => {
    if (step === 1) {
      return fullname && email && mobile && country && city;
    }
    if (step === 2) {
      return organization && jobTitle && userCategory;
    }
    return false;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!isComplex) {
      setErrorMsg("Password does not meet required complexity standards.");
      return;
    }
    if (!agreedTerms || !agreedPrivacy || !agreedUsage) {
      setErrorMsg("You must accept all required regulatory agreements.");
      return;
    }
    if (!captchaVerified) {
      setErrorMsg("Please complete the Cloudflare Turnstile verification challenge.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const payload = {
      fullname,
      email,
      mobile,
      country,
      city,
      organization,
      department,
      job_title: jobTitle,
      linkedin_profile: linkedinProfile,
      research_area: researchArea,
      institution_website: institutionWebsite,
      user_category: userCategory,
      password,
      turnstile_token: "mock-turnstile-token-hash-2026"
    };

    if (isBackendActive) {
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
          onRegisterSuccess(email);
        } else {
          setErrorMsg(data.detail || "Registration failed. Please check your credentials.");
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMsg("Failed to communicate with the FastAPI server. Please check the network.");
      }
    } else {
      // Local Mode mock signup
      setTimeout(() => {
        setIsLoading(false);
        onRegisterSuccess(email);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 relative shadow-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />

        {/* Brand Header */}
        <div className="flex justify-between items-center select-none pb-2 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-brand-500/10 text-brand-400">
              <Activity size={18} className="animate-pulse" />
            </div>
            <span className="font-bold text-slate-100 text-sm tracking-tight font-display">
              Biostateer™ Evaluation Program
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-950 border border-slate-850 rounded px-2 py-0.5">
            Step {step} of 3
          </span>
        </div>

        {/* Phase Forms */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="font-bold text-slate-200 text-xs">1. Personal & Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Full Name (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="text" required value={fullname} onChange={(e) => setFullname(e.target.value)}
                      placeholder="Dr. Bhupesh Dewan"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Clinical Email (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Mobile Number (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <Activity className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Country (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="text" required value={country} onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-400 font-medium">City (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button type="button" onClick={onBackToLogin} className="text-slate-450 hover:text-slate-200 font-semibold cursor-pointer">
                  ← Back to Login
                </button>
                <button
                  type="button"
                  disabled={!canNextStep()}
                  onClick={() => setStep(2)}
                  className={`py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold transition active:scale-95 ${
                    canNextStep() ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Pro Profile
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="font-bold text-slate-200 text-xs">2. Professional & Institutional Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Organization / University (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="text" required value={organization} onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Biostateer™ Biopharma"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Official Job Title (Mandatory)</label>
                  <div className="relative">
                    <input 
                      type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Lead Biostatistician"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-10 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                    <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Department / Division (Optional)</label>
                  <input 
                    type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Biostatistics"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Professional Category (Mandatory)</label>
                  <select 
                    value={userCategory} onChange={(e) => setUserCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold cursor-pointer"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">LinkedIn Profile URL (Optional)</label>
                  <input 
                    type="url" value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Research Area Focus (Optional)</label>
                  <input 
                    type="text" value={researchArea} onChange={(e) => setResearchArea(e.target.value)}
                    placeholder="Oncology Survival Analysis"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-400 font-medium">Institution Website (Optional)</label>
                  <input 
                    type="url" value={institutionWebsite} onChange={(e) => setInstitutionWebsite(e.target.value)}
                    placeholder="https://university.edu"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button type="button" onClick={() => setStep(1)} className="text-slate-450 hover:text-slate-200 font-semibold cursor-pointer">
                  ← Back to Demographics
                </button>
                <button
                  type="button"
                  disabled={!canNextStep()}
                  onClick={() => setStep(3)}
                  className={`py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold transition active:scale-95 ${
                    canNextStep() ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Credentials
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150 select-text">
              <h3 className="font-bold text-slate-200 text-xs">3. Security Credentials & Regulatory Consents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Enter Password</label>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Confirm Password</label>
                  <input 
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                {/* Password Strength display */}
                {password.length > 0 && (
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 md:col-span-2 select-none">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Strength Audit:</span>
                      <span className={isComplex ? "text-emerald-450" : "text-amber-500"}>
                        {isComplex ? "COMPLEX CONFIGURATION COMPLETE" : "INSUFFICIENT COMPLEXITY"}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${isComplex ? "bg-emerald-500" : "bg-rose-500"}`}
                        style={{ width: `${isComplex ? 100 : 30}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                      Requires at least 12 characters, including capital [A-Z], small [a-z], number [0-9], and symbol.
                    </p>
                  </div>
                )}
              </div>

              {/* Cloudflare Turnstile CAPTCHA (Priority 2 & modification 4) */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl select-none flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${captchaVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-500/10 text-brand-400"}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-350 block">Cloudflare Turnstile Verification</span>
                    <span className="text-[9.5px] text-slate-500 leading-none">Security challenge protecting peer-review signup channels</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCaptchaVerified(!captchaVerified)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold border transition ${
                    captchaVerified 
                      ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/25" 
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 cursor-pointer"
                  }`}
                >
                  {captchaVerified ? "✓ VERIFIED HUMAN" : "VERIFY HUMAN"}
                </button>
              </div>

              {/* Regulatory agreements checkboxes (Priority 9 & Modification 7) */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5 select-none">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" checked={agreedUsage} onChange={() => setAgreedUsage(!agreedUsage)}
                    className="mt-0.5 rounded border-slate-800 bg-slate-900 text-brand-500 cursor-pointer focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-slate-400 leading-tight">
                    I understand that Biostateer™ is an evaluation platform and is not intended for direct clinical decision making. (Mandatory Checkbox)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" checked={agreedTerms} onChange={() => setAgreedTerms(!agreedTerms)}
                    className="mt-0.5 rounded border-slate-800 bg-slate-900 text-brand-500 cursor-pointer focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-slate-400 leading-tight">
                    I accept the Biostateer™ Evaluation License Agreement terms, restrictions, and reverse engineering blocks.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" checked={agreedPrivacy} onChange={() => setAgreedPrivacy(!agreedPrivacy)}
                    className="mt-0.5 rounded border-slate-800 bg-slate-900 text-brand-500 cursor-pointer focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-slate-400 leading-tight">
                    I consent to the collection and secure cloud storage of my professional demographics as detailed in the Privacy Policy.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <p className="text-[10px] font-bold text-rose-450 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                  ✗ {errorMsg}
                </p>
              )}

              <div className="pt-2 flex justify-between items-center">
                <button type="button" onClick={() => setStep(2)} className="text-slate-450 hover:text-slate-200 font-semibold cursor-pointer">
                  ← Return to Pro Profile
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword || !agreedTerms || !agreedPrivacy || !agreedUsage || !captchaVerified}
                  className={`py-2 px-5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition active:scale-95 ${
                    password && isComplex && password === confirmPassword && agreedTerms && agreedPrivacy && agreedUsage && captchaVerified && !isLoading
                      ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer shadow-lg shadow-brand-500/20" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Compiling secure profile..." : "Register Evaluation Account"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="border-t border-slate-850 pt-4 text-center space-y-1.5 select-text text-[9.5px] text-slate-500 select-none">
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
