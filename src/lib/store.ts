import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Department,
  Doctor,
  DoctorSchedule,
  Patient,
  Appointment,
  CallLog,
  Lead,
  Campaign,
  AppointmentStatus,
  OutboundCallPayload,
  WebhookEventPayload,
} from "./types";
import {
  initialDepartments,
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialCallLogs,
  initialLeads,
  initialCampaigns,
} from "./dummyData";
import { hospitalConfig } from "./config";

interface AdminUser {
  name: string;
  role: string;
  email: string;
}

interface HospitalStoreState {
  // Auth
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Sidebar mobile toggle
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Data
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  callLogs: CallLog[];
  leads: Lead[];
  campaigns: Campaign[];

  // Webhook Inspector
  isWebhookInspectorOpen: boolean;
  setWebhookInspectorOpen: (open: boolean) => void;
  lastOutboundCall: OutboundCallPayload | null;
  lastWebhookEvent: WebhookEventPayload | null;
  setLastOutboundCall: (call: OutboundCallPayload) => void;
  setLastWebhookEvent: (event: WebhookEventPayload) => void;

  // Actions
  updateDoctorSchedule: (doctorId: string, schedule: DoctorSchedule) => void;
  updateDoctor: (doctor: Doctor) => void;
  addAppointment: (apt: Appointment) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  addCallLog: (log: CallLog) => void;
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  addPatient: (patient: Patient) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaignStatus: (id: string, status: Campaign["status"]) => void;
  resetDemoData: () => void;
}

export const useHospitalStore = create<HospitalStoreState>()(
  persist(
    (set, get) => ({
      // Auth defaults
      isAuthenticated: true,
      user: hospitalConfig.adminUser,
      login: (_email: string, _pass: string) => {
        set({
          isAuthenticated: true,
          user: hospitalConfig.adminUser,
        });
        return true;
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      // UI state
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
      isMobileSidebarOpen: false,
      setMobileSidebarOpen: (open: boolean) => set({ isMobileSidebarOpen: open }),

      // Seed data
      departments: initialDepartments,
      doctors: initialDoctors,
      patients: initialPatients,
      appointments: initialAppointments,
      callLogs: initialCallLogs,
      leads: initialLeads,
      campaigns: initialCampaigns,

      // Webhook Inspector
      isWebhookInspectorOpen: false,
      setWebhookInspectorOpen: (open: boolean) => set({ isWebhookInspectorOpen: open }),
      lastOutboundCall: {
        to: "+91 98451 23410",
        agentId: hospitalConfig.defaultAgentId,
        enterprise: hospitalConfig.enterpriseSlug,
        from: hospitalConfig.phoneLineUuid,
        name: "Kavitha Mendonca",
        metadata: {
          appointment_id: "CC-APT-901",
          doctor_name: "Dr. Sudhir Rao",
          department_name: "General Medicine",
          slot_start: "2026-10-13T09:30:00+05:30",
          visit_type: "In-Person OPD",
          clinic_address: hospitalConfig.address,
          consultation_fee: 500,
        },
      },
      lastWebhookEvent: {
        event: "analysis.completed",
        callUuid: "4275b22c-1adf-4bcd-ae3c-32228d8b6e29",
        to: "+91 98451 23410",
        name: "Kavitha Mendonca",
        intent: "appointment_scheduled",
        summary: "Patient confirmed attendance for 09:30 AM slot tomorrow.",
        transcript: [
          { speaker: "agent", text: "Namaskara Mrs. Kavitha, booking confirmed for 9:30 AM." },
          { speaker: "caller", text: "Dhanyavadagalu!" },
        ],
        timestamp: "2026-10-13T14:48:10+05:30",
      },
      setLastOutboundCall: (call) => set({ lastOutboundCall: call }),
      setLastWebhookEvent: (event) => set({ lastWebhookEvent: event }),

      // Doctor updates
      updateDoctorSchedule: (doctorId, schedule) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === doctorId ? { ...doc, schedule } : doc
          ),
        }));
      },
      updateDoctor: (updatedDoctor) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === updatedDoctor.id ? updatedDoctor : doc
          ),
        }));
      },

      // Appointment actions
      addAppointment: (apt) => {
        set((state) => ({
          appointments: [apt, ...state.appointments],
        }));
      },
      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, status, updatedAt: new Date().toISOString() }
              : apt
          ),
        }));
      },
      rescheduleAppointment: (id, newDate, newTimeSlot) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? {
                  ...apt,
                  date: newDate,
                  timeSlot: newTimeSlot,
                  status: "booked",
                  updatedAt: new Date().toISOString(),
                }
              : apt
          ),
        }));
      },
      cancelAppointment: (id, reason) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? {
                  ...apt,
                  status: "cancelled",
                  reason: reason || apt.reason,
                  updatedAt: new Date().toISOString(),
                }
              : apt
          ),
        }));
      },

      // Calls & Leads
      addCallLog: (log) => {
        set((state) => ({
          callLogs: [log, ...state.callLogs],
        }));
      },
      addLead: (lead) => {
        set((state) => ({
          leads: [lead, ...state.leads],
        }));
      },
      updateLeadStatus: (id, status) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
        }));
      },
      addPatient: (patient) => {
        set((state) => ({
          patients: [patient, ...state.patients],
        }));
      },
      addCampaign: (campaign) => {
        set((state) => ({
          campaigns: [campaign, ...state.campaigns],
        }));
      },
      updateCampaignStatus: (id, status) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        }));
      },

      resetDemoData: () => {
        set({
          departments: initialDepartments,
          doctors: initialDoctors,
          patients: initialPatients,
          appointments: initialAppointments,
          callLogs: initialCallLogs,
          leads: initialLeads,
          campaigns: initialCampaigns,
        });
      },
    }),
    {
      name: "trikon-hospital-store-v4",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Automatic in-place sanitizer for any lingering browser cache
          state.doctors = state.doctors.map((doc) => {
            let name = doc.name;
            if (name.includes("Sweekar")) name = "Dr. Sudhir Rao";
            if (name.includes("Yogesh")) name = "Dr. Rajesh Bhat";
            return {
              ...doc,
              name,
              languages: doc.languages.filter((l) => l !== "Tulu"),
            };
          });
          state.appointments = state.appointments.map((apt) => {
            let docName = apt.doctorName;
            if (docName.includes("Sweekar")) docName = "Dr. Sudhir Rao";
            if (docName.includes("Yogesh")) docName = "Dr. Rajesh Bhat";
            return {
              ...apt,
              doctorName: docName,
              preferredLanguage: apt.preferredLanguage === "Tulu" ? "Kannada" : apt.preferredLanguage,
            };
          });
          state.callLogs = state.callLogs.map((log) => {
            let docName = log.doctorName;
            if (docName && docName.includes("Sweekar")) docName = "Dr. Sudhir Rao";
            if (docName && docName.includes("Yogesh")) docName = "Dr. Rajesh Bhat";
            return {
              ...log,
              doctorName: docName,
              language: log.language === "Tulu" ? "Kannada" : log.language,
            };
          });
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        departments: state.departments,
        doctors: state.doctors,
        patients: state.patients,
        appointments: state.appointments,
        callLogs: state.callLogs,
        leads: state.leads,
        campaigns: state.campaigns,
        lastOutboundCall: state.lastOutboundCall,
        lastWebhookEvent: state.lastWebhookEvent,
      }),
    }
  )
);

