"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays, Check, CheckCheck } from "lucide-react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { AttendanceToggle } from "@/components/academy/AttendanceToggle";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel } from "@/lib/utils";
import { Users } from "lucide-react";
import type { AttendanceStatus } from "@/types";

function shiftDate(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const { academy, dataset, setDataset } = useAcademyData();
  const searchParams = useSearchParams();

  const [view, setView] = useState<"daily" | "monthly">("daily");
  const [classId, setClassId] = useState(searchParams.get("classId") ?? dataset.classes[0]?.id ?? "");
  const [date, setDate] = useState("2026-06-20");
  const [draft, setDraft] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const [monthYear, setMonthYear] = useState("2026-06");

  const classStudents = useMemo(
    () => dataset.students.filter((s) => s.classId === classId && s.status === "active").sort((a, b) => a.rollNumber - b.rollNumber),
    [dataset.students, classId]
  );

  // recompute draft whenever class+date changes, without setState-in-effect
  const draftKey = `${classId}|${date}`;
  const [loadedKey, setLoadedKey] = useState(draftKey);
  if (loadedKey !== draftKey) {
    const existing: Record<string, AttendanceStatus> = {};
    for (const s of classStudents) {
      const rec = dataset.attendance.find((a) => a.studentId === s.id && a.date === date);
      if (rec) existing[s.id] = rec.status;
    }
    setDraft(existing);
    setLoadedKey(draftKey);
  }

  const counts = useMemo(() => {
    let p = 0, a = 0, l = 0;
    for (const s of classStudents) {
      const status = draft[s.id];
      if (status === "P") p++;
      else if (status === "A") a++;
      else if (status === "L") l++;
    }
    return { p, a, l, total: classStudents.length };
  }, [draft, classStudents]);

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    for (const s of classStudents) next[s.id] = status;
    setDraft(next);
  };

  const saveAttendance = () => {
    setDataset((d) => {
      const others = d.attendance.filter((a) => !(a.classId === classId && a.date === date));
      const newRecords = classStudents
        .filter((s) => draft[s.id])
        .map((s) => ({
          id: `${academy.id}-att-${s.id}-${date}`,
          academyId: academy.id,
          studentId: s.id,
          classId,
          date,
          status: draft[s.id],
        }));
      return { ...d, attendance: [...others, ...newRecords] };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // ---- monthly record data ----
  const [my, mm] = monthYear.split("-").map(Number);
  const daysInMonth = new Date(my, mm, 0).getDate();
  const monthlyStudents = dataset.students
    .filter((s) => s.classId === classId)
    .sort((a, b) => a.rollNumber - b.rollNumber);

  const cls = dataset.classes.find((c) => c.id === classId);

  return (
    <div>
      <AcademyPageHeader
        title="Attendance"
        subtitle={view === "daily" ? "Daily marking" : "Monthly record (read-only)"}
        action={
          <div className="flex gap-2">
            <Button
              variant={view === "daily" ? "primary" : "outline"}
              size="sm"
              onClick={() => setView("daily")}
            >
              Daily
            </Button>
            <Button
              variant={view === "monthly" ? "primary" : "outline"}
              size="sm"
              onClick={() => setView("monthly")}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Monthly
            </Button>
          </div>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {view === "daily" ? (
          <Card>
            <div className="flex flex-wrap items-center gap-2 p-5 pb-4">
              <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-auto min-w-[140px]">
                {dataset.classes.map((c) => (
                  <option key={c.id} value={c.id}>{classLabel(c.name, c.section)}</option>
                ))}
              </Select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDate((d) => shiftDate(d, -1))}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-hover)] text-[var(--text-faint)] hover:bg-[var(--surface-2)] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
                <button
                  onClick={() => setDate((d) => shiftDate(d, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-hover)] text-[var(--text-faint)] hover:bg-[var(--surface-2)] cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={() => markAll("P")}>All P</Button>
                <Button size="sm" variant="outline" onClick={() => markAll("A")}>All A</Button>
              </div>
            </div>

            <div className="flex items-center gap-4 border-y border-[var(--border)] bg-[var(--surface-2)]/40 px-5 py-2.5 text-xs">
              <span className="text-green-400 font-medium">✓ {counts.p}</span>
              <span className="text-red-400 font-medium">✕ {counts.a}</span>
              <span className="text-amber-400 font-medium">L {counts.l}</span>
              <span className="ml-auto text-[var(--text-faint)]">{counts.total} students</span>
            </div>

            {classStudents.length === 0 ? (
              <div className="px-5 py-5">
                <EmptyState icon={Users} title="No active students in this class" />
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {classStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-medium text-[var(--text-faint)]">{s.rollNumber}</span>
                      <span className="text-sm text-[var(--text)]">{s.name}</span>
                    </div>
                    <AttendanceToggle
                      value={draft[s.id] ?? null}
                      onChange={(status) => setDraft((d) => ({ ...d, [s.id]: status }))}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[var(--border)] p-5">
              <Button variant="primary" size="lg" className="w-full" onClick={saveAttendance}>
                {saved ? <CheckCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                {saved ? "Saved" : "Save Attendance"}
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-wrap items-center gap-2 p-5 pb-4">
              <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-auto min-w-[140px]">
                {dataset.classes.map((c) => (
                  <option key={c.id} value={c.id}>{classLabel(c.name, c.section)}</option>
                ))}
              </Select>
              <Input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} className="w-auto" />
              <Button variant="outline" size="sm" className="ml-auto">Download as PDF</Button>
            </div>

            <p className="px-5 pb-3 text-xs font-medium text-[var(--text-faint)]">
              {cls ? classLabel(cls.name, cls.section) : "—"} — {new Date(`${monthYear}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>

            <div className="overflow-x-auto px-5 pb-5">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-2 text-left font-medium text-[var(--text-faint)]">Roll</th>
                    <th className="sticky left-8 z-10 bg-[var(--surface)] px-2 py-2 text-left font-medium text-[var(--text-faint)] min-w-[120px]">Name</th>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                      <th key={day} className="px-1.5 py-2 text-center font-medium text-[var(--text-faint)] min-w-[26px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyStudents.map((s) => (
                    <tr key={s.id} className="border-b border-[var(--border)]">
                      <td className="sticky left-0 z-10 bg-[var(--surface)] px-2 py-1.5 text-[var(--text-dim)]">{s.rollNumber}</td>
                      <td className="sticky left-8 z-10 bg-[var(--surface)] px-2 py-1.5 text-[var(--text)] whitespace-nowrap">{s.name}</td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const iso = `${monthYear}-${String(day).padStart(2, "0")}`;
                        const rec = dataset.attendance.find((a) => a.studentId === s.id && a.date === iso);
                        const color = rec?.status === "P" ? "text-green-400" : rec?.status === "A" ? "text-red-400" : rec?.status === "L" ? "text-amber-400" : "text-[var(--text-faint)]";
                        return (
                          <td key={day} className={`px-1.5 py-1.5 text-center font-medium ${color}`}>
                            {rec?.status ?? ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
