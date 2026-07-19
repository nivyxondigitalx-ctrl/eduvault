"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import { ShieldCheck, Calendar, Lock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useDemo();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          System Security Audit Trail
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Read-only cryptographic system log recording administrative modifications, role upgrades, and payout actions.
        </p>
      </div>

      {auditLogs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl text-center text-xs text-slate-400">
          No audit logs recorded in current session.
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3.5 text-xs">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800/50 text-slate-500 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200">
                      {log.action.replace(/_/g, " ").toUpperCase()}
                    </p>
                    <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                    {log.details}
                  </p>
                  <span className="text-[9px] text-slate-400 mt-2 block font-mono">
                    User: {log.userEmail} ({log.userRole})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
