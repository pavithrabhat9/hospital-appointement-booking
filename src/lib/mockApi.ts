import {
  Doctor,
  Appointment,
  CallLog,
  Lead,
  Campaign,
  OutboundCallPayload,
  WebhookEventPayload,
  VisitType,
} from "./types";
import { useHospitalStore } from "./store";
import { hospitalConfig } from "./config";
import { generateUUID } from "./utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface GeneratedSlot {
  time: string; // e.g. "09:30 AM"
  available: boolean;
  isBooked: boolean;
  isBlockedDate: boolean;
}

export const mockApi = {
  // 1. Get doctors (optionally filtered by department)
  async getDoctors(departmentId?: string): Promise<Doctor[]> {
    await delay(350);
    const doctors = useHospitalStore.getState().doctors;
    if (departmentId) {
      return doctors.filter((d) => d.departmentId === departmentId);
    }
    return doctors;
  },

  // 2. Get dynamic slots for a doctor on a specific date (YYYY-MM-DD)
  async getSlots(doctorId: string, dateStr: string): Promise<GeneratedSlot[]> {
    await delay(400);
    const store = useHospitalStore.getState();
    const doctor = store.doctors.find((d) => d.id === doctorId);
    if (!doctor) return [];

    const date = new Date(dateStr);
    const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday ...
    const dayKeys = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;
    const currentDayKey = dayKeys[dayIndex];
    const daySchedule = doctor.schedule[currentDayKey];

    // Check if blocked date
    const isBlocked = doctor.schedule.blockedDates?.includes(dateStr);

    if (!daySchedule?.enabled || isBlocked) {
      return [];
    }

    const duration = doctor.schedule.slotDurationMinutes || 15;
    const slots: GeneratedSlot[] = [];

    // Helper to generate time slot strings
    const generateRangeSlots = (startStr: string, endStr: string) => {
      const [startHour, startMin] = startStr.split(":").map(Number);
      const [endHour, endMin] = endStr.split(":").map(Number);

      let currentMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      while (currentMinutes + duration <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedTime = `${displayHours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")} ${period}`;

        // Check if existing appointment has this doctor, date, and slot
        const isAlreadyBooked = store.appointments.some(
          (apt) =>
            apt.doctorId === doctorId &&
            apt.date === dateStr &&
            apt.timeSlot.trim().toUpperCase() === formattedTime.trim().toUpperCase() &&
            apt.status !== "cancelled"
        );

        slots.push({
          time: formattedTime,
          available: !isAlreadyBooked,
          isBooked: isAlreadyBooked,
          isBlockedDate: false,
        });

        currentMinutes += duration;
      }
    };

    if (daySchedule.startTime && daySchedule.endTime) {
      generateRangeSlots(daySchedule.startTime, daySchedule.endTime);
    }

    if (daySchedule.eveningEnabled && daySchedule.eveningStartTime && daySchedule.eveningEndTime) {
      generateRangeSlots(daySchedule.eveningStartTime, daySchedule.eveningEndTime);
    }

    return slots;
  },

  // 3. Check slot availability and return 3 alternative suggestions if taken
  async checkAvailability(
    doctorId: string,
    dateStr: string,
    slotTime: string
  ): Promise<{
    available: boolean;
    alternatives: string[];
  }> {
    await delay(300);
    const slots = await this.getSlots(doctorId, dateStr);
    const target = slots.find((s) => s.time === slotTime);

    if (target && target.available) {
      return { available: true, alternatives: [] };
    }

    // Pick 3 available alternative slots
    const availableOnes = slots
      .filter((s) => s.available && s.time !== slotTime)
      .slice(0, 3)
      .map((s) => s.time);

    // If less than 3 on this day, fallback to default safe morning times
    const defaultFallbacks = ["10:30 AM", "11:15 AM", "04:30 PM"].filter(
      (t) => t !== slotTime && !availableOnes.includes(t)
    );

    const alternatives = [
      ...availableOnes,
      ...defaultFallbacks,
    ].slice(0, 3);

    return {
      available: false,
      alternatives,
    };
  },

  // 4. Trigger Outbound Call conforming to Trikon platform schema
  async triggerOutboundCall(payload: OutboundCallPayload): Promise<{ callUuid: string; status: string }> {
    await delay(500);
    const callUuid = generateUUID();
    useHospitalStore.getState().setLastOutboundCall(payload);
    return {
      callUuid,
      status: "initiated",
    };
  },

  // 5. Handle Webhook payload (simulates Trikon Voice Studio analysis.completed webhook)
  async handleWebhook(body: WebhookEventPayload): Promise<{ success: boolean; eventReceived: string }> {
    await delay(400);
    const store = useHospitalStore.getState();
    store.setLastWebhookEvent(body);

    // If appointment UUID or metadata present, update appointment to booked
    const aptId = body.metadata?.appointment_id;
    if (aptId) {
      store.updateAppointmentStatus(aptId, "booked");
    }

    // Create call log entry
    const callLog: CallLog = {
      id: `cl-${Date.now()}`,
      callUuid: body.callUuid,
      patientName: body.name,
      patientPhone: body.to,
      callType: "Booking",
      language: "Kannada / English",
      durationSeconds: 45 + Math.floor(Math.random() * 45),
      intent: body.intent,
      status: "completed",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      summary: body.summary,
      transcript: body.transcript.map((t, i) => ({
        speaker: t.speaker,
        text: t.text,
        timestamp: `00:0${(i + 1) * 6}`,
      })),
      doctorName: body.metadata?.doctor_name,
      departmentName: body.metadata?.department_name,
      appointmentId: aptId,
      webhookPayload: body,
    };
    store.addCallLog(callLog);

    // Check if phone number is new; if so, create a new lead
    const existingPatient = store.patients.some((p) => p.phone === body.to);
    const existingLead = store.leads.some((l) => l.phone === body.to);
    if (!existingPatient && !existingLead) {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: body.name,
        phone: body.to,
        email: `${body.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        interest: `${body.metadata?.department_name || "General"} Consultation`,
        departmentName: body.metadata?.department_name || "General Medicine",
        source: "Inbound Voice AI",
        status: "Booked",
        dateAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
        notes: `Automatically captured from voice booking call ${body.callUuid}`,
      };
      store.addLead(newLead);
    }

    return {
      success: true,
      eventReceived: body.event,
    };
  },

  // 6. Complete booking flow with mock webhook cycle
  async bookAppointment(
    data: {
      patientName: string;
      patientPhone: string;
      patientEmail: string;
      patientAge: number;
      patientGender: "Male" | "Female" | "Other";
      doctorId: string;
      doctorName: string;
      departmentId: string;
      departmentName: string;
      date: string;
      timeSlot: string;
      visitType: VisitType;
      reason: string;
      preferredLanguage: string;
      consultationFee: number;
    },
    onProgress?: (stage: "calling" | "connected" | "webhook" | "booked") => void
  ): Promise<Appointment> {
    const store = useHospitalStore.getState();
    const aptNumber = `CC-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const aptId = `apt-${Date.now()}`;
    const tokenNum = store.appointments.filter((a) => a.date === data.date).length + 1;

    // 1. Initially saved as Pending
    const newAppointment: Appointment = {
      id: aptId,
      appointmentNumber: aptNumber,
      patientId: `pat-${Date.now()}`,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      date: data.date,
      timeSlot: data.timeSlot,
      slotEndTime: `${data.timeSlot} + 15m`,
      visitType: data.visitType,
      status: "pending", // Starts as pending
      source: "voice_ai",
      reason: data.reason || "General Consultation",
      preferredLanguage: data.preferredLanguage,
      location: "Main OPD Wing",
      consultationFee: data.consultationFee,
      paymentStatus: "Pending",
      paymentMethod: "UPI",
      tokenNumber: tokenNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.addAppointment(newAppointment);

    // Start mock outbound call
    onProgress?.("calling");
    const outboundPayload: OutboundCallPayload = {
      to: data.patientPhone,
      agentId: hospitalConfig.defaultAgentId,
      enterprise: hospitalConfig.enterpriseSlug,
      from: hospitalConfig.phoneLineUuid,
      name: data.patientName,
      metadata: {
        appointment_id: aptId,
        doctor_name: data.doctorName,
        department_name: data.departmentName,
        slot_start: `${data.date}T${data.timeSlot}`,
        visit_type: data.visitType,
        clinic_address: hospitalConfig.address,
        consultation_fee: data.consultationFee,
      },
    };

    const callResult = await this.triggerOutboundCall(outboundPayload);

    // Wait ~1.5s for call connection
    await delay(1500);
    onProgress?.("connected");

    // Wait ~2.5s for webhook return
    await delay(2500);
    onProgress?.("webhook");

    const webhookBody: WebhookEventPayload = {
      event: "analysis.completed",
      callUuid: callResult.callUuid,
      to: data.patientPhone,
      name: data.patientName,
      intent: "appointment_scheduled",
      summary: `Automated confirmation call to ${data.patientName}. Patient confirmed consultation with ${data.doctorName} for ${data.date} at ${data.timeSlot}.`,
      transcript: [
        {
          speaker: "agent",
          text: `Namaskara ${data.patientName}! This is CityCare Multispeciality Hospital calling to verify your appointment with ${data.doctorName} on ${data.date} at ${data.timeSlot}.`,
        },
        {
          speaker: "caller",
          text: "Yes, I confirm my appointment. Please book it.",
        },
        {
          speaker: "agent",
          text: `Thank you! Your appointment is confirmed with Token #${tokenNum}. You will receive an SMS confirmation shortly.`,
        },
      ],
      timestamp: new Date().toISOString(),
      metadata: outboundPayload.metadata,
    };

    await this.handleWebhook(webhookBody);
    onProgress?.("booked");

    return {
      ...newAppointment,
      status: "booked",
      callUuid: callResult.callUuid,
    };
  },

  // 7. Reschedule appointment
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newSlot: string
  ): Promise<boolean> {
    await delay(450);
    useHospitalStore.getState().rescheduleAppointment(appointmentId, newDate, newSlot);
    return true;
  },

  // 8. Cancel appointment
  async cancelAppointment(appointmentId: string, reason?: string): Promise<boolean> {
    await delay(400);
    useHospitalStore.getState().cancelAppointment(appointmentId, reason);
    return true;
  },

  // 9. Test telephony connection
  async testConnection(): Promise<{ connected: boolean; latencyMs: number; provider: string }> {
    await delay(600);
    return {
      connected: true,
      latencyMs: 84,
      provider: "Trikon Voice Studio Gateway (South-Asia-blr-1)",
    };
  },
};

