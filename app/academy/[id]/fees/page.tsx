"use client";

import { useMemo, useState } from "react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAcademyData } from "@/components/academy/AcademyContext";
import {
  classLabel,
  CURRENT_MONTH,
  CURRENT_YEAR,
  formatPKR,
  MONTH_NAMES,
} from "@/lib/utils";
import { Link as LinkIcon, Wallet } from "lucide-react";
import Link from "next/link";
import type { Student } from "@/types";

export default function FeesPage() {
  const { academy, dataset, setDataset } = useAcademyData();
  const [classId, setClassId] = useState(dataset.classes[0]?.id ?? "");
  const [payTarget, setPayTarget] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const classStudents = useMemo(
    () =>
      dataset.students
        .filter((s) => s.classId === classId && s.status === "active")
        .sort((a, b) => a.rollNumber - b.rollNumber),
    [dataset.students, classId],
  );

  const rows = useMemo(() => {
    return classStudents.map((s) => {
      const current = dataset.feeRecords.find(
        (f) =>
          f.studentId === s.id &&
          f.month === CURRENT_MONTH &&
          f.year === CURRENT_YEAR,
      );
      const prevMonth = CURRENT_MONTH === 1 ? 12 : CURRENT_MONTH - 1;
      const prevYear = CURRENT_MONTH === 1 ? CURRENT_YEAR - 1 : CURRENT_YEAR;
      const prev = dataset.feeRecords.find(
        (f) =>
          f.studentId === s.id && f.month === prevMonth && f.year === prevYear,
      );
      return { student: s, current, prev };
    });
  }, [classStudents, dataset.feeRecords]);

  const collected = rows
    .filter((r) => r.current?.status === "paid")
    .reduce((s, r) => s + (r.current?.amountDue ?? 0), 0);
  const due = rows
    .filter((r) => r.current?.status === "unpaid")
    .reduce((s, r) => s + (r.current?.amountDue ?? 0), 0);

  const confirmPay = async () => {
    if (!payTarget) return;
    setSaving(true);
    setSaveError("");

    try {
      const res = await fetch("/api/fee-records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: payTarget.id,
          month: CURRENT_MONTH,
          year: CURRENT_YEAR,
          status: "paid",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to mark as paid");
      }

      const result = await res.json();
      const paidDate = new Date().toISOString();

      // Update local dataset
      setDataset((d) => {
        const exists = d.feeRecords.some(
          (f) =>
            f.studentId === payTarget.id &&
            f.month === CURRENT_MONTH &&
            f.year === CURRENT_YEAR,
        );

        if (exists) {
          return {
            ...d,
            feeRecords: d.feeRecords.map((f) =>
              f.studentId === payTarget.id &&
              f.month === CURRENT_MONTH &&
              f.year === CURRENT_YEAR
                ? { ...f, status: "paid", paidDate }
                : f,
            ),
          };
        } else {
          // Record was just created in Supabase, add it to local state
          return {
            ...d,
            feeRecords: [
              ...d.feeRecords,
              {
                id: result.id,
                academyId: academy.id,
                studentId: payTarget.id,
                month: CURRENT_MONTH,
                year: CURRENT_YEAR,
                amountDue: payTarget.monthlyFee ?? 0,
                status: "paid" as const,
                paidDate,
              },
            ],
          };
        }
      });

      setPayTarget(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AcademyPageHeader
        title="Fees"
        subtitle={`${MONTH_NAMES[CURRENT_MONTH]} ${CURRENT_YEAR} payment tracking`}
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
            <Select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-auto min-w-[140px]"
            >
              {dataset.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {classLabel(c.name, c.section)}
                </option>
              ))}
            </Select>
            <div className="flex gap-4 text-xs">
              <span className="text-[var(--text-faint)]">
                {rows.length} records
              </span>
              <span className="font-medium text-green-400">
                Collected: {formatPKR(collected)}
              </span>
              <span className="font-medium text-red-400">
                Due: {formatPKR(due)}
              </span>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState icon={Wallet} title="No students in this class" />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {rows.map(({ student, current, prev }) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-medium text-[var(--text-faint)]">
                      {student.rollNumber}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--text)]">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-[var(--text-faint)]">
                        Prev:{" "}
                        {prev ? (prev.status === "paid" ? "Paid" : "Due") : "—"}
                      </p>
                    </div>
                  </div>

                  {student.monthlyFee === null ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="amber">Fee Not Set</Badge>
                      <Link
                        href={`/academy/${academy.id}/students/${student.id}/edit`}
                      >
                        <Button size="sm" variant="outline">
                          <LinkIcon className="h-3.5 w-3.5" /> Assign
                        </Button>
                      </Link>
                    </div>
                  ) : current?.status === "paid" ? (
                    <Badge variant="green">
                      Paid · {formatPKR(current.amountDue)}
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="red">
                        Unpaid ·{" "}
                        {current
                          ? formatPKR(current.amountDue)
                          : formatPKR(student.monthlyFee)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setPayTarget(student)}
                      >
                        Pay
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {payTarget && (
        <Modal
          open
          onClose={() => {
            setPayTarget(null);
            setSaveError("");
          }}
          title="Confirm payment"
        >
          <p className="text-sm text-[var(--text-dim)]">
            Confirm that{" "}
            <strong className="text-[var(--text)]">{payTarget.name}</strong> has
            paid{" "}
            <strong className="text-[var(--text)]">
              {formatPKR(payTarget.monthlyFee ?? 0)}
            </strong>{" "}
            for {MONTH_NAMES[CURRENT_MONTH]} {CURRENT_YEAR}?
          </p>
          {saveError && (
            <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {saveError}
            </div>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setPayTarget(null);
                setSaveError("");
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmPay} disabled={saving}>
              {saving ? "Saving…" : "Confirm Payment"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
