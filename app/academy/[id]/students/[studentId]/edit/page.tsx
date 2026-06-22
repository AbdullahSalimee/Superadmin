"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { StudentForm } from "@/components/academy/StudentForm";

export default function EditStudentPage() {
  const { academy, dataset } = useAcademyData();
  const params = useParams<{ studentId: string }>();
  const student = dataset.students.find((s) => s.id === params.studentId);

  if (!student) {
    return (
      <div className="px-6 py-10 text-center text-sm text-[var(--text-faint)]">Student not found.</div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <Link
          href={`/academy/${academy.id}/students/${student.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">Edit student</h1>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
        <StudentForm mode="edit" existing={student} />
      </div>
    </div>
  );
}
