"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { 
  BookOpen, 
  UploadCloud, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  AlertCircle,
  CheckCircle,
  FileText
} from "lucide-react";

export default function SyllabusManagerPage() {
  const { syllabusList, addSyllabusTopic, deleteSyllabusTopic } = useDemo();
  const [activeTab, setActiveTab] = useState<"list" | "upload">("list");
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});
  
  // Form State
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!subject.trim() || !unit.trim() || !topic.trim() || !content.trim()) {
      setError("Please fill in all the required fields.");
      return;
    }

    try {
      addSyllabusTopic({
        subject: subject.trim(),
        unit: unit.trim(),
        topic: topic.trim(),
        content: content.trim(),
      });
      setSuccess(true);
      // Reset form
      setSubject("");
      setUnit("");
      setTopic("");
      setContent("");
      setTimeout(() => {
        setSuccess(false);
        setActiveTab("list");
      }, 1500);
    } catch (err: any) {
      setError("Failed to upload syllabus topic: " + err.message);
    }
  };

  // Group: Subject -> Unit -> SyllabusItem[]
  const groupedSyllabus = (syllabusList || []).reduce((acc: any, item) => {
    if (!acc[item.subject]) {
      acc[item.subject] = {};
    }
    if (!acc[item.subject][item.unit]) {
      acc[item.subject][item.unit] = [];
    }
    acc[item.subject][item.unit].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 p-6 md:p-10 text-white shadow-2xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>EduPlus Syllabus Manager</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Syllabus Library
            </h1>
            <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed">
              Upload your official course syllabus and lecture documents. Our AI engines use this exact context to boundary quiz generation and revision sheets, guaranteeing exam relevance.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "list"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Syllabus ({syllabusList?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`pb-3 font-extrabold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Syllabus</span>
        </button>
      </div>

      {activeTab === "list" ? (
        /* SYLLABUS LIST VIEW */
        <div className="space-y-6">
          {(!syllabusList || syllabusList.length === 0) ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-600">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">No syllabus loaded</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Upload your textbook syllabus or course details. The custom content will appear here and feed directly into the AI study planner and quiz builders.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("upload")}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Syllabus Now</span>
              </button>
            </div>
          ) : (
            Object.entries(groupedSyllabus).map(([subj, units]: any) => (
              <div key={subj} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 transition-all">
                <div className="flex items-center gap-3 border-b border-slate-50 dark:border-zinc-800 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    📘
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-zinc-50">{subj}</h3>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Course Module</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(units).map(([unitName, topics]: any) => (
                    <div key={unitName} className="space-y-2 pl-2 border-l-2 border-slate-100 dark:border-zinc-800">
                      <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 py-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{unitName}</span>
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        {topics.map((item: any) => {
                          const isExpanded = !!expandedTopics[item.id];
                          return (
                            <div 
                              key={item.id} 
                              className="rounded-2xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-800/30 overflow-hidden transition-all"
                            >
                              <div 
                                onClick={() => toggleTopic(item.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-indigo-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                                    {item.topic}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSyllabusTopic(item.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Delete syllabus topic"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="p-4 pt-0 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap pl-10 bg-white/40 dark:bg-zinc-900/40">
                                  <p className="py-3">{item.content}</p>
                                  <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-50 dark:border-zinc-800 pt-2 mt-2 font-semibold">
                                    <span>SOURCE: STUDENT SYLLABUS DRAFT</span>
                                    <span>ADDED: {new Date(item.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* UPLOAD SYLLABUS FORM VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload New Syllabus Module</span>
          </h3>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                  Course / Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. CS3491 Artificial Intelligence"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                  Unit Name / Chapter ID
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. Unit I - Foundational Logic"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                Topic Title
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Propositional Logic, Truth Tables, Inference Rules"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                Syllabus Detailed Content / Reference Text
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the official syllabus contents, subtopics, exam guidelines, or chapter lecture abstracts. The AI will read this exact paragraph to construct custom tests and revision notes."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Syllabus topic uploaded successfully! Redirecting...</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-5 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
              >
                Upload Syllabus
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
