"use client";

import React from "react";
import { useDemo } from "../../lib/context";
import { formatCurrency } from "../../lib/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardOverview() {
  const { users, dealers, materials, studentProfiles, orders, payouts } = useDemo();

  const totalUsers = users.length;
  const activeSubscribers = Object.values(studentProfiles).filter((p) => p.isSubscribed).length;
  const pendingDealers = dealers.filter((d) => d.status === "pending").length;
  const pendingModerations = materials.filter((m) => m.status === "pending").length;

  const totalGMV = orders.reduce((acc, o) => acc + o.grossAmount, 0);
  const totalGatewayFees = orders.reduce((acc, o) => acc + o.gatewayFee, 0);
  
  // Platform net earnings = Gross order sums - dealer shares
  // Simplification for demo: 25% average platform cut
  const platformRevenue = Math.round(totalGMV * 0.25);
  const dealerPayables = totalGMV - platformRevenue - totalGatewayFees;

  // Chart data: monthly GMV distributions
  const monthlyGMV = [
    { month: "Jan", gmv: 15000, revenue: 3750 },
    { month: "Feb", gmv: 22000, revenue: 5500 },
    { month: "Mar", gmv: 18000, revenue: 4500 },
    { month: "Apr", gmv: 34000, revenue: 8500 },
    { month: "May", gmv: 29000, revenue: 7250 },
    { month: "Jun", gmv: 42000, revenue: 10500 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Admin Console Overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Platform-wide diagnostics. Moderate content uploads, adjust dealer commissions, and approve payout batches.
        </p>
      </div>

      {/* KPI Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Subscribers</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{activeSubscribers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Pending Reviews</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{pendingModerations}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Gross GMV</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{formatCurrency(totalGMV)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Platform Cut</span>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-50 mt-0.5">{formatCurrency(platformRevenue)}</p>
          </div>
        </div>

      </div>

      {/* Moderation Alerts Banner */}
      {pendingModerations > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>There are {pendingModerations} new college study guides awaiting moderation review.</span>
          </div>
          <Link
            href="/admin/materials"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
          >
            Review Queue
          </Link>
        </div>
      )}

      {/* Recharts GMV Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Sales Volume
            </span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-50">
              Monthly Platform GMV vs Net Platform Revenue
            </h3>
          </div>
          
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGMV}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                <Bar dataKey="gmv" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Gross GMV" />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="Net Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Pending Queue status */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Dealer Payables
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-50">Accumulated Dealer Balance</h4>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
                {formatCurrency(dealerPayables)}
              </p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-1">
              <span className="font-bold block">Dealers application:</span>
              <p className="text-[10px] text-indigo-600 leading-normal">
                {pendingDealers} dealers are awaiting KYC approval reviews.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 dark:border-zinc-800/40">
            <Link
              href="/admin/dealers"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-bold shadow block"
            >
              Manage Dealer Network
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Orders List */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Recent Platform Transactions
        </h3>
        
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No transaction logs available.</p>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {orders.slice(0, 4).map((ord) => (
                <div key={ord.id} className="p-4 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-zinc-200">Order from student: {ord.studentName}</p>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                      ID: {ord.orderNumber} • Method: {ord.paymentMethod} • Date: {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-zinc-50 shrink-0 ml-4">
                    {formatCurrency(ord.netAmount)}
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
