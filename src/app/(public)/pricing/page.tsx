"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { ShieldCheck, HelpCircle, ArrowRight, Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const { subscriptionPlans, currentUser, studentProfiles, subscribeToPlan } = useDemo();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const studentProfile = currentUser ? studentProfiles[currentUser.id] : null;

  const handleSubscribe = (planId: string) => {
    if (!currentUser) {
      toast.info("Please sign in as a student to subscribe.");
      router.push("/login");
      return;
    }

    if (currentUser.role !== "student") {
      toast.error("Subscriptions are only available for Student accounts.");
      return;
    }

    setLoadingPlanId(planId);
    // Simulate payment loading split screen
    setTimeout(() => {
      subscribeToPlan(planId);
      setLoadingPlanId(null);
      toast.success("Subscription updated successfully!");
      router.push("/student/subscription");
    }, 1200);
  };

  const faqs = [
    { q: "How does the shared subscription pool work?", a: "A portion of your monthly subscription is pooled together and distributed directly to dealers and content creators based on how many unique students download their verified resources." },
    { q: "Can I cancel my subscription anytime?", a: "Yes, you can manage and cancel your mock subscription directly from your student dashboard settings." },
    { q: "What's the difference between ad-unlocks and subscription?", a: "Ad-unlocks require watching a simulated 10-second advertisement and only grant access for 24 hours. Subscribers get instant ad-free access to all subscription-eligible files permanently while subscribed." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Affordable Academic Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
            Plans for Every Study Budget
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
            Choose a plan that fits your prep cycle. Academic subscriptions support verified dealer contributions directly.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-1 mt-8 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${billingCycle === "monthly" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400"}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${billingCycle === "yearly" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400"}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {subscriptionPlans.map((plan) => {
            const isFree = plan.price === 0;
            const isCurrent = studentProfile?.subscriptionPlanId === plan.id;
            
            // Apply discount for yearly cycle if applicable
            let finalPrice = plan.price;
            if (billingCycle === "yearly" && !isFree) {
              finalPrice = Math.round(plan.price * 12 * 0.8);
            }

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-zinc-900 border rounded-3xl p-6 shadow-md flex flex-col justify-between relative transition-all hover:shadow-xl ${
                  plan.id === "plan-plus"
                    ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10"
                    : "border-slate-100 dark:border-zinc-800"
                }`}
              >
                {/* Popularity Badge */}
                {plan.id === "plan-plus" && (
                  <span className="absolute top-0 right-6 transform -translate-y-1/2 px-2.5 py-1 bg-indigo-600 text-white text-[9px] uppercase tracking-widest font-black rounded-full">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-zinc-50 capitalize">{plan.name}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase mt-1">
                    {plan.activeSubscribers} active students
                  </p>

                  {/* Price */}
                  <div className="my-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-zinc-50">
                      {isFree ? "₹0" : formatCurrency(finalPrice)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {isFree ? " / forever" : billingCycle === "monthly" ? " / month" : " / year"}
                    </span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400 pt-6 border-t border-slate-50 dark:border-zinc-800/40">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {plan.discountPercentage > 0 && (
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>{plan.discountPercentage}% discount</strong> on selected premium-only items.
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Submit Action */}
                <div className="pt-8">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrent || loadingPlanId === plan.id}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-default"
                        : plan.id === "plan-plus"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                        : "bg-slate-900 hover:bg-slate-950 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      "Loading Checkout..."
                    ) : isCurrent ? (
                      "Active Plan"
                    ) : (
                      <>
                        Select Plan <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <section className="mt-24 max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-black text-slate-950 dark:text-zinc-50 tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <h4 className="font-bold text-xs text-slate-900 dark:text-zinc-50 flex items-start gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                  {f.q}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2.5 leading-relaxed pl-6">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
