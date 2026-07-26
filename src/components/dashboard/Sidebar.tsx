"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDemo } from "../../lib/context";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  DollarSign,
  Download,
  Heart,
  PlusCircle,
  HelpCircle,
  Settings,
  Users,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Megaphone,
  Bell,
  Star,
  FileText,
  LogOut,
  ChevronRight,
  TrendingUp,
  X,
  AlertTriangle,
  Menu,
} from "lucide-react";

interface SidebarProps {
  role: "student" | "dealer" | "admin";
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useDemo();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === `/${role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getLinks = () => {
    switch (role) {
      case "admin":
        return [
          { label: "Admin Overview", href: "/admin", icon: LayoutDashboard },
          { label: "User Accounts", href: "/admin/users", icon: Users },
          { label: "Dealers Hub", href: "/admin/dealers", icon: Briefcase },
          { label: "Materials Queue", href: "/admin/materials", icon: FileText },
          { label: "Academic Taxonomy", href: "/admin/taxonomy", icon: GraduationCap },
          { label: "Payment Splits", href: "/admin/payment-splits", icon: DollarSign },
          { label: "Payout Requests", href: "/admin/payouts", icon: DollarSign },
          { label: "Subscription Plans", href: "/admin/subscriptions", icon: ShieldCheck },
          { label: "Ad Campaigns", href: "/admin/advertisements", icon: Megaphone },
          { label: "Support Tickets", href: "/admin/support", icon: HelpCircle },
          { label: "System Errors", href: "/admin/errors", icon: AlertTriangle },
          { label: "System Logs", href: "/admin/audit-logs", icon: FileText },
          { label: "Global Settings", href: "/admin/settings", icon: Settings },
        ];
      case "dealer":
        return [
          { label: "Dealer Dashboard", href: "/dealer", icon: LayoutDashboard },
          { label: "Upload Material", href: "/dealer/materials/new", icon: PlusCircle },
          { label: "My Materials", href: "/dealer/materials", icon: FileText },
          { label: "Earnings Ledger", href: "/dealer/earnings", icon: DollarSign },
          { label: "Payout Requests", href: "/dealer/payouts", icon: TrendingUp },
          { label: "Student Requests", href: "/dealer/requests", icon: HelpCircle },
          { label: "Reviews Feed", href: "/dealer/reviews", icon: Star },
          { label: "Support Desk", href: "/dealer/support", icon: HelpCircle },
          { label: "Account Settings", href: "/dealer/settings", icon: Settings },
        ];
      case "student":
      default:
        return [
          { label: "Student Home", href: "/student", icon: LayoutDashboard },
          { label: "My Library", href: "/student/library", icon: BookOpen },
          { label: "My Cart", href: "/student/cart", icon: FolderOpen },
          { label: "Saved Notes", href: "/student/saved", icon: Heart },
          { label: "My Subscriptions", href: "/student/subscription", icon: ShieldCheck },
          { label: "Requested Files", href: "/student/requests", icon: PlusCircle },
          { label: "Notifications", href: "/student/notifications", icon: Bell },
          { label: "Academic Helpdesk", href: "/student/support", icon: HelpCircle },
          { label: "Study Settings", href: "/student/settings", icon: Settings },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Floating Menu Button on Mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center border border-indigo-500 transition-transform active:scale-95"
      >
        <Menu className="w-5.5 h-5.5" />
      </button>

      {/* Desktop Sidebar (persistent on large screens) */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 flex-col h-[calc(100vh-4rem)] sticky top-16 z-20 transition-colors">
        {/* Profile summary */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
          <img
            src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 dark:border-zinc-800"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-slate-800 dark:text-zinc-50 truncate leading-none mb-1">
              {currentUser?.name}
            </p>
            <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[9px] font-bold rounded-full capitalize">
              {role} mode
            </span>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"}`} />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
              </Link>
            );
          })}
        </nav>

        {/* Footer logout */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (overlay on slide-in) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
          
          {/* Drawer menu panel */}
          <aside className="relative w-64 max-w-xs bg-white dark:bg-zinc-900 h-full flex flex-col shadow-2xl z-50 border-r border-slate-100 dark:border-zinc-800 transition-colors">
            {/* Drawer Close Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Navigation Menu</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile summary */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
              <img
                src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 dark:border-zinc-800"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-slate-800 dark:text-zinc-50 truncate leading-none mb-1">
                  {currentUser?.name}
                </p>
                <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[9px] font-bold rounded-full capitalize">
                  {role} mode
                </span>
              </div>
            </div>

            {/* Navigation Link list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"}`} />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer logout */}
            <div className="p-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Exit Dashboard</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
