"use client";

import React from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    { q: "Is the material aligned to the latest Anna University syllabus?", a: "Yes, our filters support classifications by Regulation Year (e.g. Regulation 2021). All materials detail their associated syllabus regulations." },
    { q: "How can I become a content dealer?", a: "If you are a student representative, tutor, or professor with quality solved notes, head to the 'Become a Dealer' page and fill out the registry form. Once verified, you can upload files and request payouts." },
    { q: "How long do ad-unlocks last?", a: "Ad-unlocks last for exactly 24 hours from the completion of the countdown, after which you can re-watch an ad or purchase the file permanently." },
    { q: "Can I download files for offline view?", a: "Yes. Once unlocked (by purchase, subscription, or ad), the resource offers a Download PDF button allowing you to save it directly to your device local storage." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 text-slate-700 dark:text-zinc-300">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-none">
              FAQ & Help Center
            </h1>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
