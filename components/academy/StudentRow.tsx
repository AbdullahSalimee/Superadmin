import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { currentFeeStatus, formatPKR } from "@/lib/utils";
import type { FeeRecord, Student } from "@/types";

export function StudentRow({
  student,
  academyId,
  feeRecords,
}: {
  student: Student;
  academyId: string;
  feeRecords: FeeRecord[];
}) {
  const feeStatus = currentFeeStatus(student.id, feeRecords);
  const feeRecord = feeRecords.find((f) => f.studentId === student.id);

  return (
    <Link
      href={`/academy/${academyId}/students/${student.id}`}
      className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]/40"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-dim)]">
          {student.rollNumber}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--text)]">{student.name}</p>
          <p className="truncate text-xs text-[var(--text-faint)]">{student.phone ?? "No phone on file"}</p>
        </div>
      </div>
      <div className="shrink-0">
        {feeStatus === "not_set" ? (
          <Badge variant="amber">Fee Not Set</Badge>
        ) : feeStatus === "paid" ? (
          <Badge variant="green">
            Paid{feeRecord ? ` · ${formatPKR(feeRecord.amountDue)}` : ""}
          </Badge>
        ) : (
          <Badge variant="red">
            Unpaid{feeRecord ? ` · ${formatPKR(feeRecord.amountDue)}` : ""}
          </Badge>
        )}
      </div>
    </Link>
  );
}
