"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyChipProps {
  value: string;
  prefix?: string;
  className?: string;
  truncate?: boolean;
}

export function CopyChip({
  value,
  prefix = "ID:",
  className,
  truncate = false,
}: CopyChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = truncate && value.length > 16
    ? `${value.substring(0, 8)}...${value.substring(value.length - 6)}`
    : value;

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy ID"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 text-neutral-700 transition-colors cursor-pointer select-all",
        className
      )}
    >
      {prefix && <span className="text-neutral-600 font-semibold">{prefix}</span>}
      <span className="tracking-tight text-neutral-800">{displayValue}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
      )}
    </button>
  );
}

