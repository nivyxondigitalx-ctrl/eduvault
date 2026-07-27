"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Edit3, 
  Award, 
  TrendingUp, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Compass, 
  FileText, 
  ArrowRight 
} from "lucide-react";

export default function StudyPlanAndGrammarPage() {
  const [activeTab, setActiveTab] = useState<"plan" | "grammar">("plan");
  const [loading, setLoading] = useState(false);

  // Study Plan State
  const [subject, setSubject] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [focusAreas, setFocusAreas] = useState("");
  const [planResult, setPlanResult] = useState<any>(null);

  // Grammar & Answer Checker State
  const [questionText, setQuestionText] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [grammarResult, setGrammarResult] = useState<any>(null);

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setLoading(true);
    setPlanResult(null);
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "plan", subject, hoursPerDay, focusAreas }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setPlanResult(data.result);
        try {
          const stats = JSON.parse(localStorage.getItem("eduvault_trophies") || "{}");
          stats.plannerPro = true;
          localStorage.setItem("eduvault_trophies", JSON.stringify(stats));
        } catch (err) {}
      } else {
        alert("Failed to generate plan: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error reaching study plan engine.");
    } finally {
      setLoading(false);
    }
  };

  const checkGrammar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;
    setLoading(true);
    setGrammarResult(null);
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grammar", studentAnswer, questionText }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setGrammarResult(data.result);
        try {
          const stats = JSON.parse(localStorage.getItem("eduvault_trophies") || "{}");
          stats.wordsmith = true;
          localStorage.setItem("eduvault_trophies", JSON.stringify(stats));
        } catch (err) {}
      } else {
        alert("Failed to evaluate grammar: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error reaching grammar enhancer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 p-6 md:p-10 text-white shadow-2xl border border-teal-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-400/30">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>EduPlus Academic Suite</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              AI Study Planner & Answer Coach
            </h1>
            <p className="text-sm md:text-base text-teal-100/90 leading-relaxed">
              Design structured 7-day study sprints for high-weightage university exams, or submit your written draft answers for real-time vocabulary and score optimization!
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab("plan")}
          className={`pb-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "plan"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>7-Day Exam Study Timetable</span>
        </button>
        <button
          onClick={() => setActiveTab("grammar")}
          className={`pb-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "grammar"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Exam Answer & Grammar Coach</span>
        </button>
      </div>

      {activeTab === "plan" ? (
        /* STUDY PLAN SECTION */
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-xl">
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Configure Your Prep Timetable</span>
            </h3>
            <form onSubmit={generatePlan} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase">Subject Name</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Microprocessors & Interfacing, Constitutional Law..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase">Daily Hours Available</label>
                <select
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1">1 Hour / Day (Lightware)</option>
                  <option value="2">2 Hours / Day (Standard)</option>
                  <option value="4">4 Hours / Day (Intensive)</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Create Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {planResult && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-emerald-400 font-extrabold uppercase block mb-1">Personalized Schedule Generated</span>
                  <h2 className="text-2xl font-black">{planResult.planTitle}</h2>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Total Effort: {planResult.totalStudyHours}</span>
                </div>
              </div>

              {/* Day Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {planResult.dailySchedule?.map((day: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-lg space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                          {day.day}
                        </span>
                        <CheckCircle className="w-5 h-5 text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 dark:text-zinc-100">{day.topic}</h4>
                      <ul className="space-y-2">
                        {day.activities?.map((act: string, i: number) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Milestone: {day.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Pro Examiner Tips for this Subject</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200/90 list-disc pl-5">
                  {planResult.examTips?.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GRAMMAR & ANSWER COACH SECTION */
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Academic Writing & Answer Scorer</span>
            </h3>
            <form onSubmit={checkGrammar} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase">Exam Question (Optional Context)</label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Explain the differences between synchronous and asynchronous architectures (8 Marks)..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase">Your Draft Answer</label>
                <textarea
                  rows={6}
                  required
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Paste or write your answer here. Our AI will grade your technical vocabulary and transform basic explanations into professional scholarly prose..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Evaluating Prose...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate & Optimize Answer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {grammarResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
              {/* Score Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col justify-between border border-zinc-800">
                <div>
                  <span className="text-xs text-indigo-400 font-extrabold uppercase">Score Estimation</span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{grammarResult.enhancedScore}</span>
                    <span className="text-base text-zinc-400">/ 10.0</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Up from {grammarResult.originalScore}/10 with formatting optimization.</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Academic Tone Boost</span>
                    <span>+30%</span>
                  </div>
                </div>
              </div>

              {/* Feedback & Vocabulary */}
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xl space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Vocabulary Upgrades</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {grammarResult.vocabularyUpgrades?.map((v: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 text-xs space-y-1">
                        <div className="line-through text-rose-500 font-mono">{v.original}</div>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          <span>{v.replacement}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{v.reason}</div>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mt-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Rewritten Master Answer</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-800 dark:text-zinc-200 font-serif leading-relaxed">
                    {grammarResult.rewrittenAnswer}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
