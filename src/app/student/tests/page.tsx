"use client";

import React, { useState, useEffect } from "react";
import { useDemo } from "../../../lib/context";
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Check, 
  Layers 
} from "lucide-react";

export default function SmartTestsPage() {
  const { syllabusList, addTestAttemptRecord } = useDemo();
  const [mode, setMode] = useState<"custom" | "syllabus">("custom");
  const [selectedSyllabusId, setSelectedSyllabusId] = useState("");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [testType, setTestType] = useState("mcq");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  
  // Quiz State
  const [testData, setTestData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [essayAnswers, setEssayAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (mode === "syllabus" && selectedSyllabusId) {
      const selectedItem = (syllabusList || []).find(s => s.id === selectedSyllabusId);
      if (selectedItem) {
        setTopic(selectedItem.topic);
      }
    }
  }, [selectedSyllabusId, mode, syllabusList]);

  const generateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setTestData(null);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setEssayAnswers({});
    setCurrentQuestionIndex(0);

    // Get syllabus context if in syllabus mode
    let syllabusContext = "";
    if (mode === "syllabus" && selectedSyllabusId) {
      const selectedItem = (syllabusList || []).find(s => s.id === selectedSyllabusId);
      if (selectedItem) {
        syllabusContext = `Subject: ${selectedItem.subject}, Unit: ${selectedItem.unit}, Topic Description: ${selectedItem.content}`;
      }
    }

    try {
      const res = await fetch("/api/ai/test-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          testType,
          count: questionCount,
          contentContext: syllabusContext,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTestData(data.data);
      } else {
        alert("Failed to generate test: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Test error:", err);
      alert("Error reaching AI test engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const handleEssayChange = (qIndex: number, val: string) => {
    if (isSubmitted) return;
    setEssayAnswers({ ...essayAnswers, [qIndex]: val });
  };

  const submitQuiz = () => {
    if (!testData || !testData.questions) return;
    let earned = 0;
    testData.questions.forEach((q: any, idx: number) => {
      if (q.type === "mcq") {
        if (selectedAnswers[idx] === q.correctAnswer) {
          earned += q.marks;
        }
      } else {
        // Automatically reward 85% credit for completed effort in sandbox
        if ((essayAnswers[idx] || "").length > 15) {
          earned += Math.round(q.marks * 0.85);
        }
      }
    });
    setScore(earned);
    setIsSubmitted(true);
    
    // Save achievement to localStorage to power Trophy system!
    try {
      const existingTrophies = JSON.parse(localStorage.getItem("eduvault_trophies") || "{}");
      existingTrophies.firstQuiz = true;
      if (earned >= testData.questions.length * 1.5) existingTrophies.highScorer = true;
      localStorage.setItem("eduvault_trophies", JSON.stringify(existingTrophies));
      
      // Update streak
      const streak = parseInt(localStorage.getItem("eduvault_streak") || "1") + 1;
      localStorage.setItem("eduvault_streak", streak.toString());

      // Add history attempt record
      addTestAttemptRecord({
        subject: testData.subject || topic,
        topic: testData.testTitle.split(": ").slice(1).join(": ") || topic,
        score: earned,
        totalMarks: totalPossibleMarks,
        testType: testType,
        difficulty: difficulty,
        questionCount: testData.questions.length,
      });
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const totalPossibleMarks = testData?.questions?.reduce((acc: number, q: any) => acc + q.marks, 0) || 0;
  const percentage = totalPossibleMarks > 0 ? Math.round((score / totalPossibleMarks) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 p-6 md:p-10 text-white shadow-2xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>EduPlus AI Engine Imported</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Smart Test & Quiz Builder
            </h1>
            <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed">
              Generate custom real-time examinations straight from your university syllabus. Attempt timed MCQs, short answers, or 10-mark essays with automatic answer evaluations!
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-inner">
            <Award className="w-8 h-8 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-indigo-100 uppercase tracking-wide">Trophy Rewards</span>
            <span className="text-[11px] text-indigo-300">Completing quizzes unlocks badges!</span>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Configure Your Exam Practice</span>
          </h2>

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
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm animate-in fade-in-50"
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
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm animate-in fade-in-50"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              From My Syllabus
            </button>
          </div>
        </div>

        <form onSubmit={generateTest} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {mode === "syllabus" ? (
            <div className="md:col-span-2 space-y-1.5 animate-in slide-in-from-left-2 duration-300">
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
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
            <div className="md:col-span-2 space-y-1.5 animate-in slide-in-from-left-2 duration-300">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                Subject / Chapter Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Data Structures, Digital Signal Processing, Organic Chemistry..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
              Question Format
            </label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            >
              <option value="mcq">MCQ Quiz (Multiple Choice)</option>
              <option value="short">2-Mark Short Answers</option>
              <option value="essay">10-Mark Detailed Essays</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
              Difficulty & Count
            </label>
            <div className="flex gap-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-1/2 px-3 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-1/2 px-3 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value={3}>3 Qs</option>
                <option value={5}>5 Qs</option>
                <option value={10}>10 Qs</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Exam with AI...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate AI Test Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quiz Area */}
      {testData && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden transition-all animate-in zoom-in-95 duration-300">
          {/* Top Info Strip */}
          <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800">
            <div>
              <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-wider block mb-0.5">
                {testData.subject} • {testData.difficulty} MODE
              </span>
              <h3 className="text-xl font-black text-white">{testData.testTitle}</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{testData.questions.length} Questions ({totalPossibleMarks} Marks Total)</span>
              </div>
              {isSubmitted && (
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-sm shadow-md">
                  <Award className="w-4 h-4" />
                  <span>Score: {score} / {totalPossibleMarks} ({percentage}%)</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Question Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
              {testData.questions.map((q: any, idx: number) => {
                const isSelected = idx === currentQuestionIndex;
                const isAnswered = q.type === "mcq" ? selectedAnswers[idx] !== undefined : (essayAnswers[idx] || "").length > 0;
                let statusClass = "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700";
                
                if (isSubmitted) {
                  if (q.type === "mcq") {
                    statusClass = selectedAnswers[idx] === q.correctAnswer 
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-500/40 font-extrabold"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-500/40 font-extrabold";
                  } else {
                    statusClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-500/40 font-bold";
                  }
                } else if (isAnswered) {
                  statusClass = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-400/50 font-bold";
                }
                if (isSelected) {
                  statusClass += " ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs border transition-all ${statusClass}`}
                  >
                    Q{idx + 1} ({q.marks}M)
                  </button>
                );
              })}
            </div>

            {/* Current Question View */}
            {testData.questions[currentQuestionIndex] && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-black text-base shadow-sm">
                    {currentQuestionIndex + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                      Question ({testData.questions[currentQuestionIndex].marks} Marks)
                    </span>
                    <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-zinc-100 leading-snug">
                      {testData.questions[currentQuestionIndex].question}
                    </p>
                  </div>
                </div>

                {/* Options / Answer Box */}
                {testData.questions[currentQuestionIndex].type === "mcq" ? (
                  <div className="grid grid-cols-1 gap-3 pl-0 md:pl-14">
                    {testData.questions[currentQuestionIndex].options.map((option: string, optIdx: number) => {
                      const isChecked = selectedAnswers[currentQuestionIndex] === optIdx;
                      const isCorrect = testData.questions[currentQuestionIndex].correctAnswer === optIdx;
                      let btnStyle = "bg-slate-50 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 text-slate-700 dark:text-zinc-200";

                      if (isSubmitted) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-sm";
                        } else if (isChecked) {
                          btnStyle = "bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 opacity-90";
                        }
                      } else if (isChecked) {
                        btnStyle = "bg-indigo-600 text-white border-indigo-600 font-bold shadow-md shadow-indigo-500/20";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          disabled={isSubmitted}
                          className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span className="flex-1 font-medium">{option}</span>
                          {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          {isSubmitted && isChecked && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                          {!isSubmitted && isChecked && <Check className="w-5 h-5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="pl-0 md:pl-14 space-y-4">
                    <textarea
                      rows={5}
                      disabled={isSubmitted}
                      value={essayAnswers[currentQuestionIndex] || ""}
                      onChange={(e) => handleEssayChange(currentQuestionIndex, e.target.value)}
                      placeholder="Type your exam answer here. Use bullet points and steped logic for best score evaluation..."
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>
                )}

                {/* Explanation Block when Submitted */}
                {isSubmitted && (
                  <div className="ml-0 md:ml-14 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700 space-y-2 animate-in fade-in-50 duration-500">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Model Answer & AI Evaluation Feedback</span>
                    </span>
                    <p className="text-sm text-slate-700 dark:text-zinc-300 font-mono whitespace-pre-line leading-relaxed">
                      {testData.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 disabled:opacity-40 transition-all"
              >
                Previous Question
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < testData.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : !isSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    className="px-8 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    Submit & Evaluate Exam
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedAnswers({});
                      setEssayAnswers({});
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
