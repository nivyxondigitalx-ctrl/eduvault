"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { GraduationCap, Building2, Plus, Trash2, Edit, CheckCircle, Ban, X } from "lucide-react";
import { toast } from "sonner";

type TaxType = "university" | "college" | "course" | "department" | "regulation" | "subject";

export default function AdminTaxonomyPage() {
  const {
    universities,
    colleges,
    departments,
    regulations,
    semesters,
    subjects,
    manageTaxonomy,
    materials,
  } = useDemo();

  const [activeTab, setActiveTab] = useState<TaxType>("university");
  
  // Add item form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState(""); // universityId or departmentId depending on type

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    let payload: any = { name, code, status: "active" as const };
    if (activeTab === "college") {
      if (!parentId) {
        toast.error("Please select an affiliate University.");
        return;
      }
      payload.universityId = parentId;
    } else if (activeTab === "subject") {
      if (!parentId) {
        toast.error("Please select a Department.");
        return;
      }
      payload.departmentId = parentId;
      payload.semesterId = "sem-3";
    }

    manageTaxonomy(activeTab, "create", payload);
    toast.success(`New ${activeTab} item created successfully!`);
    
    // Reset
    setName("");
    setCode("");
    setParentId("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string, type: TaxType) => {
    // Prevent deletion check: check if any materials link to this taxonomy node
    const isLinked = materials.some((m) => {
      if (type === "university") return m.universityId === id;
      if (type === "college") return m.collegeId === id;
      if (type === "department") return m.departmentId === id;
      if (type === "subject") return m.subjectId === id;
      return false;
    });

    if (isLinked) {
      toast.error(`Cannot delete this ${type}. Active study materials are currently linked to it.`);
      return;
    }

    manageTaxonomy(type, "delete", { id });
    toast.info(`${type} item removed.`);
  };

  const handleStatusToggle = (item: any, type: TaxType) => {
    const updatedStatus = item.status === "active" ? ("inactive" as const) : ("active" as const);
    manageTaxonomy(type, "update", { ...item, status: updatedStatus });
    toast.info(`Status toggled to ${updatedStatus} for: ${item.name}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Academic Taxonomy Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage institutional networks, departments syllabus mappings, and subject codes.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800 pb-3 gap-6 flex-wrap">
        {(["university", "college", "department", "subject"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAddForm(false);
            }}
            className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative capitalize ${
              activeTab === tab
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Form add modal */}
      {showAddForm && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-3xl max-w-md shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-800 dark:text-zinc-50">
            Create New {activeTab}
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Name of ${activeTab}`}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Abbreviation / Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AU, CS3351, KSRCT"
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl"
              />
            </div>

            {/* Parent relations */}
            {activeTab === "college" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Affiliate University</label>
                <select
                  required
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select University</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "subject" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Associated Department</label>
                <select
                  required
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Save Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directory listing table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-3">Item Details</th>
              <th className="p-3">Abbreviation Code</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Delete Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
            {/* Render items based on activeTab */}
            {activeTab === "university" &&
              universities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{item.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleStatusToggle(item, "university")}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(item.id, "university")} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === "college" &&
              colleges.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{item.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleStatusToggle(item, "college")}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(item.id, "college")} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === "department" &&
              departments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{item.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleStatusToggle(item, "department")}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(item.id, "department")} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === "subject" &&
              subjects.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{item.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleStatusToggle(item, "subject")}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(item.id, "subject")} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
