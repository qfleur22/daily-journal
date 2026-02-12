"use client";

import { ScheduleItem } from "@/data/hopeway-schedule";
import { GroupLog } from "@/lib/hopeway-store";

interface TodaysScheduleProps {
  items: ScheduleItem[];
  logs: Record<string, GroupLog>;
  onLogChange: (itemId: string, log: Partial<GroupLog>) => void;
}

function formatOption(opt: { name: string; location: string }): string {
  return opt.location ? `${opt.name} (${opt.location})` : opt.name;
}

export function TodaysSchedule({
  items,
  logs,
  onLogChange,
}: TodaysScheduleProps) {
  return (
    <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Today&apos;s Schedule</h2>
      <ul className="space-y-4">
        {items.map((item) => {
          const log = logs[item.id] ?? {
            attended: false,
            notes: "",
            chosenOptionIndex: item.options.length > 1 ? undefined : 0,
          };
          return (
            <li
              key={item.id}
              className={`rounded-lg p-4 ${
                item.isBreak ? "bg-icy-blue/40 border border-icy-blue/60" : "bg-pastel-petal/30 border border-pastel-petal/50"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm text-slate-600">
                    {item.time}
                  </p>
                  {item.options.length === 1 ? (
                    <p className="font-medium text-slate-800">
                      {formatOption(item.options[0])}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-slate-600 mb-2">Choose one:</p>
                      <div className="flex flex-wrap gap-3">
                        {item.options.map((opt, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`${item.id}-option`}
                              checked={log.chosenOptionIndex === idx}
                              onChange={() => {
                                onLogChange(item.id, {
                                  ...log,
                                  chosenOptionIndex: idx,
                                });
                              }}
                              className="rounded-full border-thistle text-thistle"
                            />
                            <span className="text-sm">{formatOption(opt)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={log.attended}
                      onChange={(e) =>
                        onLogChange(item.id, { ...log, attended: e.target.checked })
                      }
                      className="rounded border-thistle text-thistle"
                    />
                    <span className="text-sm font-medium">Attended</span>
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={log.notes}
                  onChange={(e) =>
                    onLogChange(item.id, { ...log, notes: e.target.value })
                  }
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 rounded-lg border border-thistle/50 bg-white/80 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
