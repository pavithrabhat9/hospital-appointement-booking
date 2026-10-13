"use client";

import React from "react";
import {
  Menu,
  Phone,
  LogOut,
  Terminal,
  Activity,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { hospitalConfig } from "@/lib/config";
import { useRouter } from "next/navigation";

export function TopBar() {
  const router = useRouter();
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    setMobileSidebarOpen,
    setWebhookInspectorOpen,
    user,
    logout,
  } = useHospitalStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E5E5] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-3">
        {/* Desktop Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Telephony Status Indicator */}
        <div className="flex items-center gap-2 pl-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-neutral-600 hidden sm:inline">
            Voice Agent Active
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hospital Phone Contact */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
          <Phone className="w-3.5 h-3.5 text-neutral-500" />
          <span className="font-mono font-medium">{hospitalConfig.phone}</span>
        </div>

        {/* Webhook Inspector Trigger Button */}
        <button
          onClick={() => setWebhookInspectorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
          title="Inspect Mock API & Webhooks"
        >
          <Terminal className="w-3.5 h-3.5 text-neutral-600" />
          <span className="hidden sm:inline">Webhook Inspector</span>
          <span className="sm:hidden">Webhooks</span>
        </button>

        {/* Admin profile chip */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 text-xs font-semibold">
            {user?.name ? user.name.charAt(0) : "A"}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-neutral-900 leading-tight">
              {user?.name || "Dr. Admin"}
            </div>
            <div className="text-[10px] text-neutral-500">
              {user?.role || "Administrator"}
            </div>
          </div>
        </div>

        {/* Log out */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

