import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { AcademyList } from "@/components/superadmin/AcademyList";
import { QuickActionsClient } from "@/components/superadmin/QuickActionsClient";
import { ACADEMIES, getAcademyMetrics, getPlatformTotals } from "@/lib/data";
import { formatPKR } from "@/lib/utils";
import { Building2, CheckCircle2, GraduationCap, Users, Wallet, AlertCircle } from "lucide-react";

export default function PlatformDashboardPage() {
  const totals = getPlatformTotals();
  const metricsById = Object.fromEntries(ACADEMIES.map((a) => [a.id, getAcademyMetrics(a.id)]));
  const now = new Date("2026-06-20");
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader title="Platform dashboard" subtitle={monthLabel} />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total academies" value={totals.totalAcademies} icon={Building2} />
          <StatCard label="Active academies" value={totals.activeAcademies} icon={CheckCircle2} />
          <StatCard label="Total students" value={totals.totalStudents.toLocaleString()} icon={GraduationCap} />
          <StatCard label="Total staff" value={totals.totalStaff} icon={Users} />
          <StatCard
            label="Revenue (this month)"
            value={formatPKR(totals.platformRevenue)}
            icon={Wallet}
          />
          <StatCard
            label="Due (this month)"
            value={formatPKR(totals.platformDue)}
            icon={AlertCircle}
          />
        </div>

        <QuickActionsClient />

        <AcademyList
          initialAcademies={ACADEMIES}
          metricsById={metricsById}
          title="Recent academies"
          limit={5}
          showFilters={false}
        />
      </div>
    </div>
  );
}
