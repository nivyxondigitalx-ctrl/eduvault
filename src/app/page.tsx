"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useDemo } from "../lib/context";
import { RatingDisplay } from "../components/shared/RatingDisplay";
import { AccessBadge } from "../components/shared/AccessBadge";
import { formatCurrency } from "../lib/storage";
import {
  Search,
  BookOpen,
  FileQuestion,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Megaphone,
  UserCheck,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    universities,
    colleges,
    departments,
    semesters,
    subjects,
    materials,
    subscriptionPlans,
  } = useDemo();

  // Search filter states
  const [selectedUniv, setSelectedUniv] = useState("");
  const [selectedColl, setSelectedColl] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSubj, setSelectedSubj] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedUniv) query.set("univ", selectedUniv);
    if (selectedColl) query.set("coll", selectedColl);
    if (selectedDept) query.set("dept", selectedDept);
    if (selectedSem) query.set("sem", selectedSem);
    if (selectedSubj) query.set("subj", selectedSubj);
    if (searchKeyword) query.set("q", searchKeyword);
    router.push(`/browse?${query.toString()}`);
  };

  const filteredColleges = colleges;
  const filteredSubjects = subjects.filter(
    (s) => (!selectedDept || s.departmentId === selectedDept) && (!selectedSem || s.semesterId === selectedSem)
  );

  // Trending & Recent Question Papers
  const trendingMaterials = materials.filter(m => m.status === "approved").slice(0, 4);
  const recentQPs = materials
    .filter((m) => m.category === "question_paper" && m.status === "approved")
    .slice(0, 4);

  const categoryCards = [
    { label: "Study Materials", type: "study_material", icon: BookOpen, color: "from-blue-500 to-indigo-500", count: 8 },
    { label: "Lecture Notes", type: "notes", icon: FileText, color: "from-indigo-500 to-purple-500", count: 12 },
    { label: "Question Papers", type: "question_paper", icon: FileQuestion, color: "from-purple-500 to-pink-500", count: 15 },
    { label: "Important Qs", type: "important_questions", icon: Sparkles, color: "from-amber-500 to-orange-500", count: 6 },
    { label: "Model Answers", type: "model_answer", icon: ShieldCheck, color: "from-emerald-500 to-teal-500", count: 8 },
    { label: "Answer Keys", type: "answer_key", icon: Clock, color: "from-rose-500 to-pink-500", count: 7 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-50/70 via-white to-transparent dark:from-indigo-950/20 dark:via-zinc-950 dark:to-transparent py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> India's Curated College Materials Directory
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight max-w-4xl mx-auto">
            Everything You Need to Prepare,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
              Organized College by College
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Instant downloads for board exams, internal test notes, solved university questions, and verified model answer keys authored by student rankers and professors.
          </p>

          {/* Simple Global Search Panel */}
          <div className="mt-12 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search all materials (e.g. CS3351, Data Structures, Question Papers)..."
                className="block w-full pl-12 pr-32 py-4 sm:py-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm sm:text-base font-medium rounded-full shadow-xl shadow-slate-200/50 dark:shadow-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Search
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Quick category cards grid */}
      <section className="py-12 bg-slate-50/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-950 dark:text-zinc-50 mb-8 tracking-tight text-center sm:text-left">
            Quick Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.type}
                  href={`/browse?category=${cat.type}`}
                  className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 dark:border-zinc-800/80 dark:hover:border-indigo-900 shadow-sm hover:shadow-md transition-all flex flex-col text-center"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-1">
                    {cat.count} files
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending resources */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-zinc-50 tracking-tight">
                Trending Study Materials
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Highest downloaded resources prepared for the upcoming board examinations.
              </p>
            </div>
            <Link
              href="/browse?sort=downloadCount"
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingMaterials.map((mat) => (
              <Link
                key={mat.id}
                href={`/material/${mat.slug}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                {/* Visual Cover Style */}
                <div className={`aspect-[16/10] bg-gradient-to-tr ${mat.thumbnailStyle} p-4 flex flex-col justify-between text-white relative`}>
                  <span className="self-start px-2 py-0.5 bg-white/20 text-[9px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                    {mat.category.replace("_", " ")}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest font-mono">
                      {mat.subjectCode}
                    </span>
                    <h3 className="font-bold text-sm leading-tight mt-0.5 line-clamp-2">
                      {mat.title}
                    </h3>
                  </div>
                </div>

                {/* Metadata body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 block uppercase tracking-wider font-semibold">
                      {mat.examType} Exam • {mat.examMonth} {mat.examYear}
                    </span>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 truncate max-w-[150px]">
                        {colleges.find((c) => c.id === mat.collegeId)?.name || "College"}
                      </span>
                      <RatingDisplay rating={mat.rating} size="sm" />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      {mat.accessModes.map(mode => (
                        <AccessBadge key={mode} mode={mode} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-slate-950 dark:text-zinc-50 tracking-tight mb-4">
            How Accessing Material Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mb-12">
            EduVault matches multiple study methods and budgets so you never fall behind in exam prep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Free Mode</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Download Directly</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Free resources are uploaded directly by colleges and departments. Anyone can view and download them instantly without ads.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Ad Unlock</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Simulated countdown</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Watch a simulated 10-second advertisement to unlock premium content for 24 hours. Limit of 3 ad unlocks per day.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Buy Premium</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Permanent Ownership</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Purchase single items directly. Purchased material goes straight to your personal library permanently with lifetime updates.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Subscribe</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">All-Inclusive Pass</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Become a Plus Member for ad-free interface and unlimited downloads of subscription-eligible guides and codes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Subscription promotions */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 dark:from-indigo-950 dark:to-zinc-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 border border-indigo-950">
            
            {/* Background glowing gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px]"></div>

            <div className="space-y-4 max-w-md">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                Subscribers Pool Deal
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Unlock Study Library Ad-Free
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Join thousands of students from Anna University and Madras University using Plus Pass. Subscriptions pools are shared with authors based on active monthly downloads.
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-zinc-100 rounded-xl text-center text-xs font-bold shadow-lg transition-all"
              >
                View Pricing Plans
              </Link>
              <span className="text-[10px] text-center text-zinc-400 font-medium">
                Starting from ₹199/month
              </span>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
