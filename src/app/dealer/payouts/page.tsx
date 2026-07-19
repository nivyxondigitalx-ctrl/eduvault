"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { CheckCircle, Clock, Send, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function DealerPayoutsPage() {
  const { dealers, currentUser, payouts, requestPayout } = useDemo();
  
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState<"Bank Transfer" | "UPI">("UPI");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);
  const myPayouts = payouts.filter((p) => p.dealerId === dealerProfile?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) {
      toast.error("Please fill in UPI ID or bank account specifications.");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const res = await requestPayout(amount, method, details);
      if (res.success) {
        toast.success("Payout request submitted successfully!");
        setAmount(500);
        setDetails("");
      } else {
        toast.error(res.error || "Failed to submit payout.");
      }
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Request Balances Payout
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Transfer accumulated available earnings balance directly to your bank account or UPI ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT: Payout Form */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 block mb-2 uppercase">
            New Payout Request
          </span>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Payout Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
                <span className="text-[9px] text-slate-400 mt-1 block font-medium">
                  Available Balance: {formatCurrency(dealerProfile?.availableBalance || 0)} (Min: ₹500)
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Transfer Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="UPI">UPI Transfer</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {method === "UPI" ? "UPI ID details" : "Bank Name, Account number, and IFSC code"}
              </label>
              <input
                type="text"
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={method === "UPI" ? "e.g. sanjay@oksbi" : "e.g. HDFC bank, A/C: 1234567890, IFSC: HDFCN000123"}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1"
            >
              {loading ? "Submitting..." : "Send Request"} <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* RIGHT: Rules */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b pb-2">
            Payout Parameters
          </span>
          <ul className="text-[10px] text-slate-500 space-y-2 leading-relaxed">
            <li>• Maximum payout limit is your total available balance.</li>
            <li>• Payout requests are verified by Main Admins weekly.</li>
            <li>• Standard processing time is 2-3 business bank days.</li>
          </ul>
        </div>

      </div>

      {/* Requests History List */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Payout Request History ({myPayouts.length})
        </h3>
        
        {myPayouts.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No payout requests submitted yet.</p>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3">Requested At</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                  {myPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                      <td className="p-3">
                        {new Date(p.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-zinc-100">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="p-3">
                        {p.paymentMethod}
                      </td>
                      <td className="p-3 font-mono text-[10px] truncate max-w-[200px]">
                        {p.paymentDetails}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                          p.status === "pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                        }`}>
                          {p.status === "pending" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
