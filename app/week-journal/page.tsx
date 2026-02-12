import Link from "next/link";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function WeekJournalPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Week-Long PHP Journal (Hopeway Schedule)
      </h1>
      <p className="text-slate-600 mb-8">
        Hopeway Partial Hospitalization Track #2
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map(({ key, label }) => (
          <Link
            key={key}
            href={`/week-journal/${key}`}
            className="block rounded-xl border-2 border-thistle/60 bg-white/80 p-6 shadow-sm hover:border-thistle hover:bg-pastel-petal/20 transition-colors"
          >
            <h2 className="font-semibold text-lg text-slate-800">{label}</h2>
            <p className="text-sm text-slate-500 mt-1">View schedule →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
