import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Trikon Voice Studio | CityCare Multispeciality Hospital",
  description:
    "Intelligent Hospital Admin & Voice AI Platform for CityCare Multispeciality Hospital, Mangaluru.",
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
      </body>
    </html>
  );
}

