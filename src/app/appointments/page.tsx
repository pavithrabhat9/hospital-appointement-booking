"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Bot,
  Globe,
  Users,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { Appointment } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyChip } from "@/components/ui/CopyChip";
import { AppointmentDrawer } from "@/components/booking/AppointmentDrawer";
import { formatINR } from "@/lib/utils";

export default function AppointmentsPage() {
  const { appointments, doctors, departments } = useHospitalStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone.includes(searchQuery) ||
        apt.appointmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

      // Doctor
      const matchesDoctor =
        selectedDoctor === "all" || apt.doctorId === selectedDoctor;

      // Department
      const matchesDept =
        selectedDept === "all" || apt.departmentId === selectedDept;

      // Status
      const matchesStatus =
        selectedStatus === "all" || apt.status === selectedStatus;

      // Source
      const matchesSource =
        selectedSource === "all" || apt.source === selectedSource;

      // Date
      let matchesDate = true;
      if (selectedDateFilter === "today") {
        matchesDate = apt.date === "2026-10-13";
      } else if (selectedDateFilter === "tomorrow") {
        matchesDate = apt.date === "2026-10-14";
      } else if (selectedDateFilter === "upcoming") {
        matchesDate = apt.date >= "2026-10-13";
      } else if (selectedDateFilter === "past") {
        matchesDate = apt.date < "2026-10-13";
      }

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesDept &&
        matchesStatus &&
        matchesSource &&
        matchesDate
      );
    });
  }, [
    appointments,
    searchQuery,
    selectedDoctor,
    selectedDept,
    selectedStatus,
    selectedSource,
    selectedDateFilter,
  ]);

  const sourceIcon = (source: string) => {
    switch (source) {
      case "voice_ai":
        return <Bot className="w-3 h-3 text-neutral-600" />;
      case "web":
        return <Globe className="w-3 h-3 text-neutral-600" />;
      default:
        return <Users className="w-3 h-3 text-neutral-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outpatient Appointments"
        subtitle="Manage hospital consultations, triage statuses, reschedule requests, and voice bot bookings."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Appointments" },
        ]}
        actions={
          <Link
            href="/appointments/book"
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Book appointment</span>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, phone, appointment number..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date filter */}
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today (Oct 13)</option>
              <option value="tomorrow">Tomorrow (Oct 14)</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Consultations</option>
            </select>

            {/* Department filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Doctor filter */}
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
            >
              <option value="all">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked / Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No-Show</option>
            </select>

            {/* Source filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="voice_ai">Voice AI Bot</option>
              <option value="reception">Reception Walk-in</option>
              <option value="web">Web Portal</option>
              <option value="campaign">Outbound Campaign</option>
            </select>
          </div>
        </div>

        {/* Total records count */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
          <span>
            Showing <strong>{filteredAppointments.length}</strong> of{" "}
            {appointments.length} appointments
          </span>
          {(searchQuery ||
            selectedDoctor !== "all" ||
            selectedDept !== "all" ||
            selectedStatus !== "all" ||
            selectedSource !== "all" ||
            selectedDateFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDoctor("all");
                setSelectedDept("all");
                setSelectedStatus("all");
                setSelectedSource("all");
                setSelectedDateFilter("all");
              }}
              className="text-neutral-700 font-medium hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-neutral-50/70 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Appt #</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Consulting Doctor</th>
                <th className="py-3 px-4">Date &amp; Slot</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-neutral-400 text-xs"
                  >
                    No appointments matched your selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    onClick={() => setActiveAppointment(apt)}
                    className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                  >
                    {/* Appt Number */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-neutral-900">
                        {apt.appointmentNumber}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Token #{apt.tokenNumber}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">
                        {apt.patientName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {apt.patientPhone}
                      </div>
                    </td>

                    {/* Doctor & Dept */}
                    <td className="py-3 px-4">
                      <div className="text-neutral-900 font-medium">
                        {apt.doctorName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {apt.departmentName}
                      </div>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-3 px-4">
                      <div className="text-neutral-900 font-mono font-medium">
                        {apt.date}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {apt.timeSlot}
                      </div>
                    </td>

                    {/* Visit Type */}
                    <td className="py-3 px-4 text-neutral-700">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] font-medium">
                        {apt.visitType}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px]">
                        {sourceIcon(apt.source)}
                        <span>{apt.source === "voice_ai" ? "Voice AI" : apt.source}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={apt.status} showDot={apt.status === "booked"} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAppointment(apt);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E5E5E5] hover:bg-neutral-100 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Drawer */}
      <AppointmentDrawer
        appointment={activeAppointment}
        isOpen={!!activeAppointment}
        onClose={() => setActiveAppointment(null)}
      />
    </div>
  );
}

