import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST: upsert a full day's attendance for a class
export async function POST(req: Request) {
  const body = await req.json();
  const { records } = body as {
    records: {
      academyId: string;
      studentId: string;
      classId: string;
      date: string;
      status: string;
    }[];
  };

  if (!records || records.length === 0) {
    return NextResponse.json({ error: "No records provided" }, { status: 400 });
  }

  const { academyId, classId, date } = records[0];

  // Delete existing records for this class+date, then insert fresh
  const { error: delErr } = await supabaseAdmin
    .from("attendance_records")
    .delete()
    .eq("academy_id", academyId)
    .eq("class_id", classId)
    .eq("date", date);

  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  const rows = records.map((r) => ({
    academy_id: r.academyId,
    student_id: r.studentId,
    class_id: r.classId,
    date: r.date,
    status: r.status,
  }));

  const { data, error } = await supabaseAdmin
    .from("attendance_records")
    .insert(rows)
    .select("id,academy_id,student_id,class_id,date,status");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((a: any) => ({
      id: a.id,
      academyId: a.academy_id,
      studentId: a.student_id,
      classId: a.class_id,
      date: a.date,
      status: a.status,
    })),
  );
}
