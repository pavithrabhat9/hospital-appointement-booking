"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  FileText,
  User,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { Patient } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyChip } from "@/components/ui/CopyChip";

export default function PatientsPage() {
  const { patients, appointments, callLogs } = useHospitalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      return (
        pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.phone.includes(searchQuery) ||
        pat.uhid.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [patients, searchQuery]);

  const patientAppointments = useMemo(() => {
    if (!activePatient) return [];
    return appointments.filter(
      (a) => a.patientPhone === activePatient.phone || a.patientName === activePatient.name
    );
  }, [activePatient, appointments]);

  const patientCalls = useMemo(() => {
    if (!activePatient) return [];
    return callLogs.filter(
      (c) => c.patientPhone === activePatient.phone || c.patientName === activePatient.name
    );
  }, [activePatient, callLogs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients Registry & Medical Demographics"
        subtitle="Universal Healthcare IDs (UHID), visit histories, and omnichannel contact records."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Patients" },
        ]}
      />

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by UHID, name, or phone number..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-neutral-50/70 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">UHID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Phone &amp; Email</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Total Visits</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPatients.map((pat) => (
                <tr
                  key={pat.id}
                  onClick={() => setActivePatient(pat)}
                  className="hover:bg-neutral-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-900">
                    {pat.uhid}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900">
                      {pat.name}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {pat.city}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-neutral-800">
                      {pat.phone}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {pat.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    {pat.age} yrs, {pat.gender} ({pat.bloodGroup})
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px]">
                      {pat.preferredLanguage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {pat.totalVisits} visits
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-600 text-[11px]">
                    {pat.lastVisitDate || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePatient(pat);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E5E5E5] hover:bg-neutral-100 transition-colors"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Drawer with History */}
      <Drawer
        isOpen={!!activePatient}
        onClose={() => setActivePatient(null)}
        width="max-w-xl"
        title="Patient Medical Profile"
        subtitle={activePatient ? `${activePatient.name} (${activePatient.uhid})` : ""}
        footer={
          activePatient ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-neutral-500 font-mono">
                UHID: {activePatient.uhid}
              </span>
              <a
                href="/appointments/book"
                className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                + Book New Appointment
              </a>
            </div>
          ) : undefined
        }
      >
        {activePatient && (
          <div className="space-y-6 text-xs">
            {/* Demographic Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-[#E5E5E5] space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-sm font-bold text-neutral-900">
                  {activePatient.name}
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">
                  {activePatient.uhid}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-700">
                <div>Phone: <strong className="font-mono">{activePatient.phone}</strong></div>
                <div>Email: {activePatient.email}</div>
                <div>Age/Gender: {activePatient.age} yrs, {activePatient.gender}</div>
                <div>Blood Group: {activePatient.bloodGroup}</div>
                <div>Language: {activePatient.preferredLanguage}</div>
                <div>City: {activePatient.city}</div>
              </div>
              {activePatient.notes && (
                <div className="pt-2 border-t border-neutral-200 text-neutral-600 text-[11px]">
                  Clinical note: {activePatient.notes}
                </div>
              )}
            </div>

            {/* Appointment History */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-2">
                Consultation History ({patientAppointments.length})
              </span>
              <div className="space-y-2">
                {patientAppointments.length === 0 ? (
                  <div className="p-4 text-center text-neutral-400 bg-neutral-50 rounded-xl">
                    No consultation records found.
                  </div>
                ) : (
                  patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {apt.doctorName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {apt.departmentName} · {apt.date} at {apt.timeSlot}
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Call Logs History */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 block mb-2">
                Voice AI Interaction History ({patientCalls.length})
              </span>
              <div className="space-y-2">
                {patientCalls.length === 0 ? (
                  <div className="p-4 text-center text-neutral-400 bg-neutral-50 rounded-xl">
                    No telephony calls recorded.
                  </div>
                ) : (
                  patientCalls.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl border border-[#E5E5E5] bg-white space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900">
                          {c.callType} Call ({c.language})
                        </span>
                        <span className="font-mono text-neutral-400 text-[10px]">
                          {c.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 line-clamp-2">
                        {c.summary}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

