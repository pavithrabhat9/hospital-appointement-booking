"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PhoneCall,
  Search,
  RefreshCw,
  Play,
  Pause,
  Copy,
  Terminal,
  Volume2,
  Clock,
  User,
  Bot,
  RotateCcw,
  Check,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { CallLog } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyChip } from "@/components/ui/CopyChip";
import { Drawer } from "@/components/ui/Drawer";
import { formatDuration } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function CallLogsPage() {
  const { callLogs } = useHospitalStore();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIntent, setSelectedIntent] = useState("all");
  const [activeCall, setActiveCall] = useState<CallLog | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Audio simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio && activeCall) {
      timer = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= activeCall.durationSeconds) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio, activeCall]);

  // Reset audio state when drawer changes
  useEffect(() => {
    setIsPlayingAudio(false);
    setPlaybackSeconds(0);
  }, [activeCall]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      success("Call Logs Synced", "Retrieved latest telephony sessions from Trikon Voice Gateway.");
    }, 500);
  };

  const handleCopyWebhook = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      const matchesSearch =
        log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.patientPhone.includes(searchQuery) ||
        log.callUuid.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || log.callType === selectedType;

      const matchesIntent =
        selectedIntent === "all" || log.intent === selectedIntent;

      return matchesSearch && matchesType && matchesIntent;
    });
  }, [callLogs, searchQuery, selectedType, selectedIntent]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telephony & Voice AI Call Logs"
        subtitle="Complete audit trail of inbound patient calls, automated reminders, and outbound campaigns."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Call Logs" },
        ]}
        badge={<StatusBadge status="Live" showDot />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-neutral-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>
        }
      />

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caller name, phone number, or Call UUID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
          >
            <option value="all">All Call Types</option>
            <option value="Booking">Booking</option>
            <option value="Reminder">Reminder</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Campaign">Campaign</option>
            <option value="Inquiry">Inquiry</option>
          </select>

          <select
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
          >
            <option value="all">All Intents</option>
            <option value="appointment_scheduled">appointment_scheduled</option>
            <option value="reschedule_requested">reschedule_requested</option>
            <option value="cancelled">cancelled</option>
            <option value="inquiry">inquiry</option>
          </select>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-neutral-50/70 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Caller / Patient</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Call Type</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Intent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setActiveCall(log)}
                  className="hover:bg-neutral-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900">
                      {log.patientName}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-neutral-700">
                      {log.patientPhone}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]">
                      {log.callType}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-neutral-700 font-medium">
                    {log.language}
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-700">
                    {formatDuration(log.durationSeconds)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                      {log.intent}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={log.status} />
                  </td>

                  <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCall(log);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E5E5E5] hover:bg-neutral-100 transition-colors"
                    >
                      View Recording
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Details Drawer with Audio Player, Transcript, and Webhook */}
      <Drawer
        isOpen={!!activeCall}
        onClose={() => setActiveCall(null)}
        width="max-w-xl"
        title="Voice Session Recording & Transcript"
        subtitle={activeCall ? `${activeCall.callType} call with ${activeCall.patientName}` : ""}
      >
        {activeCall && (
          <div className="space-y-6">
            {/* Call UUID chip */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1">
                Trikon Call Session UUID
              </span>
              <CopyChip value={activeCall.callUuid} prefix="Call UUID:" />
            </div>

            {/* Fake Audio Player */}
            <div className="p-4 rounded-2xl bg-neutral-950 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-neutral-200">
                    Telephony Call Audio Stream
                  </span>
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {formatDuration(playbackSeconds)} /{" "}
                  {formatDuration(activeCall.durationSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shrink-0 shadow-sm"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Animated waveform bars */}
                <div className="flex-1 flex items-center gap-1 h-7">
                  {[
                    40, 60, 20, 80, 95, 30, 70, 50, 85, 40, 65, 30, 90, 45, 60,
                    75, 35, 80, 55, 30, 70, 45,
                  ].map((h, i) => {
                    const isPassed =
                      (i / 22) * activeCall.durationSeconds <= playbackSeconds;

                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-200 ${
                          isPassed
                            ? "bg-emerald-400"
                            : isPlayingAudio
                            ? "bg-neutral-600 animate-pulse"
                            : "bg-neutral-800"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-1.5">
                AI Summary &amp; Intent Analysis
              </span>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 leading-relaxed">
                {activeCall.summary}
              </div>
            </div>

            {/* Conversation Transcript Bubbles */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-2">
                Turn-by-Turn Transcript
              </span>
              <div className="space-y-2.5 max-h-72 overflow-y-auto p-3.5 rounded-2xl border border-[#E5E5E5] bg-neutral-50/50">
                {activeCall.transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.speaker === "agent" ? "items-start" : "items-end"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-0.5 px-1 font-mono">
                      <span>
                        {msg.speaker === "agent" ? "Trikon Bot" : "Patient"}
                      </span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.speaker === "agent"
                          ? "bg-white border border-[#E5E5E5] text-neutral-900 rounded-tl-sm shadow-sm"
                          : "bg-black text-white rounded-tr-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook JSON Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                  Webhook Event JSON (analysis.completed)
                </span>
                <button
                  onClick={() =>
                    handleCopyWebhook(
                      activeCall.webhookPayload || {
                        event: "analysis.completed",
                        callUuid: activeCall.callUuid,
                        to: activeCall.patientPhone,
                        name: activeCall.patientName,
                        intent: activeCall.intent,
                        summary: activeCall.summary,
                        timestamp: activeCall.timestamp,
                      }
                    )
                  }
                  className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-medium"
                >
                  {copiedWebhook ? (
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

              <pre className="p-3.5 rounded-xl bg-neutral-950 text-neutral-100 font-mono text-[11px] overflow-x-auto border border-neutral-800 leading-relaxed">
                {JSON.stringify(
                  activeCall.webhookPayload || {
                    event: "analysis.completed",
                    callUuid: activeCall.callUuid,
                    to: activeCall.patientPhone,
                    name: activeCall.patientName,
                    intent: activeCall.intent,
                    summary: activeCall.summary,
                    durationSeconds: activeCall.durationSeconds,
                    timestamp: activeCall.timestamp,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
