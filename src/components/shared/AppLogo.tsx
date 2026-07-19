"use client";

import React from "react";
import Link from "next/link";

interface AppLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "", iconOnly = false }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 shadow-md shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Graduation Cap */}
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          {/* Document Sheet */}
          <path d="M14 15h3v2h-3z" strokeWidth="1.5" />
        </svg>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">V</span>
        </div>
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 group-hover:text-indigo-600 transition-colors">
            Edu<span className="text-indigo-600 dark:text-indigo-400">Vault</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase leading-none">
            Material Hub
          </span>
        </div>
      )}
    </Link>
  );
};
