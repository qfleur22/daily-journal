import type { ReactNode } from "react";

export const runtime = "edge";

export default function DayDateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
