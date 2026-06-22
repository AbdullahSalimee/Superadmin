import { Modal } from "@/components/ui/Modal";
import { ShareButton } from "@/components/academy/ShareButton";
import type { Subject, Test, TestResult } from "@/types";

export function AvgScoreModal({
  open,
  onClose,
  studentId,
  subjects,
  tests,
  testResults,
}: {
  open: boolean;
  onClose: () => void;
  studentId: string;
  subjects: Subject[];
  tests: Test[];
  testResults: TestResult[];
}) {
  const bySubject = subjects
    .map((subject) => {
      const subjectTests = tests.filter((t) => t.subjectId === subject.id);
      const rows = subjectTests
        .map((test) => {
          const result = testResults.find((r) => r.testId === test.id && r.studentId === studentId);
          if (!result) return null;
          return { test, result };
        })
        .filter((r): r is { test: Test; result: TestResult } => r !== null)
        .sort((a, b) => a.test.date.localeCompare(b.test.date));
      return { subject, rows };
    })
    .filter((s) => s.rows.length > 0);

  return (
    <Modal open={open} onClose={onClose} title="Average score — by subject" size="lg">
      {bySubject.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">No tests recorded yet.</p>
      ) : (
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {bySubject.map(({ subject, rows }) => (
            <div key={subject.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                {subject.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {rows.map(({ test, result }) => (
                  <div
                    key={test.id}
                    className="rounded-md border border-[var(--border-hover)] bg-[var(--surface-2)] px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium text-[var(--text)]">{test.name}: </span>
                    <span className="text-[var(--text-dim)]">
                      {result.isAbsent ? "Absent" : `${result.marksObtained}/${test.totalMarks}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex justify-end">
        <ShareButton />
      </div>
    </Modal>
  );
}
