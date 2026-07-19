"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { DollarSign, Eye, X, ShieldAlert, AlertCircle } from "lucide-react";

export default function AdminPaymentSplitsPage() {
  const { orders, dealers, materials } = useDemo();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Split recap drawer calculator helper
  const getOrderSplits = (order: any) => {
    if (!order) return [];

    return order.items.map((item: any) => {
      const dlr = dealers.find((d) => d.id === item.dealerId);
      const commPct = dlr ? dlr.commissionPercentage : 70;
      
      const gross = item.price;
      const discount = item.discount;
      const netDistributable = gross - discount;
      
      const dealerEarning = Math.round(netDistributable * (commPct / 100));
      const adminEarning = netDistributable - dealerEarning;

      return {
        itemTitle: item.title,
        dealerName: dlr ? dlr.name : "Sanjay Kumar",
        commissionPct: commPct,
        gross,
        discount,
        netDistributable,
        dealerEarning,
        adminEarning,
      };
    });
  };

  const splits = selectedOrder ? getOrderSplits(selectedOrder) : [];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Payment Splits & Auditing
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Audit distributable shares, verify transaction gateway deductions, and monitor dealer splits ledger.
        </p>
      </div>

      {/* Orders split list */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Order Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Gross Total</th>
                <th className="p-3">GST Tax Deducted</th>
                <th className="p-3">Gateway Fee</th>
                <th className="p-3">Net Distributable</th>
                <th className="p-3 text-right">Audit splits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {orders.map((ord) => {
                const netDist = ord.grossAmount - ord.discountAmount;
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {ord.orderNumber}
                    </td>
                    <td className="p-3">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {formatCurrency(ord.grossAmount)}
                    </td>
                    <td className="p-3 text-rose-600">
                      -{formatCurrency(ord.taxAmount)}
                    </td>
                    <td className="p-3 text-rose-600">
                      -{formatCurrency(ord.gatewayFee)}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-zinc-50">
                      {formatCurrency(netDist)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 rounded-xl"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split details drawer dialog popup */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 px-6 py-6 text-left shadow-2xl transition-all w-full max-w-lg border border-slate-100 dark:border-zinc-800 z-50">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="border-b pb-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Splits Breakdown Audit</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-1">
                  Order Reference: {selectedOrder.orderNumber}
                </h3>
              </div>

              {/* Items listing breakdown */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {splits.map((split: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/50 text-xs space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{split.itemTitle}</p>
                    <div className="flex justify-between">
                      <span>Dealer:</span>
                      <strong>{split.dealerName} ({split.commissionPct}% Share)</strong>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Dealer Earning split</span>
                      <span>{formatCurrency(split.dealerEarning)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600 font-bold">
                      <span>Admin platform Share</span>
                      <span>{formatCurrency(split.adminEarning)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex items-start gap-2 text-[10px] text-slate-400 mt-4 leading-normal">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>Payout balance splits credit immediately upon transaction completion. Dealer shares can be requested for transfer in payout center.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
