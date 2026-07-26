"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "../../../lib/context";
import { RatingDisplay } from "../../../components/shared/RatingDisplay";
import { formatCurrency } from "../../../lib/storage";
import { Heart, Trash2, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { DocumentThumbnail } from "../../../components/shared/DocumentThumbnail";

export default function StudentSavedPage() {
  const { wishlist, materials, toggleWishlist, colleges } = useDemo();

  const savedList = materials.filter((m) => wishlist.includes(m.id));

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast.info("Removed from saved list.");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Saved Resources
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Bookmark materials to purchase or unlock later when you start preparing for board exams.
        </p>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Heart className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Wishlist is empty</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
            You don't have any bookmarks saved. Click the heart icon on any document cards to bookmark them.
          </p>
          <Link
            href="/browse"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow"
          >
            Go to Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((mat) => (
            <Link
              key={mat.id}
              href={`/material/${mat.slug}`}
              className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative">
                  <DocumentThumbnail material={mat} size="lg" />
                  <button
                    onClick={(e) => handleRemove(e, mat.id)}
                    className="absolute top-4 right-4 p-1.5 bg-slate-100/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all shadow z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                    {mat.examType} Exam • {mat.examMonth} {mat.examYear}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/40">
                <RatingDisplay rating={mat.rating} size="sm" />
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
