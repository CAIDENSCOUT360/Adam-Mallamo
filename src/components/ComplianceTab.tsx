import React, { useState, useEffect } from "react";
import { ComplianceTask, LLCConfig, ComplianceChecklist, ComplianceChecklistItem } from "../types";
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileCheck2, 
  Plus, 
  ShieldCheck,
  Trash2,
  Edit2,
  Check,
  X,
  ListTodo,
  Cloud,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Save,
  User,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface ComplianceTabProps {
  tasks: ComplianceTask[];
  onCompleteTask: (id: string) => void;
  onAddTask: (task: Omit<ComplianceTask, "id">) => void;
  llc: LLCConfig;
}

// Current system date helper
const TODAY_STR = "2026-06-18";
const TODAY_TIME = new Date(TODAY_STR).getTime();

// Preloaded templates matching Integrated Avodah LLC & Lawrence, KS Community context
const initialChecklists: ComplianceChecklist[] = [
  {
    id: "cl-fincen",
    name: "FinCEN Beneficial Ownership Report (BOI)",
    description: "Important corporate reporting requirement under the Corporate Transparency Act (CTA) for LLCs.",
    createdAt: "2026-01-18",
    items: [
      {
        id: "cli-1-1",
        title: "Verify state approved Articles of Organization & EIN credentials",
        dueDate: "2026-02-15",
        assignedName: "Scout Yeshua",
        completed: true,
        notes: "Completed against Delaware State certification file 5298011."
      },
      {
        id: "cli-1-2",
        title: "Acquire high-resolution digital copies of valid photo IDs (passport or license)",
        dueDate: "2026-06-22",
        assignedName: "Chava Bernstein",
        completed: false,
        notes: "Required from both managing and minority members holding 25% or more."
      },
      {
        id: "cli-1-3",
        title: "Request official FinCEN Identifier from government register",
        dueDate: "2026-06-29",
        assignedName: "Scout Yeshua",
        completed: false,
        notes: "Apply via beneficial owner secure system portal."
      },
      {
        id: "cli-1-4",
        title: "Submit final Beneficial Ownership Information Report (BOIR) online",
        dueDate: "2026-07-15",
        assignedName: "Scout Yeshua",
        completed: false,
        notes: "Download final digital submission receipt and place in Document Vault."
      }
    ]
  },
  {
    id: "cl-cta-annual",
    name: "Corporate Transparency Act & Governance Setup",
    description: "Annual verification of local consulting operations, member stakes, and registered agent validity.",
    createdAt: "2026-02-10",
    items: [
      {
        id: "cli-2-1",
        title: "Sign Delaware corporate resolution adopting modern operating structures",
        dueDate: "2026-06-10",
        assignedName: "Scout Yeshua",
        completed: false,
        notes: "This task is Overdue! Required to preserve corporate veil protection."
      },
      {
        id: "cli-2-2",
        title: "Verify active status of Delaware licensed Registered Agent mailbox",
        dueDate: "2026-07-01",
        assignedName: "Chava Bernstein",
        completed: false,
        notes: "Ensure coverage for Wilmington mail delivery c/o Delaware Standard Agent LLC."
      },
      {
        id: "cli-2-3",
        title: "Catalog capital accounts and distribute quarterly financial ledger report",
        dueDate: "2026-07-20",
        assignedName: "Chava Bernstein",
        completed: false,
        notes: "Extract synced accounting records and reconcile LLC consulting expenses."
      }
    ]
  },
  {
    id: "cl-pilot-care",
    name: "Avodah Community Care Pilot Compliance",
    description: "Operational checks for Lawrence, KS neighborly care pilot program in partnership with Lawrence coffee shops.",
    createdAt: "2026-03-01",
    items: [
      {
        id: "cli-3-1",
        title: "Execute community service waiver outlines with pilot partners",
        dueDate: "2026-06-15",
        assignedName: "Chava Bernstein",
        completed: true,
        notes: "Waiver customized for home visits and mobile community room sessions."
      },
      {
        id: "cli-3-2",
        title: "Perform physical equipment inspection checklist for mobile care kits",
        dueDate: "2026-06-30",
        assignedName: "Scout Yeshua",
        completed: false,
        notes: "Inspect massage table stability, botanical oils, and organic aromatherapy sprays."
      },
      {
        id: "cli-3-3",
        title: "Store signed Lawrence church facilities agreements in the Document Vault",
        dueDate: "2026-07-10",
        assignedName: "Chava Bernstein",
        completed: false,
        notes: "Physical copies to be scanned and analyzed using corporate AI tools."
      }
    ]
  }
];

