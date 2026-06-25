import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    academyId,
    classId,
    rollNumber,
    name,
    fatherName,
    monthlyFee,
    admissionDate,
    phone,
    address,
    teacherRemarks,
    status,
    addedByRole,
  } = body;

  if (!academyId || !classId || !name || !rollNumber || !admissionDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("students")
    .insert({
      academy_id: academyId,
      class_id: classId,
      roll_number: rollNumber,
      name,
      father_name: fatherName || null,
      monthly_fee: monthlyFee ?? null,
      admission_date: admissionDate,
      phone: phone || null,
      address: address || null,
      teacher_remarks: teacherRemarks || null,
      status: status ?? "active",
      added_by_role: addedByRole ?? "admin",
    })
    .select(
      "id,academy_id,class_id,roll_number,name,father_name,monthly_fee,admission_date,phone,address,teacher_remarks,status,added_by_role",
    )
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    academyId: data.academy_id,
    classId: data.class_id,
    rollNumber: data.roll_number,
    name: data.name,
    fatherName: data.father_name ?? null,
    monthlyFee: data.monthly_fee !== null ? Number(data.monthly_fee) : null,
    admissionDate: data.admission_date,
    phone: data.phone ?? null,
    address: data.address ?? null,
    teacherRemarks: data.teacher_remarks ?? null,
    status: data.status,
    addedByRole: data.added_by_role,
  });
}
