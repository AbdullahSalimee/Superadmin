import { redirect } from "next/navigation";

export default async function AcademyIndex({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/academy/${id}/dashboard`);
}
