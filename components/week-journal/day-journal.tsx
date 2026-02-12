"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HOPEWAY_SCHEDULE, type DayKey } from "@/data/hopeway-schedule";
import { TodaysSchedule } from "@/components/week-journal/todays-schedule";
import { WeekendReflection } from "@/components/week-journal/weekend-reflection";
import {
  getDayLog,
  saveDayLog,
  type GroupLog,
} from "@/lib/hopeway-store";
import { format, parseISO } from "date-fns";

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

interface DayJournalProps {
  dayKey: DayKey;
}

export function DayJournal({ dayKey }: DayJournalProps) {
  const [date, setDate] = useState<string>("");
  const [logs, setLogs] = useState<Record<string, GroupLog>>({});
  const [reflection, setReflection] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const dayNum = today.getDay();
    const targetNum = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(dayKey);
    let d = new Date(today);
    d.setDate(today.getDate() + (targetNum - dayNum));
    const dateStr = format(d, "yyyy-MM-dd");
    setDate(dateStr);

    const existing = getDayLog({ date: dateStr });
    if (existing) {
      setLogs(existing.logs);
      setReflection(existing.reflection ?? "");
    } else {
      setLogs({});
      setReflection("");
    }
  }, [dayKey]);

  const schedule = HOPEWAY_SCHEDULE[dayKey];
  const isWeekend = dayKey === "saturday" || dayKey === "sunday";

  const handleLogChange = (itemId: string, update: Partial<GroupLog>) => {
    const next = { ...logs };
    const current = next[itemId] ?? { itemId, attended: false, notes: "" };
    next[itemId] = { ...current, ...update };
    setLogs(next);
    if (date) {
      saveDayLog({ date, logs: next, reflection });
    }
  };

  const handleReflectionChange = (value: string) => {
    setReflection(value);
    if (date) {
      saveDayLog({ date, logs, reflection: value });
    }
  };

  const handleSave = () => {
    if (date) {
      saveDayLog({ date, logs, reflection });
    }
  };

  if (!date) {
    return <div className="text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {DAY_LABELS[dayKey]} — {format(parseISO(date), "MMMM d, yyyy")}
          </h1>
          <p className="text-slate-600 mt-1">Hopeway PHP Track #2</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/week-journal"
            className="px-4 py-2 rounded-lg border-2 border-thistle/60 bg-white/80 hover:bg-pastel-petal/30 transition-colors"
          >
            ← Back to week
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-thistle/80 text-slate-800 hover:bg-thistle font-medium"
          >
            Save
          </button>
        </div>
      </div>

      {isWeekend ? (
        <WeekendReflection
          reflection={reflection}
          onReflectionChange={handleReflectionChange}
        />
      ) : (
        <TodaysSchedule
          items={schedule}
          logs={logs}
          onLogChange={handleLogChange}
        />
      )}
    </div>
  );
}
