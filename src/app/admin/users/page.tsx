"use client";

import React from "react";
import { useDemo } from "../../../lib/context";
import { Users, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { users, saveUsers } = useDemo();

  const handleRoleChange = (userId: string, newRole: "admin" | "dealer" | "student") => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsers(updated);
    toast.success(`Role updated successfully for User: ${userId}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          User Accounts Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage system users and change roles to inspect dashboards.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Switch Role Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-8 h-8 rounded-full bg-slate-100" />
                      <span className="font-bold">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono">
                    {u.email}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === "admin"
                        ? "bg-emerald-50 text-emerald-700"
                        : u.role === "dealer"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-right shrink-0">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleRoleChange(u.id, "student")}
                        disabled={u.role === "student"}
                        className="px-2 py-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 text-[9px] font-bold rounded-lg border border-slate-100 disabled:opacity-40"
                      >
                        Student
                      </button>
                      <button
                        onClick={() => handleRoleChange(u.id, "dealer")}
                        disabled={u.role === "dealer"}
                        className="px-2 py-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 text-[9px] font-bold rounded-lg border border-slate-100 disabled:opacity-40"
                      >
                        Dealer
                      </button>
                      <button
                        onClick={() => handleRoleChange(u.id, "admin")}
                        disabled={u.role === "admin"}
                        className="px-2 py-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 text-[9px] font-bold rounded-lg border border-slate-100 disabled:opacity-40"
                      >
                        Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
