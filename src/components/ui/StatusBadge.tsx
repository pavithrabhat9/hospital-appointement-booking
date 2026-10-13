import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "live"
  | "booked"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "no_show"
  | "escalated"
  | "active"
  | "scheduled"
  | "draft"
  | "new"
  | "contacted"
  | "lost";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  variant,
  className,
  showDot = false,
}: StatusBadgeProps) {
  const norm = (variant || status || "").toLowerCase().replace(/[\s-]/g, "_");

  let styles = "bg-neutral-100 text-neutral-700 border-neutral-200";
  let dotColor = "bg-neutral-400";
  let isPulsing = false;

  switch (norm) {
    case "live":
      styles = "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium";
      dotColor = "bg-emerald-500";
      isPulsing = true;
      break;
    case "booked":
    case "confirmed":
    case "active":
      styles = "bg-emerald-50 text-emerald-800 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;
    case "pending":
    case "scheduled":
      styles = "bg-amber-50 text-amber-800 border-amber-200";
      dotColor = "bg-amber-500";
      break;
    case "cancelled":
    case "failed":
    case "lost":
      styles = "bg-rose-50 text-rose-800 border-rose-200";
      dotColor = "bg-rose-500";
      break;
    case "completed":
      styles = "bg-neutral-100 text-neutral-700 border-neutral-200";
      dotColor = "bg-neutral-400";
      break;
    case "no_show":
    case "escalated":
      styles = "bg-orange-50 text-orange-800 border-orange-200";
      dotColor = "bg-orange-500";
      break;
    case "new":
    case "contacted":
      styles = "bg-neutral-100 text-neutral-800 border-neutral-200 font-medium";
      dotColor = "bg-neutral-500";
      break;
    default:
      styles = "bg-neutral-100 text-neutral-700 border-neutral-200";
      dotColor = "bg-neutral-400";
  }

  const label =
    status === "no_show"
      ? "No-Show"
      : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border font-medium",
        styles,
        className
      )}
    >
      {(showDot || isPulsing) && (
        <span className="relative flex h-2 w-2">
          {isPulsing && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColor
              )}
            />
          )}
          <span
            className={cn("relative inline-flex rounded-full h-2 w-2", dotColor)}
          />
        </span>
      )}
      {label}
    </span>
  );
}

