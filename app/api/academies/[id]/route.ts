import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  // --- Update academies table (name, status, contact fields) ---
  const academyPatch: Record<string, unknown> = {};
  if (body.name !== undefined) academyPatch.name = body.name;
  if (body.status !== undefined) academyPatch.status = body.status;
  if (body.contactName !== undefined)
    academyPatch.contact_name = body.contactName || null;
  if (body.contactPhone !== undefined)
    academyPatch.contact_phone = body.contactPhone || null;

  if (Object.keys(academyPatch).length > 0) {
    const { error } = await supabaseAdmin
      .from("academies")
      .update(academyPatch)
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // --- Update academy_roles table (passwords) ---
  // AFTER
  if (body.adminPassword !== undefined) {
    const { data: hash, error: hashErr } = await supabaseAdmin.rpc(
      "hash_password",
      { p_password: body.adminPassword },
    );
    if (hashErr)
      return NextResponse.json({ error: hashErr.message }, { status: 500 });
    const { error } = await supabaseAdmin
      .from("academy_roles")
      .update({ password_hash: hash })
      .eq("academy_id", id)
      .eq("role", "admin");
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.teacherPassword !== undefined) {
    const { data: hash, error: hashErr } = await supabaseAdmin.rpc(
      "hash_password",
      { p_password: body.teacherPassword },
    );
    if (hashErr)
      return NextResponse.json({ error: hashErr.message }, { status: 500 });
    const { error } = await supabaseAdmin
      .from("academy_roles")
      .update({ password_hash: hash })
      .eq("academy_id", id)
      .eq("role", "teacher");
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("academies")
    .update({ status: "deleted" })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
