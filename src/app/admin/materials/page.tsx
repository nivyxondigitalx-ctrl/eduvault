"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { AccessBadge } from "../../../components/shared/AccessBadge";
import { PDFPreview } from "../../../components/shared/PDFPreview";
import { formatCurrency } from "../../../lib/storage";
import { FileText, Eye, CheckCircle2, ShieldAlert, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminMaterialsPage() {
  const { materials, moderateMaterial, colleges, subjects } = useDemo();
  const [selectedMat, setSelectedMat] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const pendingMaterials = materials.filter((m) => m.status === "pending");
  const otherMaterials = materials.filter((m) => m.status !== "pending");

  const handleApprove = () => {
    if (!selectedMat) return;
    moderateMaterial(selectedMat.id, "approved");
    toast.success("Document approved successfully!");
    setSelectedMat(null);
    setShowRejectForm(false);
    setRejectReason("");
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMat || !rejectReason) return;
    moderateMaterial(selectedMat.id, "rejected", rejectReason);
    toast.info("Document rejected with feedback reason.");
    setSelectedMat(null);
    setShowRejectForm(false);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Materials Moderation Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Review student requests, verify dealer uploads, and enforce copyright guidelines.
        </p>
      </div>

      {/* Pending moderation queue */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
          Pending Moderation Queue ({pendingMaterials.length})
        </h2>

        {pendingMaterials.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl text-center text-xs text-slate-400">
            All submitted materials have been moderated.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <span className="text-[8px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {mat.category.replace("_", " ")}
                  </span>
                  <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-200 mt-2 line-clamp-2">
                    {mat.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{mat.subjectCode} • {mat.dealerName}</p>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-zinc-800/40 mt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-950 dark:text-zinc-55">
                    {mat.price > 0 ? formatCurrency(mat.price - mat.discount) : "FREE"}
                  </span>
                  <button
                    onClick={() => setSelectedMat(mat)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold shadow-sm"
                  >
                    Open Moderation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Moderated items list */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
        <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
          Moderated Materials Catalog ({otherMaterials.length})
        </h2>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">College Code</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                {otherMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="p-3">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{mat.title}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{mat.subjectCode}</span>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{mat.category.replace("_", " ")}</td>
                    <td className="p-3 font-semibold">{colleges.find(c => c.id === mat.collegeId)?.code}</td>
                    <td className="p-3 font-semibold">{mat.dealerName}</td>
                    <td className="p-3">
                      <StatusBadge status={mat.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DETAILED MODERATION DRAWER PANEL */}
      {selectedMat && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedMat(null)}></div>
          
          <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-100 dark:border-zinc-800 z-50 flex flex-col md:flex-row gap-6 max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMat(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT SIDE: Metadata */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[80vh]">
              <div className="border-b pb-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Review Metadata</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-1">{selectedMat.title}</h3>
              </div>

              <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Description</span>
                  <p className="mt-1 leading-relaxed bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border">{selectedMat.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">College Affiliation</span>
                    <strong className="text-slate-800 dark:text-zinc-200 mt-1 block">{colleges.find(c => c.id === selectedMat.collegeId)?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Syllabus Subject</span>
                    <strong className="text-slate-800 dark:text-zinc-200 mt-1 block">
                      {selectedMat.subjectCode} - {subjects.find(s => s.id === selectedMat.subjectId)?.name}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Access Mode</span>
                    <div className="flex gap-1 mt-1">
                      {selectedMat.accessModes.map((mode: any) => (
                        <AccessBadge key={mode} mode={mode} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Price Details</span>
                    <strong className="text-slate-800 dark:text-zinc-200 mt-1 block">
                      {selectedMat.price > 0 ? formatCurrency(selectedMat.price - selectedMat.discount) : "FREE"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {showRejectForm ? (
                <form onSubmit={handleRejectSubmit} className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                  <label className="block text-xs font-bold text-rose-600 uppercase">
                    Provide Rejection Reason
                  </label>
                  <textarea
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide details about formatting errors, incorrect questions solutions, or missing key files..."
                    className="w-full min-h-[80px] p-2.5 bg-slate-50 dark:bg-zinc-800 text-xs rounded-xl border border-rose-200"
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/60 mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleApprove}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Document
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="py-3 border border-rose-200 text-rose-600 rounded-2xl font-bold text-xs hover:bg-rose-50/50 flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" /> Reject Upload
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: PDF Preview sheet */}
            <div className="w-full md:w-[400px] max-h-[80vh] overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">PDF Document Sheet</span>
              <PDFPreview
                title={selectedMat.title}
                totalPageCount={selectedMat.pageCount}
                previewPageCount={selectedMat.previewPageCount}
                isUnlocked={true} // Admin has full view rights
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
