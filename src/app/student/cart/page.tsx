"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Tag, Percent } from "lucide-react";
import { toast } from "sonner";

export default function StudentCartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, currentUser, studentProfiles, subscriptionPlans } = useDemo();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  // Calculate student subscription discounts
  let subDiscountPercent = 0;
  if (profile?.isSubscribed) {
    const plan = subscriptionPlans.find(p => p.id === profile.subscriptionPlanId);
    if (plan) {
      subDiscountPercent = plan.discountPercentage;
    }
  }

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  
  // Total discounts (sub discount + coupon)
  let discountPercent = subDiscountPercent;
  if (appliedCoupon === "EXAM50") {
    discountPercent = Math.max(discountPercent, 50);
  } else if (appliedCoupon === "FREEBIE") {
    discountPercent = 100;
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const netAmountBeforeTax = subtotal - discountAmount;
  const tax = Math.round(netAmountBeforeTax * 0.18); // 18% GST
  const netAmount = netAmountBeforeTax + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = couponCode.toUpperCase().trim();
    
    if (cleanCoupon === "EXAM50" || cleanCoupon === "FREEBIE") {
      setAppliedCoupon(cleanCoupon);
      toast.success(`Coupon code ${cleanCoupon} applied successfully!`);
    } else {
      toast.error("Invalid coupon code. Try 'EXAM50' or 'FREEBIE'.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  const handleProceed = () => {
    if (cart.length === 0) return;
    router.push(`/student/checkout?coupon=${appliedCoupon || ""}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Review your digital purchase items. Coupons or membership discounts apply below.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto">
            You don't have any premium resources added to your checkout basket.
          </p>
          <Link
            href="/browse"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow"
          >
            Browse Materials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center shadow-sm"
              >
                <div className="flex gap-3 items-center overflow-hidden">
                  <div className="w-9 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-[9px] shrink-0 font-mono">
                    {item.subjectCode.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[8px] bg-slate-50 dark:bg-zinc-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">
                      {item.category.replace("_", " ")}
                    </span>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-200 mt-1 truncate">
                      {item.title}
                    </h3>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{item.subjectCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                    {formatCurrency(item.price)}
                  </span>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.info("Removed item from cart.");
                    }}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                clearCart();
                toast.info("Cart cleared successfully.");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear Cart
            </button>

            {/* Coupon application block */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1">
                <Tag className="w-4 h-4 text-indigo-600" /> Apply Coupon
              </span>
              
              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                    Coupon: {appliedCoupon} ({appliedCoupon === "EXAM50" ? "50%" : "100%"} off)
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. EXAM50, FREEBIE)"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT: Totals and Checkout */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/40 pb-2">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {profile?.isSubscribed && (
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span>Plus Member Discount ({subDiscountPercent}%)</span>
                  <span>-{formatCurrency(Math.round(subtotal * (subDiscountPercent / 100)))}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>-{formatCurrency(discountAmount - (profile?.isSubscribed ? Math.round(subtotal * (subDiscountPercent / 100)) : 0))}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2"></div>

              <div className="flex justify-between font-black text-slate-900 dark:text-zinc-50 text-sm">
                <span>Total Amount</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={handleProceed}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-1.5"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/browse"
                className="w-full py-2.5 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl font-bold text-[11px] hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
