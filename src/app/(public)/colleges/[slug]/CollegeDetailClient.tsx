"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../../components/layout/Navbar";
import { Footer } from "../../../../components/layout/Footer";
import { useDemo } from "../../../../lib/context";
import { RatingDisplay } from "../../../../components/shared/RatingDisplay";
import { AccessBadge } from "../../../../components/shared/AccessBadge";
import { formatCurrency } from "../../../../lib/storage";
import { DocumentThumbnail } from "../../../../components/shared/DocumentThumbnail";
import {
  Building2,
  GraduationCap,
  BookOpen,
  ChevronRight,
  TrendingUp,
  FileQuestion,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

export default function CollegeDetailClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const collegeId = searchParams.get("id");
  const { colleges, universities, departments, materials, semesters } = useDemo();

  // Find college
  const college = colleges.find(
    (c) => c.id === collegeId || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
  );

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-bold">College Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The college you requested could not be located in our registry.</p>
          <Link href="/colleges" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Return to Colleges
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const university = universities.find((u) => u.id === college.universityId);
  const collegeMaterials = materials.filter(
    (m) => m.collegeId === college.id && m.status === "approved"
  );

  const displayedMaterials = collegeMaterials.filter((m) => {
    if (selectedDept && m.departmentId !== selectedDept) return false;
    if (selectedSem && m.semesterId !== selectedSem) return false;
    return true;
  });

  const popularMaterials = [...collegeMaterials]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 3);

  const collegeDepts = departments.filter((d) =>
    collegeMaterials.some((m) => m.departmentId === d.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* College Banner Header */}
      <section className="bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
          <div className="text-9xl font-black transform rotate-12 translate-x-20 translate-y-10">
            {college.code}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white mb-6 transition-colors"
          >
            &larr; Back to Colleges
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="px-2.5 py-1 bg-white/10 text-indigo-200 border border-white/15 text-[9px] font-bold rounded-lg uppercase tracking-wider block mb-3 self-start">
                Code: {college.code}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {college.name}
              </h1>
              <p className="text-xs text-slate-300 mt-2 flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                Affiliated to: {university?.name} ({university?.code})
              </p>
            </div>

            <div className="flex gap-4 shrink-0 bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl text-center text-xs">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Resources</p>
                <p className="text-lg font-bold text-white mt-0.5">{collegeMaterials.length}</p>
              </div>
              <div className="w-px bg-white/15 self-stretch"></div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Downloads</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {collegeMaterials.reduce((acc, m) => acc + m.downloadCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: Filters and Materials Grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/40 pb-2">
              Filter College Resources
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department Selector shortcut */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {collegeDepts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Semester Selector shortcut */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Semester</label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resources directory grid */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-950 dark:text-zinc-50 tracking-tight">
              Study Materials ({displayedMaterials.length})
            </h2>

            {displayedMaterials.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-md mx-auto my-6">
                <BookOpen className="w-10 h-10 text-slate-400 dark:text-zinc-500 mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-50">No resources matched filters</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2">Try clearing your department or semester selectors.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayedMaterials.map((mat) => (
                  <Link
                    key={mat.id}
                    href={`/material/${mat.slug}`}
                    className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover style */}
                      <DocumentThumbnail material={mat} size="lg" />

                      {/* Content panel */}
                      <div className="p-4 space-y-2">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">
                          {mat.examType} Exam • {mat.examMonth} {mat.examYear}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 line-clamp-1">
                          {mat.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {mat.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40">
                      <RatingDisplay rating={mat.rating} count={mat.reviewCount} size="sm" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        FREE
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT: Popular Resources & Quick Stats */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Trending College materials */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/40 pb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Trending Here
            </h3>

            <div className="space-y-4">
              {popularMaterials.map((mat) => (
                <Link
                  key={mat.id}
                  href={`/material/${mat.slug}`}
                  className="group flex gap-3 items-center"
                >
                  <DocumentThumbnail material={mat} size="sm" />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 transition-colors">
                      {mat.title}
                    </h4>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5 block">
                      {mat.downloadCount} downloads • {mat.subjectCode}
                    </span>
                  </div>
                </Link>
              ))}
              {popularMaterials.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-zinc-500 italic text-center py-4">No trending items yet.</p>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
