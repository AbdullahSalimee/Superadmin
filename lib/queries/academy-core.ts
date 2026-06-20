"use server";

import { db } from "@/lib/supabase/client";
import type { ClassRow, SubjectRow, Student } from "@/lib/queries/types";

// ─── classes ────────────────────────────────────────────────────
export async function getClasses(academyId: string): Promise<ClassRow[]> {
  const { data, error } = await db()
    .from("classes")
    .select("*")
    .eq("academy_id", academyId)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as ClassRow[];
}

export async function createClass(academyId: string, name: string, section: string | null) {
  const { error } = await db().from("classes").insert({ academy_id: academyId, name, section });
  if (error) throw new Error(error.message);
}

export async function updateClass(id: string, name: string, section: string | null) {
  const { error } = await db().from("classes").update({ name, section }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteClass(id: string) {
  const { error } = await db().from("classes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── subjects ───────────────────────────────────────────────────
export async function getSubjects(academyId: string): Promise<SubjectRow[]> {
  const { data, error } = await db()
    .from("subjects")
    .select("*")
    .eq("academy_id", academyId)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as SubjectRow[];
}

export async function createSubject(academyId: string, name: string) {
  const { error } = await db().from("subjects").insert({ academy_id: academyId, name });
  if (error) throw new Error(error.message);
}

export async function deleteSubject(id: string) {
  const { error } = await db().from("subjects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── students ───────────────────────────────────────────────────
export async function getStudents(academyId: string): Promise<Student[]> {
  const { data, error } = await db()
    .from("students")
    .select("*")
    .eq("academy_id", academyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Student[];
}

export interface StudentInput {
  class_id: string;
  roll_number: number;
  name: string;
  father_name: string | null;
  monthly_fee: number | null;
  phone: string | null;
  address: string | null;
  teacher_remarks: string | null;
}

export async function createStudent(academyId: string, input: StudentInput) {
  const { error } = await db()
    .from("students")
    .insert({ academy_id: academyId, ...input, added_by_role: "admin", status: "active" });
  if (error) throw new Error(error.message);
}

export async function updateStudent(id: string, input: Partial<StudentInput>) {
  const { error } = await db().from("students").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setStudentStatus(id: string, status: "active" | "inactive") {
  const { error } = await db().from("students").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteStudent(id: string) {
  const { error } = await db().from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
