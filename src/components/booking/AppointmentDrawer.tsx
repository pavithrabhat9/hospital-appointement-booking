"use client";

import React, { useState } from "react";
import { Drawer } from "../ui/Drawer";
import { StatusBadge } from "../ui/StatusBadge";
import { CopyChip } from "../ui/CopyChip";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { useHospitalStore } from "@/lib/store";
import { useToast } from "../ui/Toast";
import { formatINR } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface AppointmentDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDrawer({
  appointment,
  isOpen,
  onClose,
}: AppointmentDrawerProps) {
  const { updateAppointmentStatus, rescheduleAppointment, cancelAppointment } =
    useHospitalStore();
  const { success } = useToast();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");

  if (!appointment) return null;

  const handleStatusChange = (status: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, status);
    success(
      `Appointment ${status}`,
      `Token #${appointment.tokenNumber} marked as ${status}.`
    );
    onClose();
  };

  const handleReschedule = () => {
    if (!newDate) return;
    rescheduleAppointment(appointment.id, newDate, newTime);
    success("Rescheduled", `Appointment moved to ${newDate} at ${newTime}`);
    setIsRescheduling(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <span>{appointment.appointmentNumber}</span>
          <StatusBadge status={appointment.status} showDot />
        </div>
      }
      subtitle={`Created via ${appointment.source === "voice_ai" ? "Voice AI Agent" : appointment.source}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {appointment.status !== "cancelled" && (
              <button
                onClick={() => {
                  cancelAppointment(appointment.id, "Cancelled by administrative staff");
                  success("Appointment Cancelled", "Slot has been released.");
                  onClose();
                }}
                className="px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            {appointment.status !== "no_show" && appointment.status !== "completed" && (
              <button
                onClick={() => handleStatusChange("no_show")}
                className="px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                No-Show
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {appointment.status === "pending" && (
              <button
                onClick={() => handleStatusChange("booked")}
                className="px-4 py-2 text-xs font-medium text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Confirm Appointment
              </button>
            )}
            {appointment.status === "booked" && (
              <button
                onClick={() => handleStatusChange("completed")}
                className="px-4 py-2 text-xs font-medium text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark Attended
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Token and Quick Overview Card */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
              OPD Queue Token
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-0.5">
              Token #{appointment.tokenNumber}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
              Consultation Fee
            </div>
            <div className="text-lg font-semibold text-neutral-900 mt-0.5">
              {formatINR(appointment.consultationFee)}
            </div>
          </div>
        </div>

        {/* Appointment Timing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
              Scheduled Date & Time
            </span>
            <button
              onClick={() => setIsRescheduling(!isRescheduling)}
              className="text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1 underline underline-offset-2"
            >
              <RotateCcw className="w-3 h-3" />
              {isRescheduling ? "Cancel reschedule" : "Reschedule slot"}
            </button>
          </div>

          {!isRescheduling ? (
            <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {appointment.date}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {appointment.timeSlot} ({appointment.visitType})
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-neutral-500">
                Room: {appointment.location}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/70 space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  defaultValue={appointment.date}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1">
                  New Time Slot
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:15 PM">05:15 PM</option>
                </select>
              </div>
              <button
                onClick={handleReschedule}
                className="w-full py-2 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Save New Time
              </button>
            </div>
          )}
        </div>

        {/* Doctor & Department */}
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
            Consulting Doctor
          </span>
          <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-900">
                {appointment.doctorName}
              </div>
              <div className="text-xs text-neutral-500">
                {appointment.departmentName}
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-neutral-100 rounded-md text-neutral-700 font-medium">
              {appointment.location}
            </span>
          </div>
        </div>

        {/* Patient Details */}
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
            Patient Information
          </span>
          <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-semibold text-neutral-900">
                  {appointment.patientName}
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                {appointment.patientAge} yrs, {appointment.patientGender}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{appointment.patientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate">{appointment.patientEmail || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                <span>Payment: {appointment.paymentStatus}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-semibold text-neutral-500">Language:</span>
                <span>{appointment.preferredLanguage}</span>
              </div>
            </div>

            {appointment.reason && (
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Reason for Visit
                </span>
                <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 leading-relaxed">
                  {appointment.reason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Telephony Metadata */}
        {appointment.callUuid && (
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
              Voice Bot Call UUID
            </span>
            <CopyChip value={appointment.callUuid} prefix="Call UUID:" />
          </div>
        )}
      </div>
    </Drawer>
  );
}

