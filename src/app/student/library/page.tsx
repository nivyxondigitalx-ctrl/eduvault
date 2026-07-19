"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDemo } from "../../../lib/context";
import { RatingDisplay } from "../../../components/shared/RatingDisplay";
import { formatCurrency } from "../../../lib/storage";
import { BookOpen, Download, Eye, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type LibraryTab = "all" | "purchased" | "subscription" | "ad_unlock" | "free";

export default function StudentLibraryPage() {
  const { currentUser, studentProfiles, materials, colleges } = useDemo();
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  // Filtered materials inside library
  const unlockedIds = profile?.unlockedMaterialIds || [];
  const libraryMaterials = materials.filter((m) =>
    m.status === "approved" && (m.price === 0 || unlockedIds.includes(m.id) || (m.subscriptionEligible && profile?.isSubscribed))
  );

  const getFilteredMaterials = () => {
    switch (activeTab) {
      case "purchased":
        return libraryMaterials.filter((m) => m.price > 0 && !m.subscriptionEligible && unlockedIds.includes(m.id));
      case "subscription":
        return libraryMaterials.filter((m) => m.subscriptionEligible && profile?.isSubscribed);
      case "ad_unlock":
        return libraryMaterials.filter((m) => m.price > 0 && m.accessModes.includes("ad_unlock") && unlockedIds.includes(m.id));
      case "free":
        return libraryMaterials.filter((m) => m.price === 0);
      case "all":
      default:
        return libraryMaterials;
    }
  };

  const displayedList = getFilteredMaterials();

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Mock PDF Download initiated: "${title}"`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          My Study Library
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Access all solved question papers, notes, and handouts currently unlocked on your account.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800 pb-3 gap-6 flex-wrap">
        {(["all", "purchased", "subscription", "ad_unlock", "free"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative capitalize ${
              activeTab === tab
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.replace("_", " ")}
            {activeTab === tab && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {displayedList.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Unlocked Materials</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            You don't have any resources in this tab. Navigate to the marketplace to download free items, unlock with ads, or buy premium files.
          </p>
          <Link
            href="/browse"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow"
          >
            Browse Materials Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedList.map((mat) => (
            <Link
              key={mat.id}
              href={`/material/${mat.slug}`}
              className="group bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex gap-3 items-center overflow-hidden">
                <div className={`w-10 h-14 rounded-lg bg-gradient-to-tr ${mat.thumbnailStyle} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                  {mat.subjectCode.slice(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[8px] bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {mat.category.replace("_", " ")}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 mt-1 truncate">
                    {mat.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                    {mat.subjectCode} • {colleges.find(c => c.id === mat.collegeId)?.code || "KSRCT"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={(e) => handleDownload(e, mat.title)}
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <div className="p-2 border border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 rounded-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
