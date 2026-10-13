import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | React.ReactNode;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  badge?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badge,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-neutral-900">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              trend.isPositive ? "text-emerald-600" : "text-neutral-500"
            )}
          >
            {trend.value}
            {trend.label && (
              <span className="text-neutral-400 font-normal ml-1">
                {trend.label}
              </span>
            )}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-neutral-500 font-normal">
          {subtitle}
        </div>
      )}
    </div>
  );
}

