"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreditCard, PhoneCall, Bot, Zap, ArrowUpRight, Download, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

export default function UsageBillingPage() {
  const invoices = [
    { id: "INV-2026-009", date: "Oct 01, 2026", amount: "₹24,999", status: "Paid", method: "HDFC Corp Card" },
    { id: "INV-2026-008", date: "Sep 01, 2026", amount: "₹24,999", status: "Paid", method: "HDFC Corp Card" },
    { id: "INV-2026-007", date: "Aug 01, 2026", amount: "₹24,999", status: "Paid", method: "HDFC Corp Card" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Voice AI Usage & Enterprise Billing"
        subtitle="Telephony minutes consumption, SIP channel concurrency, and subscription plan."
        breadcrumbs={[
          { label: "Account", href: "/" },
          { label: "Usage and Billing" },
        ]}
      />

      {/* Plan Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            CURRENT SUBSCRIPTION
          </span>
          <h2 className="text-xl font-bold text-neutral-900 mt-0.5">
            CareDesk Enterprise — Hospital Tier
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Unlimited SIP channels, Multilingual Indic Models (Kannada, Hindi, Tamil, Telugu), 99.9% Telephony SLA.
          </p>
        </div>
        <div className="text-right sm:border-l sm:border-neutral-200 sm:pl-6">
          <div className="text-2xl font-bold text-neutral-900 font-mono">₹24,999</div>
          <div className="text-xs text-neutral-500">per month (Billed annually)</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Telephony Minutes"
          value="4,820 / 10,000"
          subtitle="48.2% monthly quota used"
          icon={PhoneCall}
        />
        <StatCard
          title="Live AI Concurrency"
          value="4 calls"
          subtitle="Peak concurrent channels today"
          icon={Zap}
        />
        <StatCard
          title="Est. Savings vs Frontdesk"
          value="₹84,500"
          subtitle="Based on 180 hrs staff time saved"
          icon={CreditCard}
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
          <h3 className="text-sm font-bold text-neutral-900">
            Billing History &amp; Tax Invoices
          </h3>
          <span className="text-xs text-neutral-500 font-mono">GSTIN: 29AAACH1234F1Z8</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2">Invoice #</th>
                <th className="pb-2">Billing Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Payment Method</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 font-mono font-semibold text-neutral-900">{inv.id}</td>
                  <td className="py-3 text-neutral-700">{inv.date}</td>
                  <td className="py-3 font-mono font-semibold text-neutral-900">{inv.amount}</td>
                  <td className="py-3 text-neutral-600">{inv.method}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-neutral-600 hover:text-black inline-flex items-center gap-1 font-medium">
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
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
