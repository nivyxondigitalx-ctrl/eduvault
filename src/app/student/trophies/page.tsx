"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Flame, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Star, 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  Crown
} from "lucide-react";

export default function TrophiesPage() {
  const [trophies, setTrophies] = useState<{ [key: string]: boolean }>({});
  const [streak, setStreak] = useState<number>(1);
  const [selectedTrophy, setSelectedTrophy] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("eduvault_trophies") || "{}");
      const storedStreak = parseInt(localStorage.getItem("eduvault_streak") || "3");
      setTrophies(stored);
      setStreak(storedStreak);
    } catch (e) {
      console.error("Error loading trophies:", e);
    }
  }, []);

  const unlockTrophySim = (id: string) => {
    const updated = { ...trophies, [id]: true };
    setTrophies(updated);
    localStorage.setItem("eduvault_trophies", JSON.stringify(updated));
  };

  const trophyDefinitions = [
    {
      id: "firstQuiz",
      title: "First Steps into Knowledge",
      category: "Quiz Master",
      desc: "Complete your very first practice quiz in the AI Smart Test Builder.",
      points: 100,
      icon: Crown,
      color: "from-amber-400 to-yellow-600",
      bg: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    },
    {
      id: "highScorer",
      title: "Academic Honor Roll",
      category: "Performance",
      desc: "Score at least 80% marks on any simulated AI practice examination.",
      points: 250,
      icon: Star,
      color: "from-purple-500 to-indigo-600",
      bg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
    {
      id: "notesExplorer",
      title: "Syllabus Deconstructor",
      category: "Revision Engine",
      desc: "Generate exam cheat-sheets or flashcard memory decks for 3 distinct topics.",
      points: 150,
      icon: Zap,
      color: "from-cyan-400 to-blue-600",
      bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "plannerPro",
      title: "Strategic Time Architect",
      category: "Organization",
      desc: "Synthesize a 7-day study countdown plan for upcoming final semester exams.",
      points: 150,
      icon: Target,
      color: "from-emerald-400 to-teal-600",
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "wordsmith",
      title: "Scholarly Wordsmith",
      category: "Grammar Coach",
      desc: "Optimize an essay answer using our AI Grammar Coach to achieve a 9.0+ score estimation.",
      points: 200,
      icon: ShieldCheck,
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    },
    {
      id: "streakMaster",
      title: "Unstoppable Momentum",
      category: "Dedication",
      desc: "Maintain a 5-day active study and paper review streak without skipping a day.",
      points: 500,
      icon: Flame,
      color: "from-orange-500 to-red-600",
      bg: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    },
  ];

  const unlockedCount = trophyDefinitions.filter((t) => trophies[t.id]).length;
  const totalPoints = trophyDefinitions.reduce((acc, t) => (trophies[t.id] ? acc + t.points : acc), 0);
  const maxPoints = trophyDefinitions.reduce((acc, t) => acc + t.points, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-slate-900 to-purple-950 p-6 md:p-10 text-white shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Trophy className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>EduPlus Gamification Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Student Trophy Room
            </h1>
            <p className="text-sm md:text-base text-amber-100/80 leading-relaxed">
              Unlock prestigious academic badges, earn achievement XP points, and climb the student study rankings as you utilize AI study assistants every single day!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-2xl text-center min-w-28 shadow-inner">
              <span className="text-2xl font-black text-amber-400 block">{unlockedCount} / {trophyDefinitions.length}</span>
              <span className="text-[10px] font-bold uppercase text-amber-200">Badges Won</span>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-2xl text-center min-w-28 shadow-inner">
              <span className="text-2xl font-black text-indigo-300 block">{totalPoints} XP</span>
              <span className="text-[10px] font-bold uppercase text-indigo-200">Total Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Daily Task Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Day Streak</span>
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl font-black">{streak} Days!</h2>
            <p className="text-xs text-orange-100 leading-relaxed">
              You're on fire! Return tomorrow and take a quick practice quiz to extend your streak and claim the 500 XP Streak Master badge!
            </p>
          </div>
        </div>

        <div className="md:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Daily Study Quest Checklist</span>
            </h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">XP Boost Active</span>
          </div>
          <div className="space-y-2">
            {[
              { task: "Complete 1 practice test in Smart Test room", points: "50 XP", done: true },
              { task: "Synthesize 1 AI exam cheat-sheet for review", points: "50 XP", done: true },
              { task: "Review saved university solved question papers", points: "25 XP", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${item.done ? "text-emerald-500" : "text-slate-300 dark:text-zinc-600"}`} />
                  <span className={`text-xs font-bold ${item.done ? "line-through text-slate-400" : "text-slate-700 dark:text-zinc-200"}`}>
                    {item.task}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  +{item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trophy Showcase Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <span>Achievement Showcase Grid ({unlockedCount}/{trophyDefinitions.length})</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trophyDefinitions.map((item) => {
            const isUnlocked = !!trophies[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => !isUnlocked && unlockTrophySim(item.id)}
                className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                  isUnlocked
                    ? "bg-white dark:bg-zinc-900 border-amber-500/50 shadow-xl hover:shadow-2xl"
                    : "bg-slate-50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800/80 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${isUnlocked ? item.bg : "bg-slate-200 dark:bg-zinc-800 text-slate-400 border-slate-300 dark:border-zinc-700"}`}>
                      {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${isUnlocked ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300/40" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"}`}>
                      {item.points} XP
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-base font-black text-slate-800 dark:text-zinc-100 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isUnlocked ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500 group-hover:text-indigo-500"}`}>
                    {isUnlocked ? "✨ UNLOCKED ACHIEVEMENT" : "🔒 Click to unlock in demo"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
