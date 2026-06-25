import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// PATCH: mark a fee record as paid (or unpaid)
export async function PATCH(req: Request) {
  const body = await req.json();
  const { studentId, month, year, status } = body;

  if (!studentId || !month || !year || !status) {
    return NextResponse.json(
      { error: "studentId, month, year and status are required" },
      { status: 400 },
    );
  }

  const paidDate = status === "paid" ? new Date().toISOString() : null;

  // Try to update existing record
  const { data: existing } = await supabaseAdmin
    .from("fee_records")
    .select("id")
    .eq("student_id", studentId)
    .eq("month", month)
    .eq("year", year)
    .single();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("fee_records")
      .update({ status, paid_date: paidDate })
      .eq("id", existing.id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: existing.id });
  }

  // No record exists yet — create it (need amountDue from student)
  const { data: student } = await supabaseAdmin
    .from("students")
    .select("monthly_fee, academy_id")
    .eq("id", studentId)
    .single();

  if (!student?.monthly_fee) {
    return NextResponse.json(
      { error: "Student has no monthly fee set" },
      { status: 400 },
    );
  }

  const { data: inserted, error: insErr } = await supabaseAdmin
    .from("fee_records")
    .insert({
      academy_id: student.academy_id,
      student_id: studentId,
      month,
      year,
      amount_due: student.monthly_fee,
      status,
      paid_date: paidDate,
    })
    .select("id,academy_id,student_id,month,year,amount_due,status,paid_date")
    .single();

  if (insErr)
    return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    id: inserted.id,
    academyId: inserted.academy_id,
    studentId: inserted.student_id,
    month: inserted.month,
    year: inserted.year,
    amountDue: Number(inserted.amount_due),
    status: inserted.status,
    paidDate: inserted.paid_date ?? null,
  });
}
