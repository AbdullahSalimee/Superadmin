"use client";

import { useMemo, useState } from "react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export default function TestRecordPage() {
  const { dataset } = useAcademyData();
  const [classId, setClassId] = useState(dataset.classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(dataset.subjects[0]?.id ?? "");
  const [teacherName, setTeacherName] = useState("");

  const tests = useMemo(
    () =>
      dataset.tests
        .filter((t) => t.classId === classId && t.subjectId === subjectId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [dataset.tests, classId, subjectId]
  );

  const students = useMemo(
    () => dataset.students.filter((s) => s.classId === classId && s.status === "active").sort((a, b) => a.rollNumber - b.rollNumber),
    [dataset.students, classId]
  );

  const cls = dataset.classes.find((c) => c.id === classId);
  const subject = dataset.subjects.find((s) => s.id === subjectId);

  const cellValue = (studentId: string, testId: string) => {
    const result = dataset.testResults.find((r) => r.testId === testId && r.studentId === studentId);
    if (!result) return { text: "—", color: "text-[var(--text-faint)]" };
    if (result.isAbsent) return { text: "Absent", color: "text-amber-400" };
    const test = dataset.tests.find((t) => t.id === testId);
    return { text: `${result.marksObtained}/${test?.totalMarks}`, color: "text-[var(--text-dim)]" };
  };

  return (
    <div>
      <AcademyPageHeader title="Test Record" subtitle="Yearly tabular view per class & subject" />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="flex flex-wrap items-center gap-2 p-5 pb-4">
            <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-auto min-w-[130px]">
              {dataset.classes.map((c) => (
                <option key={c.id} value={c.id}>{classLabel(c.name, c.section)}</option>
              ))}
            </Select>
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-auto min-w-[130px]">
              {dataset.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
            <Input
              placeholder="Teacher name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-auto min-w-[140px]"
            />
            <Button variant="outline" size="sm" className="ml-auto">Download as PDF</Button>
          </div>

          <p className="px-5 pb-3 text-xs font-medium text-[var(--text-faint)]">
            {cls ? classLabel(cls.name, cls.section) : "—"}, Subject {subject?.name ?? "—"}
            {teacherName ? `, Teacher ${teacherName}` : ""}
          </p>

          {tests.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState icon={BookOpen} title="No tests for this class & subject yet" />
            </div>
          ) : (
            <div className="overflow-x-auto px-5 pb-5">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-2 text-left font-medium text-[var(--text-faint)] min-w-[120px]">Name</th>
                    {tests.map((t) => (
                      <th key={t.id} className="px-2 py-2 text-center font-medium text-[var(--text-faint)] min-w-[70px]">
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-[var(--border)]">
                      <td className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-1.5 text-[var(--text)] whitespace-nowrap">{s.name}</td>
                      {tests.map((t) => {
                        const cell = cellValue(s.id, t.id);
                        return (
                          <td key={t.id} className={`px-2 py-1.5 text-center font-medium ${cell.color}`}>
                            {cell.text}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
