"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { DollarSign, ShieldCheck, Briefcase, FileText, ArrowRight } from "lucide-react";

export default function DealerEarningsPage() {
  const { ledger, dealers, currentUser } = useDemo();

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);
  const myLedger = ledger.filter((l) => l.dealerId === dealerProfile?.id);

  // Group splits calculation simulator
  const [testGross, setTestGross] = useState(100);
  const commPct = dealerProfile ? dealerProfile.commissionPercentage : 70;
  
  const gatewayFee = Math.round(testGross * 0.02); // 2%
  const netDistributable = testGross - gatewayFee;
  const dealerShare = Math.round(netDistributable * (commPct / 100));
  const adminShare = netDistributable - dealerShare;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Earnings & Finance Ledger
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Track transaction ledgers, platform deductions, and verify your payout splits configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT: Ledger list */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">My Transaction Ledger</span>

          {myLedger.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-sm mx-auto">
              <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                {myLedger.map((item) => (
                  <div key={item.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-zinc-200">{item.description}</p>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5 block">
                        Date: {new Date(item.createdAt).toLocaleString()} • Ref ID: {item.referenceId}
                      </span>
                    </div>
                    <span className={`font-bold shrink-0 ml-4 ${item.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.amount > 0 ? "+" : ""}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Splits calculator */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/40 pb-2">
              Royalties Calculator
            </h3>

            <div className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-xs">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4.5 h-4.5" />
                Active Share Split: {commPct}%
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                Simulated Sale Price (INR)
              </label>
              <input
                type="number"
                value={testGross}
                onChange={(e) => setTestGross(parseInt(e.target.value) || 0)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400 border-t border-slate-50 dark:border-zinc-800/40 pt-4">
              <div className="flex justify-between">
                <span>Payment Gateway fee (2% mock)</span>
                <span>-{formatCurrency(gatewayFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Distributable</span>
                <span>{formatCurrency(netDistributable)}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2"></div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-zinc-200">
                <span>My Earned Share ({commPct}%)</span>
                <span className="text-emerald-600 font-black">{formatCurrency(dealerShare)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Platform Commission ({100 - commPct}%)</span>
                <span>{formatCurrency(adminShare)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
