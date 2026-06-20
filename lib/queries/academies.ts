"use server";

import { db } from "@/lib/supabase/client";
import type { Academy, AcademyRole, StaffRole } from "@/lib/queries/types";

// ─── academies ──────────────────────────────────────────────────
export async function listAcademies(): Promise<Academy[]> {
  const { data, error } = await db()
    .from("academies")
    .select("*")
    .neq("status", "deleted")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Academy[];
}

export async function createAcademy(input: {
  name: string;
  city: string;
  status: Academy["status"];
  contact_name: string | null;
  contact_phone: string | null;
  admin_password: string;
  teacher_password: string;
}) {
  const supabase = db();
  const { data: academy, error } = await supabase
    .from("academies")
    .insert({
      name: input.name,
      city: input.city,
      status: input.status,
      contact_name: input.contact_name,
      contact_phone: input.contact_phone,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Seed the two shared-credential role rows, hashed via the same
  // pgcrypto RPC the AMS app's login flow verifies against.
  for (const role of ["admin", "teacher"] as StaffRole[]) {
    const pw = role === "admin" ? input.admin_password : input.teacher_password;
    const { data: hash, error: hashErr } = await supabase.rpc("hash_role_password", {
      plain_password: pw,
    });
    if (hashErr) throw new Error(hashErr.message);
    const { error: roleErr } = await supabase
      .from("academy_roles")
      .insert({ academy_id: academy.id, role, password_hash: hash as string });
    if (roleErr) throw new Error(roleErr.message);
  }

  return academy as Academy;
}

export async function updateAcademy(
  id: string,
  input: Partial<Pick<Academy, "name" | "city" | "status" | "contact_name" | "contact_phone">>
) {
  const { error } = await db()
    .from("academies")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function softDeleteAcademy(id: string) {
  const { error } = await db()
    .from("academies")
    .update({ status: "deleted", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── academy_roles ──────────────────────────────────────────────
export async function getAcademyRoles(academyId: string): Promise<AcademyRole[]> {
  const { data, error } = await db()
    .from("academy_roles")
    .select("*")
    .eq("academy_id", academyId);
  if (error) throw new Error(error.message);
  return (data ?? []) as AcademyRole[];
}

export async function resetRolePassword(academyId: string, role: StaffRole, newPassword: string) {
  const supabase = db();
  const { data: hash, error: hashErr } = await supabase.rpc("hash_role_password", {
    plain_password: newPassword,
  });
  if (hashErr) throw new Error(hashErr.message);
  const { error } = await supabase
    .from("academy_roles")
    .update({ password_hash: hash as string })
    .eq("academy_id", academyId)
    .eq("role", role);
  if (error) throw new Error(error.message);
}

// ─── platform-wide aggregates (dashboard/academies list cards) ──
export async function getPlatformCounts(academyId: string) {
  const supabase = db();
  const [{ count: students }, { count: classes }, { data: roles }] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("academy_id", academyId).eq("status", "active"),
    supabase.from("classes").select("id", { count: "exact", head: true }).eq("academy_id", academyId),
    supabase.from("academy_roles").select("id").eq("academy_id", academyId),
  ]);
  return { students: students ?? 0, classes: classes ?? 0, roleRows: roles?.length ?? 0 };
}
