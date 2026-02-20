import { NextRequest, NextResponse } from "next/server";

const CALENDAR_ID = "quinndelafleur@gmail.com";

export interface CalendarEventBrief {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
}

function parseEventTime(
  start: { dateTime?: string; date?: string },
  end: { dateTime?: string; date?: string }
): { timeStart: string; timeEnd: string } | null {
  const startDt = start.dateTime ?? start.date;
  const endDt = end.dateTime ?? end.date;
  if (!startDt || !endDt) {
    return null;
  }
  const startDate = new Date(startDt);
  const endDate = new Date(endDt);
  const timeStart = `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
  const timeEnd = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
  return { timeStart, timeEnd };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, date } = body as {
      accessToken: string;
      date: string;
    };

    if (!accessToken || !date) {
      return NextResponse.json(
        { error: "accessToken and date are required" },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);
    const timeMin = new Date(year, month - 1, day, 0, 0, 0);
    const timeMax = new Date(year, month - 1, day, 23, 59, 59);
    const timeMinStr = timeMin.toISOString();
    const timeMaxStr = timeMax.toISOString();

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
    );
    url.searchParams.set("timeMin", timeMinStr);
    url.searchParams.set("timeMax", timeMaxStr);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: "Calendar API error", details: err },
        { status: res.status }
      );
    }

    const data = (await res.json()) as {
      items?: Array<{
        id: string;
        summary?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
        status?: string;
      }>;
    };

    const events: CalendarEventBrief[] = [];
    for (const item of data.items ?? []) {
      if (item.status === "cancelled") {
        continue;
      }
      const start = item.start ?? {};
      const end = item.end ?? {};
      const times = parseEventTime(start, end);
      if (!times) {
        continue;
      }
      events.push({
        id: item.id,
        title: item.summary ?? "(No title)",
        timeStart: times.timeStart,
        timeEnd: times.timeEnd,
      });
    }

    return NextResponse.json({ events });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch calendar events", details: message },
      { status: 500 }
    );
  }
}
