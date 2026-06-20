import { notFound } from "next/navigation";
import { db } from "@/lib/supabase/client";
import { getClasses, getSubjects, getStudents } from "@/lib/queries/academy-core";
import { getFeeRecords } from "@/lib/queries/academy-attendance-fees";
import { getTests } from "@/lib/queries/academy-tests";
import { getNotifications } from "@/lib/queries/academy-tests";
import { getAcademyRoles } from "@/lib/queries/academies";
import type { Academy } from "@/lib/queries/types";
import Workspace from "./workspace";

const CURRENT_MONTH = 6;
const CURRENT_YEAR = 2026;

export default async function AcademyWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: academy, error } = await db().from("academies").select("*").eq("id", id).single();
  if (error || !academy) notFound();

  const [classes, subjects, students, fees, tests, notifications, roles] = await Promise.all([
    getClasses(id),
    getSubjects(id),
    getStudents(id),
    getFeeRecords(id, CURRENT_MONTH, CURRENT_YEAR),
    getTests(id),
    getNotifications(id),
    getAcademyRoles(id),
  ]);

  return (
    <Workspace
      academy={academy as Academy}
      initialClasses={classes}
      initialSubjects={subjects}
      initialStudents={students}
      initialFees={fees}
      initialTests={tests}
      initialNotifications={notifications}
      roles={roles}
      month={CURRENT_MONTH}
      year={CURRENT_YEAR}
    />
  );
}
