"use client";

import React from "react";
import { FileText } from "lucide-react";
import { University } from "../../types";

interface DocumentThumbnailProps {
  material: {
    id: string;
    title: string;
    subjectCode: string;
    category: string;
    examMonth: string;
    examYear: string;
    pageCount: number;
    thumbnailStyle?: string;
  };
  size?: "sm" | "md" | "lg";
}

export const DocumentThumbnail: React.FC<DocumentThumbnailProps> = ({ material, size = "lg" }) => {
  const categoryLabel = material.category
    ? material.category.replace("_", " ").toUpperCase()
    : "SOLVED KEY";

  const isQuestionPaper = material.category === "question_paper";

  // Large horizontal card style (e.g. Browse cards)
  if (size === "lg") {
    return (
      <div className="aspect-[16/10] w-full bg-white dark:bg-zinc-800 border-b border-slate-100 dark:border-zinc-800/80 p-4 flex flex-col justify-between relative overflow-hidden group-hover:opacity-95 transition-opacity">
        {/* Left page margin line */}
        <div className="absolute top-0 left-4 w-px h-full bg-rose-200 dark:bg-rose-950/40" />

        {/* Top Header: University Stamp */}
        <div className="text-center pl-4 border-b border-slate-100 dark:border-zinc-800/60 pb-1">
          <span className="text-[8px] font-black tracking-widest text-slate-400 dark:text-zinc-500 uppercase font-sans">
            UNIVERSITY EXAMINATION REFERENCE
          </span>
        </div>

        {/* Center Title and Code details */}
        <div className="pl-4 my-auto space-y-1.5 text-center flex flex-col items-center">
          <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow-sm ${
            isQuestionPaper 
              ? "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-transparent" 
              : "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-transparent"
          }`}>
            {categoryLabel}
          </span>
          <h4 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 leading-snug line-clamp-2 tracking-wide font-sans">
            {material.title}
          </h4>
          <span className="font-mono text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-100/40">
            {material.subjectCode}
          </span>
        </div>

        {/* Footer date & page count */}
        <div className="pl-4 flex justify-between items-center text-[8px] font-bold text-slate-400 border-t border-slate-50 dark:border-zinc-800/40 pt-1.5">
          <span>DATE: {material.examMonth} {material.examYear}</span>
          <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700 rounded text-slate-500 font-mono">
            {material.pageCount} Pages
          </span>
        </div>
      </div>
    );
  }

  // Small vertical portrait page list (e.g. sidebar downloads or library)
  return (
    <div className="w-10 h-14 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 flex flex-col justify-between relative overflow-hidden shadow-sm shrink-0">
      {/* Left page margin line */}
      <div className="absolute top-0 left-2 w-px h-full bg-rose-200 dark:bg-rose-950/40" />

      {/* Header code */}
      <span className="text-[5px] pl-2 text-center font-bold text-indigo-600 dark:text-indigo-400 block uppercase truncate font-mono">
        {material.subjectCode}
      </span>

      {/* Title / Category */}
      <div className="pl-2 w-full text-center flex flex-col items-center my-auto">
        <span className={`px-1 py-0.2 rounded-[2px] text-[4px] font-black uppercase ${
          isQuestionPaper ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
        }`}>
          {isQuestionPaper ? "QP" : "KEY"}
        </span>
        <p className="text-[5px] font-extrabold text-slate-700 dark:text-zinc-300 mt-0.5 line-clamp-2 leading-tight tracking-tighter">
          {material.title}
        </p>
      </div>

      {/* Footer */}
      <div className="pl-2 flex justify-between text-[4px] font-bold text-slate-400">
        <span>{material.examYear}</span>
        <span>{material.pageCount}p</span>
      </div>
    </div>
  );
};