export default function ComplianceTab({ tasks, onCompleteTask, onAddTask, llc }: ComplianceTabProps) {
  // Navigation tabs toggle
  const [activeSubTab, setActiveSubTab] = useState<"filings" | "checklists">("filings");

  // Filter state for filings
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Form State for creating custom compliance task (under filings tab)
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("2026-07-31");
  const [category, setCategory] = useState<ComplianceTask["category"]>("State Filing");
  const [fee, setFee] = useState("100");
  const [description, setDescription] = useState("");

  // ==================== CHECKLIST ENGINE STATE ====================
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>(() => {
    const saved = localStorage.getItem("avodah_compliance_checklists");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading checklists:", e);
      }
    }
    return initialChecklists;
  });

  const [selectedChecklistId, setSelectedChecklistId] = useState<string>(
    checklists[0]?.id || "cl-fincen"
  );

  // Form for new Checklist Container
  const [showNewChecklistForm, setShowNewChecklistForm] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newChecklistDesc, setNewChecklistDesc] = useState("");

  // Form for new Checklist Item inside selected checklist
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDueDate, setNewItemDueDate] = useState("2026-06-30");
  const [newItemAssignee, setNewItemAssignee] = useState("Scout Yeshua");
  const [newItemCustomAssignee, setNewItemCustomAssignee] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");

  // Editing checklist item inline
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDueDate, setEditItemDueDate] = useState("");
  const [editItemAssignee, setEditItemAssignee] = useState("");
  const [editItemNotes, setEditItemNotes] = useState("");

  // Google Drive Simulation Integration
  const [driveBackingUp, setDriveBackingUp] = useState(false);
  const [driveSyncHistory, setDriveSyncHistory] = useState<Array<{ date: string; checklistName: string; size: string }>>([
    { date: "2026-05-10 14:22", checklistName: "FinCEN Beneficial Ownership Report (BOI)", size: "4.2 KB" }
  ]);
  const [driveSyncSuccessMsg, setDriveSyncSuccessMsg] = useState("");

  // Save checklists whenever they change
  useEffect(() => {
    localStorage.setItem("avodah_compliance_checklists", JSON.stringify(checklists));
  }, [checklists]);

  // Handle standard tasks creation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      dueDate,
      state: llc.state,
      category,
      status: "Pending",
      fee: Number(fee) || 0,
      description: description || "Custom corporate compliance task assigned by management."
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setFee("100");
    setShowAddForm(false);
  };

  // Filter Tasks (Jurisdictional Filings)
  const filteredTasks = tasks.filter((t) => {
    if (filter === "Pending" && t.status !== "Pending") return false;
    if (filter === "Completed" && t.status !== "Completed") return false;
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
    return true;
  });

  // Recharts Progress Tracking calculations for corporate filings
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === "Completed").length;
  const pendingTasksCount = tasks.filter(t => t.status === "Pending").length;
  const overdueTasksCount = tasks.filter(t => t.status === "Overdue").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const pieData = [
    { name: "Completed", value: completedTasksCount, color: "#10b981" },
    { name: "Pending", value: pendingTasksCount, color: "#f59e0b" },
    { name: "Overdue", value: overdueTasksCount, color: "#ef4444" }
  ].filter(item => item.value > 0);

  const finalPieData = pieData.length > 0 ? pieData : [{ name: "No Tasks", value: 1, color: "#292524" }];

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b0b0b] border border-stone-800 p-2.5 rounded shadow-xl text-stone-100 font-mono text-xs">
          <p className="font-semibold" style={{ color: data.color }}>
            {payload[0].name.toUpperCase()}
          </p>
          <p className="mt-0.5 text-stone-300">
            Filings: <span className="font-bold text-stone-100">{payload[0].value}</span>
          </p>
          {totalTasks > 0 && (
            <p className="text-[10px] text-stone-500 mt-0.5">
              Ref Ratio: {Math.round((payload[0].value / totalTasks) * 100)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate day difference for status calculation
  const getDaysDiff = (dateStr: string) => {
    const taskTime = new Date(dateStr).getTime();
    const diffTime = taskTime - TODAY_TIME;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate relative status of checklist item
  const getItemStatus = (item: ComplianceChecklistItem) => {
    if (item.completed) {
      return { label: "COMPLETED", color: "text-emerald-500 bg-emerald-950/30 border-emerald-900/60", badge: "Completed" };
    }
    const daysDiff = getDaysDiff(item.dueDate);
    if (daysDiff < 0) {
      return { 
        label: "OVERDUE", 
        color: "text-rose-400 bg-rose-950/40 border-rose-900/60 animate-pulse", 
        badge: `Overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? "" : "s"}` 
      };
    } else if (daysDiff <= 14) {
      return { 
        label: "UPCOMING", 
        color: "text-amber-400 bg-amber-950/30 border-amber-900/40", 
        badge: `Due in ${daysDiff} day${daysDiff === 1 ? "" : "s"}` 
      };
    } else {
      return { 
        label: "ON TRACK", 
        color: "text-sky-400 bg-sky-950/20 border-sky-900/30", 
        badge: `Due in ${daysDiff} days` 
      };
    }
  };

  // Get active selected checklist
  const selectedChecklist = checklists.find(cl => cl.id === selectedChecklistId) || checklists[0] || null;

  // Re-calculate stats for sidebar labels
  const getChecklistStats = (cl: ComplianceChecklist) => {
    const total = cl.items.length;
    const completed = cl.items.filter(i => i.completed).length;
    const pending = total - completed;
    
    // Count overdue items
    const overdue = cl.items.filter(i => {
      if (i.completed) return false;
      return getDaysDiff(i.dueDate) < 0;
    }).length;

    // Count upcoming items
    const upcoming = cl.items.filter(i => {
      if (i.completed) return false;
      const days = getDaysDiff(i.dueDate);
      return days >= 0 && days <= 14;
    }).length;

    return { total, completed, pending, overdue, upcoming, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Adding check list container
  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistName.trim()) return;

    const newCl: ComplianceChecklist = {
      id: "cl-" + Date.now(),
      name: newChecklistName.trim(),
      description: newChecklistDesc.trim() || "No description provided.",
      createdAt: TODAY_STR,
      items: []
    };

    setChecklists(prev => [...prev, newCl]);
    setSelectedChecklistId(newCl.id);
    setNewChecklistName("");
    setNewChecklistDesc("");
    setShowNewChecklistForm(false);
  };

  // Delete checklist container
  const handleDeleteChecklist = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the compliance checklist "${name}"?`)) {
      const remaining = checklists.filter(cl => cl.id !== id);
      setChecklists(remaining);
      if (selectedChecklistId === id && remaining.length > 0) {
        setSelectedChecklistId(remaining[0].id);
      }
    }
  };

  // Standard restore presets
  const handleRestorePresets = () => {
    if (window.confirm("Restore default professional templates? Your custom checklists will be reset.")) {
      setChecklists(initialChecklists);
      setSelectedChecklistId(initialChecklists[0].id);
    }
  };

  // Toggle item complete status
  const handleToggleItemComplete = (itemId: string) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.id === selectedChecklistId) {
        return {
          ...cl,
          items: cl.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return cl;
    }));
  };

  // Delete checklist item
  const handleDeleteItem = (itemId: string) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.id === selectedChecklistId) {
        return {
          ...cl,
          items: cl.items.filter(item => item.id !== itemId)
        };
      }
      return cl;
    }));
  };

  // Adding single item inside current checklist
  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const finalAssignee = newItemAssignee === "Custom" 
      ? (newItemCustomAssignee.trim() || "Unassigned")
      : newItemAssignee;

    const newItem: ComplianceChecklistItem = {
      id: "cli-" + Date.now(),
      title: newItemTitle.trim(),
      dueDate: newItemDueDate,
      assignedName: finalAssignee,
      completed: false,
      notes: newItemNotes.trim() || undefined
    };

    setChecklists(prev => prev.map(cl => {
      if (cl.id === selectedChecklistId) {
        return {
          ...cl,
          items: [...cl.items, newItem]
        };
      }
      return cl;
    }));

    // Reset Form
    setNewItemTitle("");
    setNewItemNotes("");
    setNewItemDueDate("2026-06-30");
    setNewItemAssignee("Scout Yeshua");
    setNewItemCustomAssignee("");
    setShowNewItemForm(false);
  };

  // Initialize editing mode for item
  const startEditItem = (item: ComplianceChecklistItem) => {
    setEditingItemId(item.id);
    setEditItemTitle(item.title);
    setEditItemDueDate(item.dueDate);
    setEditItemAssignee(item.assignedName);
    setEditItemNotes(item.notes || "");
  };

  // Save the inline edits
  const handleSaveItemEdit = (itemId: string) => {
    if (!editItemTitle.trim()) return;

    setChecklists(prev => prev.map(cl => {
      if (cl.id === selectedChecklistId) {
        return {
          ...cl,
          items: cl.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                title: editItemTitle.trim(),
                dueDate: editItemDueDate,
                assignedName: editItemAssignee.trim() || "Unassigned",
                notes: editItemNotes.trim() || undefined
              };
            }
            return item;
          })
        };
      }
      return cl;
    }));

    setEditingItemId(null);
  };

  // Trigger Google Drive sync representation
  const handleBackupToDrive = async () => {
    if (!selectedChecklist) return;
    setDriveBackingUp(true);
    setDriveSyncSuccessMsg("");

    // Simulate authenticating and uploading to Google Drive
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const reportSize = `${Math.round(JSON.stringify(selectedChecklist).length / 100) / 10 + 0.3} KB`;
      
      const newHistoryItem = {
        date: timestamp,
        checklistName: selectedChecklist.name,
        size: reportSize
      };

      setDriveSyncHistory(prev => [newHistoryItem, ...prev]);
      setDriveBackingUp(false);
      setDriveSyncSuccessMsg(`Successfully synced compliance checklist '${selectedChecklist.name}' backup file directly to Google Drive.`);

      // Store in transient message box
      setTimeout(() => {
        setDriveSyncSuccessMsg("");
      }, 5000);
    }, 1800);
  };

  return (
    <div id="compliance-tab-root font-sans" className="space-y-6">
      {/* Upper sub-tab controller matching mockup style */}
      <div className="flex border-b border-stone-850 bg-[#0d0d0d] p-1.5 gap-2 rounded-sm">
        <button
          onClick={() => setActiveSubTab("filings")}
          className={`px-4 py-2 text-xs font-mono tracking-wider flex items-center gap-2 rounded transition cursor-pointer ${
            activeSubTab === "filings"
              ? "bg-stone-900 border border-stone-800 text-[#c5a059] font-bold"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          GOVERNMENT FILING REMINDERS
        </button>
        <button
          onClick={() => setActiveSubTab("checklists")}
          className={`px-4 py-2 text-xs font-mono tracking-wider flex items-center gap-2 rounded transition cursor-pointer ${
            activeSubTab === "checklists"
              ? "bg-stone-900 border border-stone-800 text-[#c5a059] font-bold"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <ListTodo className="w-4 h-4" />
          CUSTOM COMPLIANCE CHECKLISTS
        </button>
      </div>

      {/* RENDER TAB 1: GOVERNMENT FILINGS MODULE */}
      {activeSubTab === "filings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
          {/* List of Tasks & Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 border border-stone-800 rounded">
              <div className="flex flex-wrap items-center gap-2">
                {(["All", "Pending", "Completed"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-3 py-1 text-xs font-mono tracking-tight transition-all rounded-sm cursor-pointer ${
                      filter === t 
                      ? "bg-[#c5a059] text-black font-semibold" 
                      : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 text-xs font-serif font-semibold text-black bg-[#c5a059] hover:bg-[#b08c48] tracking-tight rounded-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule Filing Reminder
              </button>
            </div>

            {/* Task Creation Modal/Form Inline */}
            {showAddForm && (
              <motion.form 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCreateTask}
                className="p-5 bg-[#141414] border border-[#c5a059]/40 rounded space-y-4"
              >
                <h5 className="font-serif italic text-base text-[#c5a059] flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Schedule New Jurisdictional Duty
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">TASK TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Biennial Statement Filing"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">DUE DATE</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    >
                      <option value="State Filing">State Filing</option>
                      <option value="Franchise Tax">Franchise Tax</option>
                      <option value="Federal Tax">Federal Tax</option>
                      <option value="Registered Agent">Registered Agent</option>
                      <option value="City License">City License</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">STATE FEE ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">INSTRUCTIONAL DESCRIPTION</label>
                    <input
                      type="text"
                      placeholder="Enter details on required document forms or physical addresses."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#c5a059] text-black font-semibold tracking-tight transition cursor-pointer"
                  >
                    Log To System
                  </button>
                </div>
              </motion.form>
            )}

            {/* List of filings */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center bg-[#141414] border border-stone-800 rounded">
                  <ShieldCheck className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-300">No filings matching this filter state.</p>
                  <p className="text-xs text-stone-500 mt-1">Adjust query or check other primary registers.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-5 bg-[#141414] border rounded-sm transition ${
                      task.status === "Completed" 
                      ? "border-stone-900 opacity-70" 
                      : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-[9px] bg-stone-900 border border-stone-805 px-2 py-0.5 rounded-sm tracking-widest text-[#c5a059] font-mono uppercase">
                            {task.category}
                          </span>
                          <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-505" />
                            Deadline: {task.dueDate}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg text-stone-100 flex items-center gap-2">
                          {task.title}
                          {task.status === "Completed" && (
                            <span className="text-[10px] bg-emerald-950/40 text-emerald-500 border border-emerald-900 px-2 rounded-full font-sans uppercase">Filed</span>
                          )}
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">{task.description}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-805">
                        <div className="text-right">
                          <span className="block text-[9px] text-stone-500 font-mono uppercase">STATUTORY FEE</span>
                          <span className="text-sm font-mono font-bold text-stone-200">
                            {task.fee > 0 ? `$${task.fee}` : "Free"}
                          </span>
                        </div>

                        {task.status !== "Completed" ? (
                          <button
                            onClick={() => onCompleteTask(task.id)}
                            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-850 text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-mono rounded-sm transition cursor-pointer"
                          >
                            RECORD PAYMENT & FILE
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-emerald-950/20 px-2.5 py-1.5 border border-emerald-900/40 rounded-sm">
                            <FileCheck2 className="w-4 h-4 text-emerald-500" />
                            RECORDED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Compliance Information & Calendar Rules Sidecard */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Regulatory Task Standing Donut Chart Card */}
            <div className="bg-[#141414] border border-[#c5a059]/30 p-5 rounded space-y-4 shadow-[0_0_15px_rgba(197,160,89,0.03)]">
              <div className="flex items-center justify-between pb-2 border-b border-stone-850">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono block">Regulatory Standing</span>
                  <p className="font-serif italic text-base text-stone-100 mt-1">Filing Ratio Progress</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-stone-100">{progressPercent}%</span>
                  <span className="text-[9px] block text-stone-500 font-mono">COMPLETE</span>
                </div>
              </div>

              {/* Pie Chart / Donut Chart */}
              <div className="h-[200px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={finalPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {finalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#141414" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-2xl font-mono font-bold text-stone-100">{completedTasksCount}/{totalTasks}</span>
                  <span className="text-[9px] text-stone-500 font-mono uppercase tracking-tighter">Tasks Closed</span>
                </div>
              </div>

              {/* Dynamic Legend Block */}
              <div className="space-y-2 pt-2 border-t border-stone-850">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                  <div className="p-1.5 bg-[#10b981]/5 border border-[#10b981]/15 rounded-sm">
                    <span className="block text-emerald-400 font-bold">{completedTasksCount}</span>
                    <span className="text-[9px] text-stone-500 font-mono uppercase">Filed</span>
                  </div>
                  <div className="p-1.5 bg-[#f59e0b]/5 border border-[#f59e0b]/15 rounded-sm">
                    <span className="block text-amber-400 font-bold">{pendingTasksCount}</span>
                    <span className="text-[9px] text-stone-500 font-mono uppercase">Pending</span>
                  </div>
                  <div className="p-1.5 bg-[#ef4444]/5 border border-[#ef4444]/15 rounded-sm">
                    <span className="block text-rose-400 font-bold">{overdueTasksCount}</span>
                    <span className="text-[9px] text-stone-500 font-mono uppercase">Overdue</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-stone-800 p-5 rounded">
              <p className="text-[10px] uppercase tracking-widest text-[#c5a059] mb-4">CRITICAL STATUTORY WINDOWS</p>
              <div className="space-y-4 text-xs">
                <div className="pb-3 border-b border-stone-850 space-y-1">
                  <p className="font-serif text-sm font-semibold text-stone-200">State franchise taxes</p>
                  <p className="text-stone-400">Delaware: Due annually prior to June 1st. Failure results in immediate $200 penalty plus 1.5% interest compounding monthly.</p>
                </div>
                <div className="pb-3 border-b border-stone-850 space-y-1">
                  <p className="font-serif text-sm font-semibold text-stone-200">Beneficial ownership report (boi)</p>
                  <p className="text-stone-400">Under the CTA, entities formed in 2026 have 90 calendar days to file with FinCEN. Severe civil liability apply for delayed record sets.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-sm font-semibold text-stone-200">Corporate transparency compliance</p>
                  <p className="text-stone-400">Changes in major stakes or residential addresses of members must be refreshed inside 30 calendar days of occurrence.</p>
                </div>
              </div>
            </div>

            {/* State filings guide */}
            <div className="bg-[#141414] border border-stone-800 p-5 rounded space-y-3">
              <h5 className="font-serif text-sm italic text-stone-300">Registered Agent Address</h5>
              <div className="p-3 bg-stone-900 border border-stone-850 rounded-sm font-mono text-[11px] text-stone-400 space-y-1">
                <p className="font-semibold text-stone-210">Integrated Avodah LLC Legal Mailbox</p>
                <p>c/o Delaware Standard Agent LLC</p>
                <p>1209 North Orange Street</p>
                <p>Wilmington, New Castle County, DE 19801</p>
              </div>
              <p className="text-[10px] text-stone-500 italic">This address must receive all structural service of process notes, summons, or regulatory warnings from the secretary office.</p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 2: CUSTOMISABLE COMPLIANCE CHECKLISTS ENGINE */}
      {activeSubTab === "checklists" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
          {/* LEFT SIDE PANEL: Dynamic Checklist Directories */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#141414] border border-stone-800 p-5 rounded space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-stone-400 font-mono">My Compliance Lists</h3>
                <button
                  onClick={handleRestorePresets}
                  title="Reset list templates"
                  className="p-1 hover:bg-stone-900 border border-stone-850 rounded text-stone-400 hover:text-[#c5a059] transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {checklists.map((cl) => {
                  const stats = getChecklistStats(cl);
                  const isSelected = cl.id === selectedChecklistId;
                  return (
                    <div
                      key={cl.id}
                      onClick={() => setSelectedChecklistId(cl.id)}
                      className={`group p-3 border rounded-sm transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-stone-900 border-[#c5a059]/80 shadow-[0_0_8px_rgba(197,160,89,0.1)]"
                          : "bg-stone-950/40 border-stone-900 hover:bg-stone-900 hover:border-stone-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p className={`font-serif text-sm truncate ${isSelected ? "text-[#c5a059] font-semibold" : "text-stone-300"}`}>
                            {cl.name}
                          </p>
                          <p className="text-[10px] text-stone-500 line-clamp-1">{cl.description}</p>
                        </div>
                        {cl.id !== "cl-fincen" && cl.id !== "cl-cta-annual" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChecklist(cl.id, cl.name);
                            }}
                            className="p-1 hover:bg-rose-950/50 rounded text-stone-605 group-hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Score metrics */}
                      <div className="mt-3.5 flex items-center justify-between gap-2">
                        <div className="flex-1 bg-stone-950 rounded-full h-1 overflow-hidden border border-stone-900">
                          <div 
                            className="bg-[#c5a059] h-full transition-all duration-500"
                            style={{ width: `${stats.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0 font-medium">
                          {stats.completed}/{stats.total} Complete ({stats.percent}%)
                        </span>
                      </div>

                      {/* Highlight alert points */}
                      <div className="mt-2 flex items-center gap-2">
                        {stats.overdue > 0 && (
                          <span className="text-[8px] font-semibold font-mono bg-rose-950/40 text-rose-400 border border-rose-950 px-1.5 py-0.2 rounded-sm uppercase tracking-wide">
                            {stats.overdue} Overdue
                          </span>
                        )}
                        {stats.upcoming > 0 && (
                          <span className="text-[8px] font-semibold font-mono bg-amber-950/40 text-amber-400 border border-amber-950 px-1.5 py-0.2 rounded-sm uppercase tracking-wide">
                            {stats.upcoming} Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Toggle checklist form button */}
              {!showNewChecklistForm ? (
                <button
                  onClick={() => setShowNewChecklistForm(true)}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-[#c5a059] text-xs font-mono rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> CREATE CUSTOM CHECKLIST
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleAddChecklist}
                  className="p-4 bg-stone-900 border border-stone-800 rounded space-y-3"
                >
                  <div className="flex justify-between items-center pb-1 border-b border-stone-850">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-[#c5a059]">New Checklist Folder</p>
                    <button 
                      type="button" 
                      onClick={() => setShowNewChecklistForm(false)}
                      className="text-stone-500 hover:text-stone-350"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9px] text-stone-500 uppercase tracking-wider mb-1">Checklist Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KS County Permits Setup"
                      value={newChecklistName}
                      onChange={(e) => setNewChecklistName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 text-stone-200 px-2.5 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-stone-500 uppercase tracking-wider mb-1">Description / Goal</label>
                    <textarea
                      placeholder="e.g. Local checks for tax office authorizations."
                      value={newChecklistDesc}
                      onChange={(e) => setNewChecklistDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-950 border border-stone-850 text-stone-200 px-2.5 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewChecklistForm(false)}
                      className="flex-1 py-1.5 bg-stone-950 border border-stone-850 text-stone-400 text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1.5 bg-[#c5a059] text-black font-semibold text-[11px] rounded-sm transition cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* GOOGLE DRIVE INTEGRATION SUITE */}
            <div className="bg-[#141414] border border-stone-800 p-5 rounded space-y-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs uppercase tracking-wider text-stone-200 font-mono font-medium">Google Drive Portal</h4>
              </div>
              <p className="text-[11px] text-[#aeaeae] leading-relaxed">
                Connect and export your customizable checklists directly to your Google Workspace account for audit, sharing, and compliance safety backup.
              </p>

              {/* Status Indicator */}
              <div className="bg-stone-900 border border-stone-850 rounded p-3 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500 anim-pulse animate-pulse"></div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-300">Drive Cloud Synced</span>
                </div>
                <p className="text-[9px] text-stone-500 font-mono">SCOUT YESHUA CLIENT: gen-lang-client-0501903422</p>
              </div>

              {/* Backup triggers */}
              <button
                disabled={driveBackingUp || !selectedChecklist}
                onClick={handleBackupToDrive}
                className="w-full py-2 bg-sky-950/20 border border-sky-900/40 hover:border-sky-500 text-sky-400 hover:text-sky-305 text-xs font-mono rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {driveBackingUp ? (
                  <>
                    <span className="animate-spin border-t-2 border-r-2 border-sky-500 w-3.5 h-3.5 rounded-full mr-1 inline-block"></span>
                    SYNCING SECURE DIRECTORY...
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5" /> BACKUP ACTIVE LIST TO DRIVE
                  </>
                )}
              </button>

              <AnimatePresence>
                {driveSyncSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-2.5 bg-sky-950/40 border border-sky-900/60 rounded text-[10px] text-sky-400 text-left font-serif"
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" /> {driveSyncSuccessMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Backup History logs */}
              <div className="space-y-1.5 pt-2 border-t border-stone-850">
                <p className="text-[9px] font-mono uppercase text-stone-500 font-bold">Workspace Backup Logs</p>
                <div className="space-y-1 text-[10px] text-stone-400 max-h-24 overflow-y-auto">
                  {driveSyncHistory.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-1 border-b border-stone-900 font-mono">
                      <span className="text-stone-500 truncate max-w-[120px]" title={h.checklistName}>{h.checklistName}</span>
                      <span className="text-emerald-500 flex items-center gap-1 shrink-0 ml-1.5">
                        <FileText className="w-2.5 h-2.5 text-stone-500" />
                        {h.size} @ {h.date.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE MAIN VIEW: Selected Checklist Detail */}
          <div className="lg:col-span-8 space-y-6">
            {!selectedChecklist ? (
              <div className="p-12 text-center bg-[#141414] border border-stone-800 rounded">
                <ListTodo className="w-12 h-12 text-stone-750 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-300">No active checklists matching</p>
                <p className="text-xs text-stone-500 mt-2">Click below to restore presets or make a list</p>
                <button
                  onClick={handleRestorePresets}
                  className="mt-4 px-4 py-1.5 bg-[#c5a059] text-black font-semibold text-xs rounded transition"
                >
                  RESTORE CORPORATE TEMPLATES
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active header info card */}
                <div className="bg-[#141414] border border-stone-800 p-5 rounded space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono tracking-widest bg-stone-900 border border-stone-800 text-[#c5a059] px-2 py-0.5 uppercase">
                          Compliance Suite
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">Created: {selectedChecklist.createdAt}</span>
                      </div>
                      <h2 className="text-xl font-serif text-stone-100 italic">{selectedChecklist.name}</h2>
                      <p className="text-xs text-stone-400 font-serif leading-relaxed max-w-2xl">{selectedChecklist.description}</p>
                    </div>

                    <button
                      onClick={() => setShowNewItemForm(!showNewItemForm)}
                      className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#b08c48] text-black font-semibold text-xs tracking-tight rounded-sm transition flex items-center gap-1.5 self-start shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Task Item
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-850">
                    <div className="bg-stone-950 p-2.5 border border-stone-850 rounded">
                      <p className="text-[8px] font-mono text-stone-500 uppercase">Total Items</p>
                      <p className="text-lg font-mono font-extrabold text-stone-300">{selectedChecklist.items.length}</p>
                    </div>
                    <div className="bg-stone-950 p-2.5 border border-stone-850 rounded">
                      <p className="text-[8px] font-mono text-stone-500 uppercase">Completed</p>
                      <p className="text-lg font-mono font-extrabold text-emerald-450 text-emerald-400">
                        {selectedChecklist.items.filter(i => i.completed).length}
                      </p>
                    </div>
                    <div className="bg-stone-950 p-2.5 border border-stone-850 rounded">
                      <p className="text-[8px] font-mono text-stone-500 uppercase">Upcoming</p>
                      <p className="text-lg font-mono font-extrabold text-amber-500 text-amber-400">
                        {selectedChecklist.items.filter(i => !i.completed && getDaysDiff(i.dueDate) >= 0 && getDaysDiff(i.dueDate) <= 14).length}
                      </p>
                    </div>
                    <div className="bg-stone-950 p-2.5 border border-[#fc8181]/15 rounded">
                      <p className="text-[8px] font-mono text-stone-500 uppercase">Overdue</p>
                      <p className="text-lg font-mono font-extrabold text-rose-400">
                        {selectedChecklist.items.filter(i => !i.completed && getDaysDiff(i.dueDate) < 0).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SLIDE-DOWN: Add NEW Checklist Item Form */}
                <AnimatePresence>
                  {showNewItemForm && (
                    <motion.form
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleAddChecklistItem}
                      className="p-5 bg-stone-900 border border-[#c5a059]/40 rounded space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif italic text-[#c5a059] text-sm flex items-center gap-1.5">
                          <Plus className="w-4 h-4" /> Adding Action Task Item
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setShowNewItemForm(false)}
                          className="text-stone-500 hover:text-stone-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">Task / Deliverable Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Request certification from Dover agent"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-600 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">Due Date</label>
                          <input
                            type="date"
                            required
                            value={newItemDueDate}
                            onChange={(e) => setNewItemDueDate(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">Assign Responsibility</label>
                          <select
                            value={newItemAssignee}
                            onChange={(e) => setNewItemAssignee(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none"
                          >
                            <option value="Scout Yeshua">Scout Yeshua (Managing Member)</option>
                            <option value="Chava Bernstein">Chava Bernstein (Member)</option>
                            <option value="Custom">Custom Handle...</option>
                          </select>
                        </div>

                        {newItemAssignee === "Custom" && (
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">Custom Assignee Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Attorney Goodman"
                              value={newItemCustomAssignee}
                              onChange={(e) => setNewItemCustomAssignee(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                            />
                          </div>
                        )}

                        <div className={newItemAssignee === "Custom" ? "md:col-span-1" : "md:col-span-2"}>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">Detailed Operational Notes (Optional)</label>
                          <input
                            type="text"
                            placeholder="Add files to upload or regulatory web links..."
                            value={newItemNotes}
                            onChange={(e) => setNewItemNotes(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-600 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#c5a059]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => setShowNewItemForm(false)}
                          className="px-3.5 py-1.5 bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#c5a059] text-black font-semibold tracking-tight transition cursor-pointer"
                        >
                          Log Compliance Step
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* RENDER DYNAMIC LIST of ITEMS */}
                <div className="space-y-3">
                  {selectedChecklist.items.length === 0 ? (
                    <div className="p-10 text-center bg-[#141414] border border-stone-850 rounded">
                      <ListTodo className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-stone-400">This compliance checklist is empty.</p>
                      <p className="text-[11px] text-stone-605 mt-1">Click the 'Add Task Item' button above to construct custom checklist items.</p>
                    </div>
                  ) : (
                    selectedChecklist.items.map((item) => {
                      const ageClass = getItemStatus(item);
                      const isEditing = editingItemId === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 bg-[#141414] border rounded-sm transition ${
                            item.completed 
                              ? "border-stone-900 opacity-65" 
                              : "border-stone-850 hover:border-stone-800 shadow-sm"
                          }`}
                        >
                          {isEditing ? (
                            // INLINE EDITING CARD INJECTION
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-6">
                                  <label className="block text-[8px] font-mono text-stone-500 uppercase">Task Title</label>
                                  <input
                                    type="text"
                                    value={editItemTitle}
                                    onChange={(e) => setEditItemTitle(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-2 py-1 text-xs rounded-sm focus:outline-none"
                                  />
                                </div>
                                <div className="md:col-span-3">
                                  <label className="block text-[8px] font-mono text-stone-500 uppercase">Due date</label>
                                  <input
                                    type="date"
                                    value={editItemDueDate}
                                    onChange={(e) => setEditItemDueDate(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-2 py-1 text-xs rounded-sm focus:outline-none"
                                  />
                                </div>
                                <div className="md:col-span-3">
                                  <label className="block text-[8px] font-mono text-stone-500 uppercase">Responsible</label>
                                  <input
                                    type="text"
                                    value={editItemAssignee}
                                    onChange={(e) => setEditItemAssignee(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-2 py-1 text-xs rounded-sm focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-stone-500 uppercase">Operational notes</label>
                                <input
                                  type="text"
                                  value={editItemNotes}
                                  onChange={(e) => setEditItemNotes(e.target.value)}
                                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-2 py-1 text-xs rounded-sm focus:outline-none"
                                />
                              </div>
                              <div className="flex justify-end gap-1.5 text-[11px] pt-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingItemId(null)}
                                  className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded-sm text-stone-400 hover:text-stone-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveItemEdit(item.id)}
                                  className="px-3  py-1 bg-[#c5a059] text-black font-semibold rounded-sm tracking-tight"
                                >
                                  Save Change
                                </button>
                              </div>
                            </div>
                          ) : (
                            // STANDARD READ-ONLY ELEMENT
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 text-left">
                              {/* Left details + Checkbox */}
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  onClick={() => handleToggleItemComplete(item.id)}
                                  className={`mt-1 shrink-0 w-4.5 h-4.5 border rounded flex items-center justify-center transition-all cursor-pointer ${
                                    item.completed
                                      ? "bg-[#c5a059] border-[#c5a059] text-black"
                                      : "border-stone-700 hover:border-[#c5a059] bg-stone-950/60 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </button>

                                <div className="space-y-1 flex-1 min-w-0">
                                  <h5 className={`text-sm font-sans font-medium break-words leading-snug ${
                                    item.completed ? "text-stone-500 line-through decoration-stone-750" : "text-stone-200"
                                  }`}>
                                    {item.title}
                                  </h5>

                                  {/* Info chips row */}
                                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-stone-500 pt-0.5">
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3 text-stone-600" />
                                      Responsible: <strong className="text-stone-400 font-medium">{item.assignedName}</strong>
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-stone-605" />
                                      Due: <strong className="text-stone-400 font-medium">{item.dueDate}</strong>
                                    </span>
                                  </div>

                                  {item.notes && (
                                    <p className="text-[11px] text-stone-500 italic pt-1 max-w-full truncate" title={item.notes}>
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right status badge + custom modifiers */}
                              <div className="flex items-center gap-3 shrink-0 self-end md:self-center justify-between w-full md:w-auto border-t md:border-t-0 pt-2.5 md:pt-0 border-stone-850">
                                {/* Visual Status alerts */}
                                <span className={`text-[9px] font-mono tracking-wider font-semibold border px-2 py-0.5 rounded-sm uppercase ${ageClass.color}`}>
                                  {item.completed ? "COMPLETED" : ageClass.label}
                                </span>

                                <div className="flex items-center gap-1.5 ml-2">
                                  <button
                                    onClick={() => startEditItem(item)}
                                    className="p-1 hover:bg-stone-900 border border-stone-850 rounded text-stone-500 hover:text-[#c5a059] transition cursor-pointer"
                                    title="Edit item details"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1 hover:bg-rose-955/40 border border-stone-850 rounded text-stone-500 hover:text-rose-400 transition cursor-pointer"
                                    title="Delete compliance item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
