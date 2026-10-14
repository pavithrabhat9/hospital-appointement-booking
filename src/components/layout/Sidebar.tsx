"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  UserCheck,
  Building2,
  Clock,
  Users,
  Megaphone,
  UserPlus,
  PhoneCall,
  Bot,
  Layers,
  Settings,
  CreditCard,
  HelpCircle,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { hospitalConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/Toast";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, resetDemoData } = useHospitalStore();
  const { success } = useToast();

  const workspaceNav = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Doctors", href: "/doctors", icon: UserCheck },
    { label: "Departments", href: "/departments", icon: Building2 },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Campaigns", href: "/campaigns", icon: Megaphone },
    { label: "Leads", href: "/leads", icon: UserPlus },
    { label: "Call Logs", href: "/call-logs", icon: PhoneCall },
    { label: "AI Agent", href: "/ai-agent", icon: Bot },
  ];

  const accountNav = [
    { label: "Integrations", href: "/integrations", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Usage and Billing", href: "/usage-billing", icon: CreditCard },
    { label: "Support", href: "/support", icon: HelpCircle },
  ];

  const handleResetData = () => {
    if (confirm("Reset all appointments, schedules, and mock call records to default seed data?")) {
      resetDemoData();
      success("Demo data reset", "Hospital data restored to default seed state.");
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-[#E5E5E5] flex flex-col justify-between transition-all duration-300 z-30 select-none",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Branding & Quick Action */}
      <div className="p-4 border-b border-[#E5E5E5] shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#215c50] text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartPulse className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-neutral-900">
                  CareDesk
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-500 truncate uppercase tracking-wider">
                {hospitalConfig.shortName}
              </p>
            </div>
          )}
        </Link>

        {/* Black "+ Book appointment" Button (matches "+ New agent") */}
        <div className="mt-4">
          <Link
            href="/appointments/book"
            className={cn(
              "flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-sm",
              isSidebarCollapsed && "px-0"
            )}
            title="Book appointment"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Book appointment</span>}
          </Link>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Workspace section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
              WORKSPACE
            </div>
          )}
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                    isActive
                      ? "bg-neutral-100 text-black font-semibold shadow-none"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50",
                    isSidebarCollapsed && "justify-center px-0 py-2.5"
                  )}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-black" : "text-neutral-400 group-hover:text-neutral-900"
                    )}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Account section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
              ACCOUNT
            </div>
          )}
          <nav className="space-y-0.5">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                    isActive
                      ? "bg-neutral-100 text-black font-semibold shadow-none"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50",
                    isSidebarCollapsed && "justify-center px-0 py-2.5"
                  )}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-black" : "text-neutral-400"
                    )}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area: Demo reset & Platform info */}
      <div className="p-3 border-t border-[#E5E5E5] shrink-0 bg-neutral-50/50 space-y-2">
        <button
          onClick={handleResetData}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 transition-colors",
            isSidebarCollapsed && "justify-center px-0"
          )}
          title="Reset demo data"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          {!isSidebarCollapsed && <span>Reset demo data</span>}
        </button>

        {!isSidebarCollapsed && (
          <div className="px-3 pt-1 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Mangaluru, IN</span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Sparkles className="w-2.5 h-2.5 text-neutral-500" />
              TRIKONDEMO
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

