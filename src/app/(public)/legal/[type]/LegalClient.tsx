"use client";

import React from "react";
import { Navbar } from "../../../../components/layout/Navbar";
import { Footer } from "../../../../components/layout/Footer";
import { ShieldCheck, Scale, FileText, Ban } from "lucide-react";

export default function LegalClient({ type }: { type: string }) {
  
  const getPolicyContent = () => {
    switch (type) {
      case "privacy":
        return {
          title: "Privacy Policy",
          icon: ShieldCheck,
          text: "KalviNest respects your privacy and is committed to protecting your personal data. We do not store real payment credentials, card numbers, or government identifiers in browser localStorage. Any email and student account names processed in this demonstration are stored purely client-side inside local browser storage. If you choose to clear your browser history or reset the demo, this details will be erased.",
        };
      case "refund":
        return {
          title: "Refund Policy",
          icon: Ban,
          text: "Since all resources purchased on KalviNest are downloadable digital products (PDFs, study notes, answered question papers), we do not support general refunds once a document is unlocked or downloaded. If you experience file corruption, incorrect uploads, or missing pages, you may report the material or submit a helpdesk ticket to request an adjustment.",
        };
      case "dmca":
        return {
          title: "DMCA & Copyright Takedown Policy",
          icon: Scale,
          text: "KalviNest complies with copyright protection guidelines. If you believe any study material uploaded by our verified dealers infringes upon your copyright (e.g. copyright notes, university protected textbook pages), please file a copyright claim report. Main Admin will review the file, suspend access, and message the dealer. We enforce strict policies against repeat copyright infringement.",
        };
      case "terms":
      default:
        return {
          title: "Terms of Service",
          icon: FileText,
          text: "By accessing the KalviNest website and browsing educational study guides, notes, and keys, you agree to comply with academic integrity policies. Resources uploaded are for personal preparation reference only. Sharing premium materials on public channels, violating author copyright, or bypassing ad-unlock countdowns constitutes a violation of these terms.",
        };
    }
  };

  const policy = getPolicyContent();
  const Icon = policy.icon;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 text-slate-700 dark:text-zinc-300">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-none">
              {policy.title}
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-slate-800 dark:text-zinc-100">
              Last updated: July 17, 2026
            </p>
            <p>{policy.text}</p>
            
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 pt-4">1. Academic & Student Integrity</h3>
            <p>
              Users must use the platform responsibly. Materials are intended as supplementary study aids and must not be used to cheat in official university or college examinations.
            </p>

            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 pt-4">2. Digital Downloads</h3>
            <p>
              Unlocked documents are stored in your student dashboard library. Ad-unlocked files expire after 24 hours. Premium buyout files remain in library permanently.
            </p>

            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 pt-4">3. Content Ownership</h3>
            <p>
              All copyrights belong to the respective authors and content dealers. Unauthorized distribution of purchased PDFs is strictly prohibited.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
