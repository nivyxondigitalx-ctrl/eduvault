import React from "react";
import { AccessMode } from "../../types";

interface AccessBadgeProps {
  mode: AccessMode;
  className?: string;
}

export const AccessBadge: React.FC<AccessBadgeProps> = ({ mode, className = "" }) => {
  const styles: Record<AccessMode, { bg: string; text: string; label: string }> = {
    free: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50",
      label: "Free",
    },
    ad_unlock: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50",
      label: "Watch Ad",
    },
    subscription: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      text: "text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50",
      label: "Subscription",
    },
    purchase: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50",
      label: "Premium",
    },
  };

  const current = styles[mode] || { bg: "bg-slate-100", text: "text-slate-700", label: mode };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${current.bg} ${current.text} ${className}`}>
      {current.label}
    </span>
  );
};
