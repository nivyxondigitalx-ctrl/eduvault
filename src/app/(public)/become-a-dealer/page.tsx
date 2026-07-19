"use client";

import React, { useState } from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { useDemo } from "../../../lib/context";
import { ArrowRight, Briefcase, CheckCircle, Mail, Phone, ShieldCheck, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function BecomeADealerPage() {
  const { colleges, saveUsers, users } = useDemo();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !pan || selectedColleges.length === 0) {
      toast.error("Please fill in all fields and select at least one college.");
      return;
    }
    if (!terms) {
      toast.error("You must accept the Dealer Terms & Conditions.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Simulate registering user as a pending dealer
      const dealerExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!dealerExists) {
        const newUser = {
          id: "usr-dealer-" + Math.floor(100 + Math.random() * 900),
          email,
          name,
          role: "dealer" as const,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          createdAt: new Date().toISOString(),
        };
        saveUsers([...users, newUser]);
      }

      setLoading(false);
      toast.success("Redirecting to WhatsApp to complete registration...");
      
      const whatsappText = `Hello! I would like to join as a Dealer on EduVault.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPAN: ${pan}`;
      const whatsappUrl = `https://wa.me/917550321307?text=${encodeURIComponent(whatsappText)}`;
      window.location.href = whatsappUrl;
    }, 1000);
  };

  const handleCollegeToggle = (id: string) => {
    const idx = selectedColleges.indexOf(id);
    if (idx > -1) {
      setSelectedColleges(selectedColleges.filter((x) => x !== id));
    } else {
      setSelectedColleges([...selectedColleges, id]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        
        {submitted ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
              Application Under Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Thank you for applying to become an EduVault Verified Content Provider. 
              We have generated your demo dealer credentials. Log in using <strong>{email}</strong> once the Main Admin approves your request.
            </p>
            <div className="pt-4">
              <a
                href="/login"
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow"
              >
                Go to Sign In <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            
            {/* Info Panel column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-4">
                  <Briefcase className="w-3.5 h-3.5" /> Earn as a Provider
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
                  Publish & Earn Revenue Share
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Earn up to 80% net distributable share by uploading solved notes and question key explanations for Tamil Nadu college syllabuses.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-400">
                <div className="flex gap-2 items-start">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-200">Commission Tiers</span>
                    <p className="mt-0.5 leading-relaxed">Main Admin configure splits based on dealer status (70%, 75%, 80%).</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-200">Shared pool royalties</span>
                    <p className="mt-0.5 leading-relaxed">Subscribers downloads distribute pool allocation share directly into your ledger.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request form column */}
            <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-50 mb-6 uppercase tracking-wider">
                Dealer Application Form
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sanjay Kumar"
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dealer@mail.com"
                      className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Pan Card Number</label>
                  <input
                    type="text"
                    required
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                  />
                </div>

                {/* Colleges grid selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                    Target Institutions (Select one or more)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-slate-100 dark:border-zinc-800/80 rounded-xl p-3 space-y-2 bg-slate-50 dark:bg-zinc-800/20">
                    {colleges.map((coll) => (
                      <label key={coll.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedColleges.includes(coll.id)}
                          onChange={() => handleCollegeToggle(coll.id)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{coll.name} ({coll.code})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>I agree to the Dealer Publishing Terms of Service.</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                >
                  {loading ? "Submitting Request..." : "Submit Dealer Application"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
