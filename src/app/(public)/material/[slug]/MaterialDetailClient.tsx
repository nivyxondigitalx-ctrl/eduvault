"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "../../../../lib/context";
import { Navbar } from "../../../../components/layout/Navbar";
import { Footer } from "../../../../components/layout/Footer";
import { RatingDisplay } from "../../../../components/shared/RatingDisplay";
import { AccessBadge } from "../../../../components/shared/AccessBadge";
import { PDFPreview } from "../../../../components/shared/PDFPreview";
import { AdModal } from "../../../../components/shared/AdModal";
import { formatCurrency } from "../../../../lib/storage";
import {
  BookOpen,
  FileText,
  Calendar,
  Layers,
  Heart,
  ShoppingCart,
  Download,
  AlertTriangle,
  Send,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function MaterialDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const {
    materials,
    universities,
    colleges,
    departments,
    regulations,
    semesters,
    subjects,
    currentUser,
    studentProfiles,
    addToCart,
    cart,
    toggleWishlist,
    wishlist,
    reviews,
    addReview,
    watchAdToUnlock,
  } = useDemo();

  const [activeTab, setActiveTab] = useState<"overview" | "preview" | "reviews">("overview");
  const [adModalOpen, setAdModalOpen] = useState(false);
  
  // Review form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Find material
  const mat = materials.find((m) => m.slug === slug);
  
  if (!mat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-bold">Resource Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The material you requested could not be located in our marketplace database.</p>
          <Link href="/browse" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Return to Browse
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const university = universities.find((u) => u.id === mat.universityId);
  const college = colleges.find((c) => c.id === mat.collegeId);
  const department = departments.find((d) => d.id === mat.departmentId);
  const semester = semesters.find((s) => s.id === mat.semesterId);
  const subject = subjects.find((s) => s.id === mat.subjectId);

  // Check student unlock access
  const isStudent = currentUser?.role === "student";
  const studentProfile = currentUser ? studentProfiles[currentUser.id] : null;
  const isSubscribed = studentProfile?.isSubscribed || false;

  const isAdUnlocked = studentProfile?.unlockedMaterialIds?.includes(mat.id) || false;
  const isPurchased = studentProfile?.unlockedMaterialIds?.includes(mat.id) || false; // in our mock storage, purchased items are added to unlockedMaterialIds
  
  const hasAccess = mat.price === 0 || 
                    isAdUnlocked || 
                    isPurchased || 
                    (mat.subscriptionEligible && isSubscribed);

  const isInCart = cart.some((c) => c.id === mat.id);
  const isWished = wishlist.includes(mat.id);

  const handleAction = () => {
    if (!currentUser) {
      toast.info("Please log in to unlock or purchase materials.");
      router.push("/login");
      return;
    }

    if (mat.price === 0) {
      handleDownload();
      return;
    }

    if (mat.subscriptionEligible && isSubscribed) {
      handleDownload();
      return;
    }

    if (mat.accessModes.includes("ad_unlock") && !isAdUnlocked) {
      setAdModalOpen(true);
      return;
    }

    if (mat.accessModes.includes("purchase")) {
      if (!isInCart) {
        addToCart({
          id: mat.id,
          title: mat.title,
          price: mat.price,
          discount: mat.discount,
          category: mat.category,
          subjectCode: mat.subjectCode,
        });
        toast.success("Added to cart!");
      }
      router.push("/student/cart");
    }
  };

  const handleDownload = () => {
    toast.success(`Downloading "${mat.title}" (${mat.fileSize})`);
    
    const link = document.createElement("a");
    link.href = mat.filePath || "/uploads/sample.pdf";
    // Keep it as a PDF file
    link.download = `${mat.title.replace(/[^a-zA-Z0-9.-]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to leave a review.");
      return;
    }
    if (!newComment) {
      toast.error("Please add a comment review.");
      return;
    }

    setReviewLoading(true);
    setTimeout(() => {
      addReview(mat.id, newRating, newComment);
      setNewComment("");
      setNewRating(5);
      setReviewLoading(false);
      toast.success("Review posted successfully!");
    }, 600);
  };

  const matReviews = reviews.filter((r) => r.materialId === mat.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Academic Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-500 font-semibold mb-6 flex-wrap">
          <Link href="/browse" className="hover:text-indigo-600">All</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/browse?univ=${mat.universityId}`} className="hover:text-indigo-600">{university?.code || "Univ"}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/browse?coll=${mat.collegeId}`} className="hover:text-indigo-600 truncate max-w-[120px]">{college?.code || "College"}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/browse?dept=${mat.departmentId}`} className="hover:text-indigo-600">{department?.code || "Dept"}</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{semester?.name}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-zinc-400 font-mono truncate max-w-[150px]">{mat.subjectCode} - {subject?.name}</span>
        </nav>

        {/* Main Details Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Preview & Tabs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Embedded simulated PDF previewer */}
            <PDFPreview
              title={mat.title}
              totalPageCount={mat.pageCount}
              previewPageCount={mat.previewPageCount}
              isUnlocked={hasAccess}
              onUnlockRequest={handleAction}
            />

            {/* Content Tabs */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
              
              <div className="flex border-b border-slate-100 dark:border-zinc-800 pb-3 mb-6 gap-6">
                {(["overview", "preview", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-1 text-xs font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === t
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    {t}
                    {activeTab === t && (
                      <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4 text-slate-600 dark:text-zinc-300">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Description</h3>
                    <p className="text-xs mt-2 leading-relaxed">{mat.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-zinc-800/40">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Regulation Year</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                        {regulations.find((r) => r.id === mat.regulationId)?.year || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Exam Date</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                        {mat.examMonth} {mat.examYear} ({mat.examType} Exam)
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Author / Content Provider</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5 flex items-center gap-1">
                        {mat.dealerName} {mat.dealerVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Language</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                        {mat.language}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Preview Details */}
              {activeTab === "preview" && (
                <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300">
                  <p>This is a certified academic catalog document details:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>File format: PDF format</li>
                    <li>Page size count: {mat.pageCount} pages</li>
                    <li>Previewable sheets limit: {mat.previewPageCount} pages</li>
                    <li>Security features: Watermarked, dynamic copy prevention, offline view ready</li>
                    <li>Total downloads: {mat.downloadCount} students</li>
                  </ul>
                </div>
              )}

              {/* Tab 3: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  
                  {/* Reviews Form */}
                  {currentUser && currentUser.role === "student" ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">Write a Review</span>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className={`w-6 h-6 text-lg transition-transform hover:scale-110 ${newRating >= star ? "text-amber-500" : "text-slate-300"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience using this study resource (e.g. helped with semester tests, detailed answer steps...)"
                        className="w-full min-h-[80px] p-3 bg-white dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 placeholder-slate-400 text-xs rounded-xl"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        {reviewLoading ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      Please log in as a student to submit a review.
                    </p>
                  )}

                  {/* Review lists */}
                  <div className="space-y-4">
                    {matReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50/50 dark:bg-zinc-800/20 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
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
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2.5 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                    {matReviews.length === 0 && (
                      <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-6">No student reviews written yet.</p>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* RIGHT: Sticky Purchase Card */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                    Access Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-zinc-50">
                      {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                    </span>
                    {mat.price > 0 && mat.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(mat.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {mat.accessModes.map(mode => (
                    <AccessBadge key={mode} mode={mode} />
                  ))}
                </div>
              </div>

              {/* Specs parameters lists */}
              <div className="py-5 space-y-3.5 text-xs text-slate-600 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span>Subject Code</span>
                  <span className="font-mono font-bold uppercase text-slate-800 dark:text-zinc-200">{mat.subjectCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Volume Size</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{mat.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Included Answers</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{mat.includesAnswerKey ? "Yes (Verified Key)" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Syllabus Regulation</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{regulations.find(r => r.id === mat.regulationId)?.year || "AU 2021"}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-5 space-y-3">
                
                {hasAccess ? (
                  /* ALREADY UNLOCKED CTA */
                  <button
                    onClick={handleDownload}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 dark:shadow-none transition-all flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Download className="w-4 h-4" /> Download Document
                  </button>
                ) : (
                  /* PRIMARY BUY/UNLOCK ACTION BUTTONS */
                  <>
                    <button
                      onClick={handleAction}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-1.5 text-xs"
                    >
                      {mat.accessModes.includes("ad_unlock") ? "Watch Ad to Unlock Free" : "Buy & Unlock Access"}
                    </button>
                    
                    {mat.accessModes.includes("purchase") && !hasAccess && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: mat.id,
                            title: mat.title,
                            price: mat.price,
                            discount: mat.discount,
                            category: mat.category,
                            subjectCode: mat.subjectCode,
                          });
                          toast.success("Added to cart!");
                        }}
                        disabled={isInCart}
                        className="w-full py-3 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl font-semibold text-xs hover:bg-slate-50 dark:hover:bg-zinc-800/50 disabled:opacity-40"
                      >
                        {isInCart ? "Already in Cart" : "Add to Cart"}
                      </button>
                    )}
                  </>
                )}

                {/* Wishlist toggle button */}
                <button
                  onClick={() => {
                    if (!currentUser) {
                      toast.info("Please sign in to save items.");
                      return;
                    }
                    toggleWishlist(mat.id);
                  }}
                  className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                    isWished
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-rose-500 text-rose-500" : ""}`} />
                  {isWished ? "Saved in Wishlist" : "Save to Wishlist"}
                </button>

              </div>

            </div>

            {/* Disclaimer Security Notice */}
            <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
                Security Disclaimer
              </span>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                All documents on EduVault are verified by content providers and subject to DMCA compliance and copyright verification standards.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Dynamic count countdown ad unlock modal */}
      <AdModal
        isOpen={adModalOpen}
        materialId={mat.id}
        materialTitle={mat.title}
        onClose={() => setAdModalOpen(false)}
        onSuccess={() => {
          setAdModalOpen(false);
          setActiveTab("preview");
        }}
      />

      <Footer />
    </div>
  );
}
