"use client";

import React, { useState } from "react";
import {
  Bot,
  Mic,
  PhoneCall,
  Copy,
  Check,
  Sparkles,
  Share2,
  Trash2,
  Save,
  HelpCircle,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyChip } from "@/components/ui/CopyChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { mockApi } from "@/lib/mockApi";
import { hospitalConfig } from "@/lib/config";

const sampleAgents = [
  {
    id: "4275b22c-1adf-4bcd-ae3c-32228d8b6e29",
    name: "Hospital Outpatient Booking Agent",
    role: "Front-desk OPD Receptionist & Triage Bot",
    language: "Multilingual (Kannada, English, Hindi)",
    voice: "Deepa (Warm Southern Accent)",
    greeting: "Namaskara! Welcome to CityCare Multispeciality Hospital, Mangaluru. How can I help you book or reschedule your consultation today?",
    systemPrompt: `# Role and Identity
You are Riya, the warm and professional AI healthcare receptionist representing CityCare Multispeciality Hospital, Mangaluru.

# Clinical Guidelines
1. Greet callers warmly in their chosen language (Kannada, English, or Hindi).
2. Clarify primary symptom or desired department (General Medicine, Cardiology, Orthopedics, Pediatrics, Gynecology, Dermatology).
3. Check doctor availability and offer slots in 15/20 min intervals. If a slot is taken, offer 2-3 alternatives.
4. Verify patient full name, age, and phone number before booking.
5. If caller reports chest pain, sudden breathlessness, or severe trauma, immediately state: "Please proceed directly to CityCare Emergency Wing or dial 108 / +91 824 222 5500."`,
    knowledge: `Hospital: CityCare Multispeciality Hospital
Location: KSR Road, Hampankatta, Mangaluru, Karnataka
Emergency Phone: +91 824 222 5500
OPD Consultation Fee: Rs. 500 - 800
Insurance Accepted: Star Health, Care Health, HDFC Ergo, Ayushman Bharat, CGHS`,
    escalation: `If caller requests human supervisor or reports post-surgical bleeding, immediately transfer call to front-desk line +91 824 222 5555.`,
    forbidden: `Do not provide medical prescriptions or dispense antibiotic dosages over the phone. Direct patients to doctor consultation.`,
  },
  {
    id: "7b13e9a0-9831-4122-bc01-9231f82710aa",
    name: "Automated Appointment Reminder Agent",
    role: "Outbound Confirmation & Reschedule Bot",
    language: "English & Kannada",
    voice: "Kavya (Clear & Friendly)",
    greeting: "Hello, this is CityCare Multispeciality Hospital calling to remind you of your upcoming appointment tomorrow. Would you like to confirm your attendance?",
    systemPrompt: `# Objective
Call patients 24 hours prior to outpatient consultation. Confirm attendance, handle reschedule requests, or release slot if cancelled.`,
    knowledge: `Same-day cancellations are free of charge. Rescheduled slots must be within the next 7 business days.`,
    escalation: `If patient cannot reach the hospital due to transport emergency, notify reception desk.`,
    forbidden: `Do not collect credit card CVV or OTP details under any circumstance.`,
  },
  {
    id: "9c23d4e5-6789-40ab-cdef-1234567890ab",
    name: "Post-Discharge Follow-up Agent",
    role: "Post-operative Care & Wellness Outreach",
    language: "Kannada & English",
    voice: "Ananya (Empathetic Care)",
    greeting: "Namaskara! This is the Patient Care team from CityCare Hospital calling following your discharge. How are you feeling today?",
    systemPrompt: `# Role
Assess pain scale (1-10), check if medications were purchased from pharmacy, and remind patient of the surgical dressing review on Day 7.`,
    knowledge: `Wound care clinic operates Mon-Sat 9 AM to 1 PM at Room 105.`,
    escalation: `High fever above 101°F or severe surgical site pain must trigger immediate SMS alert to attending consultant.`,
    forbidden: `Never alter medication doses without doctor authorisation.`,
  },
];

