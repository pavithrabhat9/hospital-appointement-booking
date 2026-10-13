"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  UserCheck,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { mockApi, GeneratedSlot } from "@/lib/mockApi";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR } from "@/lib/utils";
import { Doctor, VisitType, Appointment } from "@/lib/types";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDept = searchParams.get("dept");
  const initialDoc = searchParams.get("doctor");

  const { departments, doctors } = useHospitalStore();

  // Stepper state: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedDeptId, setSelectedDeptId] = useState(
    initialDept || departments[0]?.id || ""
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    initialDoc || ""
  );
  const [selectedDate, setSelectedDate] = useState("2026-10-14"); // default tomorrow
  const [selectedSlotTime, setSelectedSlotTime] = useState("");
  const [alternativeSlots, setAlternativeSlots] = useState<string[]>([]);
  const [slotWarning, setSlotWarning] = useState<string | null>(null);

  // Slots loading & list
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<GeneratedSlot[]>([]);

  // Patient details form
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("+91 ");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [visitType, setVisitType] = useState<VisitType>("In-Person OPD");
  const [reason, setReason] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("Kannada");

  // Booking Progress & Outbound call simulation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callProgressStage, setCallProgressStage] = useState<
    "idle" | "calling" | "connected" | "webhook" | "booked"
  >("idle");
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Filtered doctors based on chosen department
  const availableDoctors = useMemo(() => {
    if (!selectedDeptId) return doctors;
    return doctors.filter((d) => d.departmentId === selectedDeptId);
  }, [doctors, selectedDeptId]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedDepartment = departments.find((d) => d.id === selectedDeptId);

  // If initial doctor passed, auto set department
  useEffect(() => {
    if (initialDoc) {
      const doc = doctors.find((d) => d.id === initialDoc);
      if (doc) {
        setSelectedDoctorId(doc.id);
        setSelectedDeptId(doc.departmentId);
        setCurrentStep(3); // jump to date & slot
      }
    }
  }, [initialDoc, doctors]);

  // Load slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      setLoadingSlots(true);
      mockApi
        .getSlots(selectedDoctorId, selectedDate)
        .then((res) => {
          setSlots(res);
          setLoadingSlots(false);
        })
        .catch(() => setLoadingSlots(false));
    }
  }, [selectedDoctorId, selectedDate]);

  // Handle slot click
  const handleSlotClick = (slot: GeneratedSlot) => {
    if (slot.isBooked) {
      // Slot is taken! Show 3 alternative slots like the voice agent offers
      setSlotWarning(`The slot at ${slot.time} is already booked.`);
      mockApi
        .checkAvailability(selectedDoctorId, selectedDate, slot.time)
        .then((res) => {
          setAlternativeSlots(res.alternatives);
        });
      return;
    }

    setSlotWarning(null);
    setAlternativeSlots([]);
    setSelectedSlotTime(slot.time);
  };

  const handleSelectAlternative = (altTime: string) => {
    setSelectedSlotTime(altTime);
    setSlotWarning(null);
    setAlternativeSlots([]);
  };

  // Submit booking
  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDepartment || !selectedSlotTime) return;

    setIsSubmitting(true);
    setCallProgressStage("calling");

    try {
      const apt = await mockApi.bookAppointment(
        {
          patientName: patientName || "Guest Patient",
          patientPhone: patientPhone.trim() || "+91 98451 00000",
          patientEmail: patientEmail || "patient@citycare.health",
          patientAge: Number(patientAge) || 30,
          patientGender,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          departmentId: selectedDepartment.id,
          departmentName: selectedDepartment.name,
          date: selectedDate,
          timeSlot: selectedSlotTime,
          visitType,
          reason: reason || "General Outpatient Consultation",
          preferredLanguage,
          consultationFee: selectedDoctor.consultationFee,
        },
        (stage) => {
          setCallProgressStage(stage);
        }
      );

      setCreatedAppointment(apt);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Department" },
    { num: 2, title: "Doctor" },
    { num: 3, title: "Date & Slot" },
    { num: 4, title: "Patient Details" },
    { num: 5, title: "Review & Confirm" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Schedule Outpatient Appointment"
        subtitle="Full-page booking flow with automated Voice AI outbound verification and webhook confirmation."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Appointments", href: "/appointments" },
          { label: "Book Appointment" },
        ]}
      />

      {/* Stepper Indicator */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between relative">
          {/* Progress bar line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-neutral-100 -z-0" />
          <div
            className="absolute top-1/2 left-6 -translate-y-1/2 h-[2px] bg-black -z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 92}%`,
            }}
          />

          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className="relative z-10 flex flex-col items-center bg-white px-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? "bg-black text-white"
                      : isCurrent
                      ? "bg-black text-white ring-4 ring-neutral-100"
                      : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                    isCurrent ? "text-neutral-900 font-bold" : "text-neutral-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Department */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-6">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Step 1: Select Clinical Department
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Choose the specialty clinic matching the patient&apos;s primary symptom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);

              return (
                <div
                  key={dept.id}
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    setSelectedDoctorId(""); // reset doctor on dept change
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-black bg-neutral-50/70 ring-1 ring-black"
                      : "border-[#E5E5E5] hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-900">
                        {dept.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {dept.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-600">
                    <span>{deptDoctors.length} Doctors</span>
                    <span className="font-medium text-black">Select &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedDeptId}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Doctor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Doctor */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Step 2: Choose Specialist
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Available doctors in {selectedDepartment?.name}
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-neutral-500 hover:text-black flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableDoctors.map((doc) => {
              const isSelected = selectedDoctorId === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-black bg-neutral-50/70 ring-1 ring-black"
                      : "border-[#E5E5E5] hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold text-xs text-neutral-700 shrink-0">
                      {doc.name
                        .split(" ")
                        .slice(1)
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        {doc.qualification}
                      </p>
                      <div className="text-xs text-neutral-700 mt-1 font-semibold">
                        Fee: {formatINR(doc.consultationFee)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Next Slot: Tomorrow 10:00 AM</span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-black font-bold" : "text-neutral-400"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Choose"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedDoctorId}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Slot */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Step 3: Select Consultation Date &amp; Time Slot
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Consulting: {selectedDoctor?.name} ({selectedDepartment?.name})
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-neutral-500 hover:text-black flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Doctor
            </button>
          </div>

          {/* Date Picker row */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
              Choose Date
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "Today", date: "2026-10-13" },
                { label: "Tomorrow", date: "2026-10-14" },
                { label: "Thursday", date: "2026-10-15" },
                { label: "Friday", date: "2026-10-16" },
                { label: "Saturday", date: "2026-10-17" },
              ].map((d) => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d.date);
                    setSelectedSlotTime("");
                    setSlotWarning(null);
                    setAlternativeSlots([]);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    selectedDate === d.date
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-700 border-[#E5E5E5] hover:bg-neutral-50"
                  }`}
                >
                  <span>{d.label}</span>
                  <span className="text-[10px] opacity-70 ml-1.5 font-mono">
                    ({d.date.substring(5)})
                  </span>
                </button>
              ))}

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlotTime("");
                  setSlotWarning(null);
                  setAlternativeSlots([]);
                }}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50 font-mono"
              />
            </div>
          </div>

          {/* Slot chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                Available OPD Slots ({slots.length} Total)
              </span>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  Booked / Occupied
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  Selected
                </span>
              </div>
            </div>

            {loadingSlots ? (
              <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">
                Calculating doctor availability...
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                Doctor has no active OPD shifts or is on leave on this date.
                Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((s) => {
                  const isSelected = selectedSlotTime === s.time;
                  const isTaken = s.isBooked;

                  return (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => handleSlotClick(s)}
                      className={`p-2.5 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                        isSelected
                          ? "bg-black text-white border-black shadow-sm"
                          : isTaken
                          ? "bg-neutral-100 text-neutral-400 border-neutral-200 line-through cursor-pointer hover:border-neutral-300"
                          : "bg-white text-neutral-800 border-[#E5E5E5] hover:border-black hover:bg-neutral-50"
                      }`}
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Taken slot alternative suggestion banner (matches Trikon Voice Agent behavior) */}
          {slotWarning && alternativeSlots.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>{slotWarning}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Similar to the Voice AI agent, here are 3 alternate slots recommended for {selectedDoctor?.name}:
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {alternativeSlots.map((alt) => (
                  <button
                    key={alt}
                    type="button"
                    onClick={() => handleSelectAlternative(alt)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-mono text-xs font-medium hover:bg-amber-100/60 transition-colors"
                  >
                    Select {alt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedSlotTime}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Patient Details */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Step 4: Patient Information
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Demographic and contact details for appointment confirmation SMS and Voice Bot
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-neutral-500 hover:text-black flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Slot
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Vinay Kumar Rao"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Phone Number (for Voice call &amp; SMS) *
              </label>
              <input
                type="text"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98451 23410"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="vinay.rao@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Visit Type
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
              >
                <option value="In-Person OPD">In-Person OPD Consultation</option>
                <option value="Follow-up">Post-visit Follow-up</option>
                <option value="Teleconsultation">Teleconsultation (Video)</option>
                <option value="Health Checkup">Health Checkup Review</option>
              </select>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Preferred Voice Agent Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
              >
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
              </select>
            </div>

            {/* Reason for Visit */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mb-1.5">
                Reason for Visit / Chief Complaint
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the symptoms or health inquiry..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              disabled={!patientName.trim()}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Confirm */}
      {currentStep === 5 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-card space-y-6">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Step 5: Review Booking &amp; Outbound Voice Verification
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review appointment details. Confirming triggers the live Trikon voice bot confirmation protocol.
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-[#E5E5E5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-neutral-200 gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                  Doctor &amp; Department
                </span>
                <div className="text-base font-bold text-neutral-900">
                  {selectedDoctor?.name}
                </div>
                <div className="text-xs text-neutral-500">
                  {selectedDepartment?.name} · {selectedDoctor?.roomNumber}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                  Consultation Fee
                </span>
                <div className="text-base font-bold text-neutral-900">
                  {formatINR(selectedDoctor?.consultationFee || 500)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 font-medium">Date &amp; Slot:</span>
                <div className="font-mono text-neutral-900 font-semibold mt-0.5">
                  {selectedDate} at {selectedSlotTime}
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Visit Type:</span>
                <div className="text-neutral-900 font-semibold mt-0.5">
                  {visitType}
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Patient:</span>
                <div className="text-neutral-900 font-semibold mt-0.5">
                  {patientName} ({patientAge} yrs, {patientGender})
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Phone Number:</span>
                <div className="font-mono text-neutral-900 font-semibold mt-0.5">
                  {patientPhone}
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Bot Language:</span>
                <div className="text-neutral-900 font-semibold mt-0.5">
                  {preferredLanguage}
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Reason for Visit:</span>
                <div className="text-neutral-900 mt-0.5">
                  {reason || "General Consultation"}
                </div>
              </div>
            </div>
          </div>

          {/* Live Mock Outbound Call Progress Box (When confirming) */}
          {callProgressStage !== "idle" && (
            <div className="p-5 rounded-2xl bg-black text-white space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold tracking-tight">
                    Trikon Outbound Confirmation Bot
                  </span>
                </div>
                <StatusBadge status="Live" showDot />
              </div>

              {/* Progress Steps */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] bg-emerald-500 text-black font-bold">
                    ✓
                  </div>
                  <span
                    className={
                      callProgressStage === "calling"
                        ? "text-emerald-400 font-medium"
                        : "text-neutral-300"
                    }
                  >
                    Calling patient ({patientPhone})... Initiated outbound telephony
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      callProgressStage === "connected" ||
                      callProgressStage === "webhook" ||
                      callProgressStage === "booked"
                        ? "bg-emerald-500 text-black font-bold"
                        : "bg-neutral-800"
                    }`}
                  >
                    ✓
                  </div>
                  <span
                    className={
                      callProgressStage === "connected"
                        ? "text-emerald-400 font-medium"
                        : "text-neutral-400"
                    }
                  >
                    Call connected with patient... Automated Voice Agent confirming slot
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      callProgressStage === "booked"
                        ? "bg-emerald-500 text-black font-bold"
                        : "bg-neutral-800"
                    }`}
                  >
                    ✓
                  </div>
                  <span
                    className={
                      callProgressStage === "booked"
                        ? "text-emerald-400 font-bold"
                        : "text-neutral-400"
                    }
                  >
                    Webhook received: Appointment marked Booked &amp; Confirmed!
                  </span>
                </div>
              </div>

              {callProgressStage === "booked" && createdAppointment && (
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between mt-3">
                  <div>
                    <div className="text-xs text-neutral-400">
                      Confirmed Appointment Number
                    </div>
                    <div className="text-base font-mono font-bold text-white">
                      {createdAppointment.appointmentNumber} (Token #{createdAppointment.tokenNumber})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/appointments"
                      className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                    >
                      View in Appointments
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {callProgressStage === "idle" && (
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Confirm &amp; Run Voice Bot Call</span>
              </button>
            </div>
          )}

          {callProgressStage === "booked" && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setCallProgressStage("idle");
                  setCreatedAppointment(null);
                  setSelectedSlotTime("");
                  setPatientName("");
                }}
                className="px-4 py-2 text-xs font-medium border border-[#E5E5E5] rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Another Appointment</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-xs text-neutral-400">
          Loading booking workflow...
        </div>
      }
    >
      <BookAppointmentContent />
    </React.Suspense>
  );
}

