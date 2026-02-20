"use client";

import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { type ScheduleTimeBlock } from "@/models/day-entry";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface CalendarSyncButtonProps {
  date: string;
  scheduleBlocks: ScheduleTimeBlock[];
  onScheduleBlocksChange: (blocks: ScheduleTimeBlock[]) => void;
  disabled?: boolean;
}

function CalendarSyncButtonInner({
  date,
  scheduleBlocks,
  onScheduleBlocksChange,
  disabled,
}: CalendarSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    onSuccess: async (tokenResponse) => {
      setIsSyncing(true);
      setError(null);
      try {
        const res = await fetch("/api/calendar/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokenResponse.access_token,
            date,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? data.details ?? "Failed to fetch events");
          return;
        }

        const existingCalendarIds = new Set(
          (scheduleBlocks ?? [])
            .filter((b) => b.calendarEventId)
            .map((b) => b.calendarEventId)
        );

        const newBlocks: ScheduleTimeBlock[] = (data.events ?? []).map(
          (ev: { id: string; title: string; timeStart: string; timeEnd: string }) => {
            if (existingCalendarIds.has(ev.id)) {
              return null;
            }
            return {
              id: `block-cal-${ev.id}-${Date.now()}`,
              title: ev.title,
              notes: "",
              timeStart: ev.timeStart,
              timeEnd: ev.timeEnd,
              source: "calendar" as const,
              attended: false,
              calendarEventId: ev.id,
            };
          }
        ).filter(Boolean);

        if (newBlocks.length > 0) {
          onScheduleBlocksChange([...(scheduleBlocks ?? []), ...newBlocks]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sync failed");
      } finally {
        setIsSyncing(false);
      }
    },
    onError: () => {
      setError("Google sign-in failed");
      setIsSyncing(false);
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => login()}
        disabled={disabled ?? isSyncing}
        className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium disabled:opacity-60"
      >
        {isSyncing ? "Syncing…" : "Sync to calendar"}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export function CalendarSyncButton(props: CalendarSyncButtonProps) {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CalendarSyncButtonInner {...props} />
    </GoogleOAuthProvider>
  );
}
