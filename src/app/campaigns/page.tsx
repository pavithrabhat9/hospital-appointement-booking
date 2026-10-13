"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Play,
  CheckCircle,
  Clock,
  PhoneCall,
  UserCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  XCircle,
  PhoneForwarded,
  Layers,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { Campaign } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";

export default function CampaignsPage() {
  const { campaigns, addCampaign } = useHospitalStore();
  const { success } = useToast();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // New campaign state
  const [campName, setCampName] = useState("");
  const [campType, setCampType] = useState<Campaign["type"]>("Appointment reminder");
  const [campAudienceSize, setCampAudienceSize] = useState(60);
  const [campLanguage, setCampLanguage] = useState("Kannada & English");
  const [campSchedule, setCampSchedule] = useState("Daily at 10:00 AM");
  const [campScript, setCampScript] = useState("");

  const handleCreateCampaign = () => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: campName || "Patient Outreach Campaign",
      type: campType,
      audienceSize: Number(campAudienceSize) || 60,
      status: "active",
      progressPercent: 5,
      stats: {
        called: 3,
        answered: 2,
        booked: 1,
        failed: 0,
      },
      scheduledDate: campSchedule,
      language: campLanguage,
      agentName: "CityCare Automated Voice Bot",
      scriptSnippet:
        campScript ||
        "Namaskara! Welcome to CityCare Hospital. Calling to check on your health recovery...",
    };

    addCampaign(newCamp);
    success("Campaign Launched", `${newCamp.name} has been queued for outbound voice execution.`);
    setIsWizardOpen(false);
    setWizardStep(1);
    setCampName("");
    setCampScript("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outbound Voice AI Campaigns"
        subtitle="Automated post-discharge wellness checks, preventive health checkup camps, and appointment recovery."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Campaigns" },
        ]}
        actions={
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New campaign</span>
          </button>
        }
      />

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            onClick={() => setSelectedCampaign(camp)}
            className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1">
                    {camp.type}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:underline">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {camp.language} · {camp.scheduledDate}
                  </p>
                </div>
                <StatusBadge status={camp.status} showDot={camp.status === "active"} />
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-neutral-500">Execution Progress</span>
                  <span className="text-neutral-900 font-mono font-semibold">
                    {camp.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${camp.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-center">
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase">
                    Audience
                  </div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5 font-mono">
                    {camp.audienceSize}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase">
                    Called
                  </div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5 font-mono">
                    {camp.stats.called}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase">
                    Answered
                  </div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5 font-mono">
                    {camp.stats.answered}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase">
                    Booked
                  </div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5 font-mono">
                    {camp.stats.booked}
                  </div>
                </div>
              </div>

              {/* Script snippet */}
              {camp.scriptSnippet && (
                <div className="p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200/50 text-[11px] text-neutral-600 italic line-clamp-2">
                  &ldquo;{camp.scriptSnippet}&rdquo;
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-medium text-neutral-600">
              <span className="group-hover:text-black">View campaign analytics</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Detail Drawer */}
      <Drawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        width="max-w-xl"
        title="Campaign Performance & Telephony Analytics"
        subtitle={selectedCampaign?.name}
      >
        {selectedCampaign && (
          <div className="space-y-6 text-xs">
            {/* Header Status */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                  Campaign Type
                </span>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedCampaign.type}
                </div>
                <div className="text-neutral-500 text-[11px] mt-0.5">
                  Agent: {selectedCampaign.agentName}
                </div>
              </div>
              <StatusBadge status={selectedCampaign.status} showDot={selectedCampaign.status === "active"} />
            </div>

            {/* Counts Breakdown Card */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-2">
                Outbound Telephony Funnel
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
                  <span className="text-neutral-400 text-[10px] font-semibold uppercase">
                    Total Audience
                  </span>
                  <div className="text-xl font-bold text-neutral-900 mt-0.5 font-mono">
                    {selectedCampaign.audienceSize}
                  </div>
                  <span className="text-[10px] text-neutral-500">100% Target</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
                  <span className="text-neutral-400 text-[10px] font-semibold uppercase">
                    Called
                  </span>
                  <div className="text-xl font-bold text-neutral-900 mt-0.5 font-mono">
                    {selectedCampaign.stats.called}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {Math.round((selectedCampaign.stats.called / (selectedCampaign.audienceSize || 1)) * 100)}% Dispatched
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
                  <span className="text-neutral-400 text-[10px] font-semibold uppercase">
                    Answered
                  </span>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5 font-mono">
                    {selectedCampaign.stats.answered}
                  </div>
                  <span className="text-[10px] text-emerald-600">
                    {Math.round((selectedCampaign.stats.answered / (selectedCampaign.stats.called || 1)) * 100)}% Pickup Rate
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
                  <span className="text-neutral-400 text-[10px] font-semibold uppercase">
                    Booked OPD
                  </span>
                  <div className="text-xl font-bold text-neutral-900 mt-0.5 font-mono">
                    {selectedCampaign.stats.booked}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {Math.round((selectedCampaign.stats.booked / (selectedCampaign.stats.answered || 1)) * 100)}% Conversion
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Voice Script */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-1.5">
                Spoken Telephony Script &amp; Instructions
              </span>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 font-mono text-[11px] leading-relaxed">
                {selectedCampaign.scriptSnippet}
              </div>
            </div>

            {/* Schedule & Telephony Specs */}
            <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-500">Dispatch Window</span>
                <span className="font-semibold text-neutral-900">{selectedCampaign.scheduledDate}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-500">Spoken Languages</span>
                <span className="font-semibold text-neutral-900">{selectedCampaign.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Caller ID Trunk</span>
                <span className="font-mono text-neutral-900">+91 80 3132 1629</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 3-Step New Campaign Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        maxWidth="max-w-lg"
        title={
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-neutral-800" />
            <span>New Voice AI Campaign</span>
          </div>
        }
        subtitle={`Step ${wizardStep} of 3`}
        footer={
          <div className="flex items-center justify-between w-full">
            {wizardStep > 1 ? (
              <button
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium border border-[#E5E5E5] hover:bg-neutral-50"
              >
                Back
              </button>
            ) : <div />}

            {wizardStep < 3 ? (
              <button
                onClick={() => setWizardStep(wizardStep + 1)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-black text-white hover:bg-neutral-800"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-black text-white hover:bg-neutral-800"
              >
                Launch Campaign
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Diabetic Foot Clinic Outreach"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Campaign Type
                </label>
                <select
                  value={campType}
                  onChange={(e) => setCampType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                >
                  <option value="Appointment reminder">Appointment reminder</option>
                  <option value="Post-discharge follow-up">Post-discharge follow-up</option>
                  <option value="Health checkup camp">Health checkup camp</option>
                  <option value="Missed appointment recovery">Missed appointment recovery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Target Audience Size (Patients)
                </label>
                <input
                  type="number"
                  value={campAudienceSize}
                  onChange={(e) => setCampAudienceSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Voice Agent Language
                </label>
                <select
                  value={campLanguage}
                  onChange={(e) => setCampLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                >
                  <option value="Kannada & English">Kannada &amp; English</option>
                  <option value="Kannada & Hindi">Kannada &amp; Hindi</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Multilingual">Multilingual (Kannada, English, Hindi)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Opening Script &amp; Telephony Greeting
                </label>
                <textarea
                  rows={3}
                  value={campScript}
                  onChange={(e) => setCampScript(e.target.value)}
                  placeholder="Namaskara! CityCare Hospital inda karedhiddivi..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                  Outbound Telephony Schedule
                </label>
                <select
                  value={campSchedule}
                  onChange={(e) => setCampSchedule(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                >
                  <option value="Daily at 10:00 AM">Daily at 10:00 AM</option>
                  <option value="Weekdays at 04:30 PM">Weekdays at 04:30 PM</option>
                  <option value="Immediate Run (Batch 10/min)">Immediate Run (Batch 10/min)</option>
                </select>
              </div>

              <div className="p-3 bg-neutral-50 border rounded-xl text-neutral-600 text-[11px] leading-relaxed">
                CareDesk Voice Engine will dispatch calls using caller line UUID <code>line_blr_8031321629</code> with retry backoff for busy/unanswered tones.
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
