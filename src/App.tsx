import React, { useState } from "react";
import { 
  initialLLC, 
  initialComplianceTasks, 
  initialDocuments, 
  initialTransactions, 
  initialIntegrations 
} from "./data";
import { 
  LLCConfig, 
  ComplianceTask, 
  SecureDocument, 
  LedgerTransaction, 
  AccountingIntegration 
} from "./types";
import OverviewTab from "./components/OverviewTab";
import FormationTab from "./components/FormationTab";
import ComplianceTab from "./components/ComplianceTab";
import VaultTab from "./components/VaultTab";
import TaxReportingTab from "./components/TaxReportingTab";
import AccountingSyncTab from "./components/AccountingSyncTab";
import PamperProjectTab from "./components/PamperProjectTab";
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  CheckCircle,
  Clock,
  HelpCircle,
  LayoutDashboard,
  Hammer,
  RotateCcw,
  ShieldClose
} from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  // App data states
  const [llc, setLlc] = useState<LLCConfig>(initialLLC);
  const [tasks, setTasks] = useState<ComplianceTask[]>(initialComplianceTasks);
  const [documents, setDocuments] = useState<SecureDocument[]>(initialDocuments);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(initialTransactions);
  const [integrations, setIntegrations] = useState<AccountingIntegration[]>(initialIntegrations);

  // General navigation state
  // 0: Overview, 1: Formation, 2: Compliance, 3: Document Vault, 4: Tax Filings, 5: Accounting sync
  const [activeTab, setActiveTab] = useState<number>(0);

  // Regulatory Assistant chat sidebar state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: "Greetings. I am the Integrated Avodah Regulatory Consultant. I can scan multi-state corporate governance rules, explain LLC tax selections, outline beneficial ownership steps, or draft customized filings. Ask away." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  // Navigation callbacks
  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Completed" as const } : t));
  };

  const handleAddTask = (task: Omit<ComplianceTask, "id">) => {
    const newTask: ComplianceTask = {
      ...task,
      id: "task-" + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUploadDocument = (doc: SecureDocument) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateDocumentAnalysis = (id: string, summary: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, aiReviewed: true, summary } : d));
  };

  const handleAddTransaction = (tx: LedgerTransaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleIntegration = (id: "quickbooks" | "xero" | "freshbooks") => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const isConnected = item.status === "Connected";
        return {
          ...item,
          status: isConnected ? "Disconnected" as const : "Connected" as const,
          lastSynced: isConnected ? "Never" : new Date().toLocaleString()
        };
      }
      return item;
    }));
  };

  const handleSyncNow = (id: "quickbooks" | "xero" | "freshbooks") => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: "Syncing" as const,
          lastSynced: new Date().toLocaleString()
        };
      }
      return item;
    }));

    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: "Connected" as const
          };
        }
        return item;
      }));
    }, 2000);
  };

  // Submit Assistant Query
  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);
    setChatError("");

    try {
      const response = await fetch("/api/gemini/compliance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", text: userText }],
          companyContext: {
            companyName: llc.companyName,
            state: llc.state,
            managementStyle: llc.managementStyle
          }
        })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Compliance API failure.");
      }

      const result = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", text: result.response }]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "Failed compliance consult communication.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div id="app-root" className="bg-[#0a0a0a] text-stone-200 min-h-screen flex flex-col font-sans selection:bg-[#c5a059]/30 selection:text-white">
      
      {/* Top Header Navigation matching the mockup */}
      <header className="h-16 border-b border-stone-850 flex items-center justify-between px-6 md:px-8 bg-[#0d0d0d] shrink-0">
        <div id="header-brand" className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#c5a059] flex items-center justify-center rounded-sm shadow-md">
            <span className="text-black font-serif font-bold text-xl uppercase">A</span>
          </div>
          <div>
            <h1 className="font-serif italic text-xl md:text-2xl text-stone-100 tracking-tight">
              Integrated Avodah <span className="font-sans not-italic text-[10px] uppercase tracking-widest text-[#c5a059] ml-2 block md:inline border-l md:border-l border-stone-800 pl-0 md:pl-2.5">Corporate Portal</span>
            </h1>
          </div>
        </div>

        <div id="header-indicators" className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-stone-900 px-3 py-1.5 border border-stone-850">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">System Secure</span>
          </div>

          <button
            onClick={() => setShowChat(!showChat)}
            className="px-3 py-1.5 text-xs font-mono bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-stone-100 transition rounded-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            {showChat ? "Hide Advisor" : "Consult AI"}
          </button>

          <div className="w-9 h-9 rounded-full border border-[#c5a059]/60 p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-stone-800 border border-stone-900 flex items-center justify-center text-[10px] font-bold text-[#c5a059]">JD</div>
          </div>
        </div>
      </header>

      {/* Main Body container */}
      <div id="main-frame" className="flex-1 flex overflow-hidden">
        
        {/* Left Interactive Sidebar mirroring mockup exactly */}
        <aside className="w-64 border-r border-stone-850 bg-[#0d0d0d] hidden lg:flex flex-col p-6 justify-between shrink-0">
          <nav className="space-y-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-4 font-mono font-bold">Principal Operations</p>
              <ul className="space-y-1">
                {[
                  { label: "Executive Overview", index: 0 },
                  { label: "Entity Formation", index: 1 },
                  { label: "Regulatory Standing", index: 2 }
                ].map((item) => (
                  <li 
                    key={item.index} 
                    onClick={() => setActiveTab(item.index)}
                    className={`flex items-center gap-3 p-2.5 rounded-sm transition cursor-pointer text-sm ${
                      activeTab === item.index 
                      ? "text-stone-100 bg-stone-900 border-l border-[#c5a059] font-medium" 
                      : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/40"
                    }`}
                  >
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-4 font-mono font-bold">Assets & Governance</p>
              <ul className="space-y-1">
                {[
                  { label: "Secure Document Vault", index: 3 },
                  { label: "Tax Bookkeeping", index: 4 },
                  { label: "Accounting Sync", index: 5 }
                ].map((item) => (
                  <li 
                    key={item.index} 
                    onClick={() => setActiveTab(item.index)}
                    className={`flex items-center gap-3 p-2.5 rounded-sm transition cursor-pointer text-sm ${
                      activeTab === item.index 
                      ? "text-stone-100 bg-stone-900 border-l border-[#c5a059] font-medium" 
                      : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/40"
                    }`}
                  >
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-4 font-mono font-bold">Community Outreach</p>
              <ul className="space-y-1">
                {[
                  { label: "Neighborly Pamper Project", index: 6 }
                ].map((item) => (
                  <li 
                    key={item.index} 
                    onClick={() => setActiveTab(item.index)}
                    className={`flex items-center gap-3 p-2.5 rounded-sm transition cursor-pointer text-sm ${
                      activeTab === item.index 
                      ? "text-stone-100 bg-stone-900 border-l border-[#c5a059] font-medium" 
                      : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/40"
                    }`}
                  >
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Connected state mini panel */}
          <div className="bg-stone-900/80 p-4 border border-stone-850 rounded-sm">
            <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500">LEDGER SYNC STATUS</p>
            <p className="text-xs text-stone-250 mt-1 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {integrations.some(i => i.status === "Connected") ? "QB Online Linked" : "Local Database Mode"}
            </p>
            <div className="w-full bg-stone-800 h-1 mt-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#c5a059] transition-all duration-500" 
                style={{ width: integrations.some(i => i.status === "Connected") ? "100%" : "30%" }}
              ></div>
            </div>
          </div>
        </aside>

        {/* Content View Workspace Scrollable */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0a0a0a] flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Mobile / Tablet Horizontal Scroll Menu Tabs */}
            <div className="lg:hidden flex border-b border-stone-850 overflow-x-auto pb-2 gap-2 scrollbar-none shrink-0 mb-4">
              {[
                { label: "Overview", index: 0 },
                { label: "Formation", index: 1 },
                { label: "Compliance", index: 2 },
                { label: "Vault", index: 3 },
                { label: "Tax", index: 4 },
                { label: "Sync", index: 5 },
                { label: "Pamper Project", index: 6 }
              ].map((m) => (
                <button
                  key={m.index}
                  onClick={() => setActiveTab(m.index)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-tight rounded-sm transition whitespace-nowrap ${
                    activeTab === m.index 
                    ? "bg-[#c5a059] text-black" 
                    : "bg-stone-900 text-stone-400 border border-stone-850"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dynamic Content Switching Tab components */}
            <div id="dynamic-workspace-tab">
              {activeTab === 0 && (
                <OverviewTab 
                  llc={llc} 
                  tasks={tasks} 
                  onCompleteTask={handleCompleteTask} 
                  onNavigateToTab={(idx) => setActiveTab(idx)} 
                />
              )}

              {activeTab === 1 && (
                <FormationTab 
                  llc={llc} 
                  onUpdateLLC={setLlc} 
                  onSaveGeneratedDocument={(name, content, category) => {
                    const freshDoc: SecureDocument = {
                      id: "doc-gen-" + Date.now(),
                      name,
                      category,
                      uploadDate: new Date().toISOString().split("T")[0],
                      size: "24 KB",
                      isSigned: false,
                      aiReviewed: false,
                      content
                    };
                    handleUploadDocument(freshDoc);
                  }}
                />
              )}

              {activeTab === 2 && (
                <ComplianceTab 
                  tasks={tasks} 
                  onCompleteTask={handleCompleteTask} 
                  onAddTask={handleAddTask}
                  llc={llc}
                />
              )}

              {activeTab === 3 && (
                <VaultTab 
                  documents={documents} 
                  onUploadDocument={handleUploadDocument} 
                  onDeleteDocument={handleDeleteDocument}
                  onUpdateDocumentAnalysis={handleUpdateDocumentAnalysis}
                />
              )}

              {activeTab === 4 && (
                <TaxReportingTab 
                  transactions={transactions} 
                  onAddTransaction={handleAddTransaction} 
                  onDeleteTransaction={handleDeleteTransaction}
                  llc={llc}
                />
              )}

              {activeTab === 5 && (
                <AccountingSyncTab 
                  integrations={integrations} 
                  onToggleIntegration={handleToggleIntegration} 
                  onSyncNow={handleSyncNow}
                  transactions={transactions}
                />
              )}

              {activeTab === 6 && (
                <PamperProjectTab 
                  llc={llc}
                />
              )}
            </div>
          </div>

          {/* Corporate Footer status log elements matching the design philosophy (Architectural Honesty) */}
          <footer className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-600 uppercase tracking-widest pt-8 mt-12 border-t border-stone-850 shrink-0 gap-3">
            <div className="flex gap-6">
              <span>Encrypted Secure Vault: YES (AES-256)</span>
              <span>Matched Ledger Integrity: 100%</span>
            </div>
            <div>Database Sync Frame: UTC {new Date().toISOString().split("T")[0]}</div>
          </footer>
        </main>

        {/* Regulatory Consultation Assistant Sidebar */}
        {showChat && (
          <aside className="w-80 md:w-96 border-l border-stone-850 bg-[#0d0d0d] flex flex-col shrink-0 animate-slide-up h-full">
            <div className="p-4 bg-stone-900/80 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span className="font-serif italic text-base text-stone-105">AI Counsel Advisor</span>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-stone-500 hover:text-stone-300 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[8px] font-mono uppercase text-stone-550 mb-0.5">
                    {msg.role === "user" ? "Admin" : "Regulatory System Agent"}
                  </span>
                  <div className={`p-3 rounded-sm text-xs leading-relaxed font-sans ${
                    msg.role === "user"
                    ? "bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] max-w-[85%]"
                    : "bg-stone-900 border border-stone-854 text-stone-300 max-w-[88%] font-serif italic pl-3 border-l-2 border-l-[#c5a059]"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-mono uppercase text-stone-550 mb-1">Scanning state statutes...</span>
                  <div className="bg-stone-900 border border-stone-850 p-3 rounded-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-ping"></span>
                    <span className="text-[11px] text-stone-500 italic font-mono">Formulating compliance plan...</span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-2.5 bg-red-955/30 border border-red-900/50 rounded text-xs text-red-500">
                  {chatError}
                </div>
              )}
            </div>

            {/* Input field */}
            <form onSubmit={handleSubmitChat} className="p-4 border-t border-stone-850 bg-stone-900/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ask corporate transparency act steps..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-850 text-stone-200 placeholder-stone-700 px-3 py-2 text-xs rounded-sm outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="p-2 bg-[#c5a059] hover:bg-[#b08c48] text-black rounded-sm transition self-stretch shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </aside>
        )}

      </div>
    </div>
  );
}
