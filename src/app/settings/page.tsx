"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { hospitalConfig } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import { Building, Phone, Mail, MapPin, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const { success } = useToast();
  const [name, setName] = useState(hospitalConfig.name);
  const [phone, setPhone] = useState(hospitalConfig.phone);
  const [email, setEmail] = useState(hospitalConfig.email);
  const [location, setLocation] = useState(hospitalConfig.location);
  const [address, setAddress] = useState(hospitalConfig.address);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success("Settings Saved", "Hospital general configuration updated.");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Hospital System Settings"
        subtitle="General organization profile, contact numbers, and operational parameters."
        breadcrumbs={[
          { label: "Account", href: "/" },
          { label: "Settings" },
        ]}
      />

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5E5] rounded-3xl p-6 shadow-card space-y-5 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1.5">
            Hospital Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 font-mono text-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1.5">
              City / Region
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1.5">
              Full Postal Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 text-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

