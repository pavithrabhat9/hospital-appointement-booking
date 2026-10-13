"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  CalendarCheck,
  Edit2,
  Stethoscope,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { Doctor } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { DoctorDrawer } from "@/components/doctors/DoctorDrawer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DoctorsPage() {
  const { doctors, departments } = useHospitalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Today is Tuesday (for mock date 2026-10-13)
  const currentDayShort = "Tue";

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => d.languages.forEach((l) => set.add(l)));
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Search
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

      // Department
      const matchesDept =
        selectedDept === "all" || doc.departmentId === selectedDept;

      // Language
      const matchesLang =
        selectedLanguage === "all" || doc.languages.includes(selectedLanguage);

      // Available Today
      const matchesToday =
        !onlyAvailableToday || doc.availableDays.includes(currentDayShort);

      return matchesSearch && matchesDept && matchesLang && matchesToday;
    });
  }, [
    doctors,
    searchQuery,
    selectedDept,
    selectedLanguage,
    onlyAvailableToday,
    currentDayShort,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consulting Specialists & Doctors"
        subtitle="Manage faculty credentials, OPD timings, consultation fees, and multilingual coverage."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Doctors" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/appointments/book"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Book Appointment
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, or qualification..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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

          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white text-neutral-800 focus:outline-none"
          >
            <option value="all">All Languages</option>
            {allLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Available today toggle */}
          <button
            onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
              onlyAvailableToday
                ? "bg-black text-white border-black"
                : "bg-white text-neutral-700 border-[#E5E5E5] hover:bg-neutral-50"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Available Today ({currentDayShort})</span>
          </button>
        </div>
      </div>

      {/* Grid of Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoctor(doc)}
            className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Top Row: Avatar, Name & Edit Icon */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 border border-[#E5E5E5] overflow-hidden flex items-center justify-center font-bold text-neutral-700 text-sm shrink-0">
                    {doc.name
                      .split(" ")
                      .slice(1)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:underline">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {doc.departmentName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Qualification & Experience */}
              <div className="text-xs text-neutral-600 mb-3 space-y-1">
                <div className="line-clamp-1">{doc.qualification}</div>
                <div className="text-neutral-400 text-[11px]">
                  {doc.experienceYears} Years Experience · Room: {doc.roomNumber}
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="mb-3.5 pb-3 border-b border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Consultation Fee</span>
                <span className="font-semibold text-neutral-900">
                  {formatINR(doc.consultationFee)}
                </span>
              </div>

              {/* Available Days Chips */}
              <div className="mb-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1.5">
                  Available Days
                </span>
                <div className="flex flex-wrap gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                    const isAvailable = doc.availableDays.includes(
                      day as any
                    );
                    return (
                      <span
                        key={day}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                          isAvailable
                            ? "bg-neutral-50 text-neutral-800 border-neutral-200"
                            : "bg-neutral-50/40 text-neutral-300 border-transparent"
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots preview */}
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-3">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  {doc.schedule.monday.startTime || "09:30"} -{" "}
                  {doc.schedule.monday.endTime || "13:30"}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({doc.schedule.slotDurationMinutes}m slots)
                </span>
              </div>

              {/* Spoken Languages */}
              <div className="flex flex-wrap gap-1">
                {doc.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-normal"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
              <span className="text-neutral-500 group-hover:text-black font-medium">
                View profile &amp; slots
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="p-12 text-center bg-white border border-[#E5E5E5] rounded-2xl">
          <p className="text-sm text-neutral-500">
            No doctors matched your search criteria.
          </p>
        </div>
      )}

      {/* Doctor Drawer */}
      <DoctorDrawer
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}

