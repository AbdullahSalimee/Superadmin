import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ImpersonationBanner } from "@/components/academy/ImpersonationBanner";
import { AcademySidebar } from "@/components/academy/AcademySidebar";
import { AcademyMobileNav } from "@/components/academy/AcademyMobileNav";
import { AcademyProvider } from "@/components/academy/AcademyContext";
import type {
  Academy,
  AcademyDataset,
  SchoolClass,
  Subject,
  Student,
  AttendanceRecord,
  FeeRecord,
  Test,
  TestResult,
  AppNotification,
} from "@/types";

async function fetchAcademyData(
  id: string,
): Promise<{ academy: Academy; dataset: AcademyDataset } | null> {
  const [
    { data: ac },
    { data: classes },
    { data: subjects },
    { data: students },
    { data: attendance },
    { data: fees },
    { data: tests },
    { data: testResults },
    { data: notifications },
  ] = await Promise.all([
    supabaseAdmin
      .from("academies")
      .select("id,name,status,contact_name,contact_phone,created_at")
      .eq("id", id)
      .neq("status", "deleted")
      .single(),
    supabaseAdmin
      .from("classes")
      .select("id,academy_id,name,section,created_at")
      .eq("academy_id", id)
      .order("created_at"),
    supabaseAdmin
      .from("subjects")
      .select("id,academy_id,name,created_at")
      .eq("academy_id", id)
      .order("created_at"),
    supabaseAdmin
      .from("students")
      .select(
        "id,academy_id,class_id,roll_number,name,father_name,monthly_fee,admission_date,phone,address,teacher_remarks,status,added_by_role,created_at",
      )
      .eq("academy_id", id)
      .order("roll_number"),
    supabaseAdmin
      .from("attendance_records")
      .select("id,academy_id,student_id,class_id,date,status")
      .eq("academy_id", id),
    supabaseAdmin
      .from("fee_records")
      .select("id,academy_id,student_id,month,year,amount_due,status,paid_date")
      .eq("academy_id", id),
    supabaseAdmin
      .from("tests")
      .select(
        "id,academy_id,class_id,subject_id,name,date,total_marks,created_at",
      )
      .eq("academy_id", id)
      .order("date"),
    supabaseAdmin
      .from("test_results")
      .select("id,academy_id,test_id,student_id,marks_obtained,is_absent")
      .eq("academy_id", id),
    supabaseAdmin
      .from("notifications")
      .select("id,academy_id,type,student_id,message,is_resolved,created_at")
      .eq("academy_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!ac) return null;

  const academy: Academy = {
    id: ac.id,
    name: ac.name,
    status: ac.status,
    contactName: ac.contact_name ?? "",
    contactPhone: ac.contact_phone ?? "",
    createdAt: ac.created_at.slice(0, 10),
    adminPassword: "",
    teacherPassword: "",
  };

  const dataset: AcademyDataset = {
    classes: (classes ?? []).map(
      (c): SchoolClass => ({
        id: c.id,
        academyId: c.academy_id,
        name: c.name,
        section: c.section ?? null,
        createdAt: c.created_at,
      }),
    ),
    subjects: (subjects ?? []).map(
      (s): Subject => ({
        id: s.id,
        academyId: s.academy_id,
        name: s.name,
        createdAt: s.created_at,
      }),
    ),
    students: (students ?? []).map(
      (s): Student => ({
        id: s.id,
        academyId: s.academy_id,
        classId: s.class_id,
        rollNumber: s.roll_number,
        name: s.name,
        fatherName: s.father_name ?? null,
        monthlyFee: s.monthly_fee !== null ? Number(s.monthly_fee) : null,
        admissionDate: s.admission_date,
        phone: s.phone ?? null,
        address: s.address ?? null,
        teacherRemarks: s.teacher_remarks ?? null,
        status: s.status,
        addedByRole: s.added_by_role,
      }),
    ),
    attendance: (attendance ?? []).map(
      (a): AttendanceRecord => ({
        id: a.id,
        academyId: a.academy_id,
        studentId: a.student_id,
        classId: a.class_id,
        date: a.date,
        status: a.status,
      }),
    ),
    feeRecords: (fees ?? []).map(
      (f): FeeRecord => ({
        id: f.id,
        academyId: f.academy_id,
        studentId: f.student_id,
        month: f.month,
        year: f.year,
        amountDue: Number(f.amount_due),
        status: f.status,
        paidDate: f.paid_date ?? null,
      }),
    ),
    tests: (tests ?? []).map(
      (t): Test => ({
        id: t.id,
        academyId: t.academy_id,
        classId: t.class_id,
        subjectId: t.subject_id,
        name: t.name,
        date: t.date,
        totalMarks: Number(t.total_marks),
      }),
    ),
    testResults: (testResults ?? []).map(
      (r): TestResult => ({
        id: r.id,
        academyId: r.academy_id,
        testId: r.test_id,
        studentId: r.student_id,
        marksObtained:
          r.marks_obtained !== null ? Number(r.marks_obtained) : null,
        isAbsent: r.is_absent,
      }),
    ),
    notifications: (notifications ?? []).map(
      (n): AppNotification => ({
        id: n.id,
        academyId: n.academy_id,
        type: n.type,
        studentId: n.student_id ?? null,
        message: n.message,
        isResolved: n.is_resolved,
        createdAt: n.created_at,
      }),
    ),
  };

  return { academy, dataset };
}

export default async function AcademyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchAcademyData(id);
  if (!result) notFound();
  const { academy, dataset } = result;

  return (
    <AcademyProvider academy={academy} initialDataset={dataset}>
      <div className="flex min-h-screen flex-col bg-[var(--bg)]">
        <ImpersonationBanner academyName={academy.name} />
        <div className="flex flex-1">
          <AcademySidebar academyId={academy.id} academyName={academy.name} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
          </div>
        </div>
        <AcademyMobileNav academyId={academy.id} />
      </div>
    </AcademyProvider>
  );
}
