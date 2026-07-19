"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function DealerSettingsPage() {
  const { currentUser, dealers, updateProfile, updatePayoutDetails } = useDemo();

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);

  // States
  const [name, setName] = useState(currentUser?.name || "");
  const [bankName, setBankName] = useState(dealerProfile?.bankAccountName || "");
  const [bankAcc, setBankAcc] = useState(dealerProfile?.bankAccountNumber || "");
  const [bankIfsc, setBankIfsc] = useState(dealerProfile?.bankIfsc || "");
  const [upiId, setUpiId] = useState(dealerProfile?.upiId || "");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    setTimeout(() => {
      updateProfile(name);
      updatePayoutDetails(bankName, bankAcc, bankIfsc, upiId);
      setSaving(false);
      toast.success("Dealer profile & payout details updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Dealer Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Configure payout destination banking details, verify KYC, and manage profile names.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <form onSubmit={handleSave} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Email Address (Cannot change)
            </label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ""}
              className="block w-full px-3 py-2 bg-slate-100 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-500 text-xs font-semibold rounded-xl cursor-not-allowed border-0"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Payout Destination settings (Masked in UI)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Bank Account Holder Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Bank Account Number</label>
                <input
                  type="password"
                  value={bankAcc}
                  onChange={(e) => setBankAcc(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Bank IFSC Code</label>
                <input
                  type="text"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1"
          >
            {saving ? "Saving changes..." : "Save Settings"} <Save className="w-4 h-4" />
          </button>

        </form>
      </div>

    </div>
  );
}
