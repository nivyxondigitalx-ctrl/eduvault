"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDemo } from "../../../lib/context";
import { formatCurrency } from "../../../lib/storage";
import { CheckCircle, ShieldCheck, CreditCard, Sparkles, Loader, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coupon = searchParams.get("coupon") || "";
  const { cart, checkout, currentUser, studentProfiles, subscriptionPlans, clearCart, refreshBackendState } = useDemo();

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Net Banking" | "Wallet">("UPI");
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  // Calculate discounts
  let subDiscountPercent = 0;
  if (profile?.isSubscribed) {
    const plan = subscriptionPlans.find(p => p.id === profile.subscriptionPlanId);
    if (plan) {
      subDiscountPercent = plan.discountPercentage;
    }
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  let discountPercent = subDiscountPercent;
  if (coupon === "EXAM50") {
    discountPercent = Math.max(discountPercent, 50);
  } else if (coupon === "FREEBIE") {
    discountPercent = 100;
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const netAmountBeforeTax = subtotal - discountAmount;
  const tax = Math.round(netAmountBeforeTax * 0.18);
  const netAmount = netAmountBeforeTax + tax;

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await checkout(paymentMethod, coupon);
      if (!response) {
        toast.error("Checkout failed. Please review your cart.");
        setLoading(false);
        return;
      }

      if (response.isSimulation) {
        setCreatedOrder(response.order);
        toast.success("Payment successful! Resources unlocked.");
        setLoading(false);
        return;
      }

      // Real Razorpay payment flow
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay payment SDK.");
        setLoading(false);
        return;
      }

      const options = {
        key: response.key,
        amount: response.amount,
        currency: response.currency,
        name: "EduVault",
        description: "Purchase study resources",
        order_id: response.gatewayOrderId,
        handler: async function (verifyResponse: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.order.id,
                razorpayPaymentId: verifyResponse.razorpay_payment_id,
                razorpayOrderId: verifyResponse.razorpay_order_id,
                razorpaySignature: verifyResponse.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              const finalOrder = await verifyRes.json();
              clearCart();
              await refreshBackendState();
              setCreatedOrder(finalOrder);
              toast.success("Payment verified successfully!");
            } else {
              const errData = await verifyRes.json();
              toast.error(errData.error || "Payment signature verification failed.");
            }
          } catch (e: any) {
            toast.error("An error occurred during verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: profile?.name || currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#3730A3",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (createdOrder) {
    /* SUCCESS RECEIPT STATE */
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              Payment Successful!
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Receipt No: <strong className="font-mono text-indigo-600">{createdOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Receipt Breakdown details */}
          <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-5 text-left border border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Gross Total Items ({createdOrder.items?.length || 0})</span>
              <span>{formatCurrency(createdOrder.grossAmount)}</span>
            </div>
            {createdOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discounts applied</span>
                <span>-{formatCurrency(createdOrder.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Taxes (18% GST)</span>
              <span>{formatCurrency(createdOrder.taxAmount)}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-zinc-800/80 my-2"></div>
            <div className="flex justify-between font-black text-slate-900 dark:text-zinc-50 text-sm">
              <span>Amount Paid ({createdOrder.paymentMethod})</span>
              <span>{formatCurrency(createdOrder.netAmount)}</span>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-3">
            <Link
              href="/student/library"
              className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-bold shadow transition-all"
            >
              Go to My Library
            </Link>
            <Link
              href="/student/orders"
              className="py-3 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-center text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Order Invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Checkout Securely
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Select your payment option to finalize your study resources purchase.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-8 border border-slate-100 rounded-3xl text-center">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-xs text-slate-500">Your basket is empty. Please add items before checking out.</p>
          <Link href="/browse" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Payment details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment splits visual warning */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal">
                <span className="font-bold">Instant Dealer Payout Split</span>
                <p className="mt-0.5">
                  Completing checkout distributes earnings instantly to dealer balances based on assigned commission rates (e.g. 70%, 80%).
                </p>
              </div>
            </div>

            {/* Selector Grid */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 block mb-4 uppercase">
                Payment Option
              </span>

              <div className="grid grid-cols-2 gap-4">
                {([
                  { id: "UPI", label: "Unified Payments Interface (UPI)", subtitle: "PhonePe, GPay, Paytm" },
                  { id: "Card", label: "Credit / Debit Cards", subtitle: "Visa, Mastercard, RuPay" },
                  { id: "Net Banking", label: "Internet Banking", subtitle: "SBI, HDFC, ICICI Bank" },
                  { id: "Wallet", label: "Digital Wallets", subtitle: "Amazon Pay, Mobikwik" },
                ] as const).map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === method.id
                        ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/10 ring-2 ring-indigo-600/10"
                        : "border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <CreditCard className={`w-5 h-5 ${paymentMethod === method.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{method.id}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{method.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Bill Recap */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-50 uppercase tracking-wider border-b border-slate-50 dark:border-zinc-800/40 pb-2">
              Bill Recap
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400 border-b border-slate-50 dark:border-zinc-800/40 pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <span className="line-clamp-1 flex-1 pr-2">{item.title}</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-200 shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between font-black text-slate-900 dark:text-zinc-50 text-sm">
                <span>Total Amount Due</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  `Pay ${formatCurrency(netAmount)} Securely`
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function StudentCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 text-xs font-semibold text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
