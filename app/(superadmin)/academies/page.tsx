import { PageHeader } from "@/components/layout/PageHeader";
import { AcademyList } from "@/components/superadmin/AcademyList";
import { ACADEMIES, getAcademyMetrics } from "@/lib/data";

export default function AcademiesPage() {
  const metricsById = Object.fromEntries(ACADEMIES.map((a) => [a.id, getAcademyMetrics(a.id)]));

  return (
    <div>
      <PageHeader title="Academies" subtitle={`${ACADEMIES.length} academies on the platform`} />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AcademyList initialAcademies={ACADEMIES} metricsById={metricsById} title="All academies" />
      </div>
    </div>
  );
}
