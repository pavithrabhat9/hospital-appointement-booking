"use client";

import React, { useState } from "react";
import {
  Layers,
  Copy,
  Check,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Globe,
  Radio,
  Server,
  Key,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyChip } from "@/components/ui/CopyChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { hospitalConfig } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import { mockApi } from "@/lib/mockApi";

export default function IntegrationsPage() {
  const { success, info } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(false);

  const apiKeyVal = "trikon_live_99f24e10ad82c61178a9c2b4e883901a";

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const result = await mockApi.testConnection();
    setTestingConnection(false);
    setIsConnected(true);
    success(
      "Connection Healthy",
      `Connected to ${result.provider} (Roundtrip: ${result.latencyMs}ms)`
    );
  };

  const handleAuthorizeGoogleCalendar = () => {
    setIsCalendarAuthorized(true);
    success(
      "Google Calendar Synced",
      "CityCare OPD doctors schedule linked with Google Calendar."
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Telephony & API Integrations"
        subtitle="Manage Trikon Voice Studio API credentials, webhook endpoints, and Google Calendar sync."
        breadcrumbs={[
          { label: "Account", href: "/" },
          { label: "Integrations" },
        ]}
        actions={
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <span>{testingConnection ? "Pinging..." : "Test connection"}</span>
          </button>
        }
      />

      {/* Main Connection Status Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
              TV
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">
                Trikon Voice Studio Gateway
              </div>
              <div className="text-xs text-neutral-500">
                Production Outbound SIP &amp; Webhook Hub
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="Connected" variant="booked" showDot />
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4 text-xs">
          {/* Agent ID & Enterprise Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                Trikon Agent ID
              </label>
              <div className="p-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex items-center justify-between font-mono">
                <span className="truncate">{hospitalConfig.defaultAgentId}</span>
                <CopyChip value={hospitalConfig.defaultAgentId} prefix="" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                Enterprise Tenant Slug
              </label>
              <div className="p-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex items-center justify-between font-mono">
                <span>{hospitalConfig.enterpriseSlug}</span>
                <CopyChip value={hospitalConfig.enterpriseSlug} prefix="" />
              </div>
            </div>
          </div>

          {/* Telephony Line UUID */}
          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              Telephony Line UUID
            </label>
            <div className="p-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex items-center justify-between font-mono">
              <span>{hospitalConfig.phoneLineUuid}</span>
              <CopyChip value={hospitalConfig.phoneLineUuid} prefix="" />
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              Secret API Key
            </label>
            <div className="p-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex items-center justify-between font-mono">
              <span className="text-neutral-800">
                {showApiKey ? apiKeyVal : "••••••••••••••••••••••••••••••••"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-neutral-500 hover:text-black"
                >
                  {showApiKey ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <CopyChip value={apiKeyVal} prefix="" />
              </div>
            </div>
          </div>

          {/* Webhook Endpoint */}
          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              Inbound Webhook URL (analysis.completed)
            </label>
            <div className="p-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex items-center justify-between font-mono">
              <span className="text-neutral-800">{hospitalConfig.webhookEndpoint}</span>
              <CopyChip value={hospitalConfig.webhookEndpoint} prefix="" />
            </div>
          </div>
        </div>
      </div>

      {/* Google Calendar Sync */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Google Calendar Synchronization
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Sync doctor appointments directly with hospital doctors&apos; personal Google Calendars.
            </p>
          </div>
        </div>

        <div>
          {isCalendarAuthorized ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Authorized
            </span>
          ) : (
            <button
              onClick={handleAuthorizeGoogleCalendar}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-black text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Authorize Sync
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

