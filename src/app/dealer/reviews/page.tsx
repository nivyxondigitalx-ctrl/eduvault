"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import { RatingDisplay } from "../../../components/shared/RatingDisplay";
import { Star, MessageSquare, User } from "lucide-react";

export default function DealerReviewsPage() {
  const { reviews, materials, dealers, currentUser } = useDemo();

  const dealerProfile = dealers.find((d) => d.userId === currentUser?.id);
  const myMaterials = materials.filter((m) => m.dealerId === dealerProfile?.id);
  
  // Filter reviews matching my materials
  const myReviews = reviews.filter((r) =>
    myMaterials.some((m) => m.id === r.materialId)
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Student Reviews Feed
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          See student ratings, comments, and answers key validation feedback.
        </p>
      </div>

      {myReviews.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No Reviews Yet</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            None of your uploaded materials have received reviews or comments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myReviews.map((rev) => {
            const material = myMaterials.find((m) => m.id === rev.materialId);
            return (
              <div
                key={rev.id}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{rev.studentName}</p>
                      <RatingDisplay rating={rev.rating} size="sm" className="mt-0.5" />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl text-[10px] text-slate-500 dark:text-zinc-400">
                  On file: <strong className="text-indigo-600 dark:text-indigo-400">"{material?.title}"</strong>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
