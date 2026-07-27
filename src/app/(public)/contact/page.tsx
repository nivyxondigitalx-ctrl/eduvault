"use client";

import React, { useState } from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Thank you! Your message has been sent to our academic helpdesk.");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 text-slate-700 dark:text-zinc-300">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
                Contact Us
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Have questions about billing, dealer registration, or DMCA copyright notices? Send us a message.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>nivyxondigitalx@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>+91 7550321307</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>ERODE, TAMILNADU</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aravind Swamy"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl min-h-[100px]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1"
              >
                {submitting ? "Sending..." : "Send Message"} <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