export default function AiAgentPage() {
  const { success, info } = useToast();
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "basics" | "greeting" | "prompt" | "rules" | "integrations"
  >("prompt");

  const currentAgent = sampleAgents[selectedAgentIndex];

  // Playground state
  const [isMicActive, setIsMicActive] = useState(false);
  const [isTestingCall, setIsTestingCall] = useState(false);

  // Telephony test state
  const [targetPhone, setTargetPhone] = useState("+91 98451 23410");
  const [customerName, setCustomerName] = useState("Kavitha Mendonca");

  const handleToggleMic = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      info("Microphone Connected", `Voice session streaming to ${currentAgent.name}`);
    } else {
      setIsMicActive(false);
      info("Microphone Muted", "Voice session ended.");
    }
  };

  const handleMakeOutboundTestCall = async () => {
    setIsTestingCall(true);
    info("Dialing Test Number...", `Initiating mock call to ${targetPhone} (${customerName})`);

    await mockApi.triggerOutboundCall({
      to: targetPhone,
      agentId: currentAgent.id,
      enterprise: hospitalConfig.enterpriseSlug,
      from: hospitalConfig.phoneLineUuid,
      name: customerName,
      metadata: {
        appointment_id: `test-call-${Date.now()}`,
        doctor_name: "Dr. Sudhir Rao",
        department_name: "General Medicine",
        slot_start: "Tomorrow 09:30 AM",
        visit_type: "In-Person OPD",
        clinic_address: hospitalConfig.address,
        consultation_fee: 500,
      },
    });

    setTimeout(() => {
      setIsTestingCall(false);
      success("Test Call Completed", `Simulated voice conversation finished successfully.`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
            <span>Agents</span>
            <span>&gt;</span>
            <span className="text-neutral-900 font-medium">{currentAgent.name}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              {currentAgent.name}
            </h1>
            <CopyChip value={currentAgent.id} />
          </div>
        </div>

        {/* Action buttons matching Screenshot 2 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => info("Guide", "Trikon Voice Studio documentation opened.")}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>How to configure</span>
          </button>
          <button
            onClick={() => success("Shared", "Agent link copied.")}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Share</span>
          </button>
          <button
            onClick={() => success("Saved", "Agent instructions saved successfully.")}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Agent</span>
          </button>
        </div>
      </div>

      {/* Agent Selector Dropdown (Prompt: "Show a dropdown to choose an existing agent") */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-neutral-800" />
          <div>
            <div className="text-xs font-semibold text-neutral-900">
              Active Hospital Agent:
            </div>
            <div className="text-[11px] text-neutral-500">
              Select an agent to inspect instructions, prompt rules, or test voice synthesis
            </div>
          </div>
        </div>

        <select
          value={selectedAgentIndex}
          onChange={(e) => setSelectedAgentIndex(Number(e.target.value))}
          className="px-3 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none min-w-[260px]"
        >
          {sampleAgents.map((ag, idx) => (
            <option key={ag.id} value={idx}>
              {ag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Left Configuration & Right Playground + Telephony Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Prompt Tabs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                CONFIGURATION (CUSTOM AGENT)
              </span>
            </div>
            <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
              Dynamic variables guide
            </span>
          </div>

          {/* Pill tabs matching Screenshot 2 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "basics", label: "Basics & Voice" },
              { id: "greeting", label: "Greeting" },
              { id: "prompt", label: "System Prompt & Rules" },
              { id: "rules", label: "Closing & Hangup" },
              { id: "integrations", label: "Integrations" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "prompt" && (
            <div className="space-y-5">
              {/* System Instruction Prompt */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  SYSTEM INSTRUCTION PROMPT
                </span>
                <textarea
                  readOnly
                  rows={8}
                  value={currentAgent.systemPrompt}
                  className="w-full p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 font-mono text-xs text-neutral-800 leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Knowledge Base & Business Details */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  KNOWLEDGE BASE &amp; CLINICAL DETAILS
                </span>
                <textarea
                  readOnly
                  rows={4}
                  value={currentAgent.knowledge}
                  className="w-full p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 font-mono text-xs text-neutral-800 leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Escalation Rules & Forbidden Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                    ESCALATION RULES
                  </span>
                  <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-xs text-neutral-700 leading-relaxed">
                    {currentAgent.escalation}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                    FORBIDDEN TOPICS
                  </span>
                  <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-xs text-neutral-700 leading-relaxed">
                    {currentAgent.forbidden}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "greeting" && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  AGENT GREETING MESSAGE
                </span>
                <textarea
                  readOnly
                  rows={4}
                  value={currentAgent.greeting}
                  className="w-full p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-xs text-neutral-800 leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "basics" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-neutral-50">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase">Voice Model</span>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5">{currentAgent.voice}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-neutral-50">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase">Languages</span>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5">{currentAgent.language}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="p-4 rounded-xl bg-neutral-50 text-xs text-neutral-700 space-y-2">
              <div className="font-semibold text-neutral-900">Hospital EMR &amp; Telephony Integration</div>
              <p>Connected line: <code>{hospitalConfig.phoneLineUuid}</code></p>
              <p>Webhook dispatch URL: <code>{hospitalConfig.webhookEndpoint}</code></p>
            </div>
          )}
        </div>

        {/* Right Column: Dark Playground Card + Telephony Test Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dark Playground Card (matches Screenshot 2) */}
          <div className="bg-neutral-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-widest text-neutral-400">
                PLAYGROUND
              </span>
              <StatusBadge status="Live" showDot />
            </div>

            {/* Center: Title & Green Mic Button */}
            <div className="text-center py-6">
              <h2 className="text-lg font-bold tracking-tight text-white mb-1">
                {currentAgent.name}
              </h2>
              <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-6">
                TEST YOUR AI AGENT
              </p>

              {/* Glowing Mic Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all shadow-lg ${
                  isMicActive
                    ? "bg-rose-500 hover:bg-rose-400 text-white animate-pulse ring-4 ring-rose-500/30"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black ring-4 ring-emerald-500/20"
                }`}
                title={isMicActive ? "Stop voice session" : "Start voice test session"}
              >
                {isMicActive ? (
                  <Square className="w-7 h-7" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              <div className="mt-4 text-xs font-mono text-neutral-400">
                {isMicActive
                  ? "Streaming audio... Say 'Namaskara' to begin"
                  : "Click mic to speak in Kannada or English"}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Latency: ~340ms</span>
              <span>Opus 24kHz</span>
            </div>
          </div>

          {/* Telephony Test Card matching Screenshot 2 */}
          <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">
                    Test Voice Call
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    TELEPHONY TEST
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                OUTBOUND
              </span>
            </div>

            <p className="text-xs text-neutral-500">
              Call a phone number to test the Voice Agent over real cellular lines.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1">
                  TARGET PHONE NUMBER (COUNTRY CODE REQUIRED)
                </label>
                <input
                  type="text"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 font-mono text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1">
                  CUSTOMER NAME (GREETING VARIABLE)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleMakeOutboundTestCall}
                disabled={isTestingCall}
                className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTestingCall ? "Dialing..." : "Make outbound call"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

