"use client";

import React from "react";
import Link from "next/link";
import { Drawer } from "../ui/Drawer";
import { Doctor } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Award,
  Globe,
  Calendar,
  CheckCircle2,
  CalendarCheck,
  Edit2,
  Phone,
} from "lucide-react";

interface DoctorDrawerProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorDrawer({ doctor, isOpen, onClose }: DoctorDrawerProps) {
  if (!doctor) return null;

  const daysList = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ] as const;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <span>{doctor.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-medium">
            {doctor.departmentName}
          </span>
        </div>
      }
      subtitle={doctor.qualification}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-neutral-500 font-medium">
            Room: {doctor.roomNumber}
          </span>

          <Link
            href={`/appointments/book?doctor=${doctor.id}&dept=${doctor.departmentId}`}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black hover:bg-neutral-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Book with Doctor
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Doctor Header Profile */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-[#E5E5E5] flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-neutral-600 text-xl">
            {doctor.name
              .split(" ")
              .slice(1)
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900">
              {doctor.name}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {doctor.qualification} · {doctor.experienceYears} Years Exp.
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-700">
              <span className="font-semibold text-neutral-900">
                {formatINR(doctor.consultationFee)}
              </span>
              <span className="text-neutral-300">|</span>
              <span className="flex items-center gap-1 text-neutral-600">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {doctor.roomNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Languages and Speciality Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Spoken Languages
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Slot Interval
            </span>
            <div className="text-sm font-semibold text-neutral-900 mt-1">
              {doctor.schedule.slotDurationMinutes} Minutes / Slot
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Optimized for Voice bot scheduling
            </div>
          </div>
        </div>

        {/* Weekly OPD Timings Table */}
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
            Weekly OPD Timings
          </span>
          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white text-xs divide-y divide-neutral-100">
            {daysList.map((day) => {
              const sched = doctor.schedule[day.key];
              const isAvailable = sched?.enabled;

              return (
                <div
                  key={day.key}
                  className="p-3 flex items-center justify-between hover:bg-neutral-50/50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvailable ? "bg-emerald-500" : "bg-neutral-300"
                      }`}
                    />
                    <span className="font-medium text-neutral-900">
                      {day.label}
                    </span>
                  </div>

                  {isAvailable ? (
                    <div className="text-neutral-700 font-mono text-[11px] flex items-center gap-2">
                      <span>
                        {sched.startTime} - {sched.endTime}
                      </span>
                      {sched.eveningEnabled && (
                        <span className="text-neutral-500">
                          &amp; {sched.eveningStartTime} - {sched.eveningEndTime}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-neutral-400 text-[11px]">
                      Not Available (Off)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates (if any) */}
        {doctor.schedule.blockedDates?.length > 0 && (
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
              Upcoming Blocked Dates
            </span>
            <div className="flex flex-wrap gap-2">
              {doctor.schedule.blockedDates.map((d) => (
                <span
                  key={d}
                  className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-mono"
                >
                  {d} (Leave / OT)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

