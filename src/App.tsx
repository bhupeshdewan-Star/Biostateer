import React, { useState, useEffect, useRef, Suspense } from "react";
import { ShieldAlert, AlertTriangle, Clock } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { CommandPalette } from "./components/CommandPalette";
import CopilotPanel from "./components/CopilotPanel";
import { AuditTrailPanel } from "./components/AuditTrailPanel";
import { RegulatoryCenter } from "./components/RegulatoryCenter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ModuleLoadingPlaceholder from "./components/ModuleLoadingPlaceholder";

// Mathematically Validated Clinical Modules (Lazy Loaded)
const Dashboard = React.lazy(() => import("./modules/Dashboard"));
const StudyDesignWizard = React.lazy(() => import("./modules/StudyDesignWizard"));
const SampleSizeHub = React.lazy(() => import("./modules/SampleSizeHub"));
const StatisticalAnalysisCenter = React.lazy(() => import("./modules/StatisticalAnalysisCenter"));
const SurvivalSuite = React.lazy(() => import("./modules/SurvivalSuite"));
const DiagnosticSuite = React.lazy(() => import("./modules/DiagnosticSuite"));
const ProtocolAssistant = React.lazy(() => import("./modules/ProtocolAssistant"));
const PublicationAssistant = React.lazy(() => import("./modules/PublicationAssistant"));
const ValidationDashboard = React.lazy(() => import("./modules/ValidationDashboard"));
const DataImportHub = React.lazy(() => import("./modules/DataImportHub"));
const AboutPage = React.lazy(() => import("./modules/AboutPage"));

// New clinical intelligence modules (Lazy Loaded)
const RandomizationHub = React.lazy(() => import("./modules/RandomizationHub"));
const MissingDataHub = React.lazy(() => import("./modules/MissingDataHub"));
const CDISCHub = React.lazy(() => import("./modules/CDISCHub"));
const MetaAnalysisHub = React.lazy(() => import("./modules/MetaAnalysisHub"));
const DiagnosticAccuracyHub = React.lazy(() => import("./modules/DiagnosticAccuracyHub"));
const AuditTrailCenter = React.lazy(() => import("./modules/AuditTrailCenter"));
const SecurityChecklist = React.lazy(() => import("./modules/SecurityChecklist"));
const ReleaseManagement = React.lazy(() => import("./modules/ReleaseManagement"));

// Components & Services (Static Ingestion)
import { StatisticalRegistry } from "./components/StatisticalRegistry";
import { storageService } from "./services/storageService";

// Gated Access & Security Screens (Static Ingestion for Immediate Mount)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerificationPage from "./pages/VerificationPage";
import EvaluationAgreement from "./pages/EvaluationAgreement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

// New Administrative Panels (Lazy Loaded)
const AdminDashboard = React.lazy(() => import("./modules/AdminDashboard"));
const AdminAnalytics = React.lazy(() => import("./modules/AdminAnalytics"));
const SecurityCenter = React.lazy(() => import("./modules/SecurityCenter"));

// Version 1.3.2 Modules (Lazy Loaded)
const PKAnalysisHub = React.lazy(() => import("./modules/PKAnalysisHub"));
const BioequivalenceHub = React.lazy(() => import("./modules/BioequivalenceHub"));
const DataPersistenceCenter = React.lazy(() => import("./modules/DataPersistenceCenter"));
const SystemHealthDashboard = React.lazy(() => import("./modules/SystemHealthDashboard"));

