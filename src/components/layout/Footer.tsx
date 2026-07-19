import React from "react";
import Link from "next/link";
import { AppLogo } from "../shared/AppLogo";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <AppLogo className="text-white" />
          <p className="text-xs leading-relaxed max-w-sm text-slate-400">
            EduVault is India's leading digital academic material hub, offering student-sourced, dealer-verified study materials, answer keys, and previous question papers.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300">
            <Globe className="w-3.5 h-3.5" />
            <span>Tamil Nadu, India</span>
          </div>
        </div>

        {/* Explore column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Explore Hub</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/browse" className="hover:text-white transition-colors">
                Browse Resources
              </Link>
            </li>
            <li>
              <Link href="/colleges" className="hover:text-white transition-colors">
                Affiliated Colleges
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing & Subscription
              </Link>
            </li>
            <li>
              <Link href="/become-a-dealer" className="hover:text-white transition-colors">
                Dealer Hub
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policies column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Policies</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/legal/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/refund" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/dmca" className="hover:text-white transition-colors">
                DMCA & Copyright Takedown
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Contact column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Contact & Support</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="truncate">support@eduvault.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>+91 44 2235 7264</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="leading-snug">Anna University Area, Guindy, Chennai, TN</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} EduVault India. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 italic text-[11px] text-slate-600">
          Simulated Platform Dashboard. Not a real financial utility.
        </p>
      </div>
    </footer>
  );
};
