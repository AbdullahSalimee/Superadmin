"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { ShareButton } from "@/components/academy/ShareButton";
import { LineChart } from "@/components/academy/LineChart";
import { BarChart } from "@/components/academy/BarChart";
import { MONTH_NAMES } from "@/lib/utils";

export default function StudentAnalyticsPage() {
  const { academy, dataset } = useAcademyData();
  const params = useParams<{ studentId: string }>();
  const student = dataset.students.find((s) => s.id === params.studentId);

  const testTrend = useMemo(() => {
    if (!student) return [];
    return dataset.testResults
      .filter((r) => r.studentId === student.id && !r.isAbsent && r.marksObtained !== null)
      .map((r) => {
        const test = dataset.tests.find((t) => t.id === r.testId);
        if (!test) return null;
        return {
          label: test.name,
          value: Math.round(((r.marksObtained ?? 0) / test.totalMarks) * 100),
          date: test.date,
        };
      })
      .filter((x): x is { label: string; value: number; date: string } => x !== null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10);
  }, [student, dataset]);

  const subjectAvg = useMemo(() => {
    if (!student) return [];
    return dataset.subjects
      .map((subject) => {
        const subjectTests = dataset.tests.filter((t) => t.subjectId === subject.id);
        const results = subjectTests
          .map((t) => {
            const r = dataset.testResults.find((res) => res.testId === t.id && res.studentId === student.id);
            return r && !r.isAbsent && r.marksObtained !== null ? { marks: r.marksObtained, total: t.totalMarks } : null;
          })
          .filter((x): x is { marks: number; total: number } => x !== null);
        if (results.length === 0) return null;
        const obtained = results.reduce((s, r) => s + r.marks, 0);
        const total = results.reduce((s, r) => s + r.total, 0);
        return { label: subject.name, value: Math.round((obtained / total) * 100) };
      })
      .filter((x): x is { label: string; value: number } => x !== null);
  }, [student, dataset]);

  const attendanceTrend = useMemo(() => {
    if (!student) return [];
    const records = dataset.attendance.filter((a) => a.studentId === student.id);
    const byMonth = new Map<string, { present: number; total: number; year: number; month: number }>();
    for (const r of records) {
      const [y, m] = r.date.split("-").map(Number);
      const key = `${y}-${m}`;
      if (!byMonth.has(key)) byMonth.set(key, { present: 0, total: 0, year: y, month: m });
      const entry = byMonth.get(key)!;
      entry.total++;
      if (r.status === "P") entry.present++;
    }
    return Array.from(byMonth.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((e) => ({ label: MONTH_NAMES[e.month].slice(0, 3), value: Math.round((e.present / e.total) * 100) }));
  }, [student, dataset]);

  if (!student) {
    return <div className="px-6 py-10 text-center text-sm text-[var(--text-faint)]">Student not found.</div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/academy/${academy.id}/students/${student.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">{student.name} — Analytics</h1>
        </div>
        <ShareButton />
      </div>

      <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader title="Test percentage trend" subtitle="Most recent tests, in order taken" />
          <div className="px-5 pb-5">
            <LineChart data={testTrend.map((t) => ({ label: t.label, value: t.value }))} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Subject-wise average" subtitle="Average percentage per subject" />
          <div className="px-5 pb-5">
            <BarChart data={subjectAvg} color="#22c55e" formatValue={(v) => `${v}%`} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Attendance trend" subtitle="Monthly attendance percentage over time" />
          <div className="px-5 pb-5">
            <BarChart data={attendanceTrend} color="#f59e0b" formatValue={(v) => `${v}%`} />
          </div>
        </Card>
      </div>
    </div>
  );
}
