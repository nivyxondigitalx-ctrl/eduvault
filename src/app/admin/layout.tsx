"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { useDemo } from "../../lib/context";
import { ShieldCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, initialized } = useDemo();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !currentUser) {
      router.push("/login");
    }
  }, [initialized, currentUser, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-indigo-600 animate-bounce" />
          <p className="text-xs font-semibold text-slate-500">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (currentUser && currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-2">This dashboard is restricted to Admin accounts. Your current role is: <strong className="capitalize">{currentUser.role}</strong>.</p>
          <button
            onClick={() => router.push(`/${currentUser.role}`)}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar Nav */}
        <Sidebar role="admin" />
        
        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50/50 dark:bg-zinc-950/20 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
