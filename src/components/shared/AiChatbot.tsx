"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDemo } from "../../lib/context";
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  Minimize2,
  AlertTriangle,
  DollarSign,
  BookOpen,
  FileQuestion,
  Loader2,
  Trash2,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
  data?: any; // Contains structured data payloads for custom card rendering
}

export function AiChatbot() {
  const { currentUser, materials } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const role = currentUser?.role || "guest";
  const name = currentUser?.name || "Guest";

  // Persistent storage key based on user ID
  const storageKey = `eduvault_ai_history_${currentUser?.id || "guest"}`;

  // Load chat history from sessionStorage on mount or when user changes
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } else {
        // Set default welcome message based on role
        setMessages([getWelcomeMessage(role, name)]);
      }
    } catch (e) {
      setMessages([getWelcomeMessage(role, name)]);
    }
  }, [role, name, storageKey]);

  // Save chat history to sessionStorage when it changes
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function getWelcomeMessage(role: string, name: string): ChatMessage {
    let content = "";
    if (role === "admin") {
      content = `Hello Admin **${name}**! I'm your System Copilot. I can help you monitor system errors, moderate files, or check support tickets. Ask me anything or select a task below.`;
    } else if (role === "dealer") {
      content = `Welcome back, **${name}**! I'm your Partner Assistant. I can help you view your balance details, upload files, or review payout options. How can I help you today?`;
    } else {
      content = `Hi **${name}**! I'm your AI Study Partner. I can help you search for notes, locate university question papers, or explain subscriptions. Try typing a subject name below!`;
    }
    return {
      role: "model",
      content,
      timestamp: new Date(),
    };
  }

  // Get quick suggestions based on user role
  const getSuggestions = () => {
    if (role === "admin") {
      return [
        { label: "⚠️ System Errors", text: "Show active system errors" },
        { label: "✅ Pending Moderation", text: "Show pending materials" },
        { label: "🎫 Support Tickets", text: "Are there any open support tickets?" },
        { label: "📋 Recent Audit Logs", text: "Summarize recent audit logs" },
      ];
    } else if (role === "dealer") {
      return [
        { label: "📈 Sales & Earnings", text: "Show my sales and earnings balance" },
        { label: "💰 Request Payout", text: "How do I withdraw my earnings?" },
        { label: "📤 How to Upload Notes", text: "Explain steps to upload study materials" },
        { label: "📋 My Uploaded Materials", text: "Show my uploaded files" },
      ];
    } else {
      return [
        { label: "🔍 Find Math Notes", text: "Find notes for mathematics" },
        { label: "📺 Free Unlock (Ads)", text: "How can I unlock study materials for free?" },
        { label: "💼 Subscription Plans", text: "Show me the subscription plans" },
        { label: "❓ Support Desk", text: "How do I create a support ticket?" },
      ];
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // API call to the Next.js chatbot route
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI endpoint.");
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        role: "model",
        content: data.content,
        timestamp: new Date(),
        data: data.data, // Custom payload
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, I encountered an error connecting to the AI system. Please verify your connection or try again shortly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    sessionStorage.removeItem(storageKey);
    setMessages([getWelcomeMessage(role, name)]);
  };

  // UI Theme adaptation values
  const getThemeConfig = () => {
    switch (role) {
      case "admin":
        return {
          accent: "indigo-600",
          bgGradient: "from-rose-600 to-indigo-700",
          glowClass: "shadow-rose-500/25",
          btnColor: "bg-rose-600 hover:bg-rose-700",
          badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50",
          title: "Admin System Copilot",
        };
      case "dealer":
        return {
          accent: "teal-600",
          bgGradient: "from-emerald-600 to-teal-700",
          glowClass: "shadow-emerald-500/25",
          btnColor: "bg-emerald-600 hover:bg-emerald-700",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50",
          title: "Dealer Partner Helper",
        };
      default:
        return {
          accent: "indigo-600",
          bgGradient: "from-indigo-600 via-violet-600 to-blue-600",
          glowClass: "shadow-indigo-500/25",
          btnColor: "bg-indigo-600 hover:bg-indigo-700",
          badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50",
          title: "AI Study Assistant",
        };
    }
  };

  const theme = getThemeConfig();

  // Custom visual components for rich AI answers
  const renderCustomCards = (msgData: any) => {
    if (!msgData) return null;

    if (msgData.role === "admin") {
      // 1. Admin System Error Cards
      if (msgData.errors && msgData.errors.length > 0) {
        return (
          <div className="mt-3 p-3 bg-red-50/80 dark:bg-rose-950/20 border border-red-100 dark:border-rose-900/30 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-red-700 dark:text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Direct Diagnostic Logs:
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {msgData.errors.map((err: any) => (
                <div key={err.id} className="p-2 bg-white dark:bg-zinc-800 rounded border border-red-100/50 dark:border-rose-900/20 text-[11px] font-mono text-slate-700 dark:text-zinc-300">
                  <div className="text-red-500 font-semibold">{err.message}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(err.createdAt).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    if (msgData.role === "dealer") {
      // 2. Dealer balance overview board
      if (msgData.earnings) {
        const { totalSales, netEarnings, availableBalance } = msgData.earnings;
        return (
          <div className="mt-3 p-3.5 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Finance Stat Card
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-medium">Real-Time</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white dark:bg-zinc-900/50 border border-emerald-100/40 dark:border-emerald-800/20 p-2 rounded text-center">
                <div className="text-[10px] text-slate-400">Total Sales</div>
                <div className="font-bold text-slate-800 dark:text-zinc-100">${totalSales.toFixed(1)}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 border border-emerald-100/40 dark:border-emerald-800/20 p-2 rounded text-center">
                <div className="text-[10px] text-slate-400">Net Share</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">${netEarnings.toFixed(1)}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 border border-emerald-100/40 dark:border-emerald-800/20 p-2 rounded text-center border-l-2 border-l-emerald-500">
                <div className="text-[10px] text-slate-400">Available</div>
                <div className="font-bold text-slate-800 dark:text-zinc-100">${availableBalance.toFixed(1)}</div>
              </div>
            </div>
            <div className="text-center">
              <Link href="/dealer/payouts" className="inline-block px-3 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 transition">
                Request Payout Transfer
              </Link>
            </div>
          </div>
        );
      }
    }

    // 3. Material Carousel/Lists for Students or General search
    if (msgData.materials && msgData.materials.length > 0) {
      return (
        <div className="mt-3 space-y-2">
          <span className="text-[11px] text-slate-400 font-bold block">RECOMMENDED SYLLABUS PAPERS:</span>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin max-w-full">
            {msgData.materials.map((mat: any) => (
              <div
                key={mat.id}
                className="flex-shrink-0 w-[180px] p-2.5 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 rounded-xl flex flex-col justify-between shadow-sm hover:border-indigo-400 transition cursor-pointer"
              >
                <div>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">{mat.subjectCode}</div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-zinc-200 line-clamp-2 leading-tight mb-2 h-7">{mat.title}</div>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-50 dark:border-zinc-700/40">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-zinc-100">
                    {mat.price > 0 ? `$${mat.price.toFixed(2)}` : "Free"}
                  </span>
                  <Link href={`/material/${mat.slug}`} className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold transition">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${theme.btnColor} ${theme.glowClass} flex items-center justify-center`}
        aria-label="Ask AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Glassmorphic Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className={`p-4 bg-gradient-to-r ${theme.bgGradient} text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">{theme.title}</h3>
                <p className="text-[10px] text-white/80 font-medium">EduVault Knowledge Graph Enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={clearHistory}
                className="p-1 hover:bg-white/10 rounded transition text-white/80 hover:text-white"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition text-white/80 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                
                {/* Profile Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                  msg.role === "user" 
                    ? "bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300" 
                    : `${theme.btnColor} text-white`
                }`}>
                  {msg.role === "user" ? name.slice(0, 1).toUpperCase() : "AI"}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white border-indigo-700 rounded-tr-none"
                      : "bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-200 border-slate-100 dark:border-zinc-800/80 shadow-sm rounded-tl-none"
                  }`}>
                    {/* Render basic bold statements or normal text paragraphs */}
                    <div className="whitespace-pre-line font-medium">
                      {msg.content.split("**").map((chunk, idx) => 
                        idx % 2 === 1 ? <strong key={idx} className="font-bold underline decoration-indigo-400 decoration-2">{chunk}</strong> : chunk
                      )}
                    </div>
                  </div>

                  {/* Render Custom UI Cards underneath AI responses */}
                  {msg.role === "model" && renderCustomCards(msg.data)}

                  {/* Timestamp */}
                  <div className={`text-[9px] text-slate-400 px-1 ${msg.role === "user" ? "text-right" : ""}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

              </div>
            ))}

            {/* AI Typing Loader */}
            {loading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${theme.btnColor} font-bold`}>
                  AI
                </div>
                <div className="p-3 bg-white dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider">Syncing database...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Footer */}
          {messages.length < 5 && (
            <div className="p-2 border-t border-slate-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 flex gap-1.5 overflow-x-auto scrollbar-none">
              {getSuggestions().map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSend(suggestion.text)}
                  className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-slate-100 dark:border-zinc-700 rounded-full text-[10px] font-bold text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          {/* Text Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={role === "admin" ? "Ask diagnostics/tickets..." : "Search subjects, code, or balance..."}
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-xs font-semibold rounded-xl transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 rounded-xl text-white shadow-md hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none cursor-pointer ${theme.btnColor}`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
