"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export default function StudentSettingsPage() {
  const {
    currentUser,
    studentProfiles,
    universities,
    colleges,
    departments,
    updateProfile,
  } = useDemo();

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  const [name, setName] = useState(currentUser?.name || "");
  const [selectedUniv, setSelectedUniv] = useState(profile?.universityId || "");
  const [selectedColl, setSelectedColl] = useState(profile?.collegeId || "");
  const [selectedDept, setSelectedDept] = useState(profile?.departmentId || "");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    setTimeout(() => {
      updateProfile(name, selectedUniv, selectedColl, selectedDept);
      setSaving(false);
      toast.success("Profile settings updated successfully!");
    }, 800);
  };

  const filteredColleges = colleges.filter((c) => c.universityId === selectedUniv);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Settings & Academic Classification
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Configure your academic details to receive customized subject listings and study updates.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-50 flex items-center gap-2 uppercase tracking-wider">
          <Settings className="w-5 h-5 text-indigo-600 shrink-0" />
          Edit Academic Profile
        </h4>

        <form onSubmit={handleSave} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                University
              </label>
              <select
                value={selectedUniv}
                onChange={(e) => {
                  setSelectedUniv(e.target.value);
                  setSelectedColl("");
                }}
                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-sm rounded-xl"
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                College
              </label>
              <select
                value={selectedColl}
                disabled={!selectedUniv}
                onChange={(e) => setSelectedColl(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-sm rounded-xl disabled:opacity-50"
              >
                <option value="">Select College</option>
                {filteredColleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-sm rounded-xl"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1"
          >
            {saving ? "Saving Changes..." : "Save Classification"} <Save className="w-4 h-4" />
          </button>

        </form>
      </div>

    </div>
  );
}
