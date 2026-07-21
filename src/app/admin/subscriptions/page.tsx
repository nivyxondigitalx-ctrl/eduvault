"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { ShieldCheck, Plus, Edit, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminSubscriptionsPage() {
  const { subscriptionPlans, manageSubscriptionPlan } = useDemo();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(199);
  const [duration, setDuration] = useState(1);
  const [discount, setDiscount] = useState(10);
  const [features, setFeatures] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    manageSubscriptionPlan("create", {
      id: "plan-" + name.toLowerCase().replace(/\s+/g, ""),
      name,
      price,
      durationMonths: duration,
      downloadLimit: 100,
      discountPercentage: discount,
      features: features.split(",").map(f => f.trim()).filter(Boolean),
      activeSubscribers: 0,
    });

    toast.success("Subscription plan updated successfully!");
    setName("");
    setFeatures("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Subscription Plan Configurator
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure student membership tires, discount values, and subscription benefits.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl max-w-md shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-800 dark:text-zinc-155">
            Create Subscription Plan
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Gold Pass"
                className="block w-full px-3 py-2 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="block w-full px-2 py-2 bg-slate-50 border-0 text-slate-900 text-xs rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Months</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="block w-full px-2 py-2 bg-slate-50 border-0 text-slate-900 text-xs rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Discount %</label>
                <input
                  type="number"
                  required
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="block w-full px-2 py-2 bg-slate-50 border-0 text-slate-900 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Features (Comma separated)</label>
              <input
                type="text"
                required
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Unlimited downloads, Ad-free interface"
                className="block w-full px-3 py-2 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">Save Plan</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Plans List cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-50 capitalize">{plan.name}</h3>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">Subscribers: {plan.activeSubscribers}</p>
              
              <div className="my-4">
                <span className="text-xl font-black text-slate-950 dark:text-zinc-50">{formatCurrency(plan.price)}</span>
                <span className="text-[10px] text-slate-400"> / {plan.durationMonths} months</span>
              </div>

              <ul className="text-[10px] text-slate-500 space-y-2 border-t pt-4">
                {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
