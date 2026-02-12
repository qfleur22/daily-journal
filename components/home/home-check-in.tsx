"use client";

import { useEffect, useState } from "react";
import { createOrGetTodayEntry, updateEntry } from "@/lib/day-store";
import { DayEntry } from "@/models/day-entry";
import { DayEntryForm } from "@/components/day/day-entry-form";

export function HomeCheckIn() {
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    const today = createOrGetTodayEntry();
    setEntry(today);
    setIsLoading(false);
  }, []);

  const handleUpdate = (updates: Partial<DayEntry>) => {
    if (!entry) {
      return;
    }
    const updated = updateEntry({ id: entry.id, updates });
    if (updated) {
      setEntry(updated);
    }
  };

  const handleSave = () => {
    if (!entry) {
      return;
    }
    updateEntry({ id: entry.id, updates: { ...entry } });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  if (isLoading || !entry) {
    return (
      <div className="text-slate-500">Loading...</div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const isCurrentDay = entry.date === today;

  return (
    <div className="relative pb-16">
      <DayEntryForm
        entry={entry}
        onUpdate={handleUpdate}
        isCurrentDay={isCurrentDay}
      />
      <div className="fixed bottom-6 right-6">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-3 rounded-xl border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 shadow-md transition-colors font-medium"
        >
          {savedFeedback ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}
