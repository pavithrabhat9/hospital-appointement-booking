"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Calendar,
  ChevronRight,
  ArrowRight,
  MapPin,
  Stethoscope,
  HeartPulse,
  Activity,
  Bone,
  Baby,
  Sparkles,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { DoctorDrawer } from "@/components/doctors/DoctorDrawer";
import { Doctor } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export default function DepartmentsPage() {
  const { departments, doctors, appointments } = useHospitalStore();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const getDeptIcon = (code: string) => {
    switch (code) {
      case "CARD":
        return HeartPulse;
      case "ORTH":
        return Bone;
      case "PED":
        return Baby;
      case "GYN":
        return Activity;
      case "DERM":
        return Sparkles;
      default:
        return Stethoscope;
    }
  };

  const selectedDepartment = departments.find((d) => d.id === selectedDeptId);
  const drillDownDoctors = doctors.filter((d) => d.departmentId === selectedDeptId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Departments & Centers of Excellence"
        subtitle="Speciality departments, outpatient wings, clinical faculty, and active patient queues."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Departments" },
        ]}
      />

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const Icon = getDeptIcon(dept.code);
          const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);
          const deptAppointments = appointments.filter(
            (a) => a.departmentId === dept.id
          );
          const todayAppointments = deptAppointments.filter(
            (a) => a.date === "2026-10-13"
          );
          const isSelected = selectedDeptId === dept.id;

          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(isSelected ? null : dept.id)}
              className={`bg-white border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-black ring-1 ring-black"
                  : "border-[#E5E5E5]"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    CODE: {dept.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {dept.name}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                  {dept.description}
                </p>

                {/* Location & Head */}
                <div className="text-xs text-neutral-600 space-y-1 mb-4 pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{dept.floor}</span>
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    HOD: <strong className="text-neutral-800">{dept.headOfDepartment}</strong>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Doctors
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {deptDoctors.length} Active
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Today&apos;s OPD
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {todayAppointments.length} Bookings
                    </span>
                  </div>
                </div>
              </div>

              {/* Drill-down toggle button */}
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-medium text-neutral-700">
                <span>
                  {isSelected ? "Hide faculty" : "View faculty & drill down"}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    isSelected ? "rotate-90 text-black" : ""
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Drill-Down Section when a department is clicked */}
      {selectedDepartment && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
            <div>
              <div className="text-xs uppercase font-semibold tracking-wider text-neutral-500">
                Department Faculty Drill-down
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                {selectedDepartment.name} Specialists
              </h2>
            </div>
            <Link
              href={`/appointments/book?dept=${selectedDepartment.id}`}
              className="px-4 py-2 text-xs font-medium bg-black text-white hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-2 self-start"
            >
              <span>Book in {selectedDepartment.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {drillDownDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/40 hover:bg-white hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold text-xs text-neutral-800 shrink-0">
                      {doc.name
                        .split(" ")
                        .slice(1)
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1 mb-2">
                    <div>Fee: {formatINR(doc.consultationFee)}</div>
                    <div className="text-[11px] text-neutral-400">
                      Room: {doc.roomNumber}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E5E5E5] text-neutral-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-medium text-neutral-600">
                  <span>View profile &amp; slots</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Profile Drawer */}
      <DoctorDrawer
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}

