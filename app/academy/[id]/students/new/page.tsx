"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { StudentForm } from "@/components/academy/StudentForm";

export default function AddStudentPage() {
  const { academy } = useAcademyData();
  const searchParams = useSearchParams();
  const defaultClassId = searchParams.get("classId") ?? undefined;

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <Link
          href={`/academy/${academy.id}/students`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">Add student</h1>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
        <StudentForm mode="add" defaultClassId={defaultClassId} />
      </div>
    </div>
  );
}
