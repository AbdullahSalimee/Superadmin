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
  const [deleteClassTarget, setDeleteClassTarget] = useState<SchoolClass | null>(null);
  const [deleteSubjectTarget, setDeleteSubjectTarget] = useState<Subject | null>(null);

  const addClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    const newClass: SchoolClass = {
      id: `${academy.id}-class-${Date.now()}`,
      academyId: academy.id,
      name: className.trim(),
      section: section.trim() || null,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDataset((d) => ({ ...d, classes: [...d.classes, newClass] }));
    setClassName("");
    setSection("");
  };

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    const newSubject: Subject = {
      id: `${academy.id}-subject-${Date.now()}`,
      academyId: academy.id,
      name: subjectName.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDataset((d) => ({ ...d, subjects: [...d.subjects, newSubject] }));
    setSubjectName("");
  };

  const classHasRecords = (classId: string) =>
    dataset.students.some((s) => s.classId === classId) ||
    dataset.attendance.some((a) => a.classId === classId) ||
    dataset.tests.some((t) => t.classId === classId);

  const confirmDeleteClass = () => {
    if (!deleteClassTarget) return;
    setDataset((d) => ({ ...d, classes: d.classes.filter((c) => c.id !== deleteClassTarget.id) }));
    setDeleteClassTarget(null);
  };

  const confirmDeleteSubject = () => {
    if (!deleteSubjectTarget) return;
    setDataset((d) => ({ ...d, subjects: d.subjects.filter((s) => s.id !== deleteSubjectTarget.id) }));
    setDeleteSubjectTarget(null);
  };

  return (
    <div>
      <AcademyPageHeader title="Classes & Subjects" subtitle="Feeds every dropdown elsewhere in the app" />

      <div className="grid grid-cols-1 gap-5 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader title="Classes" subtitle={`${dataset.classes.length} classes`} />
          <form onSubmit={addClass} className="flex flex-wrap items-end gap-2 px-5 pb-4">
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
            <Button type="submit" variant="primary" size="md">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>

          {dataset.classes.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState icon={GraduationCap} title="No classes yet" description="Add your first class above." />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {dataset.classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-[var(--text)]">{classLabel(c.name, c.section)}</span>
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
          <CardHeader title="Subjects" subtitle={`${dataset.subjects.length} subjects · global across academy`} />
          <form onSubmit={addSubject} className="flex items-end gap-2 px-5 pb-4">
            <div className="flex-1">
              <Input
                placeholder="Subject name (e.g. Mathematics)"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>

          {dataset.subjects.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState icon={BookOpen} title="No subjects yet" description="Add your first subject above." />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {dataset.subjects.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3">
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

        <Card className="lg:col-span-2">
          <div className="flex items-start gap-3 p-5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Getting started</p>
              <ol className="mt-2 space-y-1 text-xs text-[var(--text-faint)] list-decimal list-inside">
                <li>Create your classes first (e.g., &quot;Grade 5 A&quot;, &quot;Grade 6 B&quot;).</li>
                <li>Add subjects (e.g., Maths, English, Science).</li>
                <li>Go to Students and add students to each class.</li>
                <li>Fee records are generated automatically each month for active students — no manual step required.</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>

      {deleteClassTarget && (
        <Modal open onClose={() => setDeleteClassTarget(null)} title="Delete class">
          <p className="text-sm text-[var(--text-dim)]">
            {classHasRecords(deleteClassTarget.id) ? (
              <>
                <strong className="text-[var(--text)]">{classLabel(deleteClassTarget.name, deleteClassTarget.section)}</strong>{" "}
                has students, attendance, fee, or test records attached. Deleting it will remove access to that
                historical data. Are you sure?
              </>
            ) : (
              <>
                Delete <strong className="text-[var(--text)]">{classLabel(deleteClassTarget.name, deleteClassTarget.section)}</strong>?
                This class has no records attached.
              </>
            )}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteClassTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeleteClass}>Delete</Button>
          </div>
        </Modal>
      )}

      {deleteSubjectTarget && (
        <Modal open onClose={() => setDeleteSubjectTarget(null)} title="Delete subject">
          <p className="text-sm text-[var(--text-dim)]">
            Delete <strong className="text-[var(--text)]">{deleteSubjectTarget.name}</strong>? This may affect
            existing tests that reference this subject.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteSubjectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeleteSubject}>Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
