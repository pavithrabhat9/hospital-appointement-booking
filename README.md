# Trikon Voice Studio — Hospital Admin Platform UI

An intelligent outpatient hospital admin and Voice AI operations platform built for **CityCare Multispeciality Hospital, Mangaluru** powered by **Trikon Voice Studio**.

Designed in a clean black & white aesthetic matching the Trikon Voice Studio design system:
- `#FAFAFA` background, white cards, 1px `#E5E5E5` borders, rounded 18px corners, solid black primary actions.
- Semantic indicator colors (emerald for live/confirmed, amber for pending, rose for cancelled, orange for escalated).
- Clean system `sans-serif` typography and monospace for IDs, tokens, timestamps, and JSON payloads.

---

## Features

### Workspace
- **Dashboard (`/`)**:
  - Live stat cards: Today's appointments (confirmed/pending), This week's bookings, AI-booked ratio %, Calls handled today.
  - Doctors & availability overview cards.
  - Recharts department-wise outpatient load distribution chart.
  - Today's real-time OPD token queue with instant side drawer view.
  - **Live Call Activity**: Background telephony simulator automatically receiving new simulated voice calls every 20 seconds.

- **Appointments (`/appointments`)**:
  - Comprehensive list with multi-filters (Date, Doctor, Department, Status, Source) and search.
  - Interactive side drawer with actions: Confirm, Reschedule (with date/slot picker), Cancel, and Mark No-Show.

- **Book Appointment (`/appointments/book`)**:
  - Full-page 5-step stepper: Department &rarr; Doctor &rarr; Date & Slot &rarr; Patient Details &rarr; Review & Confirm.
  - Dynamic slot generator engine with alternative slot suggestions if a slot is occupied.
  - Live mock outbound confirmation call: *Calling patient...* &rarr; *Call connected...* &rarr; *Webhook received: Booked*.

- **Doctors (`/doctors`)**:
  - Clinical specialists grid with Indian names, qualifications, experience, languages, INR fees (₹400–₹800), and available day chips.
  - Multi-filtering by department, language, and "Available Today".
  - Doctor profile drawer with weekly shifts and room details.

- **Departments (`/departments`)**:
  - Clinical departments overview cards with doctor counts, active bookings, and faculty drill-down.

- **Patients Registry (`/patients`)**:
  - UHID registry (*e.g., CC-2026-0101*), demographics, contact details, consultation history, and telephony call history.

- **Campaigns (`/campaigns`)**:
  - Outbound voice campaign cards with progress bars and conversion funnels.
  - 3-step campaign wizard: Audience &rarr; Script & Language &rarr; Telephony Schedule.
  - Campaign performance drawer.

- **Leads (`/leads`)**:
  - Inbound patient inquiries pipeline with status dropdowns (*New, Contacted, Booked, Lost*).
  - Live "Call now" button triggering simulated outbound call and status updates.
  - "+ Add Lead" modal.

- **AI Agent (`/ai-agent`)**:
  - Agent switcher (*Hospital Outpatient Booking Agent, Automated Reminder Agent, Post-Discharge Follow-up Agent*).
  - Read-only prompt guidelines matching Trikon Voice Studio (*Role & Identity, Clinical Guidelines, Knowledge Base, Escalation Rules, Forbidden Topics*).
  - Dark rounded **Playground** card with live microphone stream simulator.
  - **Test Voice Call** card for dialing real test phone numbers with outbound mock telephony.

- **Call Logs (`/call-logs`)**:
  - Telephony table with live indicator and refresh sync.
  - Turn-by-turn transcript bubbles (*Trikon Bot* vs *Patient*).
  - Functional fake audio player with live scrub timer and animated waveforms.
  - Webhook JSON payload viewer with 1-click clipboard copy.

### Account
- **Integrations (`/integrations`)**: Trikon Voice Studio Gateway, Agent ID, Enterprise Slug (`TRIKONDEMO`), Phone Line UUID, masked API keys with show/hide toggle, and Google Calendar sync.
- **Settings (`/settings`)**: Hospital organization profile and address configuration.
- **Usage & Billing (`/usage-billing`)**: Enterprise Health Tier quota tracking and tax invoices table.
- **Support (`/support`)**: Emergency telephony hotline, support contact, and interactive FAQ accordion.
- **Webhook Inspector**: Global drawer accessible anytime from top bar displaying live JSON exchange.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons (`lucide-react`)
- **State Management**: Zustand with `localStorage` persistence and rehydration sanitization
- **Charts**: Recharts
- **Date Utilities**: `date-fns`

---

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Environment:
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Any email and password works on `/login`.