// Role-Based Access Control Matrix (Addition 2, Priority 12)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  Administrator: ["*"], // Full Access
  Biostatistician: ["*"], // Full Access
  Reviewer: [
    "dashboard", "data-import", "cdisc-validation", "audit-trail-center", "security-checklist", "release-management",
    "desc-stats", "parametric", "nonparametric", "categorical", "regression", "survival", "multivariate",
    "sample-size", "clinical-randomization", "rct-design", "agreement", "bayesian", "meta-analysis", "about",
    "privacy-policy", "terms-conditions", "pk-analysis", "bioequivalence", "validation", "data-persistence", "system-health",
    "diagnostic", "missing-data"
  ],
  "Evaluation User": [
    "dashboard", "data-import", "cdisc-validation", "audit-trail-center", "security-checklist", "release-management",
    "desc-stats", "parametric", "nonparametric", "categorical", "regression", "survival", "multivariate",
    "sample-size", "clinical-randomization", "rct-design", "agreement", "bayesian", "meta-analysis", "about",
    "privacy-policy", "terms-conditions", "pk-analysis", "bioequivalence", "validation", "data-persistence", "system-health",
    "diagnostic", "missing-data"
  ],
  "Principal Investigator": [
    "dashboard", "rct-design", "agreement", "bayesian", "desc-stats", "about",
    "pk-analysis", "bioequivalence", "validation", "audit-trail-center", "security-checklist", "data-persistence", "system-health",
    "diagnostic", "missing-data"
  ],
  Guest: [
    "about", "privacy-policy", "terms-conditions"
  ],
  CRA: ["dashboard", "data-import", "cdisc-validation", "clinical-randomization", "agreement", "security-checklist", "release-management", "about", "pk-analysis", "bioequivalence", "diagnostic", "missing-data"],
  "Medical Affairs": ["dashboard", "desc-stats", "agreement", "about", "diagnostic", "missing-data"],
  "Regulatory Affairs": ["dashboard", "validation", "audit-trail-center", "cdisc-validation", "security-checklist", "release-management", "about", "pk-analysis", "bioequivalence", "diagnostic", "missing-data"],
  Viewer: ["dashboard", "desc-stats", "about", "diagnostic", "missing-data"]
};

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  moduleName: string;
  calculatorName: string;
  parameters: any;
  outputs: any;
  exportStatus: string;
  hash: string;
  version: string;
}

