import React, { useState } from "react";
import { ComplianceTask, LLCConfig } from "../types";
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileCheck2, 
  Download, 
  Plus, 
  TrendingUp, 
  DollarSign,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";

interface ComplianceTabProps {
  tasks: ComplianceTask[];
  onCompleteTask: (id: string) => void;
  onAddTask: (task: Omit<ComplianceTask, "id">) => void;
  llc: LLCConfig;
}

export default function ComplianceTab({ tasks, onCompleteTask, onAddTask, llc }: ComplianceTabProps) {
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed" | "Overdue">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Form State for creating custom compliance task
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("2026-07-31");
  const [category, setCategory] = useState<ComplianceTask["category"]>("State Filing");
  const [fee, setFee] = useState("100");
  const [description, setDescription] = useState("");

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

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Priority filter
    if (filter === "Pending" && t.status !== "Pending") return false;
    if (filter === "Completed" && t.status !== "Completed") return false;
    if (filter === "Overdue" && t.status !== "Overdue") return false;

    // Category filter
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;

    return true;
  });

  return (
    <div id="compliance-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      {/* List of Tasks & Schedule */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 border border-stone-800 rounded">
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Pending", "Completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 text-xs font-mono tracking-tight transition-all rounded-sm ${
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
                  className="w-full bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 text-xs rounded-sm focus:outline-none"
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
                className="px-4 py-1.5 bg-[#c5a059] text-black font-semibold tracking-tight transition"
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
                  ? "border-stone-905 opacity-70" 
                  : "border-stone-800 hover:border-stone-700"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[9px] bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-sm tracking-widest text-[#c5a059] font-mono text-xs uppercase">
                        {task.category}
                      </span>
                      <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        Deadline: {task.dueDate}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg text-stone-100 flex items-center gap-2">
                      {task.title}
                      {task.status === "Completed" && (
                        <span className="text-[10px] bg-emerald-950/40 text-emerald-500 border border-emerald-900 px-2 rounded-full font-sans uppercase">Filed</span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-450 leading-relaxed max-w-2xl">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-800/60">
                    <div className="text-right">
                      <span className="block text-[9px] text-stone-550 font-mono uppercase">STATUTORY FEE</span>
                      <span className="text-sm font-mono font-bold text-stone-200">
                        {task.fee > 0 ? `$${task.fee}` : "Free"}
                      </span>
                    </div>

                    {task.status !== "Completed" ? (
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="px-4 py-1.5 bg-stone-900 hover:bg-stone-850 text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-mono rounded-sm transition"
                      >
                        RECORD PAYMENT & FILE
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-555 text-xs font-mono bg-emerald-950/20 px-2.5 py-1.5 border border-emerald-900/40 rounded-sm">
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
            <p className="font-semibold text-stone-200">Integrated Avodah LLC Legal Mailbox</p>
            <p>c/o Delaware Standard Agent LLC</p>
            <p>1209 North Orange Street</p>
            <p>Wilmington, New Castle county, DE 19801</p>
          </div>
          <p className="text-[10px] text-stone-500 italic">This address must receive all structural service of process notes, summons, or regulatory warnings from the secretary office.</p>
        </div>
      </div>
    </div>
  );
}
