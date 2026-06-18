import React, { useState } from "react";
import { SecureDocument } from "../types";
import { 
  FileText, 
  Trash2, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Calendar,
  Layers,
  FileCheck2,
  Info
} from "lucide-react";
import { motion } from "motion/react";

interface VaultTabProps {
  documents: SecureDocument[];
  onUploadDocument: (doc: SecureDocument) => void;
  onDeleteDocument: (id: string) => void;
  onUpdateDocumentAnalysis: (id: string, summary: string) => void;
}

export default function VaultTab({ 
  documents, 
  onUploadDocument, 
  onDeleteDocument, 
  onUpdateDocumentAnalysis 
}: VaultTabProps) {
  const [selectedDoc, setSelectedDoc] = useState<SecureDocument | null>(documents[0] || null);

  // New File Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newCategory, setNewCategory] = useState<SecureDocument["category"]>("Formation Documents");
  const [newContent, setNewContent] = useState("");
  
  // States of Analysis
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const sampleDoc: SecureDocument = {
      id: "doc-" + Date.now(),
      name: newFileName.endsWith(".txt") ? newFileName : `${newFileName}.txt`,
      category: newCategory,
      uploadDate: new Date().toISOString().split("T")[0],
      size: `${Math.round(newContent.length / 100) / 10 || 1.2} KB`,
      isSigned: false,
      aiReviewed: false,
      content: newContent || "Default business documentation content."
    };

    onUploadDocument(sampleDoc);
    setSelectedDoc(sampleDoc);

    // Reset
    setNewFileName("");
    setNewContent("");
    setNewCategory("Formation Documents");
    setShowUploadModal(false);
  };

  // Trigger Gemini Analysis on Backend
  const handleAnalyzeDocument = async (doc: SecureDocument) => {
    setAnalyzingId(doc.id);
    setAnalysisError("");

    try {
      const response = await fetch("/api/gemini/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: doc.name,
          fileType: doc.category,
          fileContent: doc.content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server issue analyzing document.");
      }

      const result = await response.json();
      onUpdateDocumentAnalysis(doc.id, result.report);
      
      // Update locally selected doc
      setSelectedDoc(prev => prev && prev.id === doc.id ? { ...prev, aiReviewed: true, summary: result.report } : prev);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "Failed dynamic communication. Make sure server is initialized.");
    } finally {
      setAnalyzingId(null);
    }
  };

  // Load corporate helper template files
  const loadTemplate = (type: "operating" | "organizational" | "resolution") => {
    if (type === "operating") {
      setNewFileName("Integrated_Avodah_Operating_Resolution_Adoption.txt");
      setNewCategory("Operating Agreements");
      setNewContent(`RESOLUTION ADOPTING OPERATING AGREEMENT OF INTEGRATED AVODAH LLC
The undersigned, being all the members of Integrated Avodah LLC, hereby agree to, accept, and adopt this Operating Agreement as of January 18, 2026.
It is resolved that the members approve Scout Yeshua as the primary tax representative, and allow financial transfers under $5,000 without countersigning operations.`);
    } else if (type === "organizational") {
      setNewFileName("State_Filing_Acceptance_Note.txt");
      setNewCategory("State Notices");
      setNewContent(`DELAWARE DEPARTMENT OF STATE
DIVISION OF CORPORATIONS - INCORPORATION FILE REPORT
The file for INTEGRATED AVODAH LLC has been received and verified under file registry 5298011.
Filing Entity Type: Domestic LLC.
Status: ACTIVE REGISTERED.`);
    } else {
      setNewFileName("Corporate_Resolution_Draft.txt");
      setNewCategory("Other");
      setNewContent(`RESOLVED, that the LLC will establish a commercial business banking relationship with Silicon Bank and that Scout Yeshua is authorized to sign checks and execute contracts in the name of Integrated Avodah LLC.`);
    }
  };

  return (
    <div id="vault-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      
      {/* File browser column */}
      <div id="browser-column" className="lg:col-span-5 space-y-4">
        <div className="bg-[#141414] border border-stone-800 p-4 rounded-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#c5a059]" />
            <span className="font-serif italic text-base text-stone-100">Encrypted Repository</span>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black hover:border-transparent transition-all rounded-sm cursor-pointer"
          >
            Deposit Document
          </button>
        </div>

        {/* Categories / Grid files */}
        <div id="files-list" className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDoc(doc);
                setAnalysisError("");
              }}
              className={`p-3.5 border rounded-sm transition cursor-pointer flex items-center justify-between ${
                selectedDoc?.id === doc.id
                ? "bg-stone-900 border-[#c5a059]"
                : "bg-[#141414] border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-stone-500 shrink-0">
                  <FileText className={`w-8 h-8 ${selectedDoc?.id === doc.id ? "text-[#c5a059]" : "text-stone-500"}`} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-stone-100 font-mono truncate max-w-[210px]">{doc.name}</h5>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5 uppercase tracking-tighter">
                    {doc.category} • {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {doc.aiReviewed && (
                  <span className="text-[9px] font-mono font-semibold tracking-wider text-emerald-450 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded uppercase">AI SUMMARY</span>
                )}
                {doc.id !== "doc1" && doc.id !== "doc2" && doc.id !== "doc3" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                      if (selectedDoc?.id === doc.id) {
                        setSelectedDoc(documents[0] || null);
                      }
                    }}
                    className="p-1 hover:bg-stone-800 text-stone-500 hover:text-rose-450 rounded"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viewer & AI Analyzer Panel */}
      <div id="viewer-column" className="lg:col-span-7 space-y-4">
        {selectedDoc ? (
          <motion.div 
            key={selectedDoc.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-stone-800 rounded-sm flex flex-col justify-between min-h-[500px]"
          >
            {/* Header info */}
            <div className="p-4 bg-stone-900/40 border-b border-stone-850 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">{selectedDoc.category}</p>
                <h4 className="font-serif text-lg text-stone-200 mt-0.5">{selectedDoc.name}</h4>
              </div>
              <div className="text-right text-[11px] font-mono text-stone-500">
                <span className="block">Deposited on {selectedDoc.uploadDate}</span>
                <span className="block">Authenticity: Signed Secure</span>
              </div>
            </div>

            {/* Content Display split: Original text / AI Summary review */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Side: Plaintext file display */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <h5 className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono mb-2">Original Document Stream</h5>
                  <div className="bg-[#0a0a0a] border border-stone-850 p-3 rounded font-mono text-xs text-stone-400 max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedDoc.content}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Encrypted Storage
                  </span>
                  <span>SHA-256 Verified Match</span>
                </div>
              </div>

              {/* Right Side: Intelligent AI Assistant Feedback */}
              <div className="bg-[#0e0e0e] border border-stone-850 p-4 rounded flex flex-col justify-between">
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Intelligent Agent Evaluation
                    </span>
                  </div>

                  {analyzingId ? (
                    <div className="text-center py-10 space-y-3">
                      <div className="w-8 h-8 rounded-full border-t-2 border-[#c5a059] animate-spin mx-auto"></div>
                      <p className="text-xs text-stone-400 font-serif italic">"Consulting state statutory laws on LLC filings..."</p>
                    </div>
                  ) : selectedDoc.summary ? (
                    <div className="text-xs text-stone-300 leading-relaxed space-y-3 whitespace-pre-line font-serif italic border-l-2 border-[#c5a059] pl-3">
                      {selectedDoc.summary}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-xs text-stone-550 italic leading-snug">
                        "Deploy Gemini 3.5 models to scan provisions, tax classifications, registered agent addresses, or corporate liabilities inside this contract file."
                      </p>
                      <button
                        onClick={() => handleAnalyzeDocument(selectedDoc)}
                        className="px-3 py-1.5 text-xs font-mono text-black bg-[#c5a059] select-none hover:bg-[#b08c48] font-bold rounded-sm transition cursor-pointer"
                      >
                        DEEP AI SCANNING
                      </button>
                    </div>
                  )}

                  {analysisError && (
                    <div className="p-2 bg-red-950/30 border border-red-900/50 rounded text-[11px] text-red-500">
                      <p className="font-semibold">Chat System Halted</p>
                      <p>{analysisError}</p>
                    </div>
                  )}
                </div>

                <div className="bg-stone-900/40 p-2.5 rounded-sm border border-stone-800 text-[10px] text-stone-500">
                  <strong>Advice Notice:</strong> Summaries generated by Avodah Core Agent are educational guidelines. Consult registered legal counselors for judicial representation briefs.
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <div className="bg-[#141414] border border-stone-800 p-12 text-center rounded">
            <span className="text-stone-500">No documents deposited. Please add files.</span>
          </div>
        )}
      </div>

      {/* Upload Modal Overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#141414] border border-[#c5a059]/50 p-6 rounded"
          >
            <div className="flex justify-between items-center pb-4 border-b border-stone-850">
              <h4 className="font-serif text-lg text-[#c5a059]">Deposit Company Record Document</h4>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-stone-500 hover:text-stone-300 font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => loadTemplate("operating")}
                  className="px-3 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-[11px] text-left text-stone-300 rounded transition"
                >
                  📄 Select Operating Resolution Template
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate("organizational")}
                  className="px-3 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-[11px] text-left text-stone-300 rounded transition"
                >
                  🏛️ Select Delaware Notice Template
                </button>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">FILENAME ON SYSTEM</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2_Board_Decisions.txt"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-700 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">DOCUMENT CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none"
                >
                  <option value="Formation Documents">Formation Documents</option>
                  <option value="Operating Agreements">Operating Agreements</option>
                  <option value="Tax Returns">Tax Returns</option>
                  <option value="State Notices">State Notices</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">CONTENT REPRESENTATION (PLAINTEXT DOCUMENT SUMMARY)</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write or copy-paste text statements, operating guidelines, resolutions, state filings, tax certificates..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-700 p-3 text-xs rounded-sm focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a059] text-black font-semibold font-serif tracking-tight cursor-pointer"
                >
                  Vault Deposit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
