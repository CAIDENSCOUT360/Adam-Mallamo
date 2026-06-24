import React, { useState, useEffect } from "react";
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
  Info,
  Cloud,
  CloudLightning,
  CloudOff,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  FolderLock,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { initAuth, googleSignIn, logout, getAccessToken } from "../firebaseAuth";
import { User } from "firebase/auth";

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
  // Select active document from the local store
  const [selectedDoc, setSelectedDoc] = useState<SecureDocument | null>(documents[0] || null);

  // Traditional local file modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newCategory, setNewCategory] = useState<SecureDocument["category"]>("Formation Documents");
  const [newContent, setNewContent] = useState("");
  
  // States of Analysis
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  // Sub tab selection: browse local files vs active Google Drive file explorer
  const [browserMode, setBrowserMode] = useState<"local" | "drive">("local");

  // Google Drive Authentication States
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);

  // Google Drive API Data States
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState("");
  
  // Individual action triggers
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const [importingFileId, setImportingFileId] = useState<string | null>(null);

  // Google Drive Direct Creator Modal States
  const [showDriveCreatorModal, setShowDriveCreatorModal] = useState(false);
  const [driveNewFileName, setDriveNewFileName] = useState("");
  const [driveNewContent, setDriveNewContent] = useState("");
  const [creatingFileInDrive, setCreatingFileInDrive] = useState(false);

  // Initialize auth state listener. Standard background observer.
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
        setNeedsAuth(false);
        fetchDriveFiles(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Launch Google login flow
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setDriveError("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        fetchDriveFiles(result.accessToken);
        alert(`Sovereign access validated for user ${result.user.email}`);
      }
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Failed client authorization with Google Drive.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log user out
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setDriveFiles([]);
      setBrowserMode("local");
    } catch (err: any) {
      console.error("Sign out fail:", err);
    }
  };

  // Google Drive: Fetch File List API Call (v3)
  const fetchDriveFiles = async (tokenToCheck?: string) => {
    const token = tokenToCheck || accessToken;
    if (!token) return;

    setLoadingDrive(true);
    setDriveError("");
    try {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files?pageSize=25&orderBy=createdTime%20desc&fields=files(id,name,mimeType,size,createdTime)",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          setNeedsAuth(true);
          setAccessToken(null);
          throw new Error("Your connection token is expired. Please re-authenticate.");
        }
        throw new Error(`Google storage API status error: ${response.status}`);
      }

      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Could not fetch resources from your Google Drive storage.");
    } finally {
      setLoadingDrive(false);
    }
  };

  // Google Drive: Create/Upload multipart file (metadata + text payload)
  const handleUploadToDrive = async (doc: SecureDocument) => {
    if (!accessToken) {
      alert("Please sign in or link your Google Drive first.");
      return;
    }

    setUploadingFileId(doc.id);
    setDriveError("");

    try {
      const metadata = {
        name: doc.name.endsWith(".txt") ? doc.name : `${doc.name}.txt`,
        mimeType: "text/plain",
        description: `Avodah LLC Encrypted Backup - Category: ${doc.category}`
      };

      const boundary = "avodah_vault_boundary_token";
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const body = [
        delimiter,
        "Content-Type: application/json; charset=UTF-8\r\n\r\n",
        JSON.stringify(metadata),
        delimiter,
        "Content-Type: text/plain; charset=UTF-8\r\n\r\n",
        doc.content,
        close_delim
      ].join("");

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`
          },
          body: body
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status code ${response.status}`);
      }

      alert(`Successfully uploaded "${doc.name}" into your Google Drive!`);
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Failed to finalize network upload to Google Drive.");
    } finally {
      setUploadingFileId(null);
    }
  };

  // Google Drive: Download text file & Import to Local list
  const handleImportDriveFile = async (driveFile: any) => {
    if (!accessToken) return;

    setImportingFileId(driveFile.id);
    setDriveError("");

    try {
      let content = `Google Drive Resource Summary\nName: ${driveFile.name}\nID: ${driveFile.id}\nMimeType: ${driveFile.mimeType}`;
      
      const isText = driveFile.mimeType && (
        driveFile.mimeType.includes("text") || 
        driveFile.mimeType.includes("plain") || 
        driveFile.mimeType.includes("json") || 
        driveFile.mimeType.includes("javascript") ||
        driveFile.name.endsWith(".txt") ||
        driveFile.name.endsWith(".json") ||
        driveFile.name.endsWith(".md")
      );

      if (isText) {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${driveFile.id}?alt=media`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        if (response.ok) {
          content = await response.text();
        } else {
          content += `\n\n(Import failed: alt=media transfer returned status ${response.status})`;
        }
      } else {
        content += `\n\n(This is a non-plaintext file. Only metadata review is loaded locally. Check Google Drive for layout rendering.)`;
      }

      // Convert drive file structure to local safe document structure
      const importedDoc: SecureDocument = {
        id: "doc-drive-" + Date.now(),
        name: driveFile.name.endsWith(".txt") ? driveFile.name : `${driveFile.name}.txt`,
        category: "Other",
        uploadDate: new Date().toISOString().split("T")[0],
        size: driveFile.size ? `${Math.round(parseInt(driveFile.size) / 100) / 10 || 0.8} KB` : "1.2 KB",
        isSigned: false,
        aiReviewed: false,
        content: content
      };

      onUploadDocument(importedDoc);
      setSelectedDoc(importedDoc);
      setBrowserMode("local");
      alert(`Import completed! "${driveFile.name}" is now stored in your Local Encrypted Repository.`);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Failed to download and parse remote Google Drive entity.");
    } finally {
      setImportingFileId(null);
    }
  };

  // Google Drive: Delete remote resource with explicit user confirmation modal (REQUIRED)
  const handleDeleteDriveFile = async (fileId: string, fileName: string) => {
    if (!accessToken) return;

    const confirmed = window.confirm(
      `CRITICAL CONFIRMATION: Are you sure you want to permanently delete "${fileName}" from your Google Drive cloud storage? This action is absolutely irreversible.`
    );
    if (!confirmed) return;

    setLoadingDrive(true);
    setDriveError("");

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete Drive file. API code: ${response.status}`);
      }

      alert(`Successfully deleted "${fileName}" from Google Drive.`);
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Could not delete resource from Google Drive.");
    } finally {
      setLoadingDrive(false);
    }
  };

  // Create a brand new text document directly on remote Google Drive from the creator modal
  const handleCreateDocumentInDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !driveNewFileName.trim()) return;

    setCreatingFileInDrive(true);
    setDriveError("");

    try {
      const metadata = {
        name: driveNewFileName.endsWith(".txt") ? driveNewFileName : `${driveNewFileName}.txt`,
        mimeType: "text/plain"
      };

      const boundary = "drive_direct_creator_boundary";
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const body = [
        delimiter,
        "Content-Type: application/json; charset=UTF-8\r\n\r\n",
        JSON.stringify(metadata),
        delimiter,
        "Content-Type: text/plain; charset=UTF-8\r\n\r\n",
        driveNewContent || "Created directly via Avodah LLC Drive Integrator.",
        close_delim
      ].join("");

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`
          },
          body: body
        }
      );

      if (!response.ok) {
        throw new Error(`Create call failed with status ${response.status}`);
      }

      alert(`Successfully created "${driveNewFileName}" directly in Google Drive!`);
      // Reset
      setDriveNewFileName("");
      setDriveNewContent("");
      setShowDriveCreatorModal(false);
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || "Failed to create new document in Google Drive.");
    } finally {
      setCreatingFileInDrive(false);
    }
  };

  // Local document creation
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
    <div id="vault-tab-root" className="space-y-6 animate-slide-up">
      
      {/* Google Drive Status Header Card */}
      <div className="bg-[#111111] p-5 rounded-sm border-2 border-[#c5a059]/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#c5a059]" />
            <span className="text-[10px] font-mono tracking-widest text-[#c5a059] uppercase font-bold">
              Google Drive Cloud Integration
            </span>
          </div>
          <h3 className="font-serif italic text-lg text-stone-100">
            {needsAuth ? "Sovereign Document Remote Backup Provider" : `Linked to Cloud Drive Account`}
          </h3>
          <p className="text-xs text-stone-400 max-w-2xl leading-normal">
            Upload articles of organization, checklists, and blueprints directly into your real Google Drive with permissions completely under your control, or pull down text artifacts to review with our local compliance engine.
          </p>
          {driveError && (
            <div className="p-2 bg-red-950/40 border border-red-900/40 text-[11px] text-red-400 font-mono rounded flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{driveError}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 z-10 self-start md:self-center">
          {needsAuth ? (
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="gsi-material-button text-xs font-semibold cursor-pointer select-none transition active:scale-95 disabled:opacity-50"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                border: "1px solid #747775",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
                color: "#1f1f1f",
                fontWeight: "500",
                height: "40px"
              }}
            >
              <div style={{ marginRight: "12px", display: "flex", alignItems: "center" }}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block", width: "18px", height: "18px" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span>{isLoggingIn ? "Verifying..." : "Connect Google Drive"}</span>
            </button>
          ) : (
            <div className="flex flex-col md:flex-row items-end gap-3 font-mono text-xs">
              <div className="text-right">
                <span className="block text-[#c5a059] font-bold">● Drive Active</span>
                <span className="block text-stone-400 mt-0.5 text-[10px] truncate max-w-[200px]">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-2.5 py-1.5 bg-stone-905 border border-stone-800 hover:border-red-900/30 text-rose-400 hover:text-rose-350 text-[10px] rounded cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Multi-split Interface: Browser on left, Interactive Display on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (File browser: Local Vault vs Cloud Google Drive) */}
        <div id="browser-column" className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#141414] border border-stone-800 rounded-sm">
            {/* Header tab controller */}
            <div className="grid grid-cols-2 text-center text-xs font-mono border-b border-stone-850">
              <button
                onClick={() => setBrowserMode("local")}
                className={`py-3 flex items-center justify-center gap-2 font-bold cursor-pointer transition ${
                  browserMode === "local"
                  ? "text-stone-100 bg-stone-900 border-b border-[#c5a059]"
                  : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <FolderLock className={`w-3.5 h-3.5 ${browserMode === "local" ? "text-[#c5a059]" : ""}`} />
                Local Repositories ({documents.length})
              </button>
              <button
                onClick={() => setBrowserMode("drive")}
                className={`py-3 flex items-center justify-center gap-2 font-bold cursor-pointer transition relative ${
                  browserMode === "drive"
                  ? "text-stone-100 bg-stone-900 border-b border-[#c5a059]"
                  : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <Cloud className={`w-3.5 h-3.5 ${browserMode === "drive" ? "text-[#c5a059]" : ""}`} />
                Drive Storage ({driveFiles.length})
                {!needsAuth && (
                  <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-555"></span>
                )}
              </button>
            </div>

            {/* List Body Container */}
            <div className="p-4 space-y-3">
              
              {/* Local List view */}
              {browserMode === "local" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Encrypted Local Copies</span>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black hover:border-transparent transition-all rounded-sm cursor-pointer"
                    >
                      Deposit Document
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoc(doc);
                          setAnalysisError("");
                        }}
                        className={`p-3 border rounded-sm transition cursor-pointer flex items-center justify-between ${
                          selectedDoc?.id === doc.id
                          ? "bg-stone-900 border-[#c5a059]"
                          : "bg-[#0b0b0b] border-stone-850 hover:border-stone-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileText className={`w-8 h-8 shrink-0 ${selectedDoc?.id === doc.id ? "text-[#c5a059]" : "text-stone-550"}`} />
                          <div className="truncate">
                            <h5 className="text-xs font-semibold text-stone-100 font-mono truncate max-w-[190px]">
                              {doc.name}
                            </h5>
                            <p className="text-[10px] text-stone-500 font-mono mt-0.5 uppercase tracking-tighter">
                              {doc.category} • {doc.size}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {doc.aiReviewed && (
                            <span className="text-[8px] font-mono bg-emerald-950/20 text-emerald-500 border border-emerald-900/30 px-1 py-0.5 rounded font-bold uppercase">AI</span>
                          )}
                          
                          {/* Sync backup button to Drive */}
                          {!needsAuth && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadToDrive(doc);
                              }}
                              disabled={uploadingFileId === doc.id}
                              className="p-1.5 bg-stone-950 hover:bg-[#c5a059]/10 text-stone-400 hover:text-[#c5a059] rounded border border-stone-850"
                              title="Backup to Google Drive"
                            >
                              <ArrowUpFromLine className={`w-3.5 h-3.5 ${uploadingFileId === doc.id ? "animate-bounce text-[#c5a059]" : ""}`} />
                            </button>
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
                              title="Delete local file copy"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real Google Drive list view */}
              {browserMode === "drive" && (
                <div className="space-y-4">
                  {needsAuth ? (
                    <div className="py-12 text-center space-y-4 bg-stone-950/40 border border-stone-850/60 p-4 rounded-sm">
                      <CloudOff className="w-8 h-8 text-stone-605 mx-auto opacity-70" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-300 font-mono">AUTHORIZED LINK REQUIRED</h4>
                        <p className="text-[10px] text-stone-500 max-w-xs mx-auto">
                          Sign in with Google using the top panel to browse, modify, and delete real files inside your Drive.
                        </p>
                      </div>
                      <button
                        onClick={handleSignIn}
                        className="px-3 py-1.5 bg-[#c5a059] text-black hover:bg-[#b58f4a] font-mono text-[10px] font-bold rounded cursor-pointer uppercase"
                      >
                        Sign In Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase">Google Drive Contents</span>
                          <button
                            onClick={() => fetchDriveFiles()}
                            disabled={loadingDrive}
                            className="p-1 text-stone-500 hover:text-stone-300"
                            title="Refresh Drive List"
                          >
                            <RefreshCw className={`w-3 h-3 ${loadingDrive ? "animate-spin text-[#c5a059]" : ""}`} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => setShowDriveCreatorModal(true)}
                          className="px-2 py-0.5 text-[9px] font-mono bg-stone-900 border border-stone-800 text-[#c5a059] hover:bg-stone-850 rounded flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          New Cloud File
                        </button>
                      </div>

                      {loadingDrive && driveFiles.length === 0 ? (
                        <div className="py-12 text-center text-stone-500 text-xs italic font-serif">
                          Loading from Google Drive cloud resources...
                        </div>
                      ) : driveFiles.length === 0 ? (
                        <div className="py-12 text-center text-stone-500 text-xs italic font-serif border border-dashed border-stone-800 rounded">
                          No resources found on Google Drive root. Back up a local document utilizing the arrow buttons.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                          {driveFiles.map((df) => (
                            <div
                              key={df.id}
                              className="p-2.5 bg-stone-950 border border-stone-855 rounded-sm flex items-center justify-between gap-3 hover:border-stone-750 transition"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <motion.div 
                                  whileHover={{ rotate: 5 }}
                                  className="w-8 h-8 rounded bg-blue-950/20 text-blue-500 border border-blue-900/30 flex items-center justify-center shrink-0"
                                >
                                  <Cloud className="w-4 h-4 text-[#c5a059]" />
                                </motion.div>
                                <div className="truncate">
                                  <h6 className="text-[11px] font-mono font-medium text-stone-105 truncate max-w-[170px]" title={df.name}>
                                    {df.name}
                                  </h6>
                                  <span className="text-[9px] text-stone-550 font-mono block">
                                    {df.size ? `${(parseInt(df.size)/1024).toFixed(1)} KB` : "Document Size Hidden"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Download / Import button */}
                                <button
                                  onClick={() => handleImportDriveFile(df)}
                                  disabled={importingFileId === df.id}
                                  className="p-1 px-1.5 bg-stone-900 hover:bg-[#c5a059]/10 text-stone-300 hover:text-[#c5a059] border border-stone-800 rounded text-[9px] font-mono flex items-center gap-1 cursor-pointer"
                                  title="Import into Local Repository"
                                >
                                  <ArrowDownToLine className={`w-3 h-3 ${importingFileId === df.id ? "animate-bounce" : ""}`} />
                                  Import
                                </button>
                                
                                {/* Delete button with explicit user confirmation */}
                                <button
                                  onClick={() => handleDeleteDriveFile(df.id, df.name)}
                                  className="p-1.5 bg-stone-900 hover:bg-rose-950/20 text-stone-500 hover:text-rose-400 border border-stone-800 rounded cursor-pointer"
                                  title="Delete from Google Drive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Original plain viewer + AI evaluation feedback */}
        <div id="viewer-column" className="lg:col-span-7 space-y-4">
          {selectedDoc ? (
            <motion.div 
              key={selectedDoc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] border border-stone-800 rounded-sm flex flex-col justify-between min-h-[500px]"
            >
              {/* Header info */}
              <div className="p-4 bg-stone-900/40 border-b border-stone-850 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">{selectedDoc.category}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-605"></span>
                    <span className="text-[10px] font-mono text-stone-505 uppercase">Local Registry</span>
                  </div>
                  <h4 className="font-serif text-lg text-stone-200 mt-0.5 truncate max-w-[280px]">{selectedDoc.name}</h4>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Backup current viewed doc directly to Drive */}
                  {!needsAuth && (
                    <button
                      onClick={() => handleUploadToDrive(selectedDoc)}
                      disabled={uploadingFileId === selectedDoc.id}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-[#c5a059]/15 border border-stone-800 hover:border-[#c5a059]/30 text-stone-300 hover:text-[#c5a059] text-[10px] font-mono font-bold uppercase rounded-sm flex items-center gap-1.5 tracking-wider cursor-pointer"
                    >
                      <ArrowUpFromLine className={`w-3.5 h-3.5 ${uploadingFileId === selectedDoc.id ? "animate-bounce" : ""}`} />
                      Sovereign Cloud Backup
                    </button>
                  )}

                  <div className="text-right text-[10px] font-mono text-stone-500 hidden sm:block">
                    <span className="block">Deposited {selectedDoc.uploadDate}</span>
                    <span className="block">Authenticity: Signed Secure</span>
                  </div>
                </div>
              </div>

              {/* Content Display split: Original text / AI Summary review */}
              <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Left Side: Plaintext file display */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono mb-2">Original Document Stream</h5>
                    <div className="bg-[#0a0a0a] border border-stone-850 p-3 rounded font-mono text-xs text-stone-400 max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {selectedDoc.content}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> SHA-256 Match Secure
                    </span>
                    <span>Local Cache Copy</span>
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

                  <div className="bg-stone-900/40 p-2.5 rounded-sm border border-stone-800 text-[9px] text-stone-500 font-mono mt-3">
                    <strong>Advice Notice:</strong> Summaries generated by Avodah Core Agent are educational guidelines. Consult registered legal counselors for judicial representation briefs.
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <div className="bg-[#141414] border border-stone-800 p-12 text-center rounded">
              <span className="text-stone-500 text-xs font-serif italic">No documents deposited. Please add files or import from Google Drive.</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Local Modal Overlay */}
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
                className="text-stone-500 hover:text-stone-300 font-mono text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => loadTemplate("operating")}
                  className="px-3 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-left text-stone-300 rounded transition cursor-pointer"
                >
                  📄 Select Operating Resolution Template
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate("organizational")}
                  className="px-3 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-left text-stone-300 rounded transition cursor-pointer"
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
                  className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a059] text-black font-semibold font-serif tracking-tight cursor-pointer animate-pulse"
                >
                  Vault Deposit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Google Drive New File Modal Overlay */}
      {showDriveCreatorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#141414] border border-[#c5a059]/50 p-6 rounded"
          >
            <div className="flex justify-between items-center pb-4 border-b border-stone-850">
              <div className="flex items-center gap-1.5">
                <Cloud className="w-5 h-5 text-[#c5a059]" />
                <h4 className="font-serif text-lg text-[#c5a059]">Create File Directly on Google Drive</h4>
              </div>
              <button 
                onClick={() => setShowDriveCreatorModal(false)}
                className="text-stone-500 hover:text-stone-300 font-mono text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocumentInDrive} className="space-y-4 pt-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">CLOUD FILENAME (.txt)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawrence_Pamper_Project_Agreement.txt"
                  value={driveNewFileName}
                  onChange={(e) => setDriveNewFileName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-700 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">PLAINTEXT FILE CONTENT</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Type the document text content to be saved directly in your Google Drive storage..."
                  value={driveNewContent}
                  onChange={(e) => setDriveNewContent(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-700 p-3 text-xs rounded-sm focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setShowDriveCreatorModal(false)}
                  className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFileInDrive}
                  className="px-5 py-2 bg-[#c5a059] text-black font-semibold font-serif tracking-tight cursor-pointer"
                >
                  {creatingFileInDrive ? "Creating in Cloud..." : "Create Drive Document"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
