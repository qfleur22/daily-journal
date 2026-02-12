import { HistoryList } from "@/components/history/history-list";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <p className="text-slate-600 mb-6">
        Previous days&apos; entries. Click a card to view full details.
      </p>
      <HistoryList />
    </div>
  );
}
