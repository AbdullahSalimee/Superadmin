"use client";

import { useMemo, useState } from "react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel, formatPKR, MONTH_NAMES } from "@/lib/utils";

const ACADEMIC_MONTHS = [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

export default function FeeRecordPage() {
  const { dataset } = useAcademyData();
  const [classId, setClassId] = useState(dataset.classes[0]?.id ?? "");

  const students = useMemo(
    () => dataset.students.filter((s) => s.classId === classId).sort((a, b) => a.rollNumber - b.rollNumber),
    [dataset.students, classId]
  );

  const cls = dataset.classes.find((c) => c.id === classId);

  const cellValue = (studentId: string, month: number) => {
    const year = month >= 5 ? 2025 : 2026;
    const record = dataset.feeRecords.find((f) => f.studentId === studentId && f.month === month && f.year === year);
    if (!record) return { text: "—", color: "text-[var(--text-faint)]" };
    if (record.status === "paid") return { text: record.amountDue.toLocaleString(), color: "text-green-400" };
    return { text: "X", color: "text-red-400" };
  };

  const monthTotal = (month: number) => {
    const year = month >= 5 ? 2025 : 2026;
    return students.reduce((sum, s) => {
      const r = dataset.feeRecords.find((f) => f.studentId === s.id && f.month === month && f.year === year && f.status === "paid");
      return sum + (r?.amountDue ?? 0);
    }, 0);
  };

  return (
    <div>
      <AcademyPageHeader title="Fee Record" subtitle="Yearly view, May – March academic year" />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
            <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-auto min-w-[140px]">
              {dataset.classes.map((c) => (
                <option key={c.id} value={c.id}>{classLabel(c.name, c.section)}</option>
              ))}
            </Select>
            <Button variant="outline" size="sm">Download as PDF</Button>
          </div>

          <p className="px-5 pb-3 text-xs font-medium text-[var(--text-faint)]">
            {cls ? classLabel(cls.name, cls.section) : "—"} — Academic Year 2025–26
          </p>

          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-2 text-left font-medium text-[var(--text-faint)]">Roll</th>
                  <th className="sticky left-8 z-10 bg-[var(--surface)] px-2 py-2 text-left font-medium text-[var(--text-faint)] min-w-[120px]">Name</th>
                  {ACADEMIC_MONTHS.map((m) => (
                    <th key={m} className="px-2 py-2 text-center font-medium text-[var(--text-faint)] min-w-[64px]">
                      {MONTH_NAMES[m].slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--border)]">
                    <td className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-1.5 text-[var(--text-dim)]">{s.rollNumber}</td>
                    <td className="sticky left-8 z-10 bg-[var(--surface)] px-2 py-1.5 text-[var(--text)] whitespace-nowrap">{s.name}</td>
                    {ACADEMIC_MONTHS.map((m) => {
                      const cell = cellValue(s.id, m);
                      return (
                        <td key={m} className={`px-2 py-1.5 text-center font-medium ${cell.color}`}>
                          {cell.text}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--border-hover)] font-semibold">
                  <td className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-2 text-[var(--text)]" colSpan={2}>
                    Total
                  </td>
                  {ACADEMIC_MONTHS.map((m) => (
                    <td key={m} className="px-2 py-2 text-center text-[var(--text)]">
                      {formatPKR(monthTotal(m))}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
