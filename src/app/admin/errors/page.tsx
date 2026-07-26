"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Trash2, 
  Calendar, 
  Globe, 
  Code, 
  Activity, 
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
  FileCheck2
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "../../../lib/storage";

interface SystemError {
  id: string;
  message: string;
  stack: string | null;
  url: string | null;
  resolved: boolean;
  createdAt: string;
}

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "unresolved" | "resolved">("unresolved");

  const fetchErrors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/errors");
      if (res.ok) {
        const data = await res.json();
        setErrors(data);
      } else {
        toast.error("Failed to load error logs.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching system logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const handleToggleResolve = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/errors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved: !currentStatus }),
      });
      if (res.ok) {
        toast.success(currentStatus ? "Marked error as active" : "Marked error as resolved!");
        // Update local state
        setErrors(prev => prev.map(e => e.id === id ? { ...e, resolved: !currentStatus } : e));
      } else {
        toast.error("Failed to update error status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/errors?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Error log permanently deleted.");
        setErrors(prev => prev.filter(e => e.id !== id));
        if (expandedId === id) setExpandedId(null);
      } else {
        toast.error("Failed to delete error log.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error deleting log.");
    }
  };

  const handleClearResolved = async () => {
    try {
      const res = await fetch("/api/errors?clearResolved=true", {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Cleared all resolved errors from database.");
        setErrors(prev => prev.filter(e => !e.resolved));
      } else {
        toast.error("Failed to clear resolved errors.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error clearing logs.");
    }
  };

  // Filter logs
  const filtered = errors.filter(e => {
    if (filterMode === "resolved" && !e.resolved) return false;
    if (filterMode === "unresolved" && e.resolved) return false;
    
    if (search) {
      const q = search.toLowerCase();
      return (
        e.message.toLowerCase().includes(q) ||
        (e.url && e.url.toLowerCase().includes(q)) ||
        (e.stack && e.stack.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalErrors = errors.length;
  const unresolvedCount = errors.filter(e => !e.resolved).length;
  const resolvedCount = errors.filter(e => e.resolved).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            System Errors Checklist
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Silent exception logs intercepted from user sessions. Mark them resolved once patched.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchErrors(false)}
            className="p-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            title="Refresh log feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {resolvedCount > 0 && (
            <button
              onClick={handleClearResolved}
              className="px-4 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 shadow-sm flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Resolved ({resolvedCount})
            </button>
          )}
        </div>
      </div>

      {/* Diagnostics summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-500 dark:text-zinc-400 font-bold shrink-0">
            {totalErrors}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500">Total Captured</span>
            <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-0.5">Log Invoices</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0">
            {unresolvedCount}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500">Active / Patched Needed</span>
            <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-0.5">Unresolved Checklist</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            {resolvedCount}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500">Fixed & Patched</span>
            <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-0.5">Resolved Errors</p>
          </div>
        </div>
      </div>

      {/* Control panel and filters */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          {/* Tabs */}
          <div className="flex border-b border-slate-50 dark:border-zinc-800/60 pb-1.5 gap-4 overflow-x-auto w-full md:w-auto">
            {(["unresolved", "resolved", "all"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative capitalize shrink-0 ${
                  filterMode === mode
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                {mode === "unresolved" ? `Unresolved (${unresolvedCount})` : mode === "resolved" ? `Resolved (${resolvedCount})` : `All (${totalErrors})`}
                {filterMode === mode && (
                  <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 rounded-xl shadow-sm shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Filter errors by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 border-0 text-slate-800 dark:text-zinc-200 text-xs font-semibold rounded-xl"
            />
          </div>
        </div>

        {/* Errors list */}
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2 font-semibold">Loading system diagnostic logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl bg-slate-50/20 dark:bg-zinc-900/10">
            <FileCheck2 className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">No matching errors in this view!</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Excellent! Your application runtime environment is fully healthy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((err) => {
              const dateStr = new Date(err.createdAt).toLocaleString();
              return (
                <div 
                  key={err.id}
                  className={`border rounded-2xl transition-all shadow-sm ${
                    err.resolved 
                      ? "bg-slate-50/50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/50 opacity-75 hover:opacity-100" 
                      : "bg-white dark:bg-zinc-900/60 border-slate-150 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900/40"
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-start gap-3 justify-between flex-wrap sm:flex-nowrap">
                    {/* Resolution toggle checklist button */}
                    <button
                      type="button"
                      onClick={() => handleToggleResolve(err.id, err.resolved)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 mt-0.5"
                    >
                      {err.resolved ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-zinc-700" />
                      )}
                    </button>

                    {/* Content details */}
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          err.resolved 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          {err.resolved ? "Resolved" : "Active Error"}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {dateStr}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-normal tracking-wide ${
                        err.resolved ? "text-slate-500 dark:text-zinc-400 line-through" : "text-slate-800 dark:text-zinc-200"
                      }`}>
                        {err.message}
                      </h4>

                      {err.url && (
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-1 truncate font-mono">
                          <Globe className="w-3 h-3 text-slate-300 shrink-0" />
                          <span className="truncate">{err.url}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-center w-full sm:w-auto justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-zinc-800/40">
                      {err.stack && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === err.id ? null : err.id)}
                          className="px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm border border-slate-100 dark:border-zinc-700"
                        >
                          <Code className="w-3 h-3" /> {expandedId === err.id ? "Hide Stack" : "Show Stack"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(err.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40"
                        title="Delete error log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Expandable Stack Trace Section */}
                  {expandedId === err.id && err.stack && (
                    <div className="border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 p-4 sm:p-5 rounded-b-2xl">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-2 font-sans">
                        Stack Trace Stacktrace Diagnostics
                      </span>
                      <pre className="text-[10px] text-slate-600 dark:text-zinc-400 font-mono overflow-x-auto max-h-60 p-4 bg-slate-100 dark:bg-zinc-950 rounded-xl leading-relaxed whitespace-pre-wrap border border-slate-150 dark:border-zinc-800/60 scrollbar-thin">
                        {err.stack}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
