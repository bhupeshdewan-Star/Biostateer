import React from "react";
import { ShieldAlert, Mail, MapPin, Eye } from "lucide-react";

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 bg-slate-950 text-slate-100 font-sans select-none animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 relative select-text">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />
        
        {/* Back navigation */}
        {onBack && (
          <button 
            onClick={onBack}
            className="px-3 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-slate-100 text-xs font-semibold cursor-pointer transition active:scale-95"
          >
            ← Back
          </button>
        )}

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-bold font-display text-slate-100 tracking-tight flex items-center gap-2">
            <Eye className="text-brand-500 w-7 h-7" />
            Biostateer™ Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: June 1, 2026 | Version 1.3
          </p>
        </div>

        <div className="border-t border-slate-850 pt-4 space-y-5 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">1. Introduction</h3>
            <p>
              Dr. Bhupesh Dewan ("we", "us", or "our") operates the Biostateer™ Clinical Research & Biostatistics Intelligence Platform. We are committed to protecting the privacy and security of evaluators, biostatisticians, and peer reviewers. This policy details what data is collected during evaluation access and how it is managed.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">2. Information We Collect</h3>
            <p>
              To maintain the integrity of our clinical evaluation program and prevent unauthorized redistribution or reverse engineering, we collect the following metrics:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
              <li><strong>Personal Identifiers</strong>: Full name, official email address, mobile phone number, city, and country of residence.</li>
              <li><strong>Professional Details</strong>: Associated clinical organization, academic department, official job title, LinkedIn professional profile URL, and institution website.</li>
              <li><strong>Professional Categorization</strong>: Selected user type (e.g. Biostatistician, CRA, Principal Investigator, Regulatory Affairs).</li>
              <li><strong>Evaluation Governance Data</strong>: Terms agreement versions accepted, electronic signature PIN authorizations, and waitlist status notes.</li>
              <li><strong>Visitor Analytics & Usage Audits</strong>: Capture of anonymized session counts, total time spent, specific modules accessed, hypothesis tests executed, and reports compiled.</li>
              <li><strong>Device Metadata</strong>: Browser type, operating system version, masked IP addresses, and generalized geolocation details.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">3. Purpose of Collection</h3>
            <p>
              All captured data elements serve strict operational and administrative purposes:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
              <li>To audit, verify, and approve evaluation credentials through manual review.</li>
              <li>To secure the platform against credential stuffing, brute-force hacking, and bot registrations.</li>
              <li>To catalog usage data to understand biostatistics feature popularity and direct future development sprints.</li>
              <li>To enforce copyright agreements and 21 CFR Part 11 electronic audit trail accountability.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">4. Data Storage & Security</h3>
            <p>
              We prioritize clinical security. User data is never stored solely in browser LocalStorage. All records are saved securely inside containerized backend relational databases hosted in clinical cloud architectures (AWS, Google Cloud, Azure). We utilize AES-256 database encryption, HTTPS TLS 1.3 encryption for all traffic, and strict Content-Security-Policy (CSP) headers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">5. Expiration and Retention</h3>
            <p>
              Evaluation accounts expire automatically after 45 days. We retain visitor data for 12 months after license expiration to maintain historical usage analytics, after which all personal records are purged unless extended.
            </p>
          </section>

          <section className="space-y-2 p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-brand-400" />
              6. Administrator Contact
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              For security concerns, evaluation extensions, or compliance audit inquiries, contact the Product Owner directly:
            </p>
            <div className="pt-1.5 space-y-1 text-[11px] font-medium text-slate-300">
              <p className="flex items-center gap-1.5"><Mail size={12} className="text-brand-400" /> bdewan@biostateer.com</p>
              <p className="flex items-center gap-1.5"><MapPin size={12} className="text-brand-400" /> Mumbai, India</p>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-850 pt-4 text-center space-y-1 text-[10px] text-slate-500 select-none">
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
