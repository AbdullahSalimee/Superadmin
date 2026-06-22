import { Modal } from "@/components/ui/Modal";
import { ShareButton } from "@/components/academy/ShareButton";
import { MONTH_NAMES } from "@/lib/utils";
import type { AttendanceRecord } from "@/types";

export function AttendanceModal({
  open,
  onClose,
  studentId,
  attendance,
}: {
  open: boolean;
  onClose: () => void;
  studentId: string;
  attendance: AttendanceRecord[];
}) {
  const records = attendance.filter((a) => a.studentId === studentId);

  const byMonth = new Map<string, { present: number; absent: number; year: number; month: number }>();
  for (const r of records) {
    const [y, m] = r.date.split("-").map(Number);
    const key = `${y}-${m}`;
    if (!byMonth.has(key)) byMonth.set(key, { present: 0, absent: 0, year: y, month: m });
    const entry = byMonth.get(key)!;
    if (r.status === "P") entry.present++;
    else entry.absent++; // A and L both count as non-present
  }

  const rows = Array.from(byMonth.values()).sort((a, b) => a.year - b.year || a.month - b.month);

  return (
    <Modal open={open} onClose={onClose} title="Attendance — monthly breakdown" size="lg">
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">No attendance recorded yet.</p>
      ) : (
        <div className="max-h-[60vh] divide-y divide-[var(--border)] overflow-y-auto rounded-lg border border-[var(--border)]">
          {rows.map((row) => (
            <div key={`${row.year}-${row.month}`} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-[var(--text)]">
                {MONTH_NAMES[row.month]} {row.year}
              </span>
              <span className="text-xs text-[var(--text-dim)]">
                <span className="text-green-400 font-medium">{row.present} Present</span>
                {" · "}
                <span className="text-red-400 font-medium">{row.absent} Absent</span>
              </span>
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
