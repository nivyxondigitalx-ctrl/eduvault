"use client";

import React, { useState } from "react";
import { Lock, ChevronLeft, ChevronRight, Eye, RefreshCw } from "lucide-react";

interface PDFPreviewProps {
  title: string;
  totalPageCount: number;
  previewPageCount: number;
  isUnlocked: boolean;
  onUnlockRequest?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  title,
  totalPageCount,
  previewPageCount,
  isUnlocked,
  onUnlockRequest,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    const limit = isUnlocked ? totalPageCount : previewPageCount + 1;
    if (currentPage < limit) setCurrentPage((p) => p + 1);
  };

  const isCurrentPageLocked = !isUnlocked && currentPage > previewPageCount;

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-zinc-300">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold truncate max-w-[200px] sm:max-w-xs">
            {title}
          </span>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1 rounded-lg hover:bg-slate-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono">
            Page {currentPage} of {!isUnlocked ? `${totalPageCount} (Preview limit: ${previewPageCount})` : totalPageCount}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === (isUnlocked ? totalPageCount : previewPageCount + 1)}
            className="p-1 rounded-lg hover:bg-slate-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Page View Area */}
      <div className="relative flex-1 aspect-[3/4] bg-slate-800 flex items-center justify-center p-6 min-h-[350px] overflow-hidden select-none">
        
        {isCurrentPageLocked ? (
          /* BLURRED PAGE WITH WATERMARK / UNLOCK CTA */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-950/40 backdrop-blur-md">
            
            {/* Blurred simulated page structure */}
            <div className="absolute inset-0 bg-slate-900/60 p-8 flex flex-col gap-4 filter blur-[6px] pointer-events-none opacity-40">
              <div className="h-6 bg-slate-700 w-1/3 rounded"></div>
              <div className="h-4 bg-slate-700 w-full rounded"></div>
              <div className="h-4 bg-slate-700 w-full rounded"></div>
              <div className="h-4 bg-slate-700 w-4/5 rounded"></div>
              <div className="h-28 bg-slate-700 w-full rounded-lg mt-4"></div>
              <div className="h-4 bg-slate-700 w-full rounded"></div>
              <div className="h-4 bg-slate-700 w-full rounded"></div>
              <div className="h-4 bg-slate-700 w-3/4 rounded"></div>
            </div>

            {/* Locked Content Card */}
            <div className="relative z-20 bg-slate-900/90 dark:bg-black/90 p-8 rounded-3xl max-w-sm border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              
              <h4 className="text-base font-bold text-white mb-2">
                Preview Limit Reached
              </h4>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                You are viewing a watermarked preview of this document. Unlock the full document to read and download all {totalPageCount} pages.
              </p>

              {onUnlockRequest ? (
                <button
                  onClick={onUnlockRequest}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-900/20 transition-all"
                >
                  Unlock Document
                </button>
              ) : (
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  Select access option on the right to unlock
                </span>
              )}
            </div>

          </div>
        ) : (
          /* ACTUAL VISIBLE PREVIEW PAGE CONTENT */
          <div className="w-full h-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-lg border border-slate-700 p-8 flex flex-col text-slate-800 dark:text-zinc-200 overflow-hidden relative">
            
            {/* Watermark diagonal text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-[0.03] dark:opacity-[0.02]">
              <div className="text-7xl font-bold tracking-widest uppercase transform -rotate-45">
                EduVault Preview
              </div>
            </div>

            {/* Simulated Academic content text */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                EduVault Certified Notes
              </span>
              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
                Page {currentPage} of {totalPageCount}
              </span>
            </div>

            {currentPage === 1 && (
              <div className="flex-1 flex flex-col justify-center text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg">
                  {title.slice(0, 2).toUpperCase()}
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-zinc-50 leading-snug mb-3">
                  {title}
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent w-2/3 mx-auto my-3"></div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                  University Board Exam Prep Study Guide
                </p>
                <div className="mt-8 space-y-2">
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded mx-auto"></div>
                  <div className="h-2 w-1/3 bg-slate-100 dark:bg-zinc-900 rounded mx-auto"></div>
                </div>
              </div>
            )}

            {currentPage > 1 && (
              <div className="flex-1 space-y-4 text-left">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                  Unit {currentPage - 1}: Core Concepts & Principles
                </h3>
                <div className="space-y-2.5">
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                    Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.
                  </p>
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 my-3">
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      Important Formula / Definition
                    </span>
                    <code className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300">
                      f(x) = dx/dy * &Sigma;(h * k) &sup2;
                    </code>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                    Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto border-t border-slate-100 dark:border-zinc-800 pt-3 flex justify-between items-center text-[9px] text-slate-400 dark:text-zinc-500">
              <span>Verified Academy Content Provider</span>
              <span>EduVault Marketplace</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
