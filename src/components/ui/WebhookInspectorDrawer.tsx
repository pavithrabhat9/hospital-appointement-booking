"use client";

import React, { useState } from "react";
import { Drawer } from "./Drawer";
import { useHospitalStore } from "@/lib/store";
import { Copy, Check, Terminal, Webhook } from "lucide-react";

export function WebhookInspectorDrawer() {
  const {
    isWebhookInspectorOpen,
    setWebhookInspectorOpen,
    lastOutboundCall,
    lastWebhookEvent,
  } = useHospitalStore();

  const [activeTab, setActiveTab] = useState<"outbound" | "webhook">("outbound");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyJson = (content: any, key: string) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Drawer
      isOpen={isWebhookInspectorOpen}
      onClose={() => setWebhookInspectorOpen(false)}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neutral-800" />
          <span>Webhook & API Inspector</span>
        </div>
      }
      subtitle="Inspect live JSON payloads exchanged between CityCare Platform and Trikon Voice Studio"
      footer={
        <button
          onClick={() => setWebhookInspectorOpen(false)}
          className="px-4 py-2 text-xs font-medium bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors"
        >
          Close Inspector
        </button>
      }
    >
      <div className="space-y-4">
        {/* Tab pills */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
          <button
            onClick={() => setActiveTab("outbound")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "outbound"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            Outbound Call Request
          </button>
          <button
            onClick={() => setActiveTab("webhook")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "webhook"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            Webhook Event (analysis.completed)
          </button>
        </div>

        {/* Content */}
        {activeTab === "outbound" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                POST /v1/telephony/outbound-calls
              </span>
              <button
                onClick={() => handleCopyJson(lastOutboundCall, "outbound")}
                className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium"
              >
                {copied === "outbound" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            {lastOutboundCall ? (
              <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                {JSON.stringify(lastOutboundCall, null, 2)}
              </pre>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                No outbound call executed yet. Book an appointment to trigger a call.
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                POST /api/webhooks/trikon (Payload)
              </span>
              <button
                onClick={() => handleCopyJson(lastWebhookEvent, "webhook")}
                className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium"
              >
                {copied === "webhook" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            {lastWebhookEvent ? (
              <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                {JSON.stringify(lastWebhookEvent, null, 2)}
              </pre>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                No webhook event received yet.
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

