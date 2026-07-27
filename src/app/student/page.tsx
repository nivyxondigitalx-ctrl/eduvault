"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "../../lib/context";
import { RatingDisplay } from "../../components/shared/RatingDisplay";
import { AccessBadge } from "../../components/shared/AccessBadge";
import { formatCurrency } from "../../lib/storage";
import { DocumentThumbnail } from "../../components/shared/DocumentThumbnail";
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
  Flame,
  BrainCircuit,
  Trophy,
  Target,
  Zap,
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

      {/* EduPlus Imported AI Study Suite & Streak Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">EduPlus AI Study Hub</span>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Personalized Study Arsenal</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active Mode</span>
              </h3>
            </div>
          </div>
          <Link
            href="/student/trophies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-black text-xs transition-transform active:scale-95 shadow-lg"
          >
            <Trophy className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Trophy Room & XP Leaderboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/student/tests"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">Smart Practice Test Room</h4>
              <p className="text-xs text-slate-300 leading-normal">Generate real-time MCQs, short answers, & essays directly from syllabus topics.</p>
            </div>
            <div className="mt-4 text-[11px] font-bold text-indigo-400 flex items-center gap-1">
              <span>Launch Quiz Suite &rarr;</span>
            </div>
          </Link>

          <Link
            href="/student/revision"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">AI Revision & Flashcards</h4>
              <p className="text-xs text-slate-300 leading-normal">Synthesize instant exam cheat-sheets and Q&A flashcards for rapid memorization.</p>
            </div>
            <div className="mt-4 text-[11px] font-bold text-purple-400 flex items-center gap-1">
              <span>Generate Cheat Sheets &rarr;</span>
            </div>
          </Link>

          <Link
            href="/student/study-plan"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">Study Plan & Grammar Coach</h4>
              <p className="text-xs text-slate-300 leading-normal">Schedule 7-day exam prep countdowns and improve academic writing scores.</p>
            </div>
            <div className="mt-4 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span>Plan & Enhance &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Download Alert & Quick Info */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
              Direct & Free Downloads Enabled
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 leading-relaxed max-w-2xl">
              All board exam study notes, lab manuals, and question papers on KalviNest are now completely free to view and download directly.
            </p>
          </div>
          <Link
            href="/browse"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-md shadow-emerald-100 dark:shadow-none"
          >
            Start Downloading Notes
          </Link>
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
                <DocumentThumbnail material={mat} size="sm" />
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
                <DocumentThumbnail material={mat} size="sm" />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 truncate">
                    {mat.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{mat.subjectCode}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-2 block">
                    FREE
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
