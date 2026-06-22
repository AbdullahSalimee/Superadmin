"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, CheckCheck } from "lucide-react";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { classLabel } from "@/lib/utils";

interface DraftEntry {
  marks: string;
  absent: boolean;
}

export default function MarksEntryPage() {
  const { academy, dataset, setDataset } = useAcademyData();
  const params = useParams<{ testId: string }>();
  const test = dataset.tests.find((t) => t.id === params.testId);
  const [saved, setSaved] = useState(false);

  const cls = test ? dataset.classes.find((c) => c.id === test.classId) : undefined;
  const subject = test ? dataset.subjects.find((s) => s.id === test.subjectId) : undefined;

  const roster = useMemo(
    () =>
      test
        ? dataset.students.filter((s) => s.classId === test.classId && s.status === "active").sort((a, b) => a.rollNumber - b.rollNumber)
        : [],
    [test, dataset.students]
  );

  const [draft, setDraft] = useState<Record<string, DraftEntry>>(() => {
    const initial: Record<string, DraftEntry> = {};
    if (test) {
      for (const s of roster) {
        const result = dataset.testResults.find((r) => r.testId === test.id && r.studentId === s.id);
        if (result) {
          initial[s.id] = { marks: result.marksObtained?.toString() ?? "", absent: result.isAbsent };
        }
      }
    }
    return initial;
  });

  if (!test) {
    return <div className="px-6 py-10 text-center text-sm text-[var(--text-faint)]">Test not found.</div>;
  }

  const enteredCount = Object.values(draft).filter((d) => d.absent || d.marks !== "").length;

  const updateEntry = (studentId: string, patch: Partial<DraftEntry>) => {
    setDraft((d) => ({ ...d, [studentId]: { marks: d[studentId]?.marks ?? "", absent: d[studentId]?.absent ?? false, ...patch } }));
  };

  const saveMarks = () => {
    setDataset((d) => {
      const others = d.testResults.filter((r) => r.testId !== test.id);
      const newResults = roster
        .filter((s) => draft[s.id] && (draft[s.id].absent || draft[s.id].marks !== ""))
        .map((s) => ({
          id: `${academy.id}-result-${test.id}-${s.id}`,
          academyId: academy.id,
          testId: test.id,
          studentId: s.id,
          marksObtained: draft[s.id].absent ? null : Number(draft[s.id].marks),
          isAbsent: draft[s.id].absent,
        }));
      return { ...d, testResults: [...others, ...newResults] };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/academy/${academy.id}/tests`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--text)]">{test.name}</h1>
            <p className="truncate text-xs text-[var(--text-faint)]">
              {subject?.name} · {cls ? classLabel(cls.name, cls.section) : "—"} · {test.totalMarks} marks
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium text-[var(--text-faint)]">{enteredCount}/{roster.length}</span>
          <Button variant="primary" size="sm" onClick={saveMarks}>
            {saved ? <CheckCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs text-[var(--text-faint)]">Press Enter or Tab to move to the next student.</p>
        <Card>
          <div className="divide-y divide-[var(--border)]">
            {roster.map((s) => {
              const entry = draft[s.id];
              const pct = entry && !entry.absent && entry.marks !== "" ? Math.round((Number(entry.marks) / test.totalMarks) * 100) : null;
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <span className="w-6 text-xs font-medium text-[var(--text-faint)]">{s.rollNumber}</span>
                  <span className="flex-1 min-w-[100px] text-sm text-[var(--text)]">{s.name}</span>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      placeholder="0"
                      disabled={entry?.absent}
                      value={entry?.marks ?? ""}
                      onChange={(e) => updateEntry(s.id, { marks: e.target.value })}
                      className="h-8 w-20 text-center"
                    />
                    <span className="text-xs text-[var(--text-faint)]">/ {test.totalMarks}</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry?.absent ?? false}
                      onChange={(e) => updateEntry(s.id, { absent: e.target.checked, marks: e.target.checked ? "" : entry?.marks ?? "" })}
                      className="h-3.5 w-3.5 accent-white"
                    />
                    Absent
                  </label>
                  <span className="ml-auto w-16 text-right text-xs font-semibold">
                    {entry?.absent ? (
                      <span className="text-amber-400">Absent</span>
                    ) : pct !== null ? (
                      <span className="text-[var(--text)]">{pct}%</span>
                    ) : (
                      <span className="text-[var(--text-faint)]">—</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[var(--border)] p-5">
            <Button variant="primary" size="lg" className="w-full" onClick={saveMarks}>
              {saved ? <CheckCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {saved ? "Saved" : "Save All Marks"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
