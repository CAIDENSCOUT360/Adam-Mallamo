import React, { useState } from "react";
import { LedgerTransaction, LLCConfig } from "../types";
import { 
  DollarSign, 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Download,
  Info 
} from "lucide-react";
import { motion } from "motion/react";

interface TaxReportingTabProps {
  transactions: LedgerTransaction[];
  onAddTransaction: (tx: LedgerTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  llc: LLCConfig;
}

export default function TaxReportingTab({ 
  transactions, 
  onAddTransaction, 
  onDeleteTransaction, 
  llc 
}: TaxReportingTabProps) {
  
  const [taxYear, setTaxYear] = useState("2026");
  const [showAddTx, setShowAddTx] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [taxReport, setTaxReport] = useState("");
  const [reportError, setReportError] = useState("");

  // Ledger state for adding transaction
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("500");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<LedgerTransaction["category"]>("Legal & Professional");
  const [date, setDate] = useState("2026-06-01");

  // Calculations
  const revenueList = transactions.filter((t) => t.type === "income");
  const expenseList = transactions.filter((t) => t.type === "expense");

  const grossRevenue = revenueList.reduce((sum, t) => sum + t.amount, 0);
  const totalDeductions = expenseList.reduce((sum, t) => sum + t.amount, 0);
  const netEarnings = grossRevenue - totalDeductions;

  // Add ledger row
  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const newTx: LedgerTransaction = {
      id: "tx-" + Date.now(),
      date,
      description: desc,
      amount: Number(amount) || 0,
      type,
      category,
      refNum: "TX-" + Math.floor(100+Math.random()*900)
    };

    onAddTransaction(newTx);
    setDesc("");
    setAmount("500");
    setShowAddTx(false);
  };

