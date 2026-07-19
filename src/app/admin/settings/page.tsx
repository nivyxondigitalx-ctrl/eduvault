"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { updateProfile, currentUser } = useDemo();
  
  const [name, setName] = useState(currentUser?.name || "");
  const [platformFee, setPlatformFee] = useState(25);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    setTimeout(() => {
      updateProfile(name);
      setSaving(false);
      toast.success("Admin profile settings updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          System Control & Config
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Configure platform transaction parameters and manage system databases.
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <form onSubmit={handleSave} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Account Email (Read-only)
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
              Admin Contact Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Default Platform Transaction Cut (%)
            </label>
            <input
              type="number"
              required
              value={platformFee}
              onChange={(e) => setPlatformFee(parseInt(e.target.value) || 0)}
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
            <span className="text-[9px] text-slate-400 mt-1 block">
              Configures platform commission cut applied by default to new Content Provider application commissions.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50 transition-all flex items-center justify-center gap-1"
          >
            {saving ? "Saving configurations..." : "Save Config"} <Save className="w-4 h-4" />
          </button>

        </form>
      </div>

    </div>
  );
}
