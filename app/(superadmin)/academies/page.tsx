import { PageHeader } from "@/components/layout/PageHeader";
import { AcademyListLive } from "@/components/superadmin/AcademyListLive";

export default function AcademiesPage() {
  return (
    <div>
      <PageHeader
        title="Academies"
        subtitle="Manage all academies on the platform"
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AcademyListLive title="All academies" />
      </div>
    </div>
  );
}
