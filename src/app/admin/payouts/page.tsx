"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Search, 
  RefreshCw, 
  FileText, 
  User, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "../../../lib/storage";

interface PayoutRequest {
  id: string;
  dealerId: string;
  amount: number;
  method: string;
  paymentDetails: string;
  status: string;
  createdAt: string;
  dealer: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "rejected">("pending");
  const [search, setSearch] = useState("");

  const fetchPayouts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/payouts");
      if (res.ok) {
        const data = await res.json();
        setPayouts(data);
      } else {
        toast.error("Failed to load payout queue.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred fetching payout logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "completed" | "rejected") => {
    const confirmation = window.confirm(
      newStatus === "completed" 
        ? "Have you successfully transferred the funds manually to the dealer's bank account/UPI? Click OK to confirm settlement."
        : "Are you sure you want to reject this payout? The amount will be refunded to the dealer's balance."
    );
    if (!confirmation) return;

    try {
      const res = await fetch("/api/admin/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Payout successfully marked as ${newStatus}!`);
        // Refresh feed
        fetchPayouts(true);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update payout status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating payout status.");
    }
  };

  const filtered = payouts.filter(p => {
    if (p.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.dealer.name.toLowerCase().includes(q) ||
        p.paymentDetails.toLowerCase().includes(q) ||
        p.amount.toString().includes(q)
      );
    }
    return true;
  });

  const pendingCount = payouts.filter(p => p.status === "pending").length;
  const completedCount = payouts.filter(p => p.status === "completed").length;
  const rejectedCount = payouts.filter(p => p.status === "rejected").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Dealer Payout Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Process dealer balance withdrawals manually, check transfer destinations, and clear payout tickets.
          </p>
        </div>
        <button
          onClick={() => fetchPayouts(false)}
          className="p-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs & Search controls */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-50 dark:border-zinc-800/60 pb-1.5 gap-4 overflow-x-auto w-full md:w-auto">
            {(["pending", "completed", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative capitalize shrink-0 ${
                  activeTab === tab
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                {tab === "pending" ? `Pending (${pendingCount})` : tab === "completed" ? `Settled (${completedCount})` : `Rejected (${rejectedCount})`}
                {activeTab === tab && (
                  <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Filter Search */}
          <div className="relative w-full md:w-72 rounded-xl shadow-sm shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search by dealer or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 border-0 text-slate-800 dark:text-zinc-200 text-xs font-semibold rounded-xl"
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2 font-semibold">Loading withdrawals ledger...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl bg-slate-50/20 dark:bg-zinc-900/10">
            <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">No payout tickets in this tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((payout) => {
              const reqDate = new Date(payout.createdAt).toLocaleString();
              return (
                <div 
                  key={payout.id}
                  className="bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                >
                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                        Requested: {reqDate}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                        {payout.method}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-white dark:bg-zinc-850 rounded-xl border border-slate-100 dark:border-zinc-750 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                          {payout.dealer.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                          {payout.dealer.email} • {payout.dealer.phone}
                        </p>
                      </div>
                    </div>

                    {/* Destination Account Info Box */}
                    <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-850/80 text-[11px] space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        Destination Credentials
                      </span>
                      <p className="font-mono text-slate-700 dark:text-zinc-300 select-all font-semibold leading-relaxed">
                        {payout.paymentDetails}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Amount and actions */}
                  <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-zinc-800 shrink-0 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">Amount Due</span>
                      <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(payout.amount)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    {payout.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(payout.id, "completed")}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve Payout
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(payout.id, "rejected")}
                          className="px-3 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        payout.status === "completed" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                      }`}>
                        {payout.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Instruction Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal">
          <span className="font-bold">Manual Settlement Process</span>
          <p className="mt-0.5">
            To fulfill a payout, copy the destination account number or UPI ID from the card above, navigate to your corporate banking or UPI dashboard, transfer the exact amount due, and click <strong>Approve Payout</strong> to deduct the virtual pending balance and update their withdrawal ledger.
          </p>
        </div>
      </div>

    </div>
  );
}
