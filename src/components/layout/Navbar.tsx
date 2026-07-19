"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "../shared/AppLogo";
import { ThemeToggle } from "../shared/ThemeToggle";
import { useDemo } from "../../lib/context";
import { formatCurrency } from "../../lib/storage";
import { toast } from "sonner";
import {
  ShoppingCart,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, cart, notifications } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const dashboardLink = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "admin") return "/admin";
    if (currentUser.role === "dealer") return "/dealer";
    return "/student";
  };

  const unreadNotifsCount = notifications.filter(n => !n.read && (n.userId === "all" || n.userId === currentUser?.id)).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <AppLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            <Link
              href="/browse"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/browse")
                  ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20"
                  : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Browse Materials
            </Link>
            <Link
              href="/colleges"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/colleges")
                  ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20"
                  : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Colleges
            </Link>
            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/pricing")
                  ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20"
                  : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Subscriptions
            </Link>
            <Link
              href="/become-a-dealer"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/become-a-dealer")
                  ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20"
                  : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Become a Dealer
            </Link>
          </nav>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            {currentUser?.role === "student" && (
              <div className="relative">
                <button
                  onClick={() => {
                    setCartOpen(!cartOpen);
                    setNotificationsOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Cart dropdown */}
                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 py-3 px-4 z-50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 pb-2 border-b border-slate-100 dark:border-zinc-800">
                      My Shopping Cart ({cart.length})
                    </h3>
                    {cart.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-6">Your cart is empty.</p>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto space-y-3 py-3">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-start text-xs">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1">{item.title}</p>
                                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                                  {item.subjectCode}
                                </span>
                              </div>
                              <span className="font-bold text-slate-900 dark:text-zinc-100 shrink-0 ml-2">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-1 flex flex-col gap-2.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cart.reduce((a, b) => a + b.price, 0))}</span>
                          </div>
                          <Link
                            href="/student/cart"
                            onClick={() => setCartOpen(false)}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none block"
                          >
                            Checkout Now
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setCartOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 py-3 px-4 z-50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 pb-2 border-b border-slate-100 dark:border-zinc-800">
                      Notifications ({unreadNotifsCount})
                    </h3>
                    <div className="max-h-60 overflow-y-auto py-2 space-y-2.5">
                      {notifications
                        .filter(n => n.userId === "all" || n.userId === currentUser.id)
                        .slice(0, 5)
                        .map((n) => (
                          <div key={n.id} className="text-xs bg-slate-50 dark:bg-zinc-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                            <p className="font-bold text-slate-900 dark:text-zinc-100">{n.title}</p>
                            <p className="text-slate-500 dark:text-zinc-400 mt-0.5 leading-normal">{n.message}</p>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 block mt-1.5 font-mono">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      {notifications.filter(n => n.userId === "all" || n.userId === currentUser.id).length === 0 && (
                        <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-6">No new notifications.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setCartOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full bg-slate-100"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 pr-1.5 hidden lg:inline-block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 py-2.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800 text-xs">
                      <p className="font-bold text-slate-900 dark:text-zinc-100">{currentUser.name}</p>
                      <p className="text-slate-400 dark:text-zinc-500 font-mono mt-0.5 truncate">{currentUser.email}</p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold rounded-full capitalize">
                        {currentUser.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={dashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Go to Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-zinc-800 pt-1.5 mt-1.5">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          toast.success("Logged out successfully.");
                          router.push("/");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-1"
              >
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            
            {currentUser?.role === "student" && (
              <Link
                href="/student/cart"
                className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-zinc-800 px-4 pt-3 pb-6 bg-white dark:bg-zinc-900 space-y-3 shadow-lg z-50 relative">
          
          <div className="flex flex-col space-y-1">
            <Link
              href="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
            >
              Browse Materials
            </Link>
            <Link
              href="/colleges"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
            >
              Colleges
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
            >
              Subscriptions
            </Link>
            <Link
              href="/become-a-dealer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
            >
              Become a Dealer
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex flex-col gap-2">
            
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{currentUser.name}</p>
                    <p className="text-slate-400 dark:text-zinc-500 font-mono mt-0.5">{currentUser.email}</p>
                  </div>
                </div>

                <Link
                  href={dashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-center text-xs font-semibold shadow-md block"
                >
                  Go to Dashboard
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    toast.success("Logged out successfully.");
                    router.push("/");
                  }}
                  className="w-full py-2.5 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs font-semibold hover:bg-rose-50/50 block"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-center text-xs font-semibold block"
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      )}
    </header>
  );
};
