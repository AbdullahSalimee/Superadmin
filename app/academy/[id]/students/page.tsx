"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, RotateCcw, Users } from "lucide-react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentRow } from "@/components/academy/StudentRow";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel } from "@/lib/utils";
import type { StudentStatus } from "@/types";

export default function StudentsPage() {
  const { academy, dataset } = useAcademyData();
  const router = useRouter();

  const [classId, setClassId] = useState(dataset.classes[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("active");

  const reset = () => {
    setClassId(dataset.classes[0]?.id ?? "");
    setSearch("");
    setStatusFilter("active");
  };

  const filtered = useMemo(() => {
    let list = dataset.students.filter((s) => s.classId === classId);
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.rollNumber - b.rollNumber);
  }, [dataset.students, classId, statusFilter, search]);

  return (
    <div>
      <AcademyPageHeader
        title="Students"
        subtitle={`${filtered.length} ${statusFilter === "all" ? "" : statusFilter} students`}
        action={
          <Button variant="primary" size="sm" onClick={() => router.push(`/academy/${academy.id}/students/new?classId=${classId}`)}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="flex flex-wrap items-center gap-2 p-5 pb-4">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-faint)]" />
              <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-auto min-w-[140px]">
              {dataset.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {classLabel(c.name, c.section)}
                </option>
              ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StudentStatus | "all")}
              className="w-auto min-w-[110px]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </Select>
            <Button variant="ghost" size="md" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState
                icon={Users}
                title="No students found"
                description="Try a different class, adjust filters, or add a new student."
              />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {filtered.map((s) => (
                <StudentRow key={s.id} student={s} academyId={academy.id} feeRecords={dataset.feeRecords} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
