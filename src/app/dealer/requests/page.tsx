"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import Link from "next/link";
import { HelpCircle, FileText, ChevronRight, GraduationCap } from "lucide-react";

export default function DealerRequestsPage() {
  const { notifications, subjects } = useDemo();

  // Find notifications containing student material requests
  const studentRequests = notifications.filter((n) =>
    n.title.includes("Request") || n.message.includes("requested")
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Student Resource Requests
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          See list of syllabus guidelines requested by students at your registered colleges.
        </p>
      </div>

      {studentRequests.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto animate-fade-in">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Pending Requests</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            There are no student request broadcasts currently pending for your college department.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {studentRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex gap-4 items-start shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                  {req.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                  {req.message}
                </p>
                <span className="text-[9px] text-slate-400 font-mono mt-2.5 block">
                  Broadcast date: {new Date(req.createdAt).toLocaleString()}
                </span>
              </div>
              
              <Link
                href="/dealer/materials/new"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow shrink-0 self-center"
              >
                Upload File
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
