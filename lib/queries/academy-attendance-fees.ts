"use server";

import { db } from "@/lib/supabase/client";
import type { AttendanceRecord, AttendanceStatus, FeeRecord, FeeStatus } from "@/lib/queries/types";

// ─── attendance ─────────────────────────────────────────────────
export async function getAttendanceForDate(
  academyId: string,
  classId: string,
  date: string
): Promise<Record<string, AttendanceStatus>> {
  const { data, error } = await db()
    .from("attendance_records")
    .select("student_id, status")
    .eq("academy_id", academyId)
    .eq("class_id", classId)
    .eq("date", date);
  if (error) throw new Error(error.message);
  const map: Record<string, AttendanceStatus> = {};
  for (const row of data ?? []) map[row.student_id as string] = row.status as AttendanceStatus;
  return map;
}

export async function saveAttendance(
  academyId: string,
  classId: string,
  date: string,
  records: { studentId: string; status: AttendanceStatus }[]
) {
  const supabase = db();
  const { data: existing } = await supabase
    .from("attendance_records")
    .select("id, student_id")
    .eq("academy_id", academyId)
    .eq("class_id", classId)
    .eq("date", date);

  const existingByStudent = new Map((existing ?? []).map((r) => [r.student_id, r.id]));
  const toInsert = [];
  const toUpdate = [];

  for (const r of records) {
    const id = existingByStudent.get(r.studentId);
    if (id) {
      toUpdate.push({ id, status: r.status, updated_at: new Date().toISOString() });
    } else {
      toInsert.push({
        academy_id: academyId,
        class_id: classId,
        student_id: r.studentId,
        date,
        status: r.status,
      });
    }
  }

  if (toInsert.length) {
    const { error } = await supabase.from("attendance_records").insert(toInsert);
    if (error) throw new Error(error.message);
  }
  for (const u of toUpdate) {
    const { error } = await supabase
      .from("attendance_records")
      .update({ status: u.status, updated_at: u.updated_at })
      .eq("id", u.id);
    if (error) throw new Error(error.message);
  }
}

export async function getMonthlyAttendance(
  academyId: string,
  classId: string,
  month: number,
  year: number
): Promise<AttendanceRecord[]> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
  const { data, error } = await db()
    .from("attendance_records")
    .select("*")
    .eq("academy_id", academyId)
    .eq("class_id", classId)
    .gte("date", start)
    .lt("date", end);
  if (error) throw new Error(error.message);
  return (data ?? []) as AttendanceRecord[];
}

// ─── fees ───────────────────────────────────────────────────────
export async function getFeeRecords(
  academyId: string,
  month: number,
  year: number
): Promise<FeeRecord[]> {
  const { data, error } = await db()
    .from("fee_records")
    .select("*")
    .eq("academy_id", academyId)
    .eq("month", month)
    .eq("year", year);
  if (error) throw new Error(error.message);
  return (data ?? []) as FeeRecord[];
}

export async function setFeeStatus(id: string, status: FeeStatus) {
  const { error } = await db()
    .from("fee_records")
    .update({ status, paid_date: status === "paid" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertFeeRecord(
  academyId: string,
  studentId: string,
  month: number,
  year: number,
  amountDue: number
) {
  const supabase = db();
  const { data: existing } = await supabase
    .from("fee_records")
    .select("id")
    .eq("academy_id", academyId)
    .eq("student_id", studentId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("fee_records")
      .update({ amount_due: amountDue })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("fee_records").insert({
      academy_id: academyId,
      student_id: studentId,
      month,
      year,
      amount_due: amountDue,
      status: "unpaid",
    });
    if (error) throw new Error(error.message);
  }
}
