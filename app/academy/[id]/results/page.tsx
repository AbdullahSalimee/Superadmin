"use client";

import { useMemo, useState } from "react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel, gradeLetter, isPassing } from "@/lib/utils";
import { BarChart3, Trophy, Target, Users } from "lucide-react";

export default function ResultsPage() {
  const { dataset } = useAcademyData();
  const sortedTests = [...dataset.tests].sort((a, b) => b.date.localeCompare(a.date));
  const [testId, setTestId] = useState(sortedTests[0]?.id ?? "");

  const test = dataset.tests.find((t) => t.id === testId);
  const cls = test ? dataset.classes.find((c) => c.id === test.classId) : undefined;
  const subject = test ? dataset.subjects.find((s) => s.id === test.subjectId) : undefined;

  const results = useMemo(() => {
    if (!test) return [];
    return dataset.testResults
      .filter((r) => r.testId === test.id)
      .map((r) => {
        const student = dataset.students.find((s) => s.id === r.studentId);
        const pct = r.isAbsent || r.marksObtained === null ? null : Math.round((r.marksObtained / test.totalMarks) * 100);
        return { result: r, student, pct };
      })
      .filter((r) => r.student);
  }, [test, dataset]);

  const present = results.filter((r) => !r.result.isAbsent);
  const absent = results.filter((r) => r.result.isAbsent);
  const ranked = [...present].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  const total = results.length;
  const avg = present.length > 0 ? Math.round(present.reduce((s, r) => s + (r.pct ?? 0), 0) / present.length) : 0;
  const highest = present.length > 0 ? Math.max(...present.map((r) => r.result.marksObtained ?? 0)) : 0;
  const passCount = present.filter((r) => isPassing(r.pct ?? 0)).length;

  return (
    <div>
      <AcademyPageHeader title="Results" subtitle="Per-test summary" />

      <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="p-5">
            <Select value={testId} onChange={(e) => setTestId(e.target.value)}>
              {sortedTests.map((t) => {
                const c = dataset.classes.find((cl) => cl.id === t.classId);
                const s = dataset.subjects.find((su) => su.id === t.subjectId);
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} · {s?.name} · {c ? classLabel(c.name, c.section) : ""}
                  </option>
                );
              })}
            </Select>
          </div>
        </Card>

        {!test ? (
          <EmptyState icon={BarChart3} title="No tests available" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard label="Total" value={total} icon={Users} />
              <StatCard label="Average" value={`${avg}%`} icon={BarChart3} />
              <StatCard label="Highest" value={highest} icon={Trophy} />
              <StatCard label="Pass" value={passCount} icon={Target} hint="≥ 33% threshold" />
            </div>

            <Card>
              <CardHeader title="Ranked results" subtitle={`${test.name} · ${subject?.name} · ${cls ? classLabel(cls.name, cls.section) : ""}`} />
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {ranked.map((r, i) => (
                  <div key={r.result.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-medium text-[var(--text-faint)]">{i + 1}</span>
                      <span className="text-sm text-[var(--text)]">{r.student?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-faint)]">
                        {r.result.marksObtained}/{test.totalMarks} · {r.pct}%
                      </span>
                      <Badge variant={isPassing(r.pct ?? 0) ? "green" : "red"}>
                        {gradeLetter(r.pct ?? 0)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {absent.map((r) => (
                  <div key={r.result.id} className="flex items-center justify-between gap-3 px-5 py-3 opacity-60">
                    <span className="text-sm text-[var(--text-dim)]">{r.student?.name}</span>
                    <Badge variant="outline">Absent</Badge>
                  </div>
                ))}
                {results.length === 0 && (
                  <div className="p-5">
                    <EmptyState icon={BarChart3} title="No marks entered for this test yet" />
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
