"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, BarChart3 } from "lucide-react";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { ProfileBox } from "@/components/academy/ProfileBox";
import { AvgScoreModal } from "@/components/academy/AvgScoreModal";
import { AttendanceModal } from "@/components/academy/AttendanceModal";
import { FeeHistoryModal } from "@/components/academy/FeeHistoryModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  classLabel, currentFeeStatus, formatDate, formatPKR,
  studentAttendancePct, studentAvgScorePct,
} from "@/lib/utils";

export default function StudentProfilePage() {
  const { academy, dataset } = useAcademyData();
  const params = useParams<{ studentId: string }>();
  const student = dataset.students.find((s) => s.id === params.studentId);

  const [scoreOpen, setScoreOpen] = useState(false);
  const [attOpen, setAttOpen] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);

  const cls = student ? dataset.classes.find((c) => c.id === student.classId) : undefined;

  const avgScore = useMemo(
    () => (student ? studentAvgScorePct(student.id, dataset.testResults, dataset.tests) : 0),
    [student, dataset]
  );
  const attendancePct = useMemo(
    () => (student ? studentAttendancePct(student.id, dataset.attendance) : 0),
    [student, dataset]
  );
  const feeStatus = student ? currentFeeStatus(student.id, dataset.feeRecords) : "not_set";

  if (!student) {
    return <div className="px-6 py-10 text-center text-sm text-[var(--text-faint)]">Student not found.</div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/academy/${academy.id}/students`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--text)]">{student.name}</h1>
            <p className="truncate text-xs text-[var(--text-faint)]">
              {cls ? classLabel(cls.name, cls.section) : "—"} · Roll #{student.rollNumber}
              {student.status === "inactive" && (
                <>
                  {" · "}
                  <Badge variant="red" className="ml-1">Inactive</Badge>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={`/academy/${academy.id}/students/${student.id}/analytics`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Button>
          </Link>
          <Link href={`/academy/${academy.id}/students/${student.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3">
          <ProfileBox label="Avg. Score" value={`${avgScore}%`} onClick={() => setScoreOpen(true)} />
          <ProfileBox label="Attendance" value={`${attendancePct}%`} onClick={() => setAttOpen(true)} />
          {student.monthlyFee === null ? (
            <ProfileBox label="Fee Status" value="Not Set" tone="amber" disabled />
          ) : (
            <ProfileBox
              label="Fee Status"
              value={feeStatus === "paid" ? "Paid" : "Unpaid"}
              tone={feeStatus === "paid" ? "green" : "red"}
              onClick={() => setFeeOpen(true)}
            />
          )}
        </div>

        <Card>
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h3 className="text-sm font-semibold text-[var(--text)]">Profile</h3>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            {[
              ["Father's Name", student.fatherName || "—"],
              ["Admission Date", formatDate(student.admissionDate)],
              ["Phone", student.phone || "—"],
              ["Address", student.address || "—"],
              ["Teacher Remarks", student.teacherRemarks || "—"],
              ["Monthly Fee (Rs.)", student.monthlyFee !== null ? formatPKR(student.monthlyFee) : "Not set"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 px-5 py-3">
                <dt className="text-xs text-[var(--text-faint)]">{label}</dt>
                <dd className="text-right text-sm text-[var(--text-dim)]">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <AvgScoreModal
        open={scoreOpen}
        onClose={() => setScoreOpen(false)}
        studentId={student.id}
        subjects={dataset.subjects}
        tests={dataset.tests}
        testResults={dataset.testResults}
      />
      <AttendanceModal
        open={attOpen}
        onClose={() => setAttOpen(false)}
        studentId={student.id}
        attendance={dataset.attendance}
      />
      <FeeHistoryModal
        open={feeOpen}
        onClose={() => setFeeOpen(false)}
        studentId={student.id}
        feeRecords={dataset.feeRecords}
      />
    </div>
  );
}
