"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAcademyData } from "@/components/academy/AcademyContext";
import { classLabel } from "@/lib/utils";
import type { Student } from "@/types";

export function StudentForm({
  mode,
  existing,
  defaultClassId,
}: {
  mode: "add" | "edit";
  existing?: Student;
  defaultClassId?: string;
}) {
  const router = useRouter();
  const { academy, dataset, setDataset } = useAcademyData();

  const [classId, setClassId] = useState(existing?.classId ?? defaultClassId ?? dataset.classes[0]?.id ?? "");
  const [name, setName] = useState(existing?.name ?? "");
  const [fatherName, setFatherName] = useState(existing?.fatherName ?? "");
  const [rollNumber, setRollNumber] = useState<number>(
    existing?.rollNumber ??
      (() => {
        const inClass = dataset.students.filter((s) => s.classId === (defaultClassId ?? dataset.classes[0]?.id));
        return inClass.length > 0 ? Math.max(...inClass.map((s) => s.rollNumber)) + 1 : 1;
      })()
  );
  const [monthlyFee, setMonthlyFee] = useState<string>(existing?.monthlyFee?.toString() ?? "");
  const [admissionDate, setAdmissionDate] = useState(existing?.admissionDate ?? new Date().toISOString().slice(0, 10));
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [teacherRemarks, setTeacherRemarks] = useState(existing?.teacherRemarks ?? "");
  const [status, setStatus] = useState<Student["status"]>(existing?.status ?? "active");
  const [rollError, setRollError] = useState("");

  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    if (mode === "add") {
      const inClass = dataset.students.filter((s) => s.classId === newClassId);
      setRollNumber(inClass.length > 0 ? Math.max(...inClass.map((s) => s.rollNumber)) + 1 : 1);
    }
  };

  const validateRoll = (val: number, cId: string) => {
    const conflict = dataset.students.some(
      (s) => s.classId === cId && s.rollNumber === val && s.id !== existing?.id
    );
    setRollError(conflict ? `Roll number ${val} is already assigned in this class` : "");
    return !conflict;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRoll(rollNumber, classId)) return;

    if (mode === "add") {
      const newStudent: Student = {
        id: `${academy.id}-student-${Date.now()}`,
        academyId: academy.id,
        classId,
        rollNumber,
        name,
        fatherName: fatherName || null,
        monthlyFee: monthlyFee ? Number(monthlyFee) : null,
        admissionDate,
        phone: phone || null,
        address: address || null,
        teacherRemarks: teacherRemarks || null,
        status: "active",
        addedByRole: "admin",
      };
      setDataset((d) => ({ ...d, students: [...d.students, newStudent] }));
      router.push(`/academy/${academy.id}/students`);
    } else if (existing) {
      setDataset((d) => ({
        ...d,
        students: d.students.map((s) =>
          s.id === existing.id
            ? {
                ...s,
                classId,
                rollNumber,
                name,
                fatherName: fatherName || null,
                monthlyFee: monthlyFee ? Number(monthlyFee) : null,
                admissionDate,
                phone: phone || null,
                address: address || null,
                teacherRemarks: teacherRemarks || null,
                status,
              }
            : s
        ),
      }));
      router.push(`/academy/${academy.id}/students/${existing.id}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sf-name">Student name</Label>
        <Input id="sf-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>

      <div>
        <Label htmlFor="sf-father">Father&apos;s name</Label>
        <Input id="sf-father" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sf-class">Class</Label>
          <Select id="sf-class" value={classId} onChange={(e) => handleClassChange(e.target.value)} required>
            {dataset.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {classLabel(c.name, c.section)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="sf-roll">Roll number</Label>
          <Input
            id="sf-roll"
            type="number"
            value={rollNumber}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRollNumber(val);
              validateRoll(val, classId);
            }}
            required
          />
          {rollError && <p className="mt-1 text-[11px] text-red-400">{rollError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sf-fee">Monthly fee (Rs.)</Label>
          <Input
            id="sf-fee"
            type="number"
            placeholder="Leave blank if unknown"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sf-admission">Admission date</Label>
          <Input
            id="sf-admission"
            type="date"
            value={admissionDate}
            onChange={(e) => setAdmissionDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sf-phone">Phone</Label>
        <Input id="sf-phone" type="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="sf-address">Address</Label>
        <Textarea id="sf-address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {mode === "edit" && (
        <>
          <div>
            <Label htmlFor="sf-remarks">Teacher remarks</Label>
            <Textarea id="sf-remarks" rows={2} value={teacherRemarks} onChange={(e) => setTeacherRemarks(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sf-status">Status</Label>
            <Select id="sf-status" value={status} onChange={(e) => setStatus(e.target.value as Student["status"])}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={!!rollError}>
          {mode === "add" ? "Admit Student" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
