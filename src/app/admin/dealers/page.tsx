"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { Briefcase, Eye, ShieldAlert, CheckCircle, Ban, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminDealersPage() {
  const { dealers, updateDealerCommission, updateDealerStatus, colleges } = useDemo();
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [commissionVal, setCommissionVal] = useState(70);

  const handleOpenDetails = (dealer: any) => {
    setSelectedDealer(dealer);
    setCommissionVal(dealer.commissionPercentage);
  };

  const handleSaveCommission = () => {
    if (!selectedDealer) return;
    updateDealerCommission(selectedDealer.id, commissionVal);
    toast.success(`Commission updated to ${commissionVal}% for dealer ${selectedDealer.name}`);
    setSelectedDealer(null);
  };

  const handleStatusChange = (status: "approved" | "suspended", verification: "verified" | "unverified") => {
    if (!selectedDealer) return;
    updateDealerStatus(selectedDealer.id, status, verification);
    toast.success(`Dealer ${selectedDealer.name} status updated to ${status}`);
    setSelectedDealer(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Dealers & Content Providers
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Configure commission percentages, verify PAN/KYC identifiers, and approve applications.
        </p>
      </div>

      {/* List Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Dealer Name</th>
                <th className="p-3">Email / Contact</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Commission split</th>
                <th className="p-3">Earnings</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {dealers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3">
                    <span className="font-bold block">{d.name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 block uppercase mt-0.5">ID: {d.id}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-mono">{d.email}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{d.phone}</p>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      d.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : d.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    {d.commissionPercentage}%
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-zinc-50">
                    {formatCurrency(d.netEarnings)}
                  </td>
                  <td className="p-3 text-right shrink-0">
                    <button
                      onClick={() => handleOpenDetails(d)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 rounded-xl"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details drawer dialog modal */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedDealer(null)}></div>
          
          <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 px-6 py-6 text-left shadow-2xl transition-all w-full max-w-md border border-slate-100 dark:border-zinc-800 z-50">
            <button
              onClick={() => setSelectedDealer(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dealer Profile details</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-1">{selectedDealer.name}</h3>
              </div>

              <div className="text-xs space-y-2.5 text-slate-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Pan Card Number</span>
                  <strong className="font-mono text-slate-800 dark:text-zinc-100 uppercase">{selectedDealer.panNumber || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Registered College Counts</span>
                  <strong className="text-slate-800 dark:text-zinc-100">{selectedDealer.collegeIds.length} affiliated</strong>
                </div>
              </div>

              {/* Commission Adjuster */}
              <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Configure Commission Split percentage (%)
                </label>
                <div className="flex gap-2">
                  <select
                    value={commissionVal}
                    onChange={(e) => setCommissionVal(parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    <option value={70}>70% Dealer Split</option>
                    <option value={75}>75% Dealer Split</option>
                    <option value={80}>80% Dealer Split</option>
                  </select>
                  <button
                    onClick={handleSaveCommission}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Status approvals actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-4">
                <button
                  onClick={() => handleStatusChange("approved", "verified")}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Approve Dealer
                </button>
                <button
                  onClick={() => handleStatusChange("suspended", "unverified")}
                  className="py-2.5 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-4 h-4" /> Suspend Account
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
