"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "../../lib/context";
import { RatingDisplay } from "../../components/shared/RatingDisplay";
import { AccessBadge } from "../../components/shared/AccessBadge";
import { formatCurrency } from "../../lib/storage";
import {
  GraduationCap,
  Play,
  Heart,
  FolderOpen,
  Calendar,
  AlertCircle,
  FileQuestion,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

export default function StudentDashboardOverview() {
  const {
    currentUser,
    studentProfiles,
    colleges,
    materials,
    universities,
    departments,
    semesters,
    wishlist,
  } = useDemo();

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const college = colleges.find((c) => c.id === profile?.collegeId);
  const university = universities.find((u) => u.id === profile?.universityId);
  const department = departments.find((d) => d.id === profile?.departmentId);
  const semester = semesters.find((s) => s.id === profile?.semesterId);

  // Student saved list
  const savedMaterials = materials.filter((m) => wishlist.includes(m.id));

  // Library materials
  const unlockedMaterials = materials.filter((m) =>
    profile?.unlockedMaterialIds?.includes(m.id)
  );

  const adUnlocksRemaining = 3 - (profile?.adUnlocksCountToday || 0);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-indigo-100 dark:shadow-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
            Academic Term Info
          </span>
          <h2 className="text-xl sm:text-3xl font-black">
            Welcome back, {currentUser?.name}!
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl">
            {college ? `${college.name} (${college.code})` : "Please complete your educational classification profile."}
          </p>
          {semester && department && (
            <div className="flex gap-4 pt-4 text-xs font-semibold">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl">{semester.name}</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl">{department.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Alert & Ads Unlocks Remaining */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Ads unlocks quota card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              Ad-Unlock Daily Quota
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-50">
              Free Daily Document Passes
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Unlock premium dealer files by watching simulated 10-second advertisements. Valid for 24 hours.
            </p>
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-zinc-50">
              {adUnlocksRemaining}
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase">
              remaining today
            </span>
          </div>
        </div>

        {/* Subscription status card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              Subscription Status
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-50">
              Plus Membership Plan
            </h3>
            
            {profile?.isSubscribed ? (
              <div className="mt-2 text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Active Member</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Expires: {new Date(profile.subscriptionExpiresAt).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Free Tier Account</p>
                  <p className="text-[10px] text-indigo-600 mt-0.5">Upgrade for ad-free downloads & answer keys.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 dark:border-zinc-800/40">
            <Link
              href="/pricing"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5"
            >
              {profile?.isSubscribed ? "Extend Membership" : "Upgrade to Plus"} &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* Library items index */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Recently Unlocked & Studied
          </h3>
          <Link
            href="/student/library"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            All Library Files
          </Link>
        </div>

        {unlockedMaterials.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-md mx-auto">
            <GraduationCap className="w-10 h-10 text-slate-400 dark:text-zinc-500 mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Library is empty</p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Unlock premium documents by browsing the catalog.</p>
            <Link href="/browse" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
              Browse Materials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedMaterials.slice(0, 3).map((mat) => (
              <Link
                key={mat.id}
                href={`/material/${mat.slug}`}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 flex gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-10 h-14 rounded-lg bg-gradient-to-tr ${mat.thumbnailStyle} text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm`}>
                  {mat.subjectCode.slice(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {mat.category.replace("_", " ")}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 mt-1.5 truncate">
                    {mat.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{mat.subjectCode}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Saved items list */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Saved / Wishlisted Guides ({savedMaterials.length})
        </h3>
        
        {savedMaterials.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic py-2">No saved items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedMaterials.slice(0, 3).map((mat) => (
              <Link
                key={mat.id}
                href={`/material/${mat.slug}`}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 flex gap-3 shadow-sm hover:shadow-md transition-all animate-fade-in"
              >
                <div className={`w-10 h-14 rounded-lg bg-gradient-to-tr ${mat.thumbnailStyle} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                  {mat.subjectCode.slice(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 truncate">
                    {mat.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{mat.subjectCode}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-2 block">
                    {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
