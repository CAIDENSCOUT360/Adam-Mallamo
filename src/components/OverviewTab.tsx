import React from "react";
import { LLCConfig, ComplianceTask } from "../types";
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Info, 
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

interface OverviewTabProps {
  llc: LLCConfig;
  tasks: ComplianceTask[];
  onCompleteTask: (id: string) => void;
  onNavigateToTab: (index: number) => void;
}

export default function OverviewTab({ llc, tasks, onCompleteTask, onNavigateToTab }: OverviewTabProps) {
  // Compute overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Filter urgent files (pending in near term)
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");

  // Checklist items mapping corporate hygiene
  const hygieneChecks = [
    { label: "Approve and Execute Operating Agreement", done: llc.members.every(m => m.signedAgreement) },
    { label: "Acquire Employer Identification Number (EIN)", done: llc.einStatus === "Obtained" },
    { label: "Appoint Delaware Registered Agent Representative", done: true },
    { label: "Review Corporate Tax Classification", done: true },
    { label: "Establish Business Invoices Ledger Structure", done: true },
  ];

  return (
    <div id="overview-tab-root" className="space-y-6 animate-slide-up">
      {/* Entity Status Header Bar */}
      <motion.div 
        id="overview-header-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[#141414] border border-stone-800 rounded-sm"
      >
        <div id="status-card-1" className="space-y-1.5 border-r border-stone-850/60 pr-4 last:border-r-0">
          <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">CORPORATE REGISTERED NAME</span>
          <h3 className="text-xl font-serif font-semibold text-stone-100 italic tracking-tight flex items-center gap-2">
            {llc.companyName}
          </h3>
          <span className="inline-flex px-2 py-0.5 text-[9px] font-mono tracking-wide text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-full items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            ACTIVE GOOD STANDING
          </span>
        </div>
        <div id="status-card-2" className="space-y-1.5 border-r border-stone-850/60 pr-4 last:border-r-0">
          <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">JURISDICTION DOMICILE</span>
          <p className="text-sm font-semibold text-stone-200">{llc.state} LLC</p>
          <p className="text-[10px] text-stone-500 font-mono">Formation Stamp: {llc.formationDate}</p>
        </div>
        <div id="status-card-3" className="space-y-1.5 border-r border-stone-850/60 pr-4 last:border-r-0">
          <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">FEDERAL TAX ID (EIN)</span>
          <p className="text-sm font-mono font-semibold text-stone-205">{llc.ein || "In Progress"}</p>
          <span className="inline-block px-1.5 py-0.2 text-[9px] bg-stone-900 text-stone-400 border border-stone-800 rounded capitalize">
            {llc.einStatus}
          </span>
        </div>
        <div id="status-card-4" className="space-y-1.5">
          <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">MANAGEMENT STRUCTURE</span>
          <p className="text-sm font-semibold text-stone-200">{llc.managementStyle}</p>
          <p className="text-[10px] text-stone-500 font-mono">{llc.members.length} Active Capital Members</p>
        </div>
      </motion.div>

      {/* Main Grid: Compliance Meter vs Urgent Filing Tracker */}
      <div id="overview-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compliance Meter - Span 4 */}
        <motion.div 
          id="compliance-meter-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="lg:col-span-4 bg-[#141414] border border-stone-800 p-6 rounded-sm flex flex-col justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-[10px] font-semibold text-[#c5a059] font-mono tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              FILING STANDING INDEX
            </h4>
            <p className="text-xs text-stone-450 leading-relaxed">Continuous compliance standing computed based on registered state liabilities.</p>
          </div>

          <div id="gauge-container" className="py-6 flex flex-col items-center justify-center relative">
            {/* Visual Circular Progress bar */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-stone-900 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-[#c5a059] fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - completionPercentage / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div id="gauge-label-center" className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-stone-100 tracking-tight font-serif">{completionPercentage}%</span>
                <span className="text-[9px] font-mono text-stone-450 tracking-widest">SECURED</span>
              </div>
            </div>
          </div>

          <div id="compliance-status-pill" className={`p-3.5 rounded-sm flex items-start gap-3 bg-stone-900/60 border border-stone-850`}>
            {completionPercentage >= 75 ? (
              <Shield className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-505 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <p className="font-semibold text-stone-200">
                {completionPercentage >= 100 ? "Corporate Status Intact" : "Filing Oversight Inactive"}
              </p>
              <p className="text-stone-450 mt-1 leading-snug">Ensure timely Delaware annual reports to maintain personal asset protection liability shields.</p>
            </div>
          </div>
        </motion.div>

        {/* Real-time Regulatory Compliance Alerts - Span 8 */}
        <motion.div 
          id="alerts-column"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="lg:col-span-8 bg-[#141414] border border-stone-800 p-6 rounded-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-850">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-stone-450 font-mono tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c5a059]" />
                  REAL-TIME STATUTORY COMPLIANCE ALERTS
                </h4>
                <p className="text-xs text-stone-450">Active filings, fees, and informational notices tracking.</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-950/60 border border-stone-850 rounded">
                {pendingTasks.length} NOTICES ACTIVE
              </span>
            </div>

            {/* List of filings of state and tax */}
            <div id="pending-alerts-list" className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
              {pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  id={`alert-row-${task.id}`}
                  className="bg-[#0a0a0a] border border-stone-850 hover:border-stone-800 transition p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 rounded uppercase">
                        {task.category}
                      </span>
                      <span className="text-xs text-[#c5a059] font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Due: {task.dueDate}
                      </span>
                    </div>
                    <h5 className="font-serif text-base text-stone-200">{task.title}</h5>
                    <p className="text-xs text-stone-450 leading-snug">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[9px] text-stone-500 font-mono uppercase">STATE FEE</p>
                      <p className="text-xs font-mono font-bold text-stone-250">
                        {task.fee > 0 ? `$${task.fee}.00` : "No Charge"}
                      </p>
                    </div>
                    <button 
                      onClick={() => onCompleteTask(task.id)}
                      id={`complete-btn-${task.id}`}
                      className="px-3 py-1.5 text-[11px] font-mono font-semibold text-black bg-[#c5a059] hover:bg-[#b08c48] transition cursor-pointer"
                    >
                      FILE RECORD
                    </button>
                  </div>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div id="no-alerts-view" className="text-center py-16 border border-dashed border-stone-850">
                  <CheckCircle2 className="w-10 h-10 text-stone-605 mx-auto mb-2" />
                  <p className="text-sm font-semibold font-serif text-stone-350">Perfect Jurisdictional Health!</p>
                  <p className="text-xs text-stone-550 mt-1">Integrated Avodah LLC has verified active status with the Delaware Division of Corporations.</p>
                </div>
              )}
            </div>
          </div>

          <div id="info-footer" className="mt-4 pt-4 border-t border-stone-850/60 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              State filings determine Good Standing certificates.
            </span>
            <button 
              onClick={() => onNavigateToTab(3)} // Navigate to Tax Reporting Tab (index 3 corresponds to tax)
              className="text-[#c5a059] hover:text-[#b08c48] flex items-center gap-1 transition font-mono font-semibold cursor-pointer"
            >
              Analyze Ledger Reports <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sovereign Covenant of Self-Government & Order Mastery */}
      <motion.div 
        id="sovereign-covenant-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 bg-[#111111] border-2 border-[#c5a059]/30 rounded-sm space-y-6 relative overflow-hidden"
      >
        <div id="glow-ambient" className="absolute top-0 right-0 w-40 h-40 bg-[#c5a059]/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              <span className="text-[10px] font-bold text-[#c5a059] font-mono tracking-widest uppercase">
                COVENANT OF SELF-GOVERNMENT
              </span>
            </div>
            <h3 className="font-serif italic text-xl text-stone-100">Dedicating Our Community to Righteous Corporate Stewardship</h3>
          </div>
          <span className="self-start md:self-center px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-sm">
            DOMAIN INTEGRITY: ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preamble & Blessings Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-950/70 p-4 border border-stone-900 rounded-sm space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-[#c5a059] block uppercase">Solemn Preamble</span>
              <p className="font-serif italic text-xs text-stone-300 leading-relaxed">
                "We establish this solemn Covenant of Self-Government under the supreme law of Yahweh, blending spiritual devotion with practical, righteous corporate governance to lead our community in absolute holiness and tactical liberty."
              </p>
            </div>

            <div className="bg-stone-950/70 p-4 border border-[#c5a059]/10 rounded-sm space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-[#c5a059] flex items-center gap-1.5 uppercase">
                <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                Divine Blessings & Tactical Intercession
              </span>
              <p className="text-xs text-stone-450 leading-relaxed">
                We pray for Yahweh’s eternal wisdom and protection to rest upon our organizational leaders, our strategic alliances, and our dedicated active defense and security unit to guarantee perpetual peace and sovereign protection.
              </p>
              <div className="pt-2 border-t border-stone-90% grid grid-cols-3 gap-2 text-center text-[9px] font-mono uppercase tracking-wider text-stone-550">
                <div>
                  <p className="text-[#c5a059] font-bold">SOLOMONIC</p>
                  <p className="mt-0.5 text-stone-500">Wisdom</p>
                </div>
                <div>
                  <p className="text-[#c5a059] font-bold">ALLIANCES</p>
                  <p className="mt-0.5 text-stone-500">Blessed</p>
                </div>
                <div>
                  <p className="text-[#c5a059] font-bold">DEFENSE</p>
                  <p className="mt-0.5 text-stone-500">Shielded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nine Levels of Order Mastery Checklist */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-widest text-stone-450 font-bold uppercase">
                THE NINE LEVELS OF ORDER MASTERY
              </span>
              <span className="text-[9px] font-mono text-stone-550">Sovereignty Progress: 100% Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {[
                { lvl: 1, title: "Spiritual Alignment", desc: "Fidelity to Yahweh" },
                { lvl: 2, title: "Command of Tongue", desc: "Noble Speech & Truth" },
                { lvl: 3, title: "Household Sanctum", desc: "Family Protection" },
                { lvl: 4, title: "Financial Just Weights", desc: "No Usury Lead Ledger" },
                { lvl: 5, title: "Contractual Fidelity", desc: "Vigilant State Compliance" },
                { lvl: 6, title: "Strategic Alliances", desc: "Righteous Partners" },
                { lvl: 7, title: "Tactical Defense Unit", desc: "Security & Fortitude" },
                { lvl: 8, title: "Compassionate Charity", desc: "Active Community Uplifting" },
                { lvl: 9, title: "Ultimate Sovereign Legacy", desc: "Multi-Generational Light" },
              ].map((item) => (
                <div 
                  key={item.lvl}
                  className="bg-stone-950/40 p-2.5 border border-stone-850 hover:border-[#c5a059]/25 rounded-sm flex items-start gap-2.5 hover:bg-stone-900/10 transition"
                >
                  <span className="w-5 h-5 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                    {item.lvl}
                  </span>
                  <div>
                    <h5 className="font-serif font-medium text-stone-200">{item.title}</h5>
                    <p className="text-[9px] text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Corporate Governance Hygiene Checklist */}
      <motion.div 
        id="corporate-hygiene-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="p-5 bg-[#141414] border border-stone-800 rounded-sm"
      >
        <div className="flex items-center gap-2 mb-4 border-b border-stone-850 pb-3">
          <TrendingUp className="w-4.5 h-4.5 text-[#c5a059]" />
          <h4 className="text-[10px] font-bold text-[#c5a059] font-mono tracking-widest">ANNUAL CORPORATE GOVERNANCE HYGIENE STATUS</h4>
        </div>

        <div id="hygiene-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {hygieneChecks.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col justify-between p-3.5 bg-[#0a0a0a] border border-stone-855 rounded-sm text-xs min-h-[95px]"
            >
              <span className="text-stone-300 font-medium leading-relaxed">{item.label}</span>
              <div className="mt-2.5 flex items-center justify-between border-t border-stone-900 pt-1.5">
                <span className="text-[9px] text-stone-500 font-mono">STATUS</span>
                {item.done ? (
                  <span className="text-[9px] font-mono text-emerald-450 bg-emerald-950/20 border border-emerald-900/40 px-1 py-0.2 rounded">VERIFIED</span>
                ) : (
                  <span className="text-[9px] font-mono text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-1 py-0.2 rounded">ATTENTION</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
