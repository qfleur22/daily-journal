"use client";

import { useState } from "react";
import { type ScheduleTimeBlock } from "@/models/day-entry";

interface CalendarImportedBlockProps {
  block: ScheduleTimeBlock;
  onUpdate: (updates: Partial<ScheduleTimeBlock>) => void;
  onRemove: () => void;
  formatTimeNow: () => string;
  formatTimeForDisplay: (time: string) => string;
  buttonClass: string;
}

export function CalendarImportedBlock({
  block,
  onUpdate,
  onRemove,
  formatTimeNow,
  formatTimeForDisplay,
  buttonClass,
}: CalendarImportedBlockProps) {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [timeStart, setTimeStart] = useState(block.timeStart);
  const [timeEnd, setTimeEnd] = useState(block.timeEnd);
  const [notes, setNotes] = useState(block.notes);
  const [attended, setAttended] = useState(block.attended ?? false);

  const handleSaveTime = () => {
    onUpdate({ timeStart, timeEnd });
    setIsEditingTime(false);
  };

  const handleSaveContent = () => {
    onUpdate({ notes, attended });
    setIsEditingContent(false);
  };

  return (
    <div className="rounded-lg p-4 bg-sky-blue/20 border border-sky-blue/50 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {isEditingTime ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeStart("16:00")}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    4pm (planned)
                  </button>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeStart(formatTimeNow())}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    Now
                  </button>
                  <span className="text-slate-500">Start</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const [h, m] = timeStart.split(":").map(Number);
                      const endMins = (h * 60 + (m ?? 0) + 60) % (24 * 60);
                      const eh = Math.floor(endMins / 60);
                      const em = endMins % 60;
                      setTimeEnd(
                        `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`
                      );
                    }}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    1hr (planned)
                  </button>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeEnd(formatTimeNow())}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    Now
                  </button>
                  <span className="text-slate-500">End</span>
                    <button
                      type="button"
                      onClick={handleSaveTime}
                      className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                    >
                      Done
                    </button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-mono text-sm font-extrabold text-slate-600">
                  {formatTimeForDisplay(block.timeStart)} –{" "}
                  {formatTimeForDisplay(block.timeEnd)}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingTime(true)}
                  className="text-sm text-thistle hover:underline font-medium"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <p className="font-extrabold text-slate-800">{block.title}</p>
        </div>
      </div>

      {isEditingContent ? (
        <div className="space-y-3 pt-2 border-t border-thistle/40">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={attended}
              onChange={(e) => setAttended(e.target.checked)}
              className="rounded border-thistle text-thistle"
            />
            <span className="text-sm text-slate-700">Mark attended</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveContent}
              className={`px-4 py-2 text-sm ${buttonClass}`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setNotes(block.notes);
                setAttended(block.attended ?? false);
                setIsEditingContent(false);
              }}
              className="px-4 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-slate-100 text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-thistle/40">
          {block.notes && (
            <p className="text-sm text-slate-600 mb-2">{block.notes}</p>
          )}
          <div className="flex items-center gap-2">
            {attended && (
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Attended
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setNotes(block.notes);
                setAttended(block.attended ?? false);
                setIsEditingContent(true);
              }}
              className={`px-3 py-1.5 text-sm ${buttonClass}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-sm text-slate-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
