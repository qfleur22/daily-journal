/**
 * Formats 24h time (HH:mm) for display (e.g. 16:00 → 4:00 PM).
 */
export function formatTimeForDisplay(time: string | null): string {
  if (!time) {
    return "";
  }
  const [h, m] = time.split(":").map(Number);
  const mm = String(m ?? 0).padStart(2, "0");
  if (h === 0) {
    return `12:${mm} AM`;
  }
  if (h < 12) {
    return `${h}:${mm} AM`;
  }
  if (h === 12) {
    return `12:${mm} PM`;
  }
  return `${h - 12}:${mm} PM`;
}
