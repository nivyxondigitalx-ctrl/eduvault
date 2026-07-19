"use client";

import React from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { Info, Users, BookOpen, GraduationCap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 text-slate-700 dark:text-zinc-300">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Info className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-none">
              About EduVault
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <p>
              EduVault is a premium digital academic marketplace born out of a desire to simplify student exam preparation. 
              Students across colleges spend hours finding syllabus handouts, notes, and previous question papers. We bring it all together under a single taxonomy.
            </p>
            <p>
              By leveraging a verified content provider network (our dealers), we ensure all answers are complete and accurate. Our business model ensures creators are rewarded fairly through purchases and shared subscription royalties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <Users className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100">Student First</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">Helping students access reference materials in seconds.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <BookOpen className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100">Verified Quality</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">All dealer materials undergo moderation checks before publication.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <GraduationCap className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100">Affiliate Friendly</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">Fully mapped to university structure and semester timetables.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
