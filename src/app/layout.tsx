import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "CareDesk | CityCare Multispeciality Hospital",
  description:
    "Intelligent Outpatient Hospital Admin & Appointment Platform for CityCare Multispeciality Hospital, Mangaluru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
        <AppShell>{children}</AppShell>
        <Script
          src="https://voice.trikon.tech/embed.js"
          data-public-key="tvk_pk_u57lzhwA7LUKPf5pvnlUeS22he1c86mv"
          data-agent-id="19a28b2c-4fff-45fe-9298-1e25a2f12a9e"
          data-position="right"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

