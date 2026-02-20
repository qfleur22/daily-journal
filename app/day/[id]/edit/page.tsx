import { DayDetail } from "@/components/day/day-detail";

export const runtime = "edge";

interface DayEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function DayEditPage({ params }: DayEditPageProps) {
  const { id } = await params;
  return <DayDetail entryId={id} mode="edit" />;
}
