"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  createOrGetEntryForDate,
  getEntryByDate,
} from "@/lib/day-store";

export default function DayByDatePage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;

  useEffect(() => {
    if (!date || typeof date !== "string") {
      return;
    }
    const existing = getEntryByDate({ date });
    if (existing) {
      router.replace(`/day/${existing.id}`);
      return;
    }
    const entry = createOrGetEntryForDate({ date });
    router.replace(`/day/${entry.id}`);
  }, [date, router]);

  return (
    <div className="text-slate-600">
      Opening entry for {date}…
      <Link href="/" className="ml-2 underline text-thistle">
        Back to home
      </Link>
    </div>
  );
}
