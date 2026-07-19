"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLogo } from "../../../components/shared/AppLogo";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Password reset code sent to: " + email);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <AppLogo className="justify-center mb-6" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
          Enter your email address and we'll send you a recovery code
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-zinc-800 sm:rounded-3xl sm:px-10">
          
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50">
                Check your inbox
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal max-w-xs mx-auto">
                We have sent a simulated password recovery code to <strong>{email}</strong>. 
                Please enter the code to reset your password.
              </p>
              <div className="pt-4">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  Verify Code Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu.in"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? "Sending link..." : "Send Verification Code"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
