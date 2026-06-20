"use server";

import { db } from "@/lib/supabase/client";
import type { TestRow, TestResult, NotificationRow } from "@/lib/queries/types";

// ─── tests ──────────────────────────────────────────────────────
export async function getTests(academyId: string): Promise<TestRow[]> {
  const { data, error } = await db()
    .from("tests")
    .select("*")
    .eq("academy_id", academyId)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as TestRow[];
}

export async function createTest(
  academyId: string,
  input: { class_id: string; subject_id: string; name: string; date: string; total_marks: number }
) {
  const { error } = await db()
    .from("tests")
    .insert({ academy_id: academyId, ...input });
  if (error) throw new Error(error.message);
}

export async function deleteTest(id: string) {
  const { error } = await db().from("tests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── test_results ───────────────────────────────────────────────
export async function getTestResults(testId: string): Promise<TestResult[]> {
  const { data, error } = await db().from("test_results").select("*").eq("test_id", testId);
  if (error) throw new Error(error.message);
  return (data ?? []) as TestResult[];
}

export async function saveTestResults(
  academyId: string,
  testId: string,
  results: { studentId: string; marksObtained: number | null; isAbsent: boolean }[]
) {
  const supabase = db();
  const { data: existing } = await supabase
    .from("test_results")
    .select("id, student_id")
    .eq("test_id", testId);

  const byStudent = new Map((existing ?? []).map((r) => [r.student_id, r.id]));
  const toInsert = [];
  const toUpdate = [];

  for (const r of results) {
    const id = byStudent.get(r.studentId);
    const payload = {
      marks_obtained: r.isAbsent ? null : r.marksObtained,
      is_absent: r.isAbsent,
      updated_at: new Date().toISOString(),
    };
    if (id) toUpdate.push({ id, ...payload });
    else
      toInsert.push({
        academy_id: academyId,
        test_id: testId,
        student_id: r.studentId,
        ...payload,
      });
  }

  if (toInsert.length) {
    const { error } = await supabase.from("test_results").insert(toInsert);
    if (error) throw new Error(error.message);
  }
  for (const u of toUpdate) {
    const { id, ...rest } = u;
    const { error } = await supabase.from("test_results").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
  }
}

// ─── notifications ──────────────────────────────────────────────
export async function getNotifications(academyId: string): Promise<NotificationRow[]> {
  const { data, error } = await db()
    .from("notifications")
    .select("*")
    .eq("academy_id", academyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as NotificationRow[];
}

export async function resolveNotification(id: string) {
  const { error } = await db().from("notifications").update({ is_resolved: true }).eq("id", id);
  if (error) throw new Error(error.message);
}
