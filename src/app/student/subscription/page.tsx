"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { ShieldCheck, Clock, ShieldX, Sparkles, Check, HelpCircle } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { toast } from "sonner";
import Link from "next/link";

export default function StudentSubscriptionPage() {
  const { currentUser, studentProfiles, subscriptionPlans } = useDemo();
  const [cancelOpen, setCancelOpen] = useState(false);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const currentPlan = subscriptionPlans.find((p) => p.id === profile?.subscriptionPlanId);

  const handleCancelSubscription = () => {
    setCancelOpen(false);
    
    // Reset subscription in student profiles
    toast.success("Subscription cancellation requested. You will retain access until expiration.");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          My Subscription Plan
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage your membership billing cycle, active benefits, and invoices.
        </p>
      </div>

      {profile?.isSubscribed && currentPlan ? (
        <div className="space-y-6">
          
          {/* Active plan summary banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-indigo-950 shadow-lg">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 text-indigo-300 border border-white/15 text-[10px] font-bold rounded-lg uppercase tracking-wider mb-2">
                  Active Subscription
                </span>
                <h3 className="text-xl font-bold tracking-tight">{currentPlan.name} Plan</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Next billing date: {new Date(profile.subscriptionExpiresAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black">{formatCurrency(currentPlan.price)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">billed monthly</span>
              </div>
            </div>
          </div>

          {/* Plan benefits check list */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 block mb-4 uppercase">
              Included Membership Benefits
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentPlan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cancellation options */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-50">Cancel Plus Membership</h4>
              <p className="text-[11px] text-slate-400 mt-1">If you no longer need study access, you can terminate billing.</p>
            </div>
            <button
              onClick={() => setCancelOpen(true)}
              className="px-4 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold hover:bg-rose-50/50"
            >
              Cancel Billing
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <ShieldX className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-50">No Active Subscription</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You are currently on the Free study plan. Watch ads to download individual resources, or upgrade to Plus to download everything ad-free.
          </p>
          <div className="pt-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
            >
              View Pricing Options &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Confirmation cancel modal dialog */}
      <ConfirmDialog
        isOpen={cancelOpen}
        title="Cancel Membership Billing"
        message="Are you sure you want to cancel your EduVault subscription? You will continue to have premium ad-free study access until the current term expires."
        confirmText="Yes, Cancel Billing"
        cancelText="No, Keep Plan"
        type="danger"
        onConfirm={handleCancelSubscription}
        onCancel={() => setCancelOpen(false)}
      />

    </div>
  );
}
