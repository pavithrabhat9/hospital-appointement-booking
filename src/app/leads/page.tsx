"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Search,
  PhoneCall,
  Mail,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
} from "lucide-react";
import { useHospitalStore } from "@/lib/store";
import { Lead } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { mockApi } from "@/lib/mockApi";
import { hospitalConfig } from "@/lib/config";

export default function LeadsPage() {
  const { leads, updateLeadStatus, addLead, departments } = useHospitalStore();
  const { success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);

  // New Lead Modal state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+91 ");
  const [newEmail, setNewEmail] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newDept, setNewDept] = useState("General Medicine");
  const [newSource, setNewSource] = useState<Lead["source"]>("Inbound Voice AI");

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallNow = async (lead: Lead) => {
    setCallingLeadId(lead.id);
    info("Calling Lead...", `Dispatching voice agent to ${lead.name} (${lead.phone})`);

    await mockApi.triggerOutboundCall({
      to: lead.phone,
      agentId: hospitalConfig.defaultAgentId,
      enterprise: hospitalConfig.enterpriseSlug,
      from: hospitalConfig.phoneLineUuid,
      name: lead.name,
      metadata: {
        appointment_id: `lead-call-${Date.now()}`,
        doctor_name: "General Consultant",
        department_name: lead.departmentName,
        slot_start: "Immediate Inquiry",
        visit_type: "In-Person OPD",
        clinic_address: hospitalConfig.address,
        consultation_fee: 500,
      },
    });

    setTimeout(() => {
      setCallingLeadId(null);
      updateLeadStatus(lead.id, "Contacted");
      success(
        "Call Completed",
        `Voice agent connected with ${lead.name}. Status updated to Contacted.`
      );
    }, 2500);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || "patient@gmail.com",
      interest: newInterest.trim() || "General Consultation",
      departmentName: newDept,
      source: newSource,
      status: "New",
      dateAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
      notes: "Registered by front-desk admin.",
    };

    addLead(lead);
    success("Lead Added", `${lead.name} added to pipeline.`);
    setIsAddLeadOpen(false);
    setNewName("");
    setNewPhone("+91 ");
    setNewEmail("");
    setNewInterest("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbound Patient Inquiries & Leads"
        subtitle="Prospective patients captured via Voice AI intake, website inquiry, and health camps."
        breadcrumbs={[
          { label: "Workspace", href: "/" },
          { label: "Leads" },
        ]}
        actions={
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add lead</span>
          </button>
        }
      />

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lead by name, phone number, or clinical interest..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-neutral-50/70 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Lead Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Clinical Interest</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date Added</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Voice AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {lead.name}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-neutral-800">{lead.phone}</div>
                    <div className="text-[11px] text-neutral-400">{lead.email}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-900">
                      {lead.interest}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {lead.departmentName}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-neutral-600">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-[11px]">
                      {lead.source}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">
                    {lead.dateAdded}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateLeadStatus(lead.id, e.target.value as any)
                      }
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#E5E5E5] bg-white font-medium text-neutral-800 focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Booked">Booked</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleCallNow(lead)}
                      disabled={callingLeadId === lead.id}
                      className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      <span>{callingLeadId === lead.id ? "Calling..." : "Call now"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        title="Add Inbound Lead"
        subtitle="Capture new prospective patient inquiry for automated Voice bot follow-up"
      >
        <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sudhir Hegde"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+91 98451 22334"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 font-mono text-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="sudhir.hegde@gmail.com"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                Department
              </label>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                Lead Source
              </label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
              >
                <option value="Inbound Voice AI">Inbound Voice AI</option>
                <option value="Website inquiry">Website inquiry</option>
                <option value="Health Camp">Health Camp</option>
                <option value="Google Search">Google Search</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase mb-1">
              Clinical Interest / Inquiry
            </label>
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. Cardiac Calcium Scoring & Echo"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-neutral-50 text-neutral-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 font-medium"
            >
              Save Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
