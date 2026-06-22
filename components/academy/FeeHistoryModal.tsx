import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { MONTH_NAMES, formatPKR } from "@/lib/utils";
import type { FeeRecord } from "@/types";

export function FeeHistoryModal({
  open,
  onClose,
  studentId,
  feeRecords,
}: {
  open: boolean;
  onClose: () => void;
  studentId: string;
  feeRecords: FeeRecord[];
}) {
  const rows = feeRecords
    .filter((f) => f.studentId === studentId)
    .sort((a, b) => b.year - a.year || b.month - a.month);

  return (
    <Modal open={open} onClose={onClose} title="Fee history" size="lg">
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">No fee records yet.</p>
      ) : (
        <div className="max-h-[60vh] divide-y divide-[var(--border)] overflow-y-auto rounded-lg border border-[var(--border)]">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-[var(--text)]">
                {MONTH_NAMES[row.month]} {row.year}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-dim)]">{formatPKR(row.amountDue)}</span>
                <Badge variant={row.status === "paid" ? "green" : "red"}>
                  {row.status === "paid" ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
