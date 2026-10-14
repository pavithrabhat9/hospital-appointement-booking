"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHospitalStore } from "@/lib/store";
import { hospitalConfig } from "@/lib/config";
import { ArrowRight, CalendarDays, HeartPulse, Lock, Mail, ShieldCheck, Stethoscope } from "lucide-react";

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
    <div className="w-full max-w-6xl overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-card grid lg:grid-cols-[1.15fr_1fr]">
      <section aria-label="Welcome to CareDesk" className="order-2 lg:order-1 relative flex flex-col bg-[#edf5f2] p-6 sm:p-10 lg:p-12">
        <div className="flex items-center gap-2.5 text-[#215c50]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80"><HeartPulse className="h-5 w-5" /></div>
          <span className="text-sm font-semibold tracking-tight">CareDesk <span className="font-normal text-[#658078]">/ Healthcare, connected</span></span>
        </div>
        <div className="mt-7 lg:mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#507a6e]">Built around better care</p>
          <h2 className="mt-3 max-w-md text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight text-[#173e35]">More time for people.<br />More room for care.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#587269]">Bring your appointments, care teams, and patient conversations together in one thoughtful workspace.</p>
        </div>
        <div className="relative mt-7 overflow-hidden rounded-2xl aspect-[2/1] lg:aspect-[3/2]">
          <Image src="/images/healthcare-welcome.png" alt="A doctor and nurse speaking with a patient in a bright outpatient clinic" fill priority sizes="(max-width: 1023px) 100vw, 600px" className="object-cover" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 text-[#215c50] shadow-sm">
            <Stethoscope className="h-5 w-5 shrink-0" />
            <div><p className="text-xs font-semibold">Every patient. Every step.</p><p className="mt-0.5 text-[11px] text-[#658078]">Helping your team make care feel personal.</p></div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#507a6e]">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Seamless appointments</span>
          <span className="flex items-center gap-1.5"><HeartPulse className="h-3.5 w-3.5" /> Connected care teams</span>
        </div>
      </section>
      <div className="order-1 lg:order-2 flex flex-col justify-center p-8 sm:p-12 lg:p-14">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5f2] text-[#215c50] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <HeartPulse className="w-6 h-6" strokeWidth={2.2} aria-hidden="true" />
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

