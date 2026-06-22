"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ClipboardList, ArrowRight } from "lucide-react";
import { AcademyPageHeader } from "@/components/academy/AcademyPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel, formatDate } from "@/lib/utils";
import type { Test } from "@/types";

export default function TestsPage() {
  const { academy, dataset, setDataset } = useAcademyData();
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const [name, setName] = useState("");
  const [classId, setClassId] = useState(dataset.classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(dataset.subjects[0]?.id ?? "");
  const [date, setDate] = useState("2026-06-20");
  const [totalMarks, setTotalMarks] = useState("20");

  const sortedTests = [...dataset.tests].sort((a, b) => b.date.localeCompare(a.date));

  const entryProgress = (test: Test) => {
    const classCount = dataset.students.filter((s) => s.classId === test.classId && s.status === "active").length;
    const entered = dataset.testResults.filter((r) => r.testId === test.id).length;
    return `${entered}/${classCount}`;
  };

  const createTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Test = {
      id: `${academy.id}-test-${Date.now()}`,
      academyId: academy.id,
      classId,
      subjectId,
      name,
      date,
      totalMarks: Number(totalMarks),
    };
    setDataset((d) => ({ ...d, tests: [...d.tests, newTest] }));
    setCreateOpen(false);
    setName("");
    router.push(`/academy/${academy.id}/tests/${newTest.id}`);
  };

  return (
    <div>
      <AcademyPageHeader
        title="Tests"
        subtitle={`${dataset.tests.length} tests created`}
        action={
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Create Test
          </Button>
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          {sortedTests.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={ClipboardList} title="No tests yet" description="Create your first test to get started." />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {sortedTests.map((test) => {
                const cls = dataset.classes.find((c) => c.id === test.classId);
                const subject = dataset.subjects.find((s) => s.id === test.subjectId);
                return (
                  <div key={test.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{test.name}</p>
                      <p className="text-xs text-[var(--text-faint)]">
                        {subject?.name} · {cls ? classLabel(cls.name, cls.section) : "—"} · {formatDate(test.date)} · {test.totalMarks} marks
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-faint)]">{entryProgress(test)} entered</span>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/academy/${academy.id}/tests/${test.id}`)}>
                        Enter Marks <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create test">
        <form onSubmit={createTest} className="space-y-4">
          <div>
            <Label htmlFor="t-name">Test name</Label>
            <Input id="t-name" placeholder="e.g. T1, Chapter 11" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="t-class">Class</Label>
              <Select id="t-class" value={classId} onChange={(e) => setClassId(e.target.value)} required>
                {dataset.classes.map((c) => (
                  <option key={c.id} value={c.id}>{classLabel(c.name, c.section)}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="t-subject">Subject</Label>
              <Select id="t-subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                {dataset.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="t-date">Date</Label>
              <Input id="t-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="t-marks">Total marks</Label>
              <Input id="t-marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
