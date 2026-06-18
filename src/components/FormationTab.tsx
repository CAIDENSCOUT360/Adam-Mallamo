import React, { useState } from "react";
import { LLCConfig, Member } from "../types";
import { 
  Building2, 
  Users, 
  Gavel, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle,
  FileSignature, 
  Download, 
  AlertCircle 
} from "lucide-react";
import { motion } from "motion/react";

interface FormationTabProps {
  llc: LLCConfig;
  onUpdateLLC: (config: LLCConfig) => void;
  onSaveGeneratedDocument: (name: string, content: string, category: any) => void;
}

export default function FormationTab({ llc, onUpdateLLC, onSaveGeneratedDocument }: FormationTabProps) {
  // Members editing status
  const [members, setMembers] = useState<Member[]>(llc.members);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"Member" | "Manager" | "Managing Member">("Member");
  const [newPercentage, setNewPercentage] = useState(20);
  const [newCapital, setNewCapital] = useState(5000);

  // States
  const [state, setState] = useState(llc.state);
  const [managementStyle, setManagementStyle] = useState(llc.managementStyle);
  const [businessType, setBusinessType] = useState(llc.businessType);
  const [companyName, setCompanyName] = useState(llc.companyName);

  // Gemini loading
  const [generating, setGenerating] = useState(false);
  const [agreementText, setAgreementText] = useState("");
  const [errorMess, setErrorMess] = useState("");

  // Add Member
  const handleAddMember = () => {
    if (!newName.trim()) return;
    const newM: Member = {
      id: "m-" + Date.now(),
      name: newName,
      role: newRole,
      percentage: Number(newPercentage),
      capital: Number(newCapital),
      signedAgreement: false
    };
    const updated = [...members, newM];
    setMembers(updated);
    setNewName("");
    setNewPercentage(20);
    setNewCapital(5000);
    
    // Broadcast updates
    onUpdateLLC({ ...llc, members: updated });
  };

  // Remove Member
  const handleRemoveMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    onUpdateLLC({ ...llc, members: updated });
  };

  // Trigger Sign on Agreement
  const handleSignMember = (id: string) => {
    const updated = members.map(m => m.id === id ? { ...m, signedAgreement: !m.signedAgreement } : m);
    setMembers(updated);
    onUpdateLLC({ ...llc, members: updated });
  };

  // Generate customized operating agreement
  const handleGenerateAgreement = async () => {
    setGenerating(true);
    setErrorMess("");

    try {
      const response = await fetch("/api/gemini/generate-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          state,
          managementStyle,
          businessType,
          members
        }),
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Failed to draft Operating Agreement. Ensure server is active.");
      }

      const data = await response.json();
      setAgreementText(data.agreement);
    } catch (err: any) {
      console.error(err);
      setErrorMess(err.message || "Failed to contact generator. Please make sure the server is healthy.");
    } finally {
      setGenerating(false);
    }
  };

  // Record into Document Storage
  const handleStoreDraft = () => {
    if (!agreementText) return;
    const name = `${companyName.replace(/\s+/g, "_")}_Operating_Agreement_Bespoke.txt`;
    onSaveGeneratedDocument(name, agreementText, "Operating Agreements");
    alert(`Operating Agreement saved to Secure Vault as name: ${name}`);
  };

  // Total Equity Check
  const totalEquity = members.reduce((sum, m) => sum + m.percentage, 0);

  return (
    <div id="formation-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      
      {/* Parameter Inputs Config */}
      <div id="params-column" className="lg:col-span-5 space-y-6">
        <motion.div 
          id="config-card"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#141414] border border-stone-800 p-5 rounded-sm space-y-4"
        >
          <h4 className="text-[10px] font-bold text-[#c5a059] font-mono tracking-widest flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#c5a059]" />
            ENTITY FORMATION REGISTER
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">COMPANY LEGAL REGISTERED NAME</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  onUpdateLLC({ ...llc, companyName: e.target.value });
                }}
                className="w-full bg-stone-900 border border-stone-800 focus:border-[#c5a059] rounded-sm px-3 py-2 text-xs text-stone-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">STATE JURISDICTION</label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    onUpdateLLC({ ...llc, state: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-[#c5a059] rounded-sm px-3 py-1.5 text-xs text-stone-200 outline-none"
                >
                  <option value="Delaware">Delaware (DE)</option>
                  <option value="California">California (CA)</option>
                  <option value="Texas">Texas (TX)</option>
                  <option value="New York">New York (NY)</option>
                  <option value="Florida">Florida (FL)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">MANAGEMENT STYLE</label>
                <select
                  value={managementStyle}
                  onChange={(e: any) => {
                    setManagementStyle(e.target.value);
                    onUpdateLLC({ ...llc, managementStyle: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-[#c5a059] rounded-sm px-3 py-1.5 text-xs text-stone-200 outline-none"
                >
                  <option value="Member-Managed">Member-Managed</option>
                  <option value="Manager-Managed">Manager-Managed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">PRIMARY OPERATIONS MODEL</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => {
                  setBusinessType(e.target.value);
                  onUpdateLLC({ ...llc, businessType: e.target.value });
                }}
                className="w-full bg-stone-900 border border-stone-800 focus:border-[#c5a059] rounded-sm px-3 py-2 text-xs text-stone-100 outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Stakeholders Configuration Section */}
        <motion.div 
          id="stakeholders-card"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141414] border border-stone-800 p-5 rounded-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-stone-450 font-mono tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c5a059]" />
              LLC CAPITAL STAKEHOLDERS
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${totalEquity === 100 ? 'text-emerald-450 bg-emerald-950/20' : 'text-orange-450 bg-orange-950/20'}`}>
              Split: {totalEquity}%
            </span>
          </div>

          <div id="members-list" className="space-y-2">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between bg-stone-950 border border-stone-900 rounded-sm p-3"
              >
                <div>
                  <p className="text-xs font-semibold text-stone-200">{member.name}</p>
                  <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                    {member.role} • Shares: {member.percentage}% • Contribution: ${member.capital.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSignMember(member.id)}
                    title={member.signedAgreement ? "E-Sign complete" : "Toggle document signature status"}
                    className={`p-1.5 rounded transition ${member.signedAgreement ? 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30' : 'bg-stone-900 text-stone-605 border border-stone-850 hover:text-stone-305'}`}
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                  </button>
                  
                  {members.length > 1 && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 bg-stone-900 text-stone-550 hover:text-rose-450 border border-stone-850 hover:border-stone-800 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Member */}
          <div id="member-editor-panel" className="pt-3 border-t border-stone-850 space-y-3">
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase">PROPOSE STAKEHOLDER / MANAGER</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Partner Legal Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-850 text-xs text-stone-100 placeholder-stone-700 px-2.5 py-1.5 rounded-sm outline-none"
              />
              <select
                value={newRole}
                onChange={(e: any) => setNewRole(e.target.value)}
                className="w-full bg-stone-900 border border-stone-850 text-xs text-stone-200 px-2.5 py-1.5 rounded-sm outline-none"
              >
                <option value="Member">Member</option>
                <option value="Managing Member">Managing Member</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] text-stone-500 font-mono mb-1">EQUITY SHARE (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newPercentage}
                  onChange={(e) => setNewPercentage(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-850 text-xs text-stone-200 px-2.5 py-1 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[8px] text-stone-500 font-mono mb-1">CAPITAL VALUE ($)</label>
                <input
                  type="number"
                  min="0"
                  value={newCapital}
                  onChange={(e) => setNewCapital(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-850 text-xs text-stone-200 px-2.5 py-1 rounded-sm"
                />
              </div>
            </div>

            <button
              onClick={handleAddMember}
              className="w-full py-1.5 bg-stone-905 hover:bg-stone-850 border border-stone-800 text-stone-300 text-xs font-mono font-medium rounded-sm transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> INSERT STAKEHOLDER ENTRY
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bespoke Agreement Workspace Panel */}
      <div id="agreements-column" className="lg:col-span-7 space-y-6">
        <motion.div 
          id="agreement-workspace-card"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#141414] border border-stone-800 rounded-sm overflow-hidden flex flex-col justify-between min-h-[500px]"
        >
          {/* Header */}
          <div className="p-4 bg-stone-900/60 border-b border-stone-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="w-4.5 h-4.5 text-[#c5a059]" />
              <div>
                <h4 className="font-serif text-base text-stone-200">Corporate Governance Draftsman</h4>
                <p className="text-[10px] text-stone-500">Draft certified, multi-member operating schedules through Gemini.</p>
              </div>
            </div>

            {agreementText && (
              <button
                onClick={handleStoreDraft}
                className="px-3 py-1 text-xs font-mono font-bold text-black bg-[#c5a059] rounded-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" /> LOCK TO VAULT
              </button>
            )}
          </div>

          {/* Drafting Workspace */}
          <div id="drafting-body" className="p-6 flex-1 flex flex-col justify-center">
            {generating ? (
              <div id="drafting-loader" className="text-center py-16 space-y-4">
                <div className="w-10 h-10 rounded-full border-t-2 border-[#c5a059] animate-spin mx-auto"></div>
                <p className="text-xs font-serif italic text-stone-350 animate-pulse">Drafting operating instructions aligned with {state} law...</p>
                <div className="text-[10px] font-mono text-stone-550 max-w-xs mx-auto">
                  <p>"Mapping IRS Partnership parameters..."</p>
                  <p>"Generating multi-signature execution pages..."</p>
                </div>
              </div>
            ) : agreementText ? (
              <div id="rendered-agreement-paper" className="space-y-4">
                <div className="p-4 bg-stone-950 border border-stone-900 text-xs text-stone-350 leading-relaxed font-serif whitespace-pre-wrap max-h-[350px] overflow-y-auto pl-3 border-l-2 border-[#c5a059]">
                  {agreementText}
                </div>
                <div className="p-3 bg-stone-900 border border-stone-850 rounded text-xs text-stone-400 flex items-center justify-between">
                  <span>Operating Agreement drafted representing registered members. Ensure all digital signatures are complete.</span>
                </div>
              </div>
            ) : (
              <div id="empty-state-agreement" className="text-center max-w-sm mx-auto py-12 space-y-4">
                <div className="p-3 bg-stone-950/80 border border-stone-850 rounded-full inline-block">
                  <Sparkles className="w-6 h-6 text-[#c5a059]" />
                </div>
                <div>
                  <h5 className="font-serif text-base font-semibold text-stone-200">Formulate Operating Agreement</h5>
                  <p className="text-xs text-stone-450 mt-1 leading-relaxed">
                    Once capital shares, stakeholder lists, and the principal management style are selected, launch the draft compiler to construct rules.
                  </p>
                </div>
                
                {totalEquity !== 100 && (
                  <div id="equity-warning" className="p-2.5 bg-stone-900 border border-stone-850 rounded flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <p className="text-[11px] text-stone-400 leading-snug">
                      Current combined capital shares equal <strong>{totalEquity}%</strong>. Under state filing best-practices, total holdings should equal exactly 100%.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGenerateAgreement}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-[#c5a059] border border-[#c5a059]/45 hover:border-[#c5a059] font-mono font-bold text-xs rounded transition flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> DRAFT AGREEMENT
                </button>
              </div>
            )}

            {errorMess && (
              <div id="drafting-error-banner" className="p-3.5 bg-red-955/30 border border-red-900/50 rounded flex items-center gap-2.5 text-left mt-4 text-xs text-red-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <div>
                  <p className="font-semibold">Filing Generation Postponed</p>
                  <p className="text-red-400 mt-0.5">{errorMess}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
