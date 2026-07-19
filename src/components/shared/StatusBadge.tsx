import React from "react";
import { MaterialStatus } from "../../types";

interface StatusBadgeProps {
  status: MaterialStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const styles: Record<MaterialStatus, { bg: string; text: string; label: string }> = {
    approved: {
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      text: "text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40",
      label: "Approved",
    },
    pending: {
      bg: "bg-amber-100 dark:bg-amber-950/40",
      text: "text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40",
      label: "Pending Review",
    },
    draft: {
      bg: "bg-slate-100 dark:bg-zinc-800/60",
      text: "text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/60",
      label: "Draft",
    },
    rejected: {
      bg: "bg-rose-100 dark:bg-rose-950/40",
      text: "text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40",
      label: "Rejected",
    },
    suspended: {
      bg: "bg-zinc-100 dark:bg-zinc-900/50",
      text: "text-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800/50",
      label: "Suspended",
    },
  };

  const current = styles[status] || { bg: "bg-slate-100", text: "text-slate-700", label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${current.bg} ${current.text} ${className}`}>
      {current.label}
    </span>
  );
};
