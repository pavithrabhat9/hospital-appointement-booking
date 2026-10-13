"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useHospitalStore } from "@/lib/store";
import { hospitalConfig } from "@/lib/config";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useHospitalStore();
  const [email, setEmail] = useState("admin@citycare.health");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      router.push("/");
    }, 400);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-8 sm:p-10 shadow-card">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            CareDesk Platform
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            {hospitalConfig.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {hospitalConfig.location} - Administrative Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@citycare.health"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo Notice */}
        <div className="mt-6 pt-6 border-t border-[#E5E5E5] flex items-center gap-2 text-[11px] text-neutral-500 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Demo mode active: Any email and password works</span>
        </div>
      </div>
    </div>
  );
}

