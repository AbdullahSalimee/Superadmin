import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST: upsert all results for a test
export async function POST(req: Request) {
  const body = await req.json();
  const { testId, results } = body as {
    testId: string;
    results: {
      academyId: string;
      studentId: string;
      marksObtained: number | null;
      isAbsent: boolean;
    }[];
  };

  if (!testId || !results) {
    return NextResponse.json(
      { error: "testId and results are required" },
      { status: 400 },
    );
  }

  // Delete existing results for this test, then insert fresh
  const { error: delErr } = await supabaseAdmin
    .from("test_results")
    .delete()
    .eq("test_id", testId);

  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (results.length === 0) return NextResponse.json([]);

  const rows = results.map((r) => ({
    academy_id: r.academyId,
    test_id: testId,
    student_id: r.studentId,
    marks_obtained: r.marksObtained ?? null,
    is_absent: r.isAbsent,
  }));

  const { data, error } = await supabaseAdmin
    .from("test_results")
    .insert(rows)
    .select("id,academy_id,test_id,student_id,marks_obtained,is_absent");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((r: any) => ({
      id: r.id,
      academyId: r.academy_id,
      testId: r.test_id,
      studentId: r.student_id,
      marksObtained:
        r.marks_obtained !== null ? Number(r.marks_obtained) : null,
      isAbsent: r.is_absent,
    })),
  );
}
