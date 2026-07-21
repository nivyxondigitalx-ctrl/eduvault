"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Play, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { useDemo } from "../../lib/context";
import { toast } from "sonner";

interface AdModalProps {
  isOpen: boolean;
  materialId: string;
  materialTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  materialId,
  materialTitle,
  onClose,
  onSuccess,
}) => {
  const { currentUser, studentProfiles, adCampaigns, watchAdToUnlock } = useDemo();
  const [stage, setStage] = useState<"intro" | "playing" | "complete" | "limit_reached">("intro");
  const [timeLeft, setTimeLeft] = useState(10);
  const [activeAd, setActiveAd] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check limits and pick campaign
  useEffect(() => {
    if (isOpen && currentUser) {
      const profile = studentProfiles[currentUser.id];
      const todayStr = new Date().toISOString().split("T")[0];
      
      // Limit check
      if (profile && profile.lastAdUnlockDate === todayStr && profile.adUnlocksCountToday >= 3) {
        setStage("limit_reached");
      } else {
        setStage("intro");
        setTimeLeft(10);
        setIsPaused(false);
        // Pick a random active ad campaign
        const activeAds = adCampaigns.filter(a => a.status === "active");
        if (activeAds.length > 0) {
          setActiveAd(activeAds[Math.floor(Math.random() * activeAds.length)]);
        } else {
          setActiveAd({
            name: "Premium Study Material Marketplace",
            advertiser: "EduVault",
            placement: "modal",
          });
        }
      }
    }
  }, [isOpen, currentUser, studentProfiles, adCampaigns]);

  // Tab blur pause mechanism
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stage === "playing") {
        setIsPaused(true);
        toast.warning("Ad Paused! Please keep the tab open.");
      } else if (!document.hidden && stage === "playing") {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stage]);

  // Count down timer
  useEffect(() => {
    if (stage === "playing" && timeLeft > 0 && !isPaused) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === "playing" && timeLeft === 0) {
      handleAdComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, timeLeft, isPaused]);

  const handleStartAd = () => {
    setStage("playing");
  };

  const handleAdComplete = async () => {
    setStage("complete");
    const success = await watchAdToUnlock(materialId);
    if (success) {
      toast.success("Material Unlocked successfully for 24 Hours!");
      onSuccess();
    } else {
      toast.error("Failed to unlock material. Ad limit reached.");
      setStage("limit_reached");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={stage !== "playing" ? onClose : undefined}></div>

      {/* Dialog Box */}
      <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 px-6 py-6 text-left shadow-2xl transition-all w-full max-w-lg border border-slate-100 dark:border-zinc-800">
        
        {/* Header (Hide Close during playing) */}
        {stage !== "playing" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* STAGE 1: INTRO */}
        {stage === "intro" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-2">
              Unlock for 24 Hours
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Watch a quick 10-second advertisement to unlock <strong className="text-indigo-600 dark:text-indigo-400">"{materialTitle}"</strong>. 
              No payment required. You will have full download and preview rights for the next 24 hours.
            </p>

            <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-4 text-left border border-slate-100 dark:border-zinc-800 mb-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Daily Limits & Rules
              </span>
              <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1.5">
                <li>• Free accounts get up to 3 ad unlocks per day.</li>
                <li>• This unlock expires exactly 24 hours from now.</li>
                <li>• Premium / Plus members get ad-free instant downloads.</li>
              </ul>
            </div>

            <button
              onClick={handleStartAd}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" /> Watch Ad
            </button>
          </div>
        )}

        {/* STAGE 2: PLAYING */}
        {stage === "playing" && (
          <div className="text-center py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg">
                Sponsored Ad
              </span>
              <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Unlock in: <span className="text-amber-500 font-mono text-base">{timeLeft}s</span>
              </div>
            </div>

            {/* Simulated Ad Billboard */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-center items-center p-6 text-center text-white mb-4">
              <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                {isPaused ? "Paused" : "Playing"}
              </div>

              <span className="text-xs text-zinc-400 tracking-widest uppercase mb-1">
                {activeAd?.advertiser || "Sponsor"}
              </span>
              <h4 className="text-lg font-bold mb-2 text-indigo-300">
                {activeAd?.name || "Premium Educational Prep Course"}
              </h4>
              <p className="text-xs text-zinc-300 max-w-sm">
                Get up to 40% discount on India's top live coaching courses with test prep tools!
              </p>
              
              {isPaused && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                  <p className="text-sm font-semibold">Ad Paused</p>
                  <p className="text-xs text-zinc-400 mt-1">Focus the window to resume countdown</p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
              Please do not switch tabs or close the browser window.
            </p>
          </div>
        )}

        {/* STAGE 3: COMPLETE */}
        {stage === "complete" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-2">
              Material Unlocked!
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Thank you for watching the ad. You now have full access to <strong className="text-indigo-600 dark:text-indigo-400">"{materialTitle}"</strong> for 24 hours.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-100 dark:shadow-none transition-all"
            >
              Open Resource
            </button>
          </div>
        )}

        {/* STAGE 4: LIMIT REACHED */}
        {stage === "limit_reached" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-2">
              Daily Limit Reached
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              You have already unlocked 3 materials today via ad unlocks. To ensure fair use, free users are capped at 3 unlocks per day.
            </p>
            
            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl p-4 text-left border border-indigo-100 dark:border-indigo-900/40 mb-6">
              <h4 className="text-sm font-semibold text-indigo-950 dark:text-indigo-400 mb-1">
                Want Unlimited Downloads?
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-normal">
                Upgrade to an EduVault Plus subscription starting at just ₹199/month for ad-free experience, unlimited downloads, and verified answer keys!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-2xl font-semibold transition-all"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
