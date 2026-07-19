"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import { Bell, CheckCircle, Clock } from "lucide-react";

export default function StudentNotificationsPage() {
  const { notifications, currentUser } = useDemo();

  const studentNotifs = notifications.filter(
    (n) => n.userId === "all" || n.userId === currentUser?.id
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Stay informed about your order success, material requests updates, and membership renewals.
        </p>
      </div>

      {studentNotifs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Notifications</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            You don't have any messages in your notification inbox.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {studentNotifs.map((notif) => (
            <div
              key={notif.id}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                  {notif.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[9px] text-slate-400 font-mono mt-2.5 block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
