"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { hospitalConfig } from "@/lib/config";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Voice Agent handle multilingual callers from coastal Karnataka?",
      a: "Trikon Voice Studio automatically detects the caller's spoken dialect in real-time. Callers speaking in Kannada, English, or Hindi are seamlessly addressed with appropriate clinical terms and regional hospital greetings."
    },
    {
      q: "What happens when a doctor updates their OPD shifts in the Schedule manager?",
      a: "The schedule updates are instantly synchronized with the slot availability engine. The voice agent immediately begins offering the newly opened slots and stops booking on blocked dates."
    },
    {
      q: "How are urgent triage cases escalated to human doctors or the emergency room?",
      a: "If a caller mentions emergency trigger phrases (such as acute chest pain, trauma, breathlessness), the agent adheres to strict clinical escalation rules, immediately advising emergency attendance and transferring to +91 824 222 5500."
    },
    {
      q: "Where can I inspect the raw telephony webhook events received by the platform?",
      a: "Click the 'Webhook Inspector' button in the top navigation bar at any time to view the exact JSON structure of the latest outbound telephony dispatch and inbound analysis.completed events."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Technical Support & Platform Assistance"
        subtitle="Dedicated technical assistance for hospital telecommunication and voice agent behavior."
        breadcrumbs={[
          { label: "Account", href: "/" },
          { label: "Support" },
        ]}
      />

      {/* Emergency Hotline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Hospital Telecom Emergency Desk
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Direct priority hotline for PRI line disruptions or voice agent call failure escalation.
          </p>
          <div className="pt-2 font-mono text-sm font-bold text-neutral-900">
            +91 80 3132 1629 (Toll Free)
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Engineering &amp; Voice Bot Support
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Submit custom prompt guidelines, doctor schedule rule updates, or language pronunciation tweaks.
          </p>
          <div className="pt-2 text-xs font-mono font-bold text-neutral-900">
            support@trikon.ai
          </div>
        </div>
      </div>

      {/* Knowledge Base FAQs */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
          <BookOpen className="w-4 h-4 text-neutral-700" />
          <h3 className="text-sm font-bold text-neutral-900">
            Frequently Asked Questions &amp; Integration Guide
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E5E5E5] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-neutral-600 bg-white leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
