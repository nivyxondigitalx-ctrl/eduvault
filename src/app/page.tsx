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
import { DocumentThumbnail } from "../components/shared/DocumentThumbnail";
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
  Gradient,
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
    { label: "Study Materials", type: "study_material", icon: BookOpen, color: "from-indigo-600 to-violet-600", count: 8 },
    { label: "Lecture Notes", type: "notes", icon: FileText, color: "from-blue-600 to-indigo-600", count: 12 },
    { label: "Question Papers", type: "question_paper", icon: FileQuestion, color: "from-purple-600 to-pink-600", count: 15 },
    { label: "Important Qs", type: "important_questions", icon: Sparkles, color: "from-amber-500 to-orange-500", count: 6 },
    { label: "Model Answers", type: "model_answer", icon: ShieldCheck, color: "from-emerald-500 to-teal-500", count: 8 },
    { label: "Answer Keys", type: "answer_key", icon: Clock, color: "from-rose-500 to-pink-500", count: 7 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 transition-colors duration-500">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glowing Background Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[110px] glow-purple opacity-40 dark:opacity-20 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-[110px] glow-blue opacity-35 dark:opacity-15 pointer-events-none animate-float"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-semibold mb-6 shadow-sm border border-indigo-100/50 dark:border-indigo-900/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Organized exam resources. No more WhatsApp group links hunting.
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-tight max-w-4xl mx-auto">
            Skip the exam panic. Get study materials that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400">
              actually make sense.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Handpicked lecture notes, previous question papers, and solved keys compiled by student rankers and verified professors.
          </p>

          {/* Interactive Multi-Field Search Panel */}
          <div className="mt-12 max-w-4xl mx-auto animate-slide-up">
            <form onSubmit={handleSearch} className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-4">
              
              {/* Keyword Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="What subject or code are you studying today? (e.g. Python, Math, CS3351...)"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-905 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium rounded-2xl transition-all"
                />
              </div>

              {/* Advanced Academic Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={selectedUniv}
                  onChange={(e) => {
                    setSelectedUniv(e.target.value);
                    setSelectedColl("");
                  }}
                  className="w-full px-3 py-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">University</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                <select
                  value={selectedColl}
                  onChange={(e) => setSelectedColl(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  disabled={!selectedUniv}
                >
                  <option value="">College</option>
                  {filteredColleges.filter(c => !selectedUniv || c.universityId === selectedUniv).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedSubj("");
                  }}
                  className="w-full px-3 py-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={selectedSem}
                  onChange={(e) => {
                    setSelectedSem(e.target.value);
                    setSelectedSubj("");
                  }}
                  className="w-full px-3 py-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                  Quick filters let you find materials for your exact syllabus year.
                </span>
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Start Preparing <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Quick category cards grid */}
      <section className="py-16 bg-slate-50/60 dark:bg-zinc-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Study by Category
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              Browse solved answers, practical record scripts, model answer keys, or notes catalogued neatly.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.type}
                  href={`/browse?category=${cat.type}`}
                  className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 dark:border-zinc-800/80 dark:hover:border-indigo-900/80 shadow-sm hover:shadow-md hover-lift flex flex-col text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 font-medium">
                    {cat.count} files
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending resources */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">
                EXAM ESSENTIALS
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
                Trending Study Materials
              </h2>
              <p className="text-xs text-slate-450 dark:text-zinc-550 mt-1">
                Highest downloaded resources prepared for the upcoming university examinations.
              </p>
            </div>
            <Link
              href="/browse?sort=downloadCount"
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingMaterials.map((mat) => (
              <Link
                key={mat.id}
                href={`/material/${mat.slug}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover-lift"
              >
                {/* Visual Cover Style */}
                <DocumentThumbnail material={mat} size="lg" />

                {/* Metadata body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-450 dark:text-zinc-500 block uppercase tracking-wider font-semibold">
                      {mat.examType} Exam • {mat.examMonth} {mat.examYear}
                    </span>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 truncate max-w-[150px]">
                        {colleges.find((c) => c.id === mat.collegeId)?.name || "College"}
                      </span>
                      <RatingDisplay rating={mat.rating} size="sm" />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-3 mt-4 flex justify-between items-center">
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
      <section className="py-20 bg-slate-50/60 dark:bg-zinc-900/30 border-y border-slate-100 dark:border-zinc-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight mb-4">
            How Accessing Material Works
          </h2>
          <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-xl mx-auto mb-12">
            EduVault matches multiple study methods and budgets so you never fall behind in exam prep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover-lift">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Free Mode</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Download Directly</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Free resources are uploaded directly by colleges and departments. Anyone can view and download them instantly without ads.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover-lift">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Ad Unlock</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Simulated countdown</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Watch a simulated 10-second advertisement to unlock premium content for 24 hours. Limit of 3 ad unlocks per day.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover-lift">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Buy Premium</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">Permanent Ownership</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Purchase single items directly. Purchased material goes straight to your personal library permanently with lifetime updates.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover-lift">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Subscribe</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-50 mt-1">All-Inclusive Pass</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Become a Plus Member for ad-free interface and unlimited downloads of subscription-eligible guides and codes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Subscription promotions */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 dark:from-indigo-950 dark:via-zinc-900 dark:to-zinc-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 border border-indigo-900/30">
            
            {/* Background glowing gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px]"></div>

            <div className="space-y-4 max-w-md relative z-10">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                Subscribers Pool Deal
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                Unlock Study Library Ad-Free
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Join thousands of students from Anna University and Madras University using Plus Pass. Subscriptions pools are shared with authors based on active monthly downloads.
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0 relative z-10">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-zinc-100 rounded-xl text-center text-xs font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-300"
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