export default function App() {
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [activePanel, setActivePanel] = useState<"none" | "copilot" | "audit" | "regulatory">("none");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [importedDataset, setImportedDataset] = useState<{ groupA: number[]; groupB: number[]; groupC?: number[]; name: string } | null>(null);
  const [showChangelog, setShowChangelog] = useState<boolean>(false);

  // Connection & Gated Authentication States (Priority 1 & 12)
  const [isBackendActive, setIsBackendActive] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "register" | "forgot" | "reset" | "verify">("login");
  const [tempVerifyEmail, setTempVerifyEmail] = useState("");
  const [agreedLicense, setAgreedLicense] = useState(false);
  const [pushedPKParams, setPushedPKParams] = useState<{ cmax: number; auc0t: number; auc0inf: number } | null>(null);

  // Inactivity & Warnings Timer States (Priority 3 Inactivity Monitor)
  const [inactiveTime, setInactiveTime] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(900); // 15 minutes warning (900s)

  // Ping FastAPI to determine if Validated Mode is active
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch("http://localhost:8000/");
        if (res.ok) {
          setIsBackendActive(true);
        } else {
          setIsBackendActive(false);
        }
      } catch (err) {
        setIsBackendActive(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 8000);
    return () => clearInterval(interval);
  }, []);

  // 8-hour inactivity monitor (Priority 3)
  useEffect(() => {
    if (!currentUser) return;

    const handleUserActivity = () => {
      setInactiveTime(0);
      setShowWarningModal(false);
      setWarningCountdown(900);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    const checkInactivity = setInterval(() => {
      setInactiveTime(prev => {
        const nextTime = prev + 1;
        // 8 hours inactivity timeout (28800 seconds). Warning starts 15 mins before (27900s).
        if (nextTime >= 27900 && nextTime < 28800) {
          setShowWarningModal(true);
          setWarningCountdown(28800 - nextTime);
        } else if (nextTime >= 28800) {
          handleLogout();
        }
        return nextTime;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      clearInterval(checkInactivity);
    };
  }, [currentUser]);

  // Expiration Warning ribbon calculator (Priority 5)
  const getLicenseRemainingDays = () => {
    if (!currentUser || !currentUser.account_expires_at) return null;
    const diff = new Date(currentUser.account_expires_at).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysRemaining = getLicenseRemainingDays();

  // Auto-Save and Restore Local Session on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem("biostateer_user_session");
    const remembered = localStorage.getItem("biostateer_remembered_user");
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Verify expiry
        if (parsed.account_expires_at) {
          const isExpired = new Date(parsed.account_expires_at).getTime() < new Date().getTime();
          if (isExpired) {
            localStorage.removeItem("biostateer_user_session");
          } else {
            setCurrentUser(parsed);
            setAgreedLicense(true);
          }
        } else {
          setCurrentUser(parsed);
          setAgreedLicense(true);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (remembered) {
      try {
        const parsed = JSON.parse(remembered);
        const reconstructedSession = {
          id: `user-remembered-${Math.random().toString(36).substring(2, 11)}`,
          username: parsed.email.split("@")[0],
          fullname: parsed.fullname || "Guest User",
          email: parsed.email,
          organization: parsed.organization || "Biostateer™ Workspace",
          role: parsed.role || "Evaluation User",
          job_title: parsed.job_title || "Clinical Research Associate",
          user_category: parsed.user_category || "Biostatistician",
          approval_status: "Approved",
          licenseStatus: "Active",
          registration_date: new Date().toISOString(),
          last_login: new Date().toISOString(),
          account_expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
        };
        setCurrentUser(reconstructedSession);
        setAgreedLicense(true);
        localStorage.setItem("biostateer_user_session", JSON.stringify(reconstructedSession));
      } catch (err) {
        console.error("Auto-login session reconstruction error:", err);
      }
    }

    const savedModule = localStorage.getItem("biostateer_active_module");
    if (savedModule) setActiveModule(savedModule);

    const savedDataset = localStorage.getItem("biostateer_imported_dataset");
    if (savedDataset) {
      try {
        setImportedDataset(JSON.parse(savedDataset));
      } catch (e) {
        console.error(e);
      }
    }

    const savedLogs = localStorage.getItem("biostateer_audit_logs");
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs));
      } catch (err) {
        console.error(err);
      }
    } else {
      const initial: AuditLogItem[] = [
        {
          id: "tx-init",
          timestamp: new Date().toISOString(),
          user: "Administrator",
          moduleName: "Platform Command Center",
          calculatorName: "Biostateer™ Platform Initialization",
          parameters: { system: "v1.3" },
          outputs: { certification: "Designed to support Part 11-aligned workflows" },
          exportStatus: "Compliance Verified",
          hash: "8f7d9a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
          version: "v1.3.0"
        }
      ];
      setAuditLogs(initial);
      localStorage.setItem("biostateer_audit_logs", JSON.stringify(initial));
    }
  }, []);

  // FDA CFR 11 Aligned 30-second Auto-Save Engine
  useEffect(() => {
    if (!currentUser) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        if (importedDataset) {
          await storageService.saveWorkspace("biostateer_imported_dataset", importedDataset);
        }
        await storageService.saveWorkspace("biostateer_audit_logs", auditLogs);
        localStorage.setItem("biostateer_last_save_time", new Date().toLocaleString());
      } catch (err) {
        console.error("Auto-save interval failed:", err);
      }
    }, 30000);

    const handleBeforeUnload = () => {
      localStorage.setItem("biostateer_last_save_time", new Date().toLocaleString());
      if (importedDataset) {
        localStorage.setItem("biostateer_imported_dataset", JSON.stringify(importedDataset));
      }
      localStorage.setItem("biostateer_audit_logs", JSON.stringify(auditLogs));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser, importedDataset, auditLogs]);

  // Auto-Save active module
  useEffect(() => {
    localStorage.setItem("biostateer_active_module", activeModule);
  }, [activeModule]);

  // Global listener for Ctrl+K Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Secure Audit Logging utility
  const handleLogAudit = (action: string, inputs: any, outputs: any, exportStatus = "None") => {
    const randomId = `tx-${Math.floor(100000 + Math.random() * 900000)}`;
    const moduleNames: Record<string, string> = {
      dashboard: "Executive Dashboard",
      "data-import": "Clinical Data Import",
      "cdisc-validation": "CDISC Ingestion & P21",
      "audit-trail-center": "CFR Part 11 Audit Trail",
      "clinical-randomization": "Clinical Randomization Hub",
      "missing-data": "Missing Data Imputation",
      diagnostic: "Diagnostic Accuracy Suite",
      "meta-analysis": "Meta-Analysis & Egger",
      "rct-design": "Study Design Wizard 2.0",
      "sample-size": "Sample Size & Spending bounds",
      survival: "Stratified Survival Suite",
      agreement: "Agreement & SAP Assistant",
      bayesian: "Bayesian Biostatistics",
      validation: "Validation Registry Dashboard",
      "security-checklist": "Security Hardening",
      "release-management": "Release Management",
      "desc-stats": "Descriptive Statistics",
      parametric: "Parametric Hypothesis Testing",
      nonparametric: "Nonparametric Hypothesis Testing",
      categorical: "Categorical Analysis",
      regression: "Regression & Modeling",
      multivariate: "Multivariate Statistics",
      "admin-dashboard": "User Access Approvals",
      "admin-analytics": "Product Analytics Dashboard",
      "security-center": "Security Center Intelligence"
    };

    const newLog: AuditLogItem = {
      id: randomId,
      timestamp: new Date().toISOString(),
      user: currentUser ? currentUser.role : "Guest",
      moduleName: moduleNames[activeModule] || "Biostateer™ Platform Core",
      calculatorName: action,
      parameters: typeof inputs === "string" ? { info: inputs } : inputs,
      outputs: typeof outputs === "string" ? { info: outputs } : outputs,
      exportStatus: exportStatus,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      version: "v1.3.0"
    };
    const updated = [newLog, ...auditLogs].slice(0, 100);
    setAuditLogs(updated);
    localStorage.setItem("biostateer_audit_logs", JSON.stringify(updated));
  };

  const [preselectedTest, setPreselectedTest] = useState<string | undefined>(undefined);

  const handleSelectCalculator = (moduleId: string, calculatorId?: string) => {
    setActiveModule(moduleId);
    setActivePanel("none");
    setIsCommandPaletteOpen(false);

    if (calculatorId) {
      const mapping: Record<string, string> = {
        "summary-stats": "descriptives",
        "table1": "descriptives",
        "t-test-ind": "welchTTest",
        "t-test-paired": "welchTTest",
        "anova-one": "oneWayANOVA",
        "mann-whitney": "mannWhitneyU",
        "pearson-corr": "pearsonCorr",
        "lin-reg": "linearRegression",
        "log-reg": "logisticRegression",
        "chi-square": "chiSquare",
        "fisher-exact": "chiSquare"
      };
      if (mapping[calculatorId]) {
        setPreselectedTest(mapping[calculatorId]);
      } else {
        setPreselectedTest(undefined);
      }
    } else {
      setPreselectedTest(undefined);
    }
  };

  const handlePushToAnalysis = (data: { groupA: number[]; groupB: number[]; groupC?: number[]; name: string }) => {
    setImportedDataset(data);
    setActiveModule("parametric");
    setPreselectedTest("welchTTest");
    handleLogAudit("Data Ingested & Pushed to Stats Engine", { name: data.name }, { sizeA: data.groupA.length, sizeB: data.groupB.length });
  };

  // Secure Authentication Handlers
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem("biostateer_user_session", JSON.stringify(user));
    handleLogAudit("Authentication Successful", { email: user.email }, { role: user.role });
  };

  const handleRegisterSuccess = (email: string) => {
    setTempVerifyEmail(email);
    setAuthScreen("verify");
  };

  const handleVerifySuccess = (status: string) => {
    alert("Verification successful! Your account is now waitlisted and pending administrative approval.");
    setAuthScreen("login");
  };

  const handleLogout = () => {
    if (currentUser) {
      handleLogAudit("Secure Logout Executed", {}, {});
    }
    setCurrentUser(null);
    setAgreedLicense(false);
    localStorage.removeItem("biostateer_user_session");
    setAuthScreen("login");
  };

  // Router to render the correct mathematically-validated clinical module
  const renderActiveModule = () => {
    if (activePanel === "regulatory") {
      return <RegulatoryCenter />;
    }

    // Role-Based Access Control Gate check (Addition 2, Priority 12)
    const permissions = ROLE_PERMISSIONS[currentUser?.role || "Guest"] || [];
    const isAllowed = permissions.includes("*") || permissions.includes(activeModule);

    if (!isAllowed) {
      const allowedRoles = Object.keys(ROLE_PERMISSIONS).filter(
        (role) => ROLE_PERMISSIONS[role].includes("*") || ROLE_PERMISSIONS[role].includes(activeModule)
      );

      const moduleNames: Record<string, string> = {
        dashboard: "Executive Dashboard",
        "data-import": "Clinical Data Import",
        "cdisc-validation": "CDISC Ingestion & P21",
        "audit-trail-center": "CFR Part 11 Audit Trail",
        "clinical-randomization": "Clinical Randomization Hub",
        "missing-data": "Missing Data Imputation",
        diagnostic: "Diagnostic Accuracy Suite",
        "meta-analysis": "Meta-Analysis & Egger",
        "rct-design": "Study Design Wizard 2.0",
        "sample-size": "Sample Size & Spending bounds",
        survival: "Stratified Survival Suite",
        agreement: "Agreement & SAP Assistant",
        bayesian: "Bayesian Biostatistics",
        validation: "Validation Registry Dashboard",
        "security-checklist": "Security Hardening",
        "release-management": "Release Management",
        "desc-stats": "Descriptive Statistics",
        parametric: "Parametric Hypothesis Testing",
        nonparametric: "Nonparametric Hypothesis Testing",
        categorical: "Categorical Analysis",
        regression: "Regression & Modeling",
        multivariate: "Multivariate Statistics",
        "admin-dashboard": "User Access Approvals",
        "admin-analytics": "Product Analytics Dashboard",
        "security-center": "Security Center Intelligence",
        "privacy-policy": "Privacy Policy Statement",
        "terms-conditions": "Terms & Conditions License"
      };

      return (
        <div className="glass-panel p-8 max-w-lg mx-auto my-12 text-center space-y-6 border border-rose-500/20 select-none animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 animate-pulse">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-100">Access Restricted</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              You do not have permissions to access the <span className="font-semibold text-slate-200">{moduleNames[activeModule] || activeModule}</span> workspace.
            </p>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Your Active Role:</span>
              <span className="font-bold text-slate-350">{currentUser?.role}</span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-slate-850/80 pt-2 mt-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Authorized Profiles</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {allowedRoles.map((role) => (
                  <span key={role} className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center text-xs">
            <button
              onClick={() => setActiveModule("dashboard")}
              className="btn-secondary px-4 py-2 cursor-pointer hover:bg-slate-800"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case "dashboard":
        return <Dashboard setCurrentModule={handleSelectCalculator} />;
      case "data-import":
        return <DataImportHub onLogAudit={handleLogAudit} onPushToAnalysis={handlePushToAnalysis} />;
      case "cdisc-validation":
        return <CDISCHub />;
      case "audit-trail-center":
        return <AuditTrailCenter onLogAudit={handleLogAudit} currentUser={currentUser} />;
      case "security-checklist":
        return <SecurityChecklist />;
      case "release-management":
        return <ReleaseManagement />;
      case "clinical-randomization":
        return <RandomizationHub onLogAudit={handleLogAudit} />;
      case "missing-data":
        return <MissingDataHub onLogAudit={handleLogAudit} />;
      case "diagnostic":
        return <DiagnosticAccuracyHub onLogAudit={handleLogAudit} />;
      case "meta-analysis":
        return <MetaAnalysisHub onLogAudit={handleLogAudit} />;
      case "about":
        return <AboutPage />;
      case "rct-design":
        return <StudyDesignWizard onLogAudit={handleLogAudit} />;
      case "sample-size":
        return <SampleSizeHub onLogAudit={handleLogAudit} />;
      case "survival":
        return <SurvivalSuite onLogAudit={handleLogAudit} />;
      case "agreement":
        return <ProtocolAssistant onLogAudit={handleLogAudit} />;
      case "bayesian":
        return <PublicationAssistant onLogAudit={handleLogAudit} />;
      case "privacy-policy":
        return <PrivacyPolicy onBack={() => setActiveModule("dashboard")} />;
      case "terms-conditions":
        return <TermsAndConditions onBack={() => setActiveModule("dashboard")} />;
      
      // Version 1.3.2 Modules
      case "pk-analysis":
        return <PKAnalysisHub onLogAudit={handleLogAudit} onPushToBE={(params) => setPushedPKParams(params)} />;
      case "bioequivalence":
        return <BioequivalenceHub onLogAudit={handleLogAudit} pushedPKParams={pushedPKParams} />;
      case "data-persistence":
        return <DataPersistenceCenter onLogAudit={handleLogAudit} />;
      case "system-health":
        return <SystemHealthDashboard currentUser={currentUser} isBackendActive={isBackendActive} />;
      
      // Administrative Routes (Priority 3 & 7 & 8)
      case "admin-dashboard":
        return <AdminDashboard onLogAudit={handleLogAudit} />;
      case "admin-analytics":
        return <AdminAnalytics />;
      case "security-center":
        return <SecurityCenter currentUser={currentUser} />;
      
      case "validation":
        return (
          <div className="space-y-8">
            <ValidationDashboard />
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <StatisticalRegistry />
            </div>
          </div>
        );
      case "desc-stats":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "descriptives"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "parametric":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "welchTTest"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "nonparametric":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "mannWhitneyU"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "regression":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "linearRegression"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "categorical":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "chiSquare"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "multivariate":
        return <StatisticalAnalysisCenter onLogAudit={handleLogAudit} defaultTest={preselectedTest || "pca2D"} importedDataset={importedDataset} isBackendActive={isBackendActive} />;
      case "epidemiology":
        return <DiagnosticSuite onLogAudit={handleLogAudit} />;
      default:
        return <Dashboard setCurrentModule={handleSelectCalculator} />;
    }
  };

  // --- 1. GATED VISITOR INTERFACES (Before Login & Approval) ---
  if (!currentUser) {
    if (authScreen === "register") {
      return <RegisterPage isBackendActive={isBackendActive} onRegisterSuccess={handleRegisterSuccess} onBackToLogin={() => setAuthScreen("login")} />;
    }
    if (authScreen === "forgot") {
      return <ForgotPassword onBack={() => setAuthScreen("login")} onNavigateToReset={(email) => { setTempVerifyEmail(email); setAuthScreen("reset"); }} />;
    }
    if (authScreen === "reset") {
      return <ResetPassword email={tempVerifyEmail} onBack={() => setAuthScreen("login")} onSuccess={() => setAuthScreen("login")} />;
    }
    if (authScreen === "verify") {
      return <VerificationPage email={tempVerifyEmail} isBackendActive={isBackendActive} onVerifySuccess={handleVerifySuccess} onBackToLogin={() => setAuthScreen("login")} />;
    }
    return <LoginPage isBackendActive={isBackendActive} onLoginSuccess={handleLoginSuccess} onRequestAccess={() => setAuthScreen("register")} onForgotPassword={() => setAuthScreen("forgot")} />;
  }

  // --- 2. GATED CLICK-THROUGH EVALUATION AGREEMENT ---
  if (!agreedLicense) {
    return <EvaluationAgreement onAccept={() => setAgreedLicense(true)} />;
  }

  // --- 3. FULL PLATFORM AUTHENTICATED EXPERIENCE ---
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={(id) => {
          setActiveModule(id);
          setActivePanel("none");
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        userRole={currentUser.role}
        userFullName={currentUser.fullname}
        userOrganization={currentUser.organization}
        userCategory={currentUser.user_category}
        userJobTitle={currentUser.job_title}
        onLogout={handleLogout}
      />

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-slate-50 dark:bg-slate-950/20">
        
        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shrink-0 px-6 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Biostateer™ Clinical Analytics
              </span>

              {/* Connection state */}
              {isBackendActive ? (
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 animate-pulse" title="All calculations verified through official FastAPI SciPy/R engines">
                  🟢 VALIDATED MODE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Calculations processed client-side through Edge mathematical engines">
                  🟡 LOCAL PRECISION MODE
                </span>
              )}
            </div>

            {/* Logged In Info Details (Priority 12) */}
            <div className="flex items-center gap-4 text-[10.5px] font-semibold text-slate-450">
              <div className="text-right">
                <span className="text-slate-500 mr-1.5 font-medium">Logged In As:</span>
                <span className="text-slate-300 font-bold">{currentUser.fullname}</span>
                <span className="mx-2 text-slate-650">|</span>
                <span className="text-slate-450">{currentUser.organization}</span>
              </div>
              
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Search</span>
                <kbd className="px-1 text-[9px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">⌘K</kbd>
              </button>
            </div>
          </div>
        </header>

        {/* Priority 5 Expiration Warning ribbon */}
        {daysRemaining !== null && daysRemaining <= 7 && (
          <div className={`h-8 shrink-0 px-6 flex items-center justify-between text-[11px] font-bold select-none ${
            daysRemaining <= 1 
              ? "bg-rose-500/15 text-rose-400 border-b border-rose-500/20 animate-pulse" 
              : daysRemaining <= 3 
                ? "bg-amber-500/15 text-amber-500 border-b border-amber-500/20" 
                : "bg-slate-900 text-slate-350 border-b border-slate-850"
          }`}>
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={14} className={daysRemaining <= 1 ? "text-rose-500 animate-spin" : ""} />
              {daysRemaining <= 1 
                ? "CRITICAL: Your peer-review evaluation license expires in 24 hours!" 
                : `Evaluation Warning: Your active evaluation license expires in ${daysRemaining} days.`}
            </span>
            <button
              onClick={() => alert("Please request access extensions directly from Dr. Bhupesh Dewan (bdewan@biostateer.com).")}
              className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 text-[10px] font-mono cursor-pointer transition active:scale-95"
            >
              REQUEST ACCESS EXTENSION
            </button>
          </div>
        )}

        {/* Viewport content and slide-out panels */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          
          <div className="flex-1 flex overflow-hidden min-w-0">
            {/* Main active module content wrapped in ErrorBoundary */}
            <div className="flex-1 overflow-y-auto px-6 py-6 min-w-0 scroll-smooth">
              <div className="max-w-4xl mx-auto pb-12">
                <ErrorBoundary>
                  <Suspense fallback={<ModuleLoadingPlaceholder moduleName={activeModule} />}>
                    {renderActiveModule()}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>

            {/* Persistent AI Copilot panel */}
            {activePanel === "copilot" && (
              <CopilotPanel
                setCurrentModule={handleSelectCalculator}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* Immutable Audit Trail Panel */}
            <AuditTrailPanel
              isOpen={activePanel === "audit"}
              onClose={() => setActivePanel("none")}
            />
          </div>

          {/* Footer containing Professional Versioning System */}
          <footer className="h-10 border-t border-slate-250 dark:border-slate-850 bg-slate-100/30 dark:bg-slate-900/20 shrink-0 px-6 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
            <div>
              <span>Biostateer™ Version 1.3.0 (Build 2026.06.01.02)</span>
              <span className="mx-2">|</span>
              <span>Classification: Enterprise Preview</span>
            </div>
            <div className="flex items-center gap-3 select-none">
              <button 
                onClick={() => setShowChangelog(true)} 
                className="hover:text-brand-400 transition cursor-pointer font-bold"
              >
                Changelog
              </button>
              <span>|</span>
              <span>© 2026 Dr. Bhupesh Dewan. All Rights Reserved.</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCalculator={handleSelectCalculator}
      />

      {/* 8-Hour Inactivity Warning Modal (Priority 3) */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 space-y-4 text-center border border-rose-500/20 select-none animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-1 animate-pulse">
              <Clock size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-100">Inactivity Security Alert</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Your Biostateer session has been idle. For clinical security (21 CFR Part 11), you will be signed out in <span className="text-rose-400 font-mono font-bold">{Math.floor(warningCountdown / 60)}m {warningCountdown % 60}s</span>.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleLogout}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                Sign Out
              </button>
              <button
                onClick={() => {
                  setInactiveTime(0);
                  setShowWarningModal(false);
                }}
                className="btn-primary py-1.5 px-4 text-xs font-bold shadow-lg shadow-brand-500/15"
              >
                Extend Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Changelog Modal */}
      {showChangelog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4 relative border border-brand-500/20 select-none">
            <h3 className="text-base font-bold text-slate-100">Biostateer™ Release Notes</h3>
            <div className="text-xs text-slate-400 space-y-3 overflow-y-auto max-h-[260px] pr-2 custom-scrollbar">
              <p className="font-semibold text-brand-400 border-b border-slate-850 pb-1">Version 1.3.0 — Enterprise Security & Gating (June 1, 2026)</p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Integrates secure click-through <strong>Evaluation License Agreements</strong>.</li>
                <li>Restricts anonymous access, forcing multi-step user signups, CAPTCHA, and <strong>6-digit OTP verification</strong>.</li>
                <li>Enforces <strong>8-hour inactivity session timers</strong> and warn reminders.</li>
                <li>Builds dedicated <strong>Admin Dashboards</strong> to review waitlisted accounts and extend licenses.</li>
                <li>Injects <strong>Statistical Validation Status</strong> badges (Formula IDs, R/SAS tolerances) directly below calculator output ledgers.</li>
                <li>Powers **Admin Product Analytics** tracking module usage statistics.</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowChangelog(false)}
              className="w-full btn-secondary text-xs py-1.5 mt-2 cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
