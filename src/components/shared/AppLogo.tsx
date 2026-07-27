"use client";

import React from "react";
import Link from "next/link";

interface AppLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "", iconOnly = false }) => {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-sm shadow-indigo-150/40 transition-transform group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-8 h-8"
        >
          {/* Circular/Globe arcs */}
          <path
            d="M 50 12 A 38 38 0 0 1 88 50"
            fill="none"
            stroke="#00a2e8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 12 50 A 38 38 0 0 1 50 12"
            fill="none"
            stroke="#4cb050"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Graduation Cap at the top */}
          <path
            d="M 50 18 L 82 30 L 50 42 L 18 30 Z"
            fill="#0c2b5c"
          />
          <path
            d="M 32 37.5 V 47 C 32 52, 42 55, 50 55 C 58 55, 68 52, 68 47 V 37.5"
            fill="none"
            stroke="#0c2b5c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Tassel */}
          <circle cx="28" cy="46" r="2" fill="#fbc02d" />
          <path
            d="M 50 30 L 28 39 V 46"
            fill="none"
            stroke="#fbc02d"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Three book spines in nest */}
          {/* Green book */}
          <rect x="36" y="44" width="7" height="15" rx="1.5" fill="#4cb050" />
          {/* Blue/Cyan book */}
          <rect x="44.5" y="47.5" width="7" height="11.5" rx="1.5" fill="#00a2e8" />
          {/* Yellow/Orange book */}
          <rect x="53" y="50" width="7" height="9" rx="1.5" fill="#fbc02d" />

          {/* White sheet of paper */}
          <rect
            x="61.5" y="44" width="9.5" height="15" rx="1"
            fill="white"
            stroke="#0c2b5c"
            strokeWidth="2.5"
          />
          <line x1="64.5" y1="48" x2="68" y2="48" stroke="#0c2b5c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64.5" y1="51.5" x2="68" y2="51.5" stroke="#0c2b5c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64.5" y1="55" x2="67" y2="55" stroke="#0c2b5c" strokeWidth="1.5" strokeLinecap="round" />

          {/* Nest (interlaced twigs curved beneath the books) */}
          <path
            d="M 23 51 C 32 63, 68 63, 77 51"
            fill="none"
            stroke="#0c2b5c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 26 55 C 34 66, 66 66, 74 55"
            fill="none"
            stroke="#0c2b5c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 20 48 C 30 60, 70 60, 80 48"
            fill="none"
            stroke="#0c2b5c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Open Book pages at the bottom */}
          <path
            d="M 50 82 C 38 72, 16 72, 6 75 V 66 C 16 63, 38 63, 50 73 C 62 63, 84 63, 94 66 V 75 C 84 72, 62 72, 50 82 Z"
            fill="#0c2b5c"
          />
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 group-hover:opacity-90 transition-opacity">
            <span className="text-[#0c2b5c] dark:text-indigo-400">Kalvi</span><span className="text-[#4cb050] inline-flex items-center relative">Nest<span className="text-[10px] absolute -top-1 -right-2">🍃</span></span>
          </span>
          <span className="text-[7.5px] font-black tracking-widest text-slate-500 dark:text-zinc-400 uppercase leading-none mt-0.5">
            Learn. Grow. Succeed.
          </span>
        </div>
      )}
    </Link>
  );
};
