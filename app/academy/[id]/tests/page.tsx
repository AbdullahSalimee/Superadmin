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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const cls = test
    ? dataset.classes.find((c) => c.id === test.classId)
    : undefined;
  const subject = test
    ? dataset.subjects.find((s) => s.id === test.subjectId)
    : undefined;

  const roster = useMemo(
    () =>
      test
        ? dataset.students
            .filter((s) => s.classId === test.classId && s.status === "active")
            .sort((a, b) => a.rollNumber - b.rollNumber)
        : [],
    [test, dataset.students],
  );

  const [draft, setDraft] = useState<Record<string, DraftEntry>>(() => {
    const initial: Record<string, DraftEntry> = {};
    if (test) {
      for (const s of roster) {
        const result = dataset.testResults.find(
          (r) => r.testId === test.id && r.studentId === s.id,
        );
        if (result) {
          initial[s.id] = {
            marks: result.marksObtained?.toString() ?? "",
            absent: result.isAbsent,
          };
        }
      }
    }
    return initial;
  });

  if (!test) {
    return (
      <div className="px-6 py-10 text-center text-sm text-[var(--text-faint)]">
        Test not found.
      </div>
    );
  }

  const enteredCount = Object.values(draft).filter(
    (d) => d.absent || d.marks !== "",
  ).length;

  const updateEntry = (studentId: string, patch: Partial<DraftEntry>) => {
    setDraft((d) => ({
      ...d,
      [studentId]: {
        marks: d[studentId]?.marks ?? "",
        absent: d[studentId]?.absent ?? false,
        ...patch,
      },
    }));
  };

  const saveMarks = async () => {
    setSaving(true);
    setSaveError("");

    const results = roster
      .filter(
        (s) => draft[s.id] && (draft[s.id].absent || draft[s.id].marks !== ""),
      )
      .map((s) => ({
        academyId: academy.id,
        studentId: s.id,
        marksObtained: draft[s.id].absent ? null : Number(draft[s.id].marks),
        isAbsent: draft[s.id].absent,
      }));

    try {
      const res = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, results }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save marks");
      }

      const savedResults = await res.json();

      setDataset((d) => {
        const others = d.testResults.filter((r) => r.testId !== test.id);
        return { ...d, testResults: [...others, ...savedResults] };
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save marks");
    } finally {
      setSaving(false);
    }
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
            <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--text)]">
              {test.name}
            </h1>
            <p className="truncate text-xs text-[var(--text-faint)]">
              {subject?.name} · {cls ? classLabel(cls.name, cls.section) : "—"}{" "}
              · {test.totalMarks} marks
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium text-[var(--text-faint)]">
            {enteredCount}/{roster.length}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={saveMarks}
            disabled={saving}
          >
            {saving ? (
              "Saving…"
            ) : saved ? (
              <>
                <CheckCheck className="h-3.5 w-3.5" /> Saved
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" /> Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {saveError && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {saveError}
          </div>
        )}
        <p className="mb-3 text-xs text-[var(--text-faint)]">
          Press Enter or Tab to move to the next student.
        </p>
        <Card>
          <div className="divide-y divide-[var(--border)]">
            {roster.map((s, idx) => {
              const entry = draft[s.id];
              const pct =
                entry && !entry.absent && entry.marks !== ""
                  ? Math.round((Number(entry.marks) / test.totalMarks) * 100)
                  : null;
              return (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-6 shrink-0 text-xs font-medium text-[var(--text-faint)]">
                    {s.rollNumber}
                  </span>
                  <span className="flex-1 text-sm text-[var(--text)]">
                    {s.name}
                  </span>
                  {pct !== null && (
                    <span
                      className={`text-xs font-medium ${pct >= 50 ? "text-green-400" : "text-red-400"}`}
                    >
                      {pct}%
                    </span>
                  )}
                  <Input
                    type="number"
                    min={0}
                    max={test.totalMarks}
                    value={entry?.absent ? "" : (entry?.marks ?? "")}
                    placeholder={
                      entry?.absent ? "Absent" : `/ ${test.totalMarks}`
                    }
                    disabled={entry?.absent}
                    className="w-24 text-center"
                    onChange={(e) =>
                      updateEntry(s.id, {
                        marks: e.target.value,
                        absent: false,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        const next =
                          document.querySelectorAll<HTMLInputElement>(
                            "[data-marks-input]",
                          )[idx + 1];
                        next?.focus();
                      }
                    }}
                    data-marks-input
                  />
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry?.absent ?? false}
                      onChange={(e) =>
                        updateEntry(s.id, {
                          absent: e.target.checked,
                          marks: "",
                        })
                      }
                      className="h-3.5 w-3.5"
                    />
                    Absent
                  </label>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
