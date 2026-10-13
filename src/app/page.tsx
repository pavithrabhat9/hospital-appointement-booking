"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  PhoneCall,
  Bot,
  Users,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Building2,
  CalendarCheck,
  RefreshCw,
  Edit2,
  UserCheck,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyChip } from "@/components/ui/CopyChip";
import { AppointmentDrawer } from "@/components/booking/AppointmentDrawer";
import { Appointment, CallLog } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { appointments, callLogs, doctors, departments } = useHospitalStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);

  // Compute live dashboard metrics
  const todayStr = "2026-10-13"; // current mock date

  const todayAppointments = useMemo(
    () => appointments.filter((apt) => apt.date === todayStr),
    [appointments, todayStr]
  );

  const confirmedCount = todayAppointments.filter((a) => a.status === "booked" || a.status === "completed").length;
  const pendingCount = todayAppointments.filter((a) => a.status === "pending").length;

  const totalThisWeek = appointments.length;
  const voiceAiCount = appointments.filter((a) => a.source === "voice_ai").length;
  const aiBookedPercent = Math.round((voiceAiCount / (appointments.length || 1)) * 100);

  // Department-wise appointment load data for Recharts
  const departmentData = useMemo(() => {
    return departments.map((dept) => {
      const count = appointments.filter((a) => a.departmentId === dept.id).length;
      return {
        name: dept.name.split(" ")[0], // short label
        fullName: dept.name,
        appointments: count,
      };
    });
  }, [departments, appointments]);

  // Today's OPD queue sorted by token
  const opdQueue = useMemo(() => {
    return [...todayAppointments].sort((a, b) => a.tokenNumber - b.tokenNumber);
  }, [todayAppointments]);

  // Recent calls (last 6 calls)
  const recentCalls = useMemo(() => {
    return callLogs.slice(0, 6);
  }, [callLogs]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Hospital Operations & Voice AI
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time outpatient OPD status, appointments, and live telephony stream.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/doctors"
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-2"
          >
            <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
            Doctors &amp; Availability
          </Link>
          <Link
            href="/appointments/book"
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            + Book Appointment
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle={
            <span>
              <strong className="text-emerald-700">{confirmedCount} confirmed</strong> ·{" "}
              <strong className="text-amber-700">{pendingCount} pending</strong>
            </span>
          }
          icon={Calendar}
        />

        <StatCard
          title="This Week's Bookings"
          value={totalThisWeek}
          trend={{
            value: "↑ 12%",
            isPositive: true,
            label: "vs last week",
          }}
          subtitle="Across all 6 clinical departments"
          icon={TrendingUp}
        />

        <StatCard
          title="AI-Booked Ratio"
          value={`${aiBookedPercent}%`}
          subtitle="Voice Agent automated conversions"
          badge={
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              Autonomous
            </span>
          }
          icon={Bot}
        />

        <StatCard
          title="Calls Handled Today"
          value={callLogs.length}
          subtitle="Avg call duration 1m 45s"
          badge={<StatusBadge status="Live" showDot />}
          icon={PhoneCall}
        />
      </div>

      {/* Doctors & Availability Glimpse (Screenshot 1 parity) */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Doctors & Availability
              </h2>
              <p className="text-xs text-neutral-500">
                Manage weekly schedules, slot intervals, and emergency blocks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
              {doctors.length} on staff
            </span>
            <Link
              href="/doctors"
              className="text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {doctors.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/40 hover:bg-white hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-800 font-semibold text-xs overflow-hidden shrink-0">
                    {doc.name
                      .split(" ")
                      .slice(1)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      {doc.departmentName}
                    </p>
                  </div>
                </div>
                <Link
                  href="/doctors"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                  title="View doctor details"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                    Available Days
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map((day) => (
                      <span
                        key={day}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#E5E5E5] text-neutral-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>
                    {doc.schedule.monday.startTime || "09:30"} -{" "}
                    {doc.schedule.monday.endTime || "13:30"} (OPD)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Department-wise Load Chart & Today's OPD Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department-wise load (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Department-wise OPD Load
                </h2>
              </div>
              <Link
                href="/departments"
                className="text-xs text-neutral-500 hover:text-black"
              >
                Details
              </Link>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Patient consultations distributed across clinical specialities
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#737373" }}
                />
                <Tooltip
                  formatter={(val) => [`${val} Appointments`, "Count"]}
                  labelFormatter={(name) => `Department: ${name}`}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E5E5E5",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                  }}
                />
                <Bar dataKey="appointments" radius={[6, 6, 0, 0]}>
                  {departmentData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#171717" : "#525252"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-neutral-500">
            <span>6 active departments</span>
            <span>Total: {appointments.length} scheduled</span>
          </div>
        </div>

        {/* Today's OPD Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Today&apos;s OPD Queue
                </h2>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                {todayAppointments.length} Tokens
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Real-time outpatient consultation lineup for today ({todayStr})
            </p>
          </div>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Token</th>
                  <th className="pb-2.5">Patient</th>
                  <th className="pb-2.5">Doctor & Dept</th>
                  <th className="pb-2.5">Slot</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {opdQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No outpatient appointments booked for today yet.
                    </td>
                  </tr>
                ) : (
                  opdQueue.slice(0, 5).map((apt) => (
                    <tr
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono font-semibold text-neutral-900">
                        #{apt.tokenNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-neutral-900">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {apt.patientPhone}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-neutral-800">{apt.doctorName}</div>
                        <div className="text-[11px] text-neutral-500">
                          {apt.departmentName}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-neutral-700">
                        {apt.timeSlot}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E5E5E5] hover:bg-neutral-100 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              Showing active queue tokens
            </span>
            <Link
              href="/appointments"
              className="font-medium text-neutral-900 hover:underline flex items-center gap-1"
            >
              All appointments
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Call Activity Card (With Live Badge & Automatic Fake Call Updates every 20s) */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Call Activity
                </h2>
                <StatusBadge status="Live" showDot />
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Real-time incoming and outgoing voice interactions handled by Trikon Voice Agent (auto-updates every 20s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">
              Auto-sync: 20s
            </span>
            <Link
              href="/call-logs"
              className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
            >
              <span>Full Call Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </div>

        {/* Table of Recent Calls */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2.5">Caller / Patient</th>
                <th className="pb-2.5">Call Type</th>
                <th className="pb-2.5">Language</th>
                <th className="pb-2.5">Duration</th>
                <th className="pb-2.5">Intent</th>
                <th className="pb-2.5">Call UUID</th>
                <th className="pb-2.5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentCalls.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-neutral-50/70 transition-colors"
                >
                  <td className="py-3">
                    <div className="font-medium text-neutral-900">
                      {log.patientName}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {log.patientPhone}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]">
                      {log.callType}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-700">{log.language}</td>
                  <td className="py-3 font-mono text-neutral-600">
                    {formatDuration(log.durationSeconds)}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-mono text-[10px]">
                      {log.intent}
                    </span>
                  </td>
                  <td className="py-3">
                    <CopyChip value={log.callUuid} truncate prefix="" />
                  </td>
                  <td className="py-3 text-neutral-500 font-mono text-[11px]">
                    {log.timestamp.split(" ")[1] || log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Drawer */}
      <AppointmentDrawer
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

