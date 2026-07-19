"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { useDemo } from "../../../lib/context";
import { Search, GraduationCap, Building2, ChevronRight, BookOpen } from "lucide-react";

export default function CollegesPage() {
  const { universities, colleges, materials } = useDemo();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-4">
            <Building2 className="w-3.5 h-3.5" /> Affiliate Network Directories
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Colleges & Affiliates Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            Search for your institution to discover notes, course handouts, and previous years' question papers specifically curated for your syllabus.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative rounded-2xl shadow-sm max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by college name, abbreviation (e.g. KSRCT, KSRCE)"
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-xs font-semibold rounded-2xl"
            />
          </div>
        </div>

        {/* Grouped by University */}
        <div className="space-y-10">
          {universities.map((univ) => {
            const univColleges = filteredColleges.filter((c) => c.universityId === univ.id);
            if (univColleges.length === 0) return null;

            return (
              <div key={univ.id} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50">
                    {univ.name} ({univ.code})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {univColleges.map((coll) => {
                    const materialCount = materials.filter(m => m.collegeId === coll.id && m.status === "approved").length;
                    // For slug, convert name to lowercase dashed
                    const collegeSlug = coll.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

                    return (
                      <Link
                        key={coll.id}
                        href={`/colleges/${collegeSlug}?id=${coll.id}`}
                        className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 dark:border-zinc-800/80 dark:hover:border-indigo-900 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold mb-1">
                            CODE: {coll.code}
                          </span>
                          <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 transition-colors">
                            {coll.name}
                          </h3>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium flex items-center gap-1 mt-2">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            {materialCount} study files
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
