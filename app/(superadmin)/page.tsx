import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { AcademyListLive } from "@/components/superadmin/AcademyListLive";
import { QuickActionsClient } from "@/components/superadmin/QuickActionsClient";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Users,
  Wallet,
  AlertCircle,
} from "lucide-react";

async function getPlatformTotals() {
  const now = new Date();
  const [
    { count: total },
    { count: active },
    { count: students },
    { data: fees },
    { count: staffRows },
  ] = await Promise.all([
    supabaseAdmin
      .from("academies")
      .select("*", { count: "exact", head: true })
      .neq("status", "deleted"),
    supabaseAdmin
      .from("academies")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAdmin
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAdmin
      .from("fee_records")
      .select("amount_due,status")
      .eq("month", now.getMonth() + 1)
      .eq("year", now.getFullYear()),
    supabaseAdmin
      .from("academy_roles")
      .select("*", { count: "exact", head: true }),
  ]);

  const revenue = (fees ?? [])
    .filter((f) => f.status === "paid")
    .reduce((s, f) => s + Number(f.amount_due), 0);
  const due = (fees ?? [])
    .filter((f) => f.status === "unpaid")
    .reduce((s, f) => s + Number(f.amount_due), 0);

  return {
    totalAcademies: total ?? 0,
    activeAcademies: active ?? 0,
    totalStudents: students ?? 0,
    totalStaff: staffRows ?? 0, // each academy has 2 rows: admin + teacher
    platformRevenue: revenue,
    platformDue: due,
  };
}

export default async function PlatformDashboardPage() {
  const totals = await getPlatformTotals();
  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHeader title="Platform dashboard" subtitle={monthLabel} />
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total academies"
            value={totals.totalAcademies}
            icon={Building2}
          />
          <StatCard
            label="Active academies"
            value={totals.activeAcademies}
            icon={CheckCircle2}
          />
          <StatCard
            label="Total students"
            value={totals.totalStudents.toLocaleString()}
            icon={GraduationCap}
          />
          <StatCard
            label="Total staff"
            value={totals.totalStaff}
            icon={Users}
          />
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
        <AcademyListLive title="All academies" />
      </div>
    </div>
  );
}
