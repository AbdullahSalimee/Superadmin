import { notFound } from "next/navigation";
import { getAcademy, getAcademyDataset } from "@/lib/data";
import { ImpersonationBanner } from "@/components/academy/ImpersonationBanner";
import { AcademySidebar } from "@/components/academy/AcademySidebar";
import { AcademyMobileNav } from "@/components/academy/AcademyMobileNav";
import { AcademyProvider } from "@/components/academy/AcademyContext";

export default async function AcademyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const academy = getAcademy(id);
  if (!academy) notFound();
  const dataset = getAcademyDataset(id);

  return (
    <AcademyProvider academy={academy} initialDataset={dataset}>
      <div className="flex min-h-screen flex-col bg-[var(--bg)]">
        <ImpersonationBanner academyName={academy.name} />
        <div className="flex flex-1">
          <AcademySidebar academyId={academy.id} academyName={academy.name} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
          </div>
        </div>
        <AcademyMobileNav academyId={academy.id} />
      </div>
    </AcademyProvider>
  );
}
