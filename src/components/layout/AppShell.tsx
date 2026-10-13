"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useHospitalStore } from "@/lib/store";
import { WebhookInspectorDrawer } from "../ui/WebhookInspectorDrawer";
import { ToastProvider, useToast } from "../ui/Toast";
import { X } from "lucide-react";
import { CallLog } from "@/lib/types";
import { generateUUID } from "@/lib/utils";

// Background simulator that creates a realistic simulated call every 20 seconds
function FakeCallSimulator() {
  const { addCallLog, doctors, patients } = useHospitalStore();
  const { info } = useToast();

  useEffect(() => {
    const fakeCallSnippets = [
      {
        type: "Inquiry" as const,
        intent: "inquiry" as const,
        lang: "Kannada",
        summary: "Patient enquired about Sunday OPD timings. Bot informed OPD is closed on Sundays and offered Monday slot.",
        text: "Namaskara, Sunday OPD timings yenu?",
      },
      {
        type: "Booking" as const,
        intent: "appointment_scheduled" as const,
        lang: "Kannada",
        summary: "Caller enquired about orthopedic consultation slot with Dr. Gautham Rao.",
        text: "Dr. Gautham Rao avara appointment bekaadithu.",
      },
      {
        type: "Reminder" as const,
        intent: "appointment_scheduled" as const,
        lang: "English",
        summary: "Automated voice check-in for upcoming cardiology review.",
        text: "Confirming appointment attendance for tomorrow morning.",
      },
      {
        type: "Follow-up" as const,
        intent: "appointment_scheduled" as const,
        lang: "Hindi",
        summary: "Post-consultation follow-up inquiry regarding lab test report availability.",
        text: "Mera blood test report kab tak mil jayega?",
      },
    ];

    const interval = setInterval(() => {
      const randomPatient =
        patients[Math.floor(Math.random() * patients.length)] || {
          name: "Suresh Baliga",
          phone: "+91 97410 44219",
        };
      const randomDoctor =
        doctors[Math.floor(Math.random() * doctors.length)] || {
          name: "Dr. Sudhir Rao",
          departmentName: "General Medicine",
        };
      const template =
        fakeCallSnippets[Math.floor(Math.random() * fakeCallSnippets.length)];

      const newLog: CallLog = {
        id: `cl-auto-${Date.now()}`,
        callUuid: generateUUID(),
        patientName: randomPatient.name,
        patientPhone: randomPatient.phone,
        callType: template.type,
        language: template.lang,
        durationSeconds: 30 + Math.floor(Math.random() * 90),
        intent: template.intent,
        status: "completed",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        summary: template.summary,
        transcript: [
          {
            speaker: "agent",
            text: "Namaskara! Welcome to CityCare Multispeciality Hospital voice assistant.",
            timestamp: "00:02",
          },
          {
            speaker: "caller",
            text: template.text,
            timestamp: "00:08",
          },
          {
            speaker: "agent",
            text: `Processed successfully for ${randomDoctor.name}.`,
            timestamp: "00:15",
          },
        ],
        doctorName: randomDoctor.name,
        departmentName: randomDoctor.departmentName,
      };

      addCallLog(newLog);
      // Subtle toast
      info("New Voice Call Completed", `${randomPatient.name} - ${template.type} (${template.lang})`);
    }, 20000); // exactly every 20 seconds as requested!

    return () => clearInterval(interval);
  }, [addCallLog, doctors, patients, info]);

  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isMobileSidebarOpen, setMobileSidebarOpen } =
    useHospitalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("trikon-hospital-store-v1");
        localStorage.removeItem("trikon-hospital-store-v2");
        localStorage.removeItem("trikon-hospital-store-v3");
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, pathname, router]);

  // If on login page, render clean auth wrapper without sidebar
  if (pathname === "/login") {
    return (
      <ToastProvider>
        <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
          {children}
        </main>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-72 bg-white h-full shadow-2xl flex flex-col">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      <WebhookInspectorDrawer />
      <FakeCallSimulator />
    </ToastProvider>
  );
}

