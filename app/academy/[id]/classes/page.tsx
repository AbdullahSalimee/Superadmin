"use client";

import { useState } from "react";
import { Plus, Trash2, GraduationCap, BookOpen, Lightbulb } from "lucide-react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel } from "@/lib/utils";
import type { SchoolClass, Subject } from "@/types";

export default function ClassesSubjectsPage() {
  const { academy, dataset, setDataset } = useAcademyData();
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [deleteClassTarget, setDeleteClassTarget] =
    useState<SchoolClass | null>(null);
  const [deleteSubjectTarget, setDeleteSubjectTarget] =
    useState<Subject | null>(null);
  const [savingClass, setSavingClass] = useState(false);
  const [savingSubject, setSavingSubject] = useState(false);

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    setSavingClass(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academyId: academy.id,
          name: className.trim(),
          section: section.trim() || null,
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to add class");
      const newClass: SchoolClass = await res.json();
      setDataset((d) => ({ ...d, classes: [...d.classes, newClass] }));
      setClassName("");
      setSection("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add class");
    } finally {
      setSavingClass(false);
    }
  };

  const addSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    setSavingSubject(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academyId: academy.id,
          name: subjectName.trim(),
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to add subject");
      const newSubject: Subject = await res.json();
      setDataset((d) => ({ ...d, subjects: [...d.subjects, newSubject] }));
      setSubjectName("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add subject");
    } finally {
      setSavingSubject(false);
    }
  };

  const classHasRecords = (classId: string) =>
    dataset.students.some((s) => s.classId === classId) ||
    dataset.attendance.some((a) => a.classId === classId) ||
    dataset.tests.some((t) => t.classId === classId);

  const confirmDeleteClass = async () => {
    if (!deleteClassTarget) return;
    try {
      const res = await fetch("/api/classes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteClassTarget.id }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to delete class");
      setDataset((d) => ({
        ...d,
        classes: d.classes.filter((c) => c.id !== deleteClassTarget.id),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete class");
    } finally {
      setDeleteClassTarget(null);
    }
  };

  const confirmDeleteSubject = async () => {
    if (!deleteSubjectTarget) return;
    try {
      const res = await fetch("/api/subjects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteSubjectTarget.id }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to delete subject");
      setDataset((d) => ({
        ...d,
        subjects: d.subjects.filter((s) => s.id !== deleteSubjectTarget.id),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete subject");
    } finally {
      setDeleteSubjectTarget(null);
    }
  };

  return (
    <div>
      <AcademyPageHeader
        title="Classes & Subjects"
        subtitle="Feeds every dropdown elsewhere in the app"
      />

      <div className="grid grid-cols-1 gap-5 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader
            title="Classes"
            subtitle={`${dataset.classes.length} classes`}
          />
          <form
            onSubmit={addClass}
            className="flex flex-wrap items-end gap-2 px-5 pb-4"
          >
            <div className="flex-1 min-w-[120px]">
              <Input
                placeholder="Class name (e.g. 10th)"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <Input
                placeholder="Section (optional)"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={savingClass}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>

          {dataset.classes.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState
                icon={GraduationCap}
                title="No classes yet"
                description="Add your first class above."
              />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {dataset.classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-[var(--text)]">
                    {classLabel(c.name, c.section)}
                  </span>
                  <button
                    onClick={() => setDeleteClassTarget(c)}
                    className="text-[var(--text-faint)] hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Subjects"
            subtitle={`${dataset.subjects.length} subjects · global across academy`}
          />
          <form
            onSubmit={addSubject}
            className="flex items-end gap-2 px-5 pb-4"
          >
            <div className="flex-1">
              <Input
                placeholder="Subject name (e.g. Mathematics)"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={savingSubject}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>

          {dataset.subjects.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState
                icon={BookOpen}
                title="No subjects yet"
                description="Add your first subject above."
              />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {dataset.subjects.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-[var(--text)]">{s.name}</span>
                  <button
                    onClick={() => setDeleteSubjectTarget(s)}
                    className="text-[var(--text-faint)] hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Delete class confirmation */}
      <Modal
        open={!!deleteClassTarget}
        onClose={() => setDeleteClassTarget(null)}
        title="Delete class"
      >
        <div className="space-y-4">
          {deleteClassTarget && classHasRecords(deleteClassTarget.id) ? (
            <p className="text-sm text-[var(--text-dim)]">
              <strong>
                {classLabel(deleteClassTarget.name, deleteClassTarget.section)}
              </strong>{" "}
              has students, attendance, or tests linked to it. Remove those
              first before deleting the class.
            </p>
          ) : (
            <p className="text-sm text-[var(--text-dim)]">
              Delete{" "}
              <strong>
                {deleteClassTarget &&
                  classLabel(deleteClassTarget.name, deleteClassTarget.section)}
              </strong>
              ? This cannot be undone.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteClassTarget(null)}
            >
              Cancel
            </Button>
            {deleteClassTarget && !classHasRecords(deleteClassTarget.id) && (
              <Button variant="danger" size="sm" onClick={confirmDeleteClass}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete subject confirmation */}
      <Modal
        open={!!deleteSubjectTarget}
        onClose={() => setDeleteSubjectTarget(null)}
        title="Delete subject"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-dim)]">
            Delete <strong>{deleteSubjectTarget?.name}</strong>? This cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteSubjectTarget(null)}
            >
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDeleteSubject}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div className="mx-auto max-w-xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-faint)]" />
            <p className="text-xs text-[var(--text-faint)]">
              Classes and subjects added here are immediately available in
              Students, Attendance, Fees, and Tests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
