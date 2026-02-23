"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createOrGetTodayEntry, updateEntry } from "@/lib/day-store";
import {
  MORNING_ROUTINE_ITEMS,
  BEDTIME_ROUTINE_ITEMS,
  type RoutineTier,
  type RoutineItem,
} from "@/data/routine-content";
import { ScaleSlider } from "@/components/shared/scale-slider";
import {
  type ParticipationPlan,
  type BurnoutStage,
  type WindowOfTolerance,
} from "@/models/day-entry";

const SPOON_OPTIONS: { value: RoutineTier; label: string }[] = [
  { value: 0, label: "Low spoons" },
  { value: 1, label: "Average spoons" },
  { value: 2, label: "High spoons" },
];

const PARTICIPATION_OPTIONS: ParticipationPlan[] = [
  "Full",
  "Medium",
  "Low",
  "Safety",
];

const BURNOUT_OPTIONS: BurnoutStage[] = [
  "Green",
  "Yellow",
  "Red",
  "Black",
];

const BURNOUT_STAGE_STYLES: Record<BurnoutStage, string> = {
  Green: "border-green-400 bg-green-50 text-green-800 ring-green-400",
  Yellow: "border-amber-400 bg-amber-50 text-amber-800 ring-amber-400",
  Red: "border-red-400 bg-red-50 text-red-800 ring-red-400",
  Black: "border-slate-600 bg-slate-200 text-slate-900 ring-slate-600",
};

const WINDOW_OPTIONS: WindowOfTolerance[] = [
  "In-window",
  "Hyper",
  "Hypo",
  "Freeze",
];

interface RoutinePageClientProps {
  routineType: "morning" | "bedtime";
  title: string;
}

