import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  const body = await req.json();

  const patch: Record<string, unknown> = {};
  if (body.classId !== undefined) patch.class_id = body.classId;
  if (body.rollNumber !== undefined) patch.roll_number = body.rollNumber;
  if (body.name !== undefined) patch.name = body.name;
  if (body.fatherName !== undefined)
    patch.father_name = body.fatherName || null;
  if (body.monthlyFee !== undefined)
    patch.monthly_fee = body.monthlyFee ?? null;
  if (body.admissionDate !== undefined)
    patch.admission_date = body.admissionDate;
  if (body.phone !== undefined) patch.phone = body.phone || null;
  if (body.address !== undefined) patch.address = body.address || null;
  if (body.teacherRemarks !== undefined)
    patch.teacher_remarks = body.teacherRemarks || null;
  if (body.status !== undefined) patch.status = body.status;

  const { error } = await supabaseAdmin
    .from("students")
    .update(patch)
    .eq("id", studentId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;

  const { error } = await supabaseAdmin
    .from("students")
    .update({ status: "inactive" })
    .eq("id", studentId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
