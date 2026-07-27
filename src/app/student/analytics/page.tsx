"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDemo } from "../../../lib/context";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  const { testHistory } = useDemo();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalysis = async () => {
    if (!testHistory || testHistory.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testHistory }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAnalysis(data.result);
      } else {
        setError(data.error || "Failed to parse performance report.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to the performance analytics engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [testHistory]);

  if (!testHistory || testHistory.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 p-6 md:p-10 text-white shadow-2xl border border-indigo-500/30">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
              <Brain className="w-3.5 h-3.5" />
              <span>AI Performance Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              AI Performance Analytics
            </h1>
            <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed">
              Unlock personalized insights, subject strengths, and study action-plans. Our AI reads your completed quiz history to find where you are struggling.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">No test history available</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
              We need at least one completed quiz result to compile your strong/weak topics and personalized study recommendations.
            </p>
          </div>
          <Link
            href="/student/tests"
            className="mt-2 inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            <span>Launch Smart Quiz Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 p-6 md:p-10 text-white shadow-2xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>EduPlus AI Analytics Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              AI Performance Analytics
            </h1>
            <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed">
              Personalized insights and study suggestions generated by Gemini AI based on your practice test performance and curriculum coverage.
            </p>
          </div>
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="shrink-0 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analysis</span>
          </button>
        </div>
      </div>

      {loading ? (
        /* LOADING STATE */
        <div className="py-24 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute top-5 left-5 animate-pulse" />
          </div>
          <div className="text-center max-w-xs">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100">Reviewing test history...</h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
              EduPlus AI is parsing scores, evaluating curriculum gaps, and updating recommendations.
            </p>
          </div>
        </div>
      ) : error ? (
        /* ERROR STATE */
        <div className="py-16 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xl text-center space-y-4 max-w-lg mx-auto p-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100">Analysis Error</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchAnalysis}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      ) : analysis ? (
        /* ANALYTICS REPORT VIEW */
        <div className="space-y-8">
          {/* Stats strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-rose-50 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-900/20 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-400 block leading-tight">
                  {analysis.weakTopics?.filter((t: string) => t !== "None detected! 🎉").length || 0}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">Weak Topics</span>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block leading-tight">
                  {analysis.strongTopics?.filter((t: string) => !t.startsWith("Keep")).length || 0}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">Strong Topics</span>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-blue-700 dark:text-blue-400 block leading-tight">
                  {analysis.recommendations?.length || 0}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">Study Tips</span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Weak and Strong list */}
            <div className="lg:col-span-1 space-y-6">
              {/* Weak Card */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-50 dark:border-zinc-800 pb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Weak Focus Areas</span>
                </h3>
                <ul className="space-y-2">
                  {analysis.weakTopics?.map((topic: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span className="text-rose-500 select-none">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strong Card */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-50 dark:border-zinc-800 pb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Verified Strengths</span>
                </h3>
                <ul className="space-y-2">
                  {analysis.strongTopics?.map((topic: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span className="text-emerald-500 select-none">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Recommendations */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 h-full">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-50 dark:border-zinc-800 pb-3">
                  <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Personalized Action Recommendations</span>
                </h3>

                <div className="space-y-4">
                  {analysis.recommendations?.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
                      <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-xs font-medium text-slate-600 dark:text-zinc-300 leading-relaxed self-center">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test History List */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Practice Exam Attempt Logs ({testHistory.length})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Subject & Topic</th>
                    <th className="pb-3">Format</th>
                    <th className="pb-3">Difficulty</th>
                    <th className="pb-3">Result</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/40">
                  {testHistory.map((attempt) => (
                    <tr key={attempt.id} className="align-middle">
                      <td className="py-4">
                        <span className="font-bold text-slate-800 dark:text-zinc-100 block">{attempt.topic}</span>
                        <span className="text-[10px] text-slate-400 block">{attempt.subject}</span>
                      </td>
                      <td className="py-4 capitalize font-semibold">{attempt.testType === "mcq" ? "MCQ Quiz" : attempt.testType === "short" ? "2-Mark Short" : "10-Mark Essay"}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                          attempt.difficulty === "hard" 
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30"
                            : attempt.difficulty === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                        }`}>
                          {attempt.difficulty}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-black text-slate-800 dark:text-zinc-100">{attempt.score} / {attempt.totalMarks}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({Math.round((attempt.score / attempt.totalMarks) * 100)}%)</span>
                      </td>
                      <td className="py-4 text-slate-400 dark:text-zinc-500 font-semibold">{new Date(attempt.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
