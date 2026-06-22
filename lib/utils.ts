import type { AttendanceRecord, FeeRecord, Test, TestResult } from "@/types";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/lib/data";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthYearLabel(month: number, year: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function classLabel(name: string, section?: string | null): string {
  return section ? `${name} (${section})` : name;
}

// ----- derived: student attendance % (admission date -> today) -----
export function studentAttendancePct(studentId: string, attendance: AttendanceRecord[]): number {
  const records = attendance.filter((a) => a.studentId === studentId);
  if (records.length === 0) return 0;
  const present = records.filter((a) => a.status === "P").length;
  return Math.round((present / records.length) * 100);
}

// ----- derived: student avg test score % across all tests -----
export function studentAvgScorePct(
  studentId: string,
  testResults: TestResult[],
  tests: Test[]
): number {
  const results = testResults.filter((r) => r.studentId === studentId && !r.isAbsent && r.marksObtained !== null);
  if (results.length === 0) return 0;
  let obtained = 0;
  let total = 0;
  for (const r of results) {
    const test = tests.find((t) => t.id === r.testId);
    if (!test) continue;
    obtained += r.marksObtained ?? 0;
    total += test.totalMarks;
  }
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}

// ----- derived: current month fee status for a student -----
export function currentFeeStatus(
  studentId: string,
  feeRecords: FeeRecord[]
): "paid" | "unpaid" | "not_set" {
  const record = feeRecords.find(
    (f) => f.studentId === studentId && f.month === CURRENT_MONTH && f.year === CURRENT_YEAR
  );
  if (!record) return "not_set";
  return record.status;
}

export function gradeLetter(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  if (pct >= 33) return "E";
  return "F";
}

export function isPassing(pct: number): boolean {
  return pct >= 33;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export { CURRENT_MONTH, CURRENT_YEAR };
