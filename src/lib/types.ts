export type AppointmentStatus =
  | "pending"
  | "booked"
  | "cancelled"
  | "completed"
  | "no_show";

export type AppointmentSource =
  | "voice_ai"
  | "reception"
  | "web"
  | "campaign"
  | "whatsapp";

export type VisitType =
  | "In-Person OPD"
  | "Follow-up"
  | "Consultation"
  | "Teleconsultation"
  | "Health Checkup";

export interface Department {
  id: string;
  name: string;
  code: string;
  iconName: string;
  description: string;
  headOfDepartment: string;
  floor: string;
  totalDoctors: number;
  activeToday: number;
}

export interface DaySchedule {
  enabled: boolean;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "13:00"
  eveningEnabled?: boolean;
  eveningStartTime?: string; // e.g. "17:00"
  eveningEndTime?: string;   // e.g. "20:00"
}

export interface DoctorSchedule {
  slotDurationMinutes: number; // 15, 20, 30
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  blockedDates: string[]; // YYYY-MM-DD
}

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  consultationFee: number; // in INR
  rating: number;
  roomNumber: string;
  availableDays: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  schedule: DoctorSchedule;
}

export interface Patient {
  id: string;
  uhid: string; // Hospital Unique Healthcare ID e.g. CC-2026-0812
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  city: string;
  preferredLanguage: string;
  totalVisits: number;
  lastVisitDate?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string; // e.g. CC-APT-8921
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  slotEndTime: string; // e.g. "10:50 AM"
  visitType: VisitType;
  status: AppointmentStatus;
  source: AppointmentSource;
  reason: string;
  preferredLanguage: string;
  location: string;
  consultationFee: number;
  paymentStatus: "Paid" | "Pending" | "Covered by Insurance";
  paymentMethod?: "UPI" | "Cash" | "Credit Card" | "Insurance";
  tokenNumber: number;
  createdAt: string;
  updatedAt: string;
  callUuid?: string;
  notes?: string;
}

export interface TranscriptMessage {
  speaker: "agent" | "caller";
  text: string;
  timestamp: string;
}

export type CallIntent =
  | "appointment_scheduled"
  | "reschedule_requested"
  | "cancelled"
  | "inquiry"
  | "escalated";

export type CallType =
  | "Booking"
  | "Reminder"
  | "Follow-up"
  | "Campaign"
  | "Inquiry";

export interface CallLog {
  id: string;
  callUuid: string;
  patientName: string;
  patientPhone: string;
  callType: CallType;
  language: string;
  durationSeconds: number;
  intent: CallIntent;
  status: "completed" | "failed" | "busy" | "live";
  timestamp: string;
  summary: string;
  transcript: TranscriptMessage[];
  appointmentId?: string;
  doctorName?: string;
  departmentName?: string;
  webhookPayload?: Record<string, any>;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  departmentName: string;
  source: "Website inquiry" | "Inbound Voice AI" | "Health Camp" | "Google Search" | "Walk-in";
  status: "New" | "Contacted" | "Booked" | "Lost";
  dateAdded: string;
  lastContactedAt?: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type:
    | "Appointment reminder"
    | "Post-discharge follow-up"
    | "Health checkup camp"
    | "Missed appointment recovery";
  audienceSize: number;
  status: "active" | "completed" | "scheduled" | "draft";
  progressPercent: number;
  stats: {
    called: number;
    answered: number;
    booked: number;
    failed: number;
  };
  scheduledDate: string;
  language: string;
  agentName: string;
  scriptSnippet: string;
}

export interface OutboundCallPayload {
  to: string;
  agentId: string;
  enterprise: string;
  from: string;
  name: string;
  metadata: {
    appointment_id: string;
    doctor_name: string;
    department_name: string;
    slot_start: string;
    visit_type: string;
    clinic_address: string;
    consultation_fee: number;
  };
}

export interface WebhookEventPayload {
  event: "analysis.completed" | "call.completed";
  callUuid: string;
  to: string;
  name: string;
  intent: CallIntent;
  summary: string;
  transcript: {
    speaker: "agent" | "caller";
    text: string;
  }[];
  timestamp: string;
  metadata?: Record<string, any>;
}

