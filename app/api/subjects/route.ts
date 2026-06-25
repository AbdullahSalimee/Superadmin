import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { academyId, name } = body;

  if (!academyId || !name) {
    return NextResponse.json(
      { error: "academyId and name are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("subjects")
    .insert({ academy_id: academyId, name })
    .select("id,academy_id,name,created_at")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    academyId: data.academy_id,
    name: data.name,
    createdAt: data.created_at,
  });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("subjects").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
