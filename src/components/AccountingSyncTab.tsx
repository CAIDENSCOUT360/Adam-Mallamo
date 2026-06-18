import React, { useState } from "react";
import { AccountingIntegration, LedgerTransaction } from "../types";
import { 
  RefreshCw, 
  CheckCircle, 
  Link2, 
  Unlink, 
  Layers, 
  HelpCircle, 
  Clock, 
  Info, 
  CheckCircle2, 
  Radio
} from "lucide-react";
import { motion } from "motion/react";

interface AccountingSyncTabProps {
  integrations: AccountingIntegration[];
  onToggleIntegration: (id: "quickbooks" | "xero" | "freshbooks") => void;
  onSyncNow: (id: "quickbooks" | "xero" | "freshbooks") => void;
  transactions: LedgerTransaction[];
}

export default function AccountingSyncTab({ 
  integrations, 
  onToggleIntegration, 
  onSyncNow,
  transactions
}: AccountingSyncTabProps) {
  
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<string | null>(null);

  const handleSyncClick = (id: "quickbooks" | "xero" | "freshbooks") => {
    setSyncingId(id);
    onSyncNow(id);

    // Simulate standard sync process matching items
    setTimeout(() => {
      setSyncingId(null);
      setMatchingStatus(`Accounting ledger synchronization completed successfully. ${transactions.length} records verified. Zero mismatches.`);
    }, 2000);
  };

  return (
    <div id="accounting-sync-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      
      {/* Integrations catalog */}
      <div id="integration-list-panel" className="lg:col-span-6 space-y-4">
        <div className="p-4 bg-stone-900 border border-stone-850 rounded-sm">
          <h4 className="font-serif italic text-base text-stone-100 mb-1">Corporate Ledger Sync Pipelines</h4>
          <p className="text-xs text-stone-400">Establish dynamic integrations to seamlessly sync bank receipts and financial state journals back into your accounting system.</p>
        </div>

        <div className="space-y-3">
          {integrations.map((item) => (
            <div 
              key={item.id}
              className={`p-5 bg-[#141414] border rounded-sm transition ${
                item.status === "Connected" 
                ? "border-[#c5a059]" 
                : "border-stone-850 hover:border-stone-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-sm bg-stone-950 flex items-center justify-center border border-stone-850 font-serif font-bold text-[#c5a059] text-lg">
                    {item.logo}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-stone-100">{item.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === "Connected" ? 'bg-emerald-500 animate-pulse' : 'bg-stone-605'}`}></span>
                      <span className="text-[10px] font-mono text-stone-450 uppercase">{item.status}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-mono">Last Sync Refresh: {item.lastSynced}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  {item.status === "Connected" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSyncClick(item.id)}
                        disabled={syncingId !== null}
                        className="px-3 py-1.5 text-xs bg-stone-900 hover:bg-stone-850 text-stone-300 rounded border border-stone-750 flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#c5a059] ${syncingId === item.id ? "animate-spin" : ""}`} />
                        Sync Now
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleIntegration(item.id)}
                        className="px-3 py-1.5 text-xs text-stone-450 hover:text-stone-300 font-mono"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleIntegration(item.id)}
                      className="px-3 py-1.5 text-xs text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-black transition uppercase font-mono tracking-wider font-semibold rounded-sm cursor-pointer"
                    >
                      Connect Portal
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Monitor and status log details */}
      <div id="sync-logs-panel" className="lg:col-span-6 space-y-4">
        
        <div className="bg-[#141414] border border-stone-800 p-5 rounded min-h-[420px] flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif italic text-base text-stone-200 border-b border-stone-850 pb-3 flex items-center gap-2">
              <Radio className="w-4.5 h-4.5 text-[#c5a059] animate-pulse" />
              Accounting ledger Reconciliation Journal
            </h4>

            {syncingId ? (
              <div id="integrations-loader" className="py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-t-2 border-[#c5a059] animate-spin mx-auto"></div>
                <p className="text-xs text-stone-400 font-serif italic">Synchronizing corporate assets with remote general ledger API...</p>
                <div className="text-[10px] font-mono text-stone-550 max-w-xs mx-auto">
                  <p>Posting formation fees record...</p>
                  <p>Resolving matching audit profiles...</p>
                </div>
              </div>
            ) : matchingStatus ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded flex gap-3 text-xs text-stone-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-stone-105">Reconciliation Complete</h5>
                    <p className="text-stone-400 mt-1 leading-normal">{matchingStatus}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-900 border border-stone-850 rounded-sm">
                  <p className="text-[10px] uppercase font-mono text-[#c5a059] tracking-wider mb-2">Sync Transaction Map Audit Logs</p>
                  <div className="space-y-1.5 text-[11px] font-mono text-stone-450">
                    <p className="flex justify-between">
                      <span>• Capital Contribution Scout:</span> <span className="text-stone-300">$15,000.00 matched</span>
                    </p>
                    <p className="flex justify-between">
                      <span>• Capital Contribution Chava:</span> <span className="text-stone-300">$10,000.00 matched</span>
                    </p>
                    <p className="flex justify-between">
                      <span>• Formation Filing Fee:</span> <span className="text-stone-300">$110.00 expensed</span>
                    </p>
                    <p className="flex justify-between">
                      <span>• Consulting Retainer:</span> <span className="text-[#c5a059]">$7,200.00 reconciled</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <div className="w-12 h-12 bg-stone-950 rounded-full border border-stone-850 flex items-center justify-center text-[#c5a059] mx-auto">
                  <Link2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-serif font-semibold text-stone-200">Reconciliation Workspace</h5>
                  <p className="text-xs text-stone-450 mt-1 leading-relaxed">
                    Connect an accounting service like QuickBooks or Xero, and press "Sync Now" to automatically verify asset ledger matches, avoid duplicate expenses, and lock audit hygiene.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-900 border border-stone-850 rounded-sm text-[10px] text-stone-500">
            <strong>Reconciliation Compliance:</strong> Linking your portal triggers TLS-encrypted token handshakes. No plain-text passwords or client credentials are ever logged.
          </div>
        </div>

      </div>

    </div>
  );
}
