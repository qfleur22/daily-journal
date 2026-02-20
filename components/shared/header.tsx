import Link from "next/link";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";

export function Header() {
  return (
    <header className="border-b-2 border-thistle/50 bg-white/90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex gap-6">
          <Link href="/" className="font-semibold text-lg hover:underline text-slate-800">
            Daily Journal
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Home
          </Link>
          <Link href="/history" className="text-slate-600 hover:text-slate-900">
            History
          </Link>
          <Link href="/week-journal" className="text-slate-600 hover:text-slate-900">
            Week Journal
          </Link>
          <Link href="/self-care" className="text-slate-600 hover:text-slate-900">
            Self Care Menu
          </Link>
        </div>
        <div className="shrink-0">
          <GoogleAuthButton />
        </div>
      </nav>
    </header>
  );
}
