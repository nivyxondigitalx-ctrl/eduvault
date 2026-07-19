"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { FileText, Eye, CheckCircle, Clock, X, AlertCircle } from "lucide-react";

export default function StudentOrdersPage() {
  const { orders, currentUser } = useDemo();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const studentOrders = orders.filter((o) => o.studentId === currentUser?.id);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Order Invoices & History
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          View past purchases, digital transaction records, and download VAT invoice drafts.
        </p>
      </div>

      {studentOrders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Orders Found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            You haven't completed any digital checkouts on this account.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                {studentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {ord.items.length} materials
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-zinc-100">
                      {formatCurrency(ord.netAmount)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
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
      )}

      {/* Invoice Detail Modal Drawer */}
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
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Invoice Receipt</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-1">
                  Order ID: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>

              {/* Items listing */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Purchased Materials</span>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-xs bg-slate-50 dark:bg-zinc-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/40">
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{item.title}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Dealer ID: {item.dealerId}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-zinc-100 shrink-0 ml-4">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial breakups */}
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Gross Total</span>
                  <span>{formatCurrency(selectedOrder.grossAmount)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discounts Applied</span>
                    <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (18% GST)</span>
                  <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-zinc-800/60 my-2"></div>
                <div className="flex justify-between font-black text-slate-900 dark:text-zinc-50 text-sm">
                  <span>Amount Paid ({selectedOrder.paymentMethod})</span>
                  <span>{formatCurrency(selectedOrder.netAmount)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2 border-t border-slate-100 dark:border-zinc-800/50 mt-4 text-[10px] text-slate-400 italic">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Simulated receipt for educational project evaluations. Gateway codes bypassed.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
