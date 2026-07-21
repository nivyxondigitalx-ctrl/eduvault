"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { Megaphone, Plus, Eye, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminAdvertisementsPage() {
  const { adCampaigns, manageAdCampaign } = useDemo();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [placement, setPlacement] = useState<"modal" | "sidebar" | "banner">("modal");
  const [estRev, setEstRev] = useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !advertiser) return;

    manageAdCampaign("create", {
      id: "ad-" + Math.floor(100 + Math.random() * 900),
      name,
      advertiser,
      status: "active" as const,
      placement,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      impressions: 0,
      completions: 0,
      estimatedRevenue: estRev,
    });

    toast.success("Ad campaign added successfully!");
    setName("");
    setAdvertiser("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Ad Campaign Control Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure sponsored prep materials banners, interstitial modals, and watch statistics.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl max-w-md shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-800 dark:text-zinc-50">
            Create Campaign
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. UPSC prep test series"
                className="block w-full px-3 py-2 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Advertiser</label>
              <input
                type="text"
                required
                value={advertiser}
                onChange={(e) => setAdvertiser(e.target.value)}
                placeholder="e.g. Unacademy"
                className="block w-full px-3 py-2 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Placement</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border-0 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  <option value="modal">Interstitial Modal</option>
                  <option value="banner">Inline Banner</option>
                  <option value="sidebar">Sidebar Card</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Revenue (INR)</label>
                <input
                  type="number"
                  required
                  value={estRev}
                  onChange={(e) => setEstRev(parseInt(e.target.value) || 0)}
                  className="block w-full px-2 py-2 bg-slate-50 border-0 text-slate-900 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">Save Campaign</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns list Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Campaign / advertiser</th>
                <th className="p-3">Placement</th>
                <th className="p-3">Status</th>
                <th className="p-3">Impressions</th>
                <th className="p-3">Completions</th>
                <th className="p-3 text-right">Est. Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {adCampaigns.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3">
                    <span className="font-bold block">{ad.name}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{ad.advertiser}</span>
                  </td>
                  <td className="p-3 uppercase font-semibold text-[10px]">{ad.placement}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${ad.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{ad.impressions}</td>
                  <td className="p-3 font-bold">{ad.completions}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-zinc-50">{formatCurrency(ad.estimatedRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