  // Compile Annual Tax Filing Report with Gemini
  const handleCompileTaxReport = async () => {
    setLoadingReport(true);
    setReportError("");
    setTaxReport("");

    try {
      const response = await fetch("/api/gemini/tax-filing-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions,
          companyName: llc.companyName,
          taxYear
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Internal response compilation failed.");
      }

      const result = await response.json();
      setTaxReport(result.report);
    } catch (err: any) {
      console.error(err);
      setReportError(err.message || "Failed dynamic communication. Make sure server is initialized.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div id="tax-reporting-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      
      {/* Ledger Management Side */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-stone-850 p-4 rounded-sm">
            <p className="text-[10px] uppercase tracking-wider text-stone-550 font-mono">GROSS REVENUE</p>
            <h4 className="font-serif text-2xl text-emerald-450 mt-1 flex items-center justify-between">
              ${grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <TrendingUp className="w-5 h-5 text-emerald-500/60" />
            </h4>
          </div>

          <div className="bg-[#141414] border border-stone-850 p-4 rounded-sm">
            <p className="text-[10px] uppercase tracking-wider text-stone-550 font-mono">TOTAL DEDUCTIBLE ASSISTANCE</p>
            <h4 className="font-serif text-2xl text-orange-450 mt-1 flex items-center justify-between">
              -${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <TrendingDown className="w-5 h-5 text-orange-500/60" />
            </h4>
          </div>

          <div className="bg-[#141414] border border-stone-850 p-4 rounded-sm ring-1 ring-[#c5a059]/30">
            <p className="text-[10px] uppercase tracking-wider text-[#c5a059] font-mono">NET TAXABLE EARNINGS</p>
            <h4 className="font-serif text-2xl text-[#c5a059] mt-1">
              ${netEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
        </div>

        {/* Ledger Header details */}
        <div className="bg-[#141414] border border-stone-800 rounded-sm">
          <div className="p-4 border-b border-stone-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-base text-stone-100">Company Operations Ledger</span>
              <span className="px-1.5 py-0.2 select-none text-[9px] bg-stone-900 border border-stone-800 text-stone-400 font-mono rounded uppercase">Sync Active</span>
            </div>
            
            <button
              onClick={() => setShowAddTx(!showAddTx)}
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black hover:border-transparent transition"
            >
              Log Transaction
            </button>
          </div>

          {/* Quick Transaction Maker inline */}
          {showAddTx && (
            <motion.form 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddTx}
              className="p-4 bg-stone-900/60 border-b border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">TRANSACTION DESCRIPTION</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal Consulting Client Retainer"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-200 outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">TX TYPE</label>
                <select
                  value={type}
                  onChange={(e: any) => {
                    setType(e.target.value);
                    setCategory(e.target.value === "income" ? "Revenue" : "Legal & Professional");
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-200"
                >
                  <option value="expense">Expense / Deduction Outflow</option>
                  <option value="income">Gross Business Income</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">AMOUNT ($)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">TAX CATEGORY</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-200"
                >
                  {type === "income" ? (
                    <option value="Revenue">Revenue / Client Paid</option>
                  ) : (
                    <>
                      <option value="Formation Fees">Formation Fees</option>
                      <option value="Legal & Professional">Legal & Professional Services</option>
                      <option value="Registered Agent Fees">Registered Agent Service</option>
                      <option value="Software Subscription">Cloud Soft Subscription</option>
                      <option value="Office Supplies">Administrative Office Supplies</option>
                      <option value="Advertising">Advertising / Hiring campaign</option>
                      <option value="State Tax / Franchise Fee">State Tax / Franchise Fee</option>
                    </>
                  )}
                  <option value="Other">Other Expenses</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddTx(false)}
                  className="px-3 py-1 bg-stone-950 border border-stone-850 text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#c5a059] text-black font-semibold font-mono"
                >
                  Confirm Log Entry
                </button>
              </div>
            </motion.form>
          )}

          {/* Ledger table list layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900/50 border-b border-stone-850 text-stone-500 font-mono text-[10px]">
                  <th className="p-3 pl-4">DATE</th>
                  <th className="p-3">DESCRIPTION</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3 text-right">VALUE</th>
                  <th className="p-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-900">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-900/30 transition">
                    <td className="p-3 pl-4 font-mono text-stone-400 whitespace-nowrap">{tx.date}</td>
                    <td className="p-3">
                      <div className="font-medium text-stone-200">{tx.description}</div>
                      <div className="text-[10px] text-stone-550 font-mono mt-0.2">{tx.refNum}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 bg-stone-900 text-stone-400 rounded-sm border border-stone-850">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-semibold font-mono ${tx.type === "income" ? "text-emerald-450" : "text-stone-300"}`}>
                      {tx.type === "income" ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 hover:bg-stone-850 text-stone-605 hover:text-rose-400 rounded transition"
                        title="Erase transaction row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Compiler Assistant Section */}
      <div id="compiler-column" className="lg:col-span-5 space-y-4">
        <div className="bg-[#141414] border border-stone-800 p-5 rounded flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-stone-850">
              <div className="flex items-center gap-1.5 text-stone-200">
                <Sparkles className="w-4.5 h-4.5 text-[#c5a059]" />
                <span className="font-serif italic text-base">Annual Tax Compiler</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[11px] font-mono text-stone-500">FISCAL YEAR</label>
                <select
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                  className="bg-stone-900 border border-stone-800 text-stone-200 font-mono text-xs px-2 py-1 rounded"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            {loadingReport ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-12 h-12 rounded-full border-t-2 border-[#c5a059] animate-spin mx-auto"></div>
                <p className="text-sm font-semibold font-serif italic text-[#c5a059] animate-pulse">Assembling schedule schedules...</p>
                <p className="text-[11px] text-stone-500">Evaluating multi-partner corporate deductions based on IRS Part II schedules</p>
              </div>
            ) : taxReport ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#0a0a0a] border border-stone-850 text-xs text-stone-300 leading-relaxed font-serif whitespace-pre-wrap max-h-[350px] overflow-y-auto pl-3 border-l-2 border-[#c5a059]">
                  {taxReport}
                </div>

                <div className="p-3 bg-stone-900 border border-stone-850 rounded text-[11px] text-stone-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <p>You can export this tax filing summary as a formatted text brief or integrate it into major tax filing softwares.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4 max-w-xs mx-auto">
                <div className="w-12 h-12 rounded-full bg-stone-950 flex items-center justify-center border border-stone-850 mx-auto">
                  <Calendar className="w-6 h-6 text-[#c5a059]" />
                </div>
                <div>
                  <h5 className="font-serif font-semibold text-stone-200">Construct IRS filing draft</h5>
                  <p className="text-xs text-stone-450 mt-1 leading-relaxed">
                    Instantly compile corporate gross receipts, map operational expenditures to tax forms, and identify write-offs using Gemini client structures.
                  </p>
                </div>
                <button
                  onClick={handleCompileTaxReport}
                  className="w-full py-2 bg-[#c5a059] text-black font-semibold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Compile Tax Report
                </button>
              </div>
            )}

            {reportError && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded text-xs text-red-500">
                <p className="font-semibold">Calculation Suspended</p>
                <p>{reportError}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-850 text-[10px] text-stone-600 font-mono flex items-center justify-between">
            <span>Deduction Engine: v1.2</span>
            <span>Formatted: IRS Schedule C Ready</span>
          </div>
        </div>
      </div>

    </div>
  );
}
