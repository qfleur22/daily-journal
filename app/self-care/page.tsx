import Link from "next/link";
import { SELF_CARE_CATEGORIES } from "@/data/self-care-menu";

export default function SelfCarePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Self Care Menu</h1>
        <p className="text-slate-600 mt-2">
          Ideas for activities when you need a little support. Pick something
          that feels right for now.
        </p>
      </div>

      <div className="space-y-8">
        {SELF_CARE_CATEGORIES.map((category) => (
          <section
            key={category.id}
            className="rounded-xl border-2 border-thistle/40 bg-white/80 p-6"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {category.name}
            </h2>
            <ul className="space-y-2">
              {category.items.map((item, i) => (
                <li
                  key={`${category.id}-${i}`}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <span className="text-thistle/60">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-thistle/40">
        <Link
          href="/"
          className="text-thistle font-medium hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
