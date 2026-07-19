"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { AccessBadge } from "../../../components/shared/AccessBadge";
import { formatCurrency } from "../../../lib/storage";
import {
  FileText,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type StatusTab = "all" | "approved" | "pending" | "draft" | "rejected";

export default function DealerMaterialsPage() {
  const { materials, dealers, currentUser } = useDemo();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);
  const myMaterials = materials.filter((m) => m.dealerId === dealerProfile?.id);

  const filtered = myMaterials.filter((m) => {
    if (activeTab !== "all" && m.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subjectCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDuplicate = (title: string) => {
    toast.success(`Duplicated document configuration for: "${title}"`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            My Solved Materials
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Review status updates from Anna University and Madras University moderators.
          </p>
        </div>
        <Link
          href="/dealer/materials/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Upload Material
        </Link>
      </div>

      {/* Tabs and search bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          
          {/* Status Tabs */}
          <div className="flex border-b border-slate-50 dark:border-zinc-800 pb-1.5 gap-4 overflow-x-auto w-full sm:w-auto">
            {(["all", "approved", "pending", "draft", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative capitalize shrink-0 ${
                  activeTab === tab
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 rounded-xl shadow-sm shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or title..."
              className="block w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 text-xs rounded-xl"
            />
          </div>

        </div>

        {/* Uploaded items listing Table */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 max-w-sm mx-auto space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-zinc-300">No materials matched your filters</p>
            <p className="text-[11px]">Upload solved papers to see them listed in this panel.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Title / Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Access</th>
                  <th className="p-3">Earnings split</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                {filtered.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    
                    <td className="p-3">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-100 line-clamp-1">{mat.title}</p>
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5 block uppercase">
                          {mat.subjectCode} • {mat.fileSize} • {mat.pageCount} pages
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      <StatusBadge status={mat.status} />
                      {mat.status === "rejected" && mat.rejectReason && (
                        <span className="block text-[8px] text-rose-500 font-semibold mt-1">
                          Reason: {mat.rejectReason}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-1">
                        {mat.accessModes.map(mode => (
                          <AccessBadge key={mode} mode={mode} />
                        ))}
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-slate-900 dark:text-zinc-100">
                      {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                    </td>

                    <td className="p-3 font-bold">
                      {mat.downloadCount}
                    </td>

                    <td className="p-3 text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/material/${mat.slug}`}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 rounded-xl"
                          title="Preview document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(mat.title)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 rounded-xl"
                          title="Duplicate configurations"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
