"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDemo } from "../../../lib/context";
import { AppLogo } from "../../../components/shared/AppLogo";
import { KeyRound, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/** Google 'G' SVG icon */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, currentUser } = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "dealer" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show Google OAuth error if present
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_cancelled") toast.error("Google sign-in was cancelled.");
    else if (error === "google_token_failed") toast.error("Could not verify Google credentials. Try again.");
    else if (error === "google_unverified_email") toast.error("Your Google account email is not verified.");
    else if (error === "google_server_error") toast.error("A server error occurred with Google sign-in.");
    else if (error === "not_configured") toast.error("Google sign-in is not configured yet.");
    else if (error === "google_unauthorized_admin") toast.error("Unauthorized: Only the assigned administrator can log in as Admin.");
    else if (error === "google_unauthorized_dealer") toast.error("Unauthorized: Only the assigned dealer can log in as Dealer.");
  }, [searchParams]);

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (currentUser) {
      router.push(`/${currentUser.role}`);
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const success = await login(email, role, password);
      setLoading(false);
      if (success) {
        toast.success(`Welcome back! Logged in as ${role}`);
        router.push(`/${role}`);
      } else {
        toast.error("Invalid credentials. Please check your email and password.");
      }
    }, 800);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `/api/auth/google?role=${role}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">

      {/* Top Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* App Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
            <Image
              src="/eduvault-icon.png"
              alt="EduVault Icon"
              width={72}
              height={72}
              className="relative rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 ring-1 ring-indigo-100 dark:ring-indigo-900/50"
              priority
            />
          </div>
        </div>

        <AppLogo className="justify-center mb-4" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
          Access your personalized EduVault dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-slate-100 dark:border-zinc-800 shadow-xl rounded-3xl sm:px-10 transition-colors">

          {/* Role selector tab style */}
          <div className="flex bg-slate-50 dark:bg-zinc-800 p-1 rounded-2xl mb-6">
            {(["student", "dealer", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  role === r
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Google Sign-In Button */}
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 shadow-sm transition-all duration-200 hover:shadow-md group"
              id="google-signin-btn"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 font-medium">
                  or continue with email
                </span>
              </div>
            </div>
          </>

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
                  placeholder={`e.g. ${role}@eduvault.com`}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm rounded-xl"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 text-sm rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration reminder */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              New to EduVault?{" "}
              <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Register as Student
              </Link>
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800">
            <div className="text-center mb-3">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Quick Demo Fill
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setEmail("sanjay@gmail.com");
                  setPassword("password123");
                }}
                className="py-1.5 px-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors text-center"
              >
                🔑 Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("dealer");
                  setEmail("bala@gmail.com");
                  setPassword("password123");
                }}
                className="py-1.5 px-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors text-center"
              >
                💼 Dealer
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  setEmail("nivas@gmail.com");
                  setPassword("password123");
                }}
                className="py-1.5 px-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors text-center"
              >
                🎓 Student
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
        <div className="text-slate-500 dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