export function RoutinePageClient({
  routineType,
  title,
}: RoutinePageClientProps) {
  const [tier, setTier] = useState<RoutineTier | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [entryId, setEntryId] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [nightmareIntensity, setNightmareIntensity] = useState<number | null>(null);
  const [dreamThemesOrRemember, setDreamThemesOrRemember] = useState<string>("");
  const [taperDownTime, setTaperDownTime] = useState<string>("");
  const [bedtimeGoalsForTomorrow, setBedtimeGoalsForTomorrow] = useState<string>("");
  const [bedtimeWorries, setBedtimeWorries] = useState<string>("");
  const [bedtimeNextAction, setBedtimeNextAction] = useState<string>("");
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [participationPlan, setParticipationPlan] =
    useState<ParticipationPlan | null>(null);
  const [burnoutStage, setBurnoutStage] = useState<BurnoutStage | null>(null);
  const [windowOfTolerance, setWindowOfTolerance] =
    useState<WindowOfTolerance | null>(null);
  const [sensoryLoad, setSensoryLoad] = useState<number | null>(null);
  const [pain, setPain] = useState<number | null>(null);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [anxiety, setAnxiety] = useState<number | null>(null);
  const [depression, setDepression] = useState<number | null>(null);
  const [dizziness, setDizziness] = useState<number | null>(null);

  const items =
    routineType === "morning"
      ? MORNING_ROUTINE_ITEMS
      : BEDTIME_ROUTINE_ITEMS;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    const entry = createOrGetTodayEntry();
    setEntryId(entry.id);

    if (routineType === "morning") {
      setSleepHours(entry.sleepHours ?? null);
      setNightmareIntensity(entry.nightmareIntensity ?? null);
      setDreamThemesOrRemember(entry.dreamThemesOrRemember ?? "");
      setParticipationPlan(entry.participationPlan ?? null);
    }
    if (routineType === "bedtime") {
      setTaperDownTime(entry.bedtimeTaperDownTime ?? "");
      setBedtimeGoalsForTomorrow(entry.bedtimeGoalsForTomorrow ?? "");
      setBedtimeWorries(entry.bedtimeWorries ?? "");
      setBedtimeNextAction(entry.bedtimeNextAction ?? "");
    }
    setBurnoutStage(entry.burnoutStage ?? null);
    setWindowOfTolerance(entry.windowOfTolerance ?? null);
    setSensoryLoad(entry.sensoryLoad ?? null);
    setPain(entry.pain ?? null);
    setFatigue(entry.fatigue ?? null);
    setAnxiety(entry.anxiety ?? null);
    setDepression(entry.depression ?? null);
    setDizziness(entry.dizziness ?? null);

    const saved =
      routineType === "morning"
        ? entry.morningRoutine
        : entry.bedtimeRoutine;

    if (saved) {
      setTier(saved.tier);
      setCompletedIds(new Set(saved.completedItemIds));
    }
  }, [routineType]);

  const saveProgress = (newTier: RoutineTier, newCompleted: Set<string>) => {
    if (!entryId || !date) {
      return;
    }
    const completedArray = Array.from(newCompleted);
    updateEntry({
      id: entryId,
      updates:
        routineType === "morning"
          ? {
              morningRoutine: {
                tier: newTier,
                completedItemIds: completedArray,
              },
            }
          : {
              bedtimeRoutine: {
                tier: newTier,
                completedItemIds: completedArray,
              },
            },
    });
  };

  const handleTierSelect = (selectedTier: RoutineTier) => {
    setTier(selectedTier);
    setCompletedIds(new Set());
    saveProgress(selectedTier, new Set());
  };

  const handleToggle = (itemId: string) => {
    const next = new Set(completedIds);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    setCompletedIds(next);
    if (tier !== null) {
      saveProgress(tier, next);
    }
  };

  if (!date) {
    return <div className="text-slate-600">Loading...</div>;
  }

  if (tier === null) {
    return (
      <div className="max-w-2xl mx-auto pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
          >
            ← Back
          </Link>
        </div>

        <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6">
          <h2 className="text-xl font-semibold mb-4">
            How much time or spoons do you have for this routine?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {SPOON_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTierSelect(value)}
                className="px-6 py-4 rounded-xl border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 transition-colors font-medium text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const saveTaperDownTime = (time: string) => {
    if (entryId) {
      updateEntry({
        id: entryId,
        updates: { bedtimeTaperDownTime: time || null },
      });
    }
  };

  const handleSave = () => {
    if (!entryId || tier === null) {
      return;
    }
    const baseUpdates = {
      burnoutStage,
      windowOfTolerance,
      sensoryLoad,
      pain,
      fatigue,
      anxiety,
      depression,
      dizziness,
    };
    updateEntry({
      id: entryId,
      updates:
        routineType === "morning"
          ? {
              ...baseUpdates,
              morningRoutine: {
                tier,
                completedItemIds: Array.from(completedIds),
              },
              sleepHours,
              nightmareIntensity,
              dreamThemesOrRemember: dreamThemesOrRemember || null,
              participationPlan,
            }
          : {
              ...baseUpdates,
              bedtimeRoutine: {
                tier,
                completedItemIds: Array.from(completedIds),
              },
              bedtimeTaperDownTime: taperDownTime || null,
              bedtimeGoalsForTomorrow: bedtimeGoalsForTomorrow || null,
              bedtimeWorries: bedtimeWorries || null,
              bedtimeNextAction: bedtimeNextAction || null,
            },
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const saveSleepAndNightmares = (
    hours: number | null,
    intensity: number | null,
    dreams?: string
  ) => {
    if (entryId) {
      updateEntry({
        id: entryId,
        updates: {
          sleepHours: hours,
          nightmareIntensity: intensity,
          ...(dreams !== undefined && { dreamThemesOrRemember: dreams || null }),
        },
      });
    }
  };

  const tierItems = items[tier];
  const grouped = tierItems.reduce<Record<string, RoutineItem[]>>((acc, item) => {
    const cat = item.category ?? "Other";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto relative pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-600 mt-1">
            {SPOON_OPTIONS.find((o) => o.value === tier)?.label} plan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTier(null)}
            className="px-3 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
          >
            Change spoons
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
          >
            ← Back
          </Link>
        </div>
      </div>

      <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6">
        <div className="mb-6 p-4 rounded-lg bg-icy-blue/30 border border-icy-blue/60 space-y-4">
          <h3 className="font-medium text-purple-700 mb-3">Check-in</h3>
          {routineType === "morning" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Participation plan
              </label>
              <select
                value={participationPlan ?? ""}
                onChange={(e) =>
                  setParticipationPlan(
                    (e.target.value || null) as ParticipationPlan | null
                  )
                }
                className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
              >
                <option value="">—</option>
                {PARTICIPATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              Burnout stage
            </label>
            <div className="flex flex-wrap gap-3">
              {BURNOUT_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full border-2 transition-all ${
                    BURNOUT_STAGE_STYLES[opt]
                  } ${burnoutStage === opt ? "ring-2 ring-offset-1" : "opacity-70 hover:opacity-100"}`}
                >
                  <input
                    type="radio"
                    name="burnoutStage"
                    checked={burnoutStage === opt}
                    onChange={() => setBurnoutStage(opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Window of tolerance (optional)
            </label>
            <select
              value={windowOfTolerance ?? ""}
              onChange={(e) =>
                setWindowOfTolerance(
                  (e.target.value || null) as WindowOfTolerance | null
                )
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            >
              <option value="">—</option>
              {WINDOW_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScaleSlider
              label="Sensory load (0–10)"
              value={sensoryLoad}
              onChange={setSensoryLoad}
            />
            <ScaleSlider
              label="Pain (0–10)"
              value={pain}
              onChange={setPain}
            />
            <ScaleSlider
              label="Fatigue (0–10)"
              value={fatigue}
              onChange={setFatigue}
            />
            <ScaleSlider
              label="Anxiety (0–10)"
              value={anxiety}
              onChange={setAnxiety}
            />
            <ScaleSlider
              label="Depression (0–10)"
              value={depression}
              onChange={setDepression}
            />
            <ScaleSlider
              label="Dizziness (0–10)"
              value={dizziness}
              onChange={setDizziness}
            />
          </div>
        </div>
        {routineType === "bedtime" && (
          <div className="mb-6 p-4 rounded-lg bg-pastel-petal/40 border border-pastel-petal/60">
            <h3 className="font-medium text-purple-700 mb-2">Time to taper down</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTaperDownTime("22:00");
                  saveTaperDownTime("22:00");
                }}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                10pm (planned)
              </button>
              <input
                type="time"
                value={taperDownTime}
                onChange={(e) => {
                  const v = e.target.value;
                  setTaperDownTime(v);
                  saveTaperDownTime(v);
                }}
                className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const h = String(now.getHours()).padStart(2, "0");
                  const m = String(now.getMinutes()).padStart(2, "0");
                  const v = `${h}:${m}`;
                  setTaperDownTime(v);
                  saveTaperDownTime(v);
                }}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                Now
              </button>
            </div>
          </div>
        )}
        {routineType === "morning" && (
          <div className="mb-6 p-4 rounded-lg bg-pastel-petal/40 border border-pastel-petal/60">
            <h3 className="font-medium text-purple-700 mb-3">Sleep & Nightmares</h3>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm mb-1">Sleep (hrs)</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={sleepHours ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const num = v === "" ? null : Number(v);
                    setSleepHours(num);
                    saveSleepAndNightmares(num, nightmareIntensity);
                  }}
                  className="w-20 px-2 py-1 rounded border-2 border-thistle/50"
                  placeholder="—"
                />
              </div>
              <div>
                <ScaleSlider
                  label="Nightmares/dream intensity (0–10)"
                  value={nightmareIntensity}
                  onChange={(v) => {
                    setNightmareIntensity(v);
                    saveSleepAndNightmares(sleepHours, v);
                  }}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm mb-1">
                  Dream themes / what I remember
                </label>
                <textarea
                  value={dreamThemesOrRemember}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDreamThemesOrRemember(v);
                    saveSleepAndNightmares(sleepHours, nightmareIntensity, v);
                  }}
                  placeholder="e.g. flying, water, people from work..."
                  className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px] text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="font-medium text-purple-700 mb-2">
                {category}
              </h3>
              <ul className="space-y-2">
                {categoryItems.map((item) => (
                  <li key={item.id}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={completedIds.has(item.id)}
                        onChange={() => handleToggle(item.id)}
                        className="mt-1 rounded border-thistle text-thistle shrink-0"
                      />
                      <span
                        className={
                          completedIds.has(item.id)
                            ? "line-through text-slate-500"
                            : "text-slate-700"
                        }
                      >
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {routineType === "bedtime" && category === "Close loops" && (
                <div className="mt-4 p-4 rounded-lg bg-white/60 border border-thistle/40 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Goals for tomorrow
                    </label>
                    <textarea
                      value={bedtimeGoalsForTomorrow}
                      onChange={(e) => setBedtimeGoalsForTomorrow(e.target.value)}
                      placeholder="1–3 tiny goals for tomorrow..."
                      className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px] text-sm"
                      rows={2}
                    />
                  </div>
                  {(tier === 1 || tier === 2) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Worries (container + revisit time)
                      </label>
                      <textarea
                        value={bedtimeWorries}
                        onChange={(e) => setBedtimeWorries(e.target.value)}
                        placeholder="Write worries down..."
                        className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px] text-sm"
                        rows={2}
                      />
                    </div>
                  )}
                  {tier === 2 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        If urgent: next action only
                      </label>
                      <textarea
                        value={bedtimeNextAction}
                        onChange={(e) => setBedtimeNextAction(e.target.value)}
                        placeholder="Write next action, not whole problem..."
                        className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px] text-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 pt-4 border-t border-thistle/40 text-sm text-slate-600">
          Progress saved to today&apos;s entry ({date})
        </p>
      </section>

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
