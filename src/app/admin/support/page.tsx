"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { HelpCircle, Send, MessageSquare, AlertCircle, Clock, X, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminSupportPage() {
  const { tickets, currentUser, replyToTicket } = useDemo();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !selectedTicket) return;

    replyToTicket(selectedTicket.id, replyMessage);
    
    // update current selected view
    const refreshedTicket = tickets.find(t => t.id === selectedTicket.id);
    setSelectedTicket(refreshedTicket);

    setReplyMessage("");
    toast.success("Reply sent to user!");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Helpdesk Tickets Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Answer student questions, clarify dealer payout issues, and close support tickets.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Support Queries</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            There are no support queries currently open on the platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Ticket Listing Column */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Inbox Queue</span>
            
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full p-4 border rounded-2xl text-left transition-all ${
                  selectedTicket?.id === t.id
                    ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/10"
                    : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    t.status === "open"
                      ? "bg-amber-50 text-amber-700"
                      : t.status === "in_progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {t.status.replace("_", " ")}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 line-clamp-1">{t.subject}</h4>
                <span className="text-[9px] text-slate-400 mt-1 block">From: {t.userName} ({t.userRole})</span>
              </button>
            ))}
          </div>

          {/* Conversation Column */}
          <div className="md:col-span-2">
            {selectedTicket ? (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 space-y-6">
                
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">{selectedTicket.subject}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">From: {selectedTicket.userName} ({selectedTicket.userEmail})</p>
                </div>

                {/* Messages feed */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Original message */}
                  <div className="bg-slate-50 dark:bg-zinc-800 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/60">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">{selectedTicket.userName} ({selectedTicket.userRole})</p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">{selectedTicket.message}</p>
                  </div>

                  {/* Replies */}
                  {selectedTicket.replies.map((reply: any) => (
                    <div
                      key={reply.id}
                      className={`p-3.5 rounded-2xl border ${
                        reply.senderRole === "admin"
                          ? "bg-indigo-50/40 border-indigo-100/50 dark:bg-indigo-950/20 dark:border-indigo-900/40 text-left"
                          : "bg-slate-50 dark:bg-zinc-800/40 border-slate-100"
                      }`}
                    >
                      <p className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                        {reply.senderName} ({reply.senderRole})
                      </p>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">{reply.message}</p>
                      <span className="text-[8px] text-slate-400 font-mono block mt-1.5">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                  ))}

                </div>

                {/* Reply Form */}
                {selectedTicket.status !== "resolved" && (
                  <form onSubmit={handleReplySubmit} className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type reply message for user..."
                      className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1 shrink-0"
                    >
                      Reply <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-12 text-center text-xs text-slate-400 dark:text-zinc-500">
                Select a ticket from the left panel to reply.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
