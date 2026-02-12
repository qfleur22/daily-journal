import Link from "next/link";
import { HomeCheckIn } from "@/components/home/home-check-in";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Check in about your day</h1>
      <HomeCheckIn />
    </div>
  );
}
