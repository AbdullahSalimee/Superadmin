import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const now = new Date();

  const [{ data: students }, { data: roles }, { data: fees }] =
    await Promise.all([
      supabaseAdmin
        .from("students")
        .select("academy_id")
        .eq("status", "active"),
      supabaseAdmin.from("academy_roles").select("academy_id, role"),
      supabaseAdmin
        .from("fee_records")
        .select("academy_id, amount_due, status")
        .eq("month", now.getMonth() + 1)
        .eq("year", now.getFullYear()),
    ]);

  const metrics: Record<
    string,
    {
      activeStudents: number;
      staffCount: number;
      revenueThisMonth: number;
      dueThisMonth: number;
    }
  > = {};

  const ensure = (id: string) => {
    if (!metrics[id])
      metrics[id] = {
        activeStudents: 0,
        staffCount: 0,
        revenueThisMonth: 0,
        dueThisMonth: 0,
      };
  };

  for (const s of students ?? []) {
    ensure(s.academy_id);
    metrics[s.academy_id].activeStudents++;
  }

  const rolesByAcademy: Record<string, Set<string>> = {};
  for (const r of roles ?? []) {
    if (!rolesByAcademy[r.academy_id]) rolesByAcademy[r.academy_id] = new Set();
    rolesByAcademy[r.academy_id].add(r.role);
  }
  for (const [id, roleSet] of Object.entries(rolesByAcademy)) {
    ensure(id);
    metrics[id].staffCount = roleSet.size;
  }

  for (const f of fees ?? []) {
    ensure(f.academy_id);
    if (f.status === "paid")
      metrics[f.academy_id].revenueThisMonth += Number(f.amount_due);
    else metrics[f.academy_id].dueThisMonth += Number(f.amount_due);
  }

  return NextResponse.json(metrics);
}
