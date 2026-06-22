import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  // Fetch academies
  const { data: academies, error: acErr } = await supabaseAdmin
    .from("academies")
    .select("id, name, status, contact_name, contact_phone, created_at")
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (acErr)
    return NextResponse.json({ error: acErr.message }, { status: 500 });

  // Fetch all academy_roles so we can attach passwords
  const { data: roles, error: rolesErr } = await supabaseAdmin
    .from("academy_roles")
    .select("academy_id, role, password_hash");

  if (rolesErr)
    return NextResponse.json({ error: rolesErr.message }, { status: 500 });

  const result = (academies ?? []).map((a: any) => {
    const adminRole = roles?.find(
      (r: any) => r.academy_id === a.id && r.role === "admin",
    );
    const teacherRole = roles?.find(
      (r: any) => r.academy_id === a.id && r.role === "teacher",
    );
    return {
      id: a.id,
      name: a.name,
      status: a.status ?? "active",
      contactName: a.contact_name ?? "",
      contactPhone: a.contact_phone ?? "",
      createdAt: a.created_at.slice(0, 10),
      // password_hash stored as plain text for now (no bcrypt in this v1 setup)
      // AFTER
      adminPassword: "", // bcrypt hash — never sent to client
      teacherPassword: "", // bcrypt hash — never sent to client
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    status,
    adminPassword,
    teacherPassword,
    contactName,
    contactPhone,
  } = body;

  if (!name || !adminPassword || !teacherPassword) {
    return NextResponse.json(
      { error: "name, adminPassword and teacherPassword are required" },
      { status: 400 },
    );
  }

  // 1. Insert academy
  const { data: academy, error: acErr } = await supabaseAdmin
    .from("academies")
    .insert({
      name,
      status: status ?? "active",
      contact_name: contactName || null,
      contact_phone: contactPhone || null,
    })
    .select("id, name, status, contact_name, contact_phone, created_at")
    .single();

  if (acErr)
    return NextResponse.json({ error: acErr.message }, { status: 500 });

  // 2. Insert admin + teacher roles
  // AFTER
  const { data: adminHash, error: hashErrA } = await supabaseAdmin.rpc(
    "hash_password",
    { p_password: adminPassword },
  );
  const { data: teacherHash, error: hashErrT } = await supabaseAdmin.rpc(
    "hash_password",
    { p_password: teacherPassword },
  );

  if (hashErrA || hashErrT) {
    await supabaseAdmin.from("academies").delete().eq("id", academy.id);
    return NextResponse.json(
      { error: "Failed to hash passwords" },
      { status: 500 },
    );
  }

  const { error: rolesErr } = await supabaseAdmin.from("academy_roles").insert([
    { academy_id: academy.id, role: "admin", password_hash: adminHash },
    { academy_id: academy.id, role: "teacher", password_hash: teacherHash },
  ]);

  if (rolesErr) {
    // Rollback: delete the academy we just created
    await supabaseAdmin.from("academies").delete().eq("id", academy.id);
    return NextResponse.json({ error: rolesErr.message }, { status: 500 });
  }

 return NextResponse.json({
   id: academy.id,
   name: academy.name,
   status: academy.status ?? "active",
   contactName: academy.contact_name ?? "",
   contactPhone: academy.contact_phone ?? "",
   createdAt: academy.created_at.slice(0, 10),
   adminPassword: "", // hashed — not returnable
   teacherPassword: "",
 });
}
