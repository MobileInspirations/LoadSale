"use client";

import { BadgeCheck } from "lucide-react";

type Level = "basic" | "verified" | "trusted" | "enterprise";

export function VerificationBadge({ level }: { level: Level }) {
  if (level === "basic") return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      title={level}
    >
      <BadgeCheck
        className={`h-3.5 w-3.5 ${
          level === "verified"
            ? "text-blue-400"
            : level === "trusted"
              ? "text-amber-400"
              : "text-purple-400"
        }`}
      />
      {level === "verified" && "Verified"}
      {level === "trusted" && "Trusted"}
      {level === "enterprise" && "Enterprise"}
    </span>
  );
}
