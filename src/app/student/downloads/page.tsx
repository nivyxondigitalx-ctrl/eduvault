"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import { BookOpen, Download, AlertCircle, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function StudentDownloadsPage() {
  const { currentUser, studentProfiles, materials } = useDemo();
  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  const unlockedIds = profile?.unlockedMaterialIds || [];
  const downloadedFiles = materials.filter((m) => unlockedIds.includes(m.id));

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Download History
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          View recent downloads and track offline material sync statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Total Downloads</span>
          <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">{downloadedFiles.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Quota Remaining Today</span>
          <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            {profile?.isSubscribed ? "Unlimited (Plus)" : `${3 - (profile?.adUnlocksCountToday || 0)}`}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Subscription Plan</span>
          <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1 capitalize">{profile?.isSubscribed ? "Plus Pass" : "Free Tier"}</p>
        </div>
      </div>

      {downloadedFiles.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Download className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Downloads Found</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You haven't downloaded any documents yet. Unlocked files from your library can be saved to your device.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider">
              Downloaded Files List
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
            {downloadedFiles.map((mat) => (
              <div key={mat.id} className="p-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-10 rounded-lg bg-gradient-to-tr ${mat.thumbnailStyle} text-white flex items-center justify-center font-bold text-[9px]`}>
                    PDF
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{mat.title}</h4>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{mat.subjectCode} • {mat.fileSize}</span>
                  </div>
                </div>

                <button
                  onClick={() => toast.success(`Re-downloading PDF of "${mat.title}"`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg font-semibold"
                >
                  Download Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
