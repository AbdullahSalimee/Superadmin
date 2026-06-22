"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Users, Building2, ClipboardList, Wallet, AlertCircle, CalendarCheck, UserPlus, FilePlus2, Bell } from "lucide-react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { CURRENT_MONTH, CURRENT_YEAR, formatPKR } from "@/lib/utils";

export default function AcademyDashboardPage() {
  const { academy, dataset } = useAcademyData();
  const router = useRouter();

  const stats = useMemo(() => {
    const activeStudents = dataset.students.filter((s) => s.status === "active").length;
    const totalClasses = dataset.classes.length;
    const totalTests = dataset.tests.length;
    const currentFees = dataset.feeRecords.filter(
      (f) => f.month === CURRENT_MONTH && f.year === CURRENT_YEAR
    );
    const collected = currentFees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amountDue, 0);
    const due = currentFees.filter((f) => f.status === "unpaid").reduce((s, f) => s + f.amountDue, 0);
    return { activeStudents, totalClasses, totalTests, collected, due };
  }, [dataset]);

  const unresolvedNotifs = dataset.notifications.filter((n) => !n.isResolved);
  const firstClass = dataset.classes[0];
  const base = `/academy/${academy.id}`;

  return (
    <div>
      <AcademyPageHeader
        title="Dashboard"
        subtitle={new Date("2026-06-20").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        action={
          firstClass && (
            <Link href={`${base}/attendance?classId=${firstClass.id}`}>
              <Button variant="primary" size="sm">
                <CalendarCheck className="h-3.5 w-3.5" /> Take Attendance
              </Button>
            </Link>
          )
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Active students" value={stats.activeStudents} icon={Users} />
          <StatCard label="Total classes" value={stats.totalClasses} icon={Building2} />
          <StatCard label="Total tests" value={stats.totalTests} icon={ClipboardList} />
          <StatCard label="Collected (this month)" value={formatPKR(stats.collected)} icon={Wallet} />
          <StatCard label="Due (this month)" value={formatPKR(stats.due)} icon={AlertCircle} />
        </div>

        {unresolvedNotifs.length > 0 && (
          <Card>
            <CardHeader
              title="Notifications"
              subtitle={`${unresolvedNotifs.length} unresolved`}
              action={<Bell className="h-4 w-4 text-amber-400" />}
            />
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {unresolvedNotifs.slice(0, 5).map((n) => (
                <div key={n.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <p className="text-xs text-[var(--text-dim)]">{n.message}</p>
                  {n.studentId && (
                    <Link href={`${base}/students/${n.studentId}?edit=1`}>
                      <Button size="sm" variant="outline">Assign fee</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <CardHeader title="Quick actions" />
          <div className="grid grid-cols-1 gap-2 px-5 pb-5 sm:grid-cols-3">
            {firstClass && (
              <button
                onClick={() => router.push(`${base}/attendance?classId=${firstClass.id}`)}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] cursor-pointer"
              >
                <CalendarCheck className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />
                Take Attendance
              </button>
            )}
            <button
              onClick={() => router.push(`${base}/students?add=1`)}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />
              Add Student
            </button>
            <button
              onClick={() => router.push(`${base}/fees`)}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] cursor-pointer"
            >
              <Wallet className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />
              Manage Fees
            </button>
            <button
              onClick={() => router.push(`${base}/tests?create=1`)}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] cursor-pointer"
            >
              <FilePlus2 className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />
              Create Test
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
