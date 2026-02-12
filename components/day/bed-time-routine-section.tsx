"use client";

import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  "Wind down",
  "Hygiene",
  "Prepare for sleep",
  "Lights out",
];

interface BedTimeRoutineSectionProps {
  className?: string;
}

export function BedTimeRoutineSection({ className }: BedTimeRoutineSectionProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 border-thistle/40 bg-icy-blue/30",
        className
      )}
    >
      <h3 className="font-semibold mb-3">Bed time routine</h3>
      <ul className="space-y-2">
        {DEFAULT_ITEMS.map((label, i) => (
          <li key={i}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-thistle text-thistle"
              />
              <span className="text-sm">{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
