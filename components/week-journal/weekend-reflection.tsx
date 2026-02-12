"use client";

interface WeekendReflectionProps {
  reflection: string;
  onReflectionChange: (value: string) => void;
}

export function WeekendReflection({
  reflection,
  onReflectionChange,
}: WeekendReflectionProps) {
  return (
    <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6 shadow-sm">
      <p className="text-slate-600 mb-3">No PHP groups scheduled.</p>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Optional freeform reflection
      </label>
      <textarea
        value={reflection}
        onChange={(e) => onReflectionChange(e.target.value)}
        placeholder="Reflect on your weekend..."
        className="w-full px-4 py-3 rounded-lg border border-thistle/50 bg-white/80 min-h-[120px]"
        rows={5}
      />
    </section>
  );
}
