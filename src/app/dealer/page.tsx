"use client";

import React from "react";
import { useDemo } from "../../lib/context";
import { formatCurrency } from "../../lib/storage";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function DealerDashboardOverview() {
  const { currentUser, dealers, materials, orders, ledger } = useDemo();

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);
  const myMaterials = materials.filter((m) => m.dealerId === dealerProfile?.id);
  
  const approvedCount = myMaterials.filter((m) => m.status === "approved").length;
  const pendingCount = myMaterials.filter((m) => m.status === "pending").length;
  const totalDownloads = myMaterials.reduce((acc, m) => acc + m.downloadCount, 0);

  const myLedger = ledger.filter((l) => l.dealerId === dealerProfile?.id);
  const recentSales = myLedger.filter((l) => l.type === "sale").slice(0, 5);

  // Chart data: simulate daily revenue for the past 6 days
  const chartData = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2400 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 3200 },
    { day: "Fri", sales: 2800 },
    { day: "Sat", sales: 4200 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Stats Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Dealer Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Welcome back, {currentUser?.name}. Manage your publishes, track payouts, and analyze sales.
          </p>
        </div>
        <Link
          href="/dealer/materials/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 shrink-0"
        >
          Upload New File
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Approved Files</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{approvedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Pending Reviews</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Net Earnings</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{formatCurrency(dealerProfile?.netEarnings || 0)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Total Downloads</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{totalDownloads}</p>
          </div>
        </div>

      </div>

      {/* Main Charts & Payouts Splits Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Charts area */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Revenue Analytics
            </span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-50">
              Weekly Revenue Distribution (INR)
            </h3>
          </div>
          
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout balance card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
              Balances Overview
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-50">Available Balance</h4>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
                {formatCurrency(dealerProfile?.availableBalance || 0)}
              </p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-xs">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4.5 h-4.5" />
                Net Share split: {dealerProfile?.commissionPercentage}%
              </span>
              <p className="mt-1 leading-normal text-[10px]">
                Commission assigned by Main Admin. Earned royalties are paid to UPI or Bank accounts.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 dark:border-zinc-800/40">
            <Link
              href="/dealer/payouts"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none block"
            >
              Request Payout
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Ledger Entries */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Recent Royalties & Payout Ledger
          </h3>
          <Link
            href="/dealer/earnings"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Full Earnings Ledger
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No recent sales or payout records found.</p>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {recentSales.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-zinc-200">{item.description}</p>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                        Ref: {item.referenceId} • {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 shrink-0 ml-4">
                    +{formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
