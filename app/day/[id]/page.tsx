import { DayDetail } from "@/components/day/day-detail";

interface DayPageProps {
  params: Promise<{ id: string }>;
}

export default async function DayPage({ params }: DayPageProps) {
  const { id } = await params;
  return <DayDetail entryId={id} mode="view" />;
}
