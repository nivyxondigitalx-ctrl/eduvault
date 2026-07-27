"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDemo } from "../../../lib/context";
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  Layers, 
  HelpCircle, 
  Share2,
  ListFilter
} from "lucide-react";

export default function AIRevisionPage() {
  const { syllabusList } = useDemo();
  const [mode, setMode] = useState<"custom" | "syllabus">("custom");
  const [selectedSyllabusId, setSelectedSyllabusId] = useState("");

  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("summary");
  const [detailLevel, setDetailLevel] = useState("concise");
  const [loading, setLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (mode === "syllabus" && selectedSyllabusId) {
      const selectedItem = (syllabusList || []).find(s => s.id === selectedSyllabusId);
      if (selectedItem) {
        setTopic(selectedItem.topic);
      }
    }
  }, [selectedSyllabusId, mode, syllabusList]);

  const generateRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setGeneratedNotes("");
    setCopied(false);

    try {
      const res = await fetch("/api/ai/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, format, detailLevel }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setGeneratedNotes(data.content);
        
        // Save to trophies streak
        try {
          const stats = JSON.parse(localStorage.getItem("eduvault_trophies") || "{}");
          stats.notesExplorer = true;
          localStorage.setItem("eduvault_trophies", JSON.stringify(stats));
        } catch (err) {}
      } else {
        alert("Could not generate revision notes: " + (data.error || "Server error"));
      }
    } catch (e) {
      console.error("Revision fetch error:", e);
      alert("Error contacting revision engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatLabels: any = {
    summary: { title: "Master Study Notes", icon: FileText, desc: "Structured architectural overview with pro scoring tips." },
    "cheat-sheet": { title: "5-Minute Cheat Sheet", icon: Zap, desc: "Key theorems, unit conventions, and important exam tables." },
    flashcards: { title: "Interactive Flashcards", icon: Layers, desc: "Q&A memory pairs designed for rapid concept recall." },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 p-6 md:p-10 text-white shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider border border-purple-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>EduPlus Revision Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              AI Exam Revision Notes
            </h1>
            <p className="text-sm md:text-base text-purple-200/90 leading-relaxed">
              Transform dense textbook chapters and lecture slides into high-yield exam cheat sheets, flashcard decks, and conceptual breakdowns in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(formatLabels).map(([key, item]: any) => {
          const Icon = item.icon;
          const isActive = format === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFormat(key)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                  : "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 hover:border-slate-200"
              }`}
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">{item.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>{isActive ? "Selected Option" : "Click to select"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Select Your Revision Topic</span>
          </h3>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 border border-slate-200/55 dark:border-zinc-800 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode("custom");
                setTopic("");
              }}
              className={`px-4.5 py-2 rounded-lg transition-all ${
                mode === "custom"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              Custom Topic
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("syllabus");
                if (syllabusList && syllabusList.length > 0) {
                  setSelectedSyllabusId(syllabusList[0].id);
                  setTopic(syllabusList[0].topic);
                }
              }}
              className={`px-4.5 py-2 rounded-lg transition-all ${
                mode === "syllabus"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              From My Syllabus
            </button>
          </div>
        </div>

        <form onSubmit={generateRevision} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {mode === "syllabus" ? (
            <div className="md:col-span-3 space-y-1.5 animate-in slide-in-from-left-2 duration-300">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                Select Syllabus Module
              </label>
              {(!syllabusList || syllabusList.length === 0) ? (
                <div className="w-full px-4 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
                  <span>No syllabus topics uploaded yet!</span>
                  <Link href="/student/syllabus" className="underline font-bold">Go upload &rarr;</Link>
                </div>
              ) : (
                <select
                  value={selectedSyllabusId}
                  onChange={(e) => setSelectedSyllabusId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                >
                  {syllabusList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subject} - {item.topic}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="md:col-span-3 space-y-1.5 animate-in slide-in-from-left-2 duration-300">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                Target Syllabus Unit or Exam Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Thermodynamic Entropy, Fourier Series Analysis, Database Normalization Form 1-3..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Notes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Output Display */}
      {generatedNotes && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in-50 duration-500">
          <div className="p-4 md:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-base font-black text-white">{formatLabels[format]?.title || "Revision Notes"}: {topic}</h3>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">AI Verified Content</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? "Copied to Clipboard" : "Copy Notes"}</span>
            </button>
          </div>

          <div className="p-6 md:p-10 prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
            {generatedNotes}
          </div>
        </div>
      )}
    </div>
  );
}
