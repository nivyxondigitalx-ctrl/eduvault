"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { useDemo } from "../../../lib/context";
import { RatingDisplay } from "../../../components/shared/RatingDisplay";
import { AccessBadge } from "../../../components/shared/AccessBadge";
import { formatCurrency } from "../../../lib/storage";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  X,
  FileText,
  UserCheck,
  Download,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    materials,
    universities,
    colleges,
    departments,
    regulations,
    semesters,
    subjects,
    addToCart,
    cart,
    currentUser,
  } = useDemo();

  // Filters state from URL query or UI state
  const [selectedUniv, setSelectedUniv] = useState(searchParams.get("univ") || "");
  const [selectedColl, setSelectedColl] = useState(searchParams.get("coll") || "");
  const [selectedDept, setSelectedDept] = useState(searchParams.get("dept") || "");
  const [selectedSem, setSelectedSem] = useState(searchParams.get("sem") || "");
  const [selectedSubj, setSelectedSubj] = useState(searchParams.get("subj") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [selectedAccess, setSelectedAccess] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("newest");
  
  // UI States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync state if URL changes
  useEffect(() => {
    setSelectedUniv(searchParams.get("univ") || "");
    setSelectedColl(searchParams.get("coll") || "");
    setSelectedDept(searchParams.get("dept") || "");
    setSelectedSem(searchParams.get("sem") || "");
    setSelectedSubj(searchParams.get("subj") || "");
    setSelectedCat(searchParams.get("category") || "");
    setSearchKeyword(searchParams.get("q") || "");
  }, [searchParams]);

  // Apply filters
  const filteredMaterials = materials.filter((mat) => {
    // Must be approved to show publicly
    if (mat.status !== "approved") return false;

    if (selectedUniv && mat.universityId !== selectedUniv) return false;
    if (selectedColl && mat.collegeId !== selectedColl) return false;
    if (selectedDept && mat.departmentId !== selectedDept) return false;
    if (selectedSem && mat.semesterId !== selectedSem) return false;
    if (selectedSubj && mat.subjectId !== selectedSubj) return false;
    if (selectedCat && mat.category !== selectedCat) return false;
    if (selectedAccess && !mat.accessModes.includes(selectedAccess as any)) return false;

    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      const titleMatches = mat.title.toLowerCase().includes(kw);
      const descMatches = mat.description.toLowerCase().includes(kw);
      const codeMatches = mat.subjectCode.toLowerCase().includes(kw);
      const tagsMatches = mat.tags.some(t => t.toLowerCase().includes(kw));
      if (!titleMatches && !descMatches && !codeMatches && !tagsMatches) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "downloadCount") {
      return b.downloadCount - a.downloadCount;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "price-asc") {
      return (a.price - a.discount) - (b.price - b.discount);
    }
    if (sortBy === "price-desc") {
      return (b.price - b.discount) - (a.price - a.discount);
    }
    return 0;
  });

  // Slicing pagination
  const totalItems = sortedMaterials.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedMaterials = sortedMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearAllFilters = () => {
    setSelectedUniv("");
    setSelectedColl("");
    setSelectedDept("");
    setSelectedSem("");
    setSelectedSubj("");
    setSelectedCat("");
    setSelectedAccess("");
    setSearchKeyword("");
    router.push("/browse");
  };

  const handleAddToCartClick = (e: React.MouseEvent, mat: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: mat.id,
      title: mat.title,
      price: mat.price,
      discount: mat.discount,
      category: mat.category,
      subjectCode: mat.subjectCode,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Breadcrumb / Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              Browse Materials Catalog
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Showing {totalItems} verified documents based on your search filters.
            </p>
          </div>

          {/* Quick controls (Sort and View toggle) */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-zinc-900 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="downloadCount">Sort by: Popularity</option>
              <option value="rating">Sort by: High Rating</option>
              <option value="price-asc">Sort by: Price Low-High</option>
              <option value="price-desc">Sort by: Price High-Low</option>
            </select>

            <div className="flex border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-0.5 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg ${viewMode === "grid" ? "bg-slate-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg ${viewMode === "list" ? "bg-slate-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden p-2 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-slate-600 dark:text-zinc-300 flex items-center gap-1.5 text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          
          {/* DESKTOP FILTER PANEL SIDEBAR */}
          <aside className="w-64 shrink-0 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-5 hidden lg:block space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider">
                Refine Search
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* College Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                College Affiliation
              </label>
              <select
                value={selectedColl}
                onChange={(e) => {
                  setSelectedColl(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                <option value="">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedSubj("");
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Name Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Subject Name
              </label>
              <select
                value={selectedSubj}
                onChange={(e) => {
                  setSelectedSubj(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                <option value="">All Subjects</option>
                {subjects
                  .filter((s) => !selectedDept || s.departmentId === selectedDept)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subject / Course Code Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Subject Code
              </label>
              <select
                value={selectedSubj}
                onChange={(e) => {
                  setSelectedSubj(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                <option value="">All Codes</option>
                {subjects
                  .filter((s) => !selectedDept || s.departmentId === selectedDept)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}
                    </option>
                  ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Resource Category
              </label>
              <select
                value={selectedCat}
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl capitalize"
              >
                <option value="">All Categories</option>
                <option value="study_material">Study Material</option>
                <option value="notes">Lecture Notes</option>
                <option value="question_paper">Question Paper</option>
                <option value="important_questions">Important Questions</option>
                <option value="model_answer">Model Answer</option>
                <option value="answer_key">Answer Key</option>
              </select>
            </div>

            {/* Access Mode */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Access Type
              </label>
              <select
                value={selectedAccess}
                onChange={(e) => {
                  setSelectedAccess(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                <option value="">All Access Types</option>
                <option value="free">Free Direct Download</option>
                <option value="ad_unlock">Ad-Unlock</option>
                <option value="purchase">Premium Buyout</option>
                <option value="subscription">Subscription Eligible</option>
              </select>
            </div>

            {/* Search filter keyword input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
                Keywords
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Subject code, tags..."
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-medium rounded-xl"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword("")}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS DIRECTORY GRID/LIST VIEW */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Filter chips active */}
            {(selectedUniv || selectedColl || selectedDept || selectedCat || selectedAccess || searchKeyword) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Filters:
                </span>
                
                {selectedSubj && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold">
                    Subject: {subjects.find(s => s.id === selectedSubj)?.code}
                    <button onClick={() => setSelectedSubj("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedColl && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold">
                    Coll: {colleges.find(c => c.id === selectedColl)?.code}
                    <button onClick={() => setSelectedColl("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedDept && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold">
                    Dept: {departments.find(d => d.id === selectedDept)?.code}
                    <button onClick={() => setSelectedDept("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedCat && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold capitalize">
                    {selectedCat.replace("_", " ")}
                    <button onClick={() => setSelectedCat("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedAccess && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold capitalize">
                    Access: {selectedAccess.replace("_", " ")}
                    <button onClick={() => setSelectedAccess("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchKeyword && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-semibold">
                    Keyword: {searchKeyword}
                    <button onClick={() => setSearchKeyword("")}><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* RESULTS CONTENT */}
            {displayedMaterials.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
                <AlertCircle className="w-12 h-12 text-slate-400 dark:text-zinc-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">No Materials Found</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  We couldn't find any resources matching your exact combination of college, department, category, or keyword filters. Try broadening your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset Search
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedMaterials.map((mat) => (
                  <Link
                    key={mat.id}
                    href={`/material/${mat.slug}`}
                    className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail styling */}
                      <div className={`aspect-[16/10] bg-gradient-to-tr ${mat.thumbnailStyle} p-4 flex flex-col justify-between text-white relative`}>
                        <span className="self-start px-2 py-0.5 bg-white/20 text-[9px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                          {mat.category.replace("_", " ")}
                        </span>
                        <div>
                          <span className="text-[9px] font-mono opacity-80 block tracking-widest">{mat.subjectCode}</span>
                          <h3 className="font-bold text-xs mt-0.5 leading-snug line-clamp-2">{mat.title}</h3>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-4 space-y-3">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold leading-none">
                          {mat.examType} Exam • {mat.examMonth} {mat.examYear}
                        </span>

                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {mat.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 pt-1.5 border-t border-slate-50 dark:border-zinc-800/40">
                          <span>{mat.pageCount} pages</span>
                          <span className="font-semibold text-slate-600 dark:text-zinc-300">
                            {colleges.find(c => c.id === mat.collegeId)?.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom buy panel */}
                    <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40">
                      <RatingDisplay rating={mat.rating} count={mat.reviewCount} size="sm" />
                      
                      <div className="flex items-center gap-2">
                        {currentUser?.role === "student" && mat.accessModes.includes("purchase") && !cart.some(c => c.id === mat.id) && (
                          <button
                            onClick={(e) => handleAddToCartClick(e, mat)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl"
                            title="Add to Cart"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {displayedMaterials.map((mat) => (
                  <Link
                    key={mat.id}
                    href={`/material/${mat.slug}`}
                    className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      {/* Left icon wrapper */}
                      <div className={`w-12 h-16 rounded-xl bg-gradient-to-tr ${mat.thumbnailStyle} flex flex-col justify-center items-center text-white text-[10px] font-bold shrink-0 shadow-sm`}>
                        {mat.subjectCode.slice(0, 2)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[8px] font-bold rounded uppercase">
                            {mat.category.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                            {mat.subjectCode}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {mat.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                          {mat.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side stats/buy */}
                    <div className="flex items-center gap-6 self-end sm:self-center shrink-0">
                      <div className="text-right hidden sm:block">
                        <RatingDisplay rating={mat.rating} count={mat.reviewCount} size="sm" className="justify-end" />
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
                          {mat.pageCount} pages • {mat.downloadCount} downloads
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentUser?.role === "student" && mat.accessModes.includes("purchase") && !cart.some(c => c.id === mat.id) && (
                          <button
                            onClick={(e) => handleAddToCartClick(e, mat)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            Add to Cart
                          </button>
                        )}
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 px-3">
                          {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINATION PANEL */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-6 mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold rounded-xl bg-white dark:bg-zinc-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Page <strong className="text-slate-800 dark:text-zinc-100">{currentPage}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold rounded-xl bg-white dark:bg-zinc-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          
          <div className="relative transform overflow-hidden bg-white dark:bg-zinc-900 shadow-xl transition-all w-full max-w-sm ml-auto h-full flex flex-col p-6 z-50 border-l border-slate-100 dark:border-zinc-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider">
                Refine Search
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* College Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">College Affiliation</label>
                <select
                  value={selectedColl}
                  onChange={(e) => {
                    setSelectedColl(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Dept Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedSubj("");
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subject Name</label>
                <select
                  value={selectedSubj}
                  onChange={(e) => {
                    setSelectedSubj(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="">All Subjects</option>
                  {subjects
                    .filter((s) => !selectedDept || s.departmentId === selectedDept)
                    .map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
              </div>

              {/* Subject Code Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subject Code</label>
                <select
                  value={selectedSubj}
                  onChange={(e) => {
                    setSelectedSubj(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="">All Codes</option>
                  {subjects
                    .filter((s) => !selectedDept || s.departmentId === selectedDept)
                    .map((s) => (
                      <option key={s.id} value={s.id}>{s.code}</option>
                    ))}
                </select>
              </div>

              {/* Cat selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category</label>
                <select
                  value={selectedCat}
                  onChange={(e) => {
                    setSelectedCat(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl capitalize"
                >
                  <option value="">All Categories</option>
                  <option value="study_material">Study Material</option>
                  <option value="notes">Lecture Notes</option>
                  <option value="question_paper">Question Paper</option>
                  <option value="important_questions">Important Questions</option>
                  <option value="model_answer">Model Answer</option>
                  <option value="answer_key">Answer Key</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={clearAllFilters}
                className="py-2.5 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 text-xs font-semibold text-slate-500">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
