import React, { useState, useRef, useEffect } from "react";
import { Brain, Send, ShieldAlert, Cpu, ArrowRight, Clipboard, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  actionLabel?: string;
  actionModule?: string;
  confidence?: number; // AI assurance score
}

export default function CopilotPanel({
  setCurrentModule,
  onLogAudit
}: {
  setCurrentModule: (module: string) => void;
  onLogAudit: (action: string, inputs: any, outputs: any) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your Biostateer™ AI Biostatistics Consultant. I can help recommend study designs, statistical tests, sample size methodologies, or explain mathematical assumptions. What study are you planning?",
      confidence: 98
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Biostatistics Expert System Rule Parser
  const getExpertResponse = (query: string): { text: string; actionLabel?: string; actionModule?: string; confidence: number } => {
    const q = query.toLowerCase();
    
    if (q.includes("two groups") || q.includes("independent") || q.includes("t-test") || q.includes("bp reduction")) {
      return {
        text: `Based on your request for comparing **two independent groups with continuous outcomes**, I recommend:
        
1. **Primary Parametric Test**: **Welch's Independent Two-Sample T-Test** (accounts for potential unequal variances).
2. **Nonparametric Alternative**: **Mann-Whitney U Test** (if data normality is severely violated).
3. **Effect Size**: **Cohen's d** (pooled SD) or **Hedges' g** (for small sample sizes < 20 per group).
4. **Primary Assumptions**: Normality (Shapiro-Wilk) and Independence of observations.

Would you like to execute this analysis or calculate the required sample size?`,
        actionLabel: "Launch Statistical Analysis",
        actionModule: "parametric",
        confidence: 96
      };
    }

    if (q.includes("sample size") || q.includes("power") || q.includes("calculate n") || q.includes("how many")) {
      return {
        text: `To calculate **clinical sample size or statistical power**, we need to define:
- **Type I error (alpha)**: typically 0.05 (two-sided)
- **Target Power (1 - beta)**: typically 80% or 90%
- **Expected Effect Size**: e.g., Cohen's d for means, risk difference for proportions, or Hazard Ratio for survival.

I can launch the interactive **Sample Size Hub** for you to input these parameters and plot a **Power Sensitivity Curve**.`,
        actionLabel: "Open Sample Size Hub",
        actionModule: "sample-size",
        confidence: 98
      };
    }

    if (q.includes("survival") || q.includes("time-to-event") || q.includes("cancer") || q.includes("hazard")) {
      return {
        text: `For clinical **time-to-event or survival endpoints**:
        
1. **Survival Curve**: **Kaplan-Meier Estimator** to compute survival rates over follow-up duration.
2. **Hypothesis Test**: **Log-Rank Test** to evaluate comparative divergence between survival curves.
3. **Multivariate modeling**: **Cox Proportional Hazards Regression** to compute Hazard Ratios (HR) and Wald 95% confidence intervals.
4. **Key Assumption**: Proportional hazards (risk ratios are constant over time).

I can redirect you to the **Survival Analysis Suite** to upload your times and events.`,
        actionLabel: "Open Survival Suite",
        actionModule: "survival",
        confidence: 94
      };
    }

    if (q.includes("protocol") || q.includes("sap") || q.includes("irb") || q.includes("draft")) {
      return {
        text: `I can help draft **FDA/ICH E9-compliant statistical methodology paragraphs** and **SAP sections** for your research protocols. 
        
Simply tell me your endpoint characteristics (continuous or binary) and I will generate complete IRB-ready paragraphs. Let's open the **Protocol Statistics Assistant**.`,
        actionLabel: "Open Protocol Assistant",
        actionModule: "agreement",
        confidence: 95
      };
    }

    // Default expert response
    return {
      text: `I understand your scientific inquiry. For clinical biostatistics:
- **Continuous endpoints (2 groups)**: Use Welch's T-Test or Mann-Whitney U.
- **Categorical endpoints (proportions)**: Use Pearson's Chi-Square or Fleiss proportions.
- **Survival outcomes (log-rank)**: Use Kaplan-Meier and Cox regression.

I can guide you through the interactive modules. Which area of your study would you like to build first?`,
      confidence: 90
    };
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI thinking and output expert advice
    setTimeout(() => {
      const expert = getExpertResponse(textToSend);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: expert.text,
        actionLabel: expert.actionLabel,
        actionModule: expert.actionModule,
        confidence: expert.confidence
      };
      setMessages((prev) => [...prev, aiMsg]);
      onLogAudit("AI Copilot Consultation", { query: textToSend }, { response: expert.text });
    }, 450);
  };

  return (
    <div className="w-[340px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-full flex flex-col overflow-hidden relative z-10 shadow-2xl">
      {/* Copilot Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50">
        <div className="p-1.5 bg-brand-500/10 rounded-lg text-brand-400">
          <Brain size={16} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight font-display">
            AI Biostatistics Copilot
          </h3>
          <span className="text-[9px] text-slate-500 block">Senior Scientific Consultant</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scroll-smooth select-text bg-slate-50/30 dark:bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[270px] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-brand-500 text-white rounded-tr-none font-medium"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-850 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}

              {/* AI Governance Warning Block (Addition 5) */}
              {msg.sender === "ai" && msg.confidence && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1 text-[9.5px] select-none animate-in fade-in duration-200 text-slate-700 dark:text-slate-350">
                  <div className="font-bold text-brand-650 dark:text-brand-400 text-[10px] uppercase tracking-wider">
                    AI Recommendation
                  </div>
                  <div className="flex justify-between items-baseline font-semibold text-slate-550 dark:text-slate-400 text-[9px]">
                    <span>Assurance Metric</span>
                    <span className="font-bold text-amber-550 dark:text-amber-400">Confidence Level: {msg.confidence}%</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800/80 pt-1.5 mt-1 text-slate-500 dark:text-slate-400 leading-normal">
                    <p className="font-medium">Not a substitute for review by a qualified statistician.</p>
                    <p className="mt-0.5">Verify assumptions before implementation.</p>
                  </div>
                </div>
              )}

              {msg.actionLabel && msg.actionModule && (
                <button
                  onClick={() => setCurrentModule(msg.actionModule!)}
                  className="mt-3 bg-brand-500/10 hover:bg-brand-500/20 text-brand-650 dark:text-brand-400 border border-brand-500/20 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 w-full justify-center transition-all cursor-pointer"
                >
                  {msg.actionLabel}
                  <ArrowRight size={10} />
                </button>
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1 select-none">
              {msg.sender === "user" ? "You" : "Copilot"}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Consultations */}
      <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 space-y-1 select-none">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">
          Suggested Inquiries
        </span>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "Welch T-Test Efficacy", query: "BP reduction Welch t-test" },
            { label: "Calculate Sample Size", query: "Power sample size calculation" },
            { label: "Log-Rank Survival Curves", query: "Kaplan-Meier survival hazards" }
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt.query)}
              className="text-[9px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI biostatistician..."
            className="form-input text-xs"
          />
          <button type="submit" className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg active:scale-95 transition-all cursor-pointer">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
