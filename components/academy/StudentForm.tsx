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

  const [classId, setClassId] = useState(
    existing?.classId ?? defaultClassId ?? dataset.classes[0]?.id ?? "",
  );
  const [name, setName] = useState(existing?.name ?? "");
  const [fatherName, setFatherName] = useState(existing?.fatherName ?? "");
  const [rollNumber, setRollNumber] = useState<number>(
    existing?.rollNumber ??
      (() => {
        const inClass = dataset.students.filter(
          (s) => s.classId === (defaultClassId ?? dataset.classes[0]?.id),
        );
        return inClass.length > 0
          ? Math.max(...inClass.map((s) => s.rollNumber)) + 1
          : 1;
      })(),
  );
  const [monthlyFee, setMonthlyFee] = useState<string>(
    existing?.monthlyFee?.toString() ?? "",
  );
  const [admissionDate, setAdmissionDate] = useState(
    existing?.admissionDate ?? new Date().toISOString().slice(0, 10),
  );
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [teacherRemarks, setTeacherRemarks] = useState(
    existing?.teacherRemarks ?? "",
  );
  const [status, setStatus] = useState<Student["status"]>(
    existing?.status ?? "active",
  );
  const [rollError, setRollError] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    if (mode === "add") {
      const inClass = dataset.students.filter((s) => s.classId === newClassId);
      setRollNumber(
        inClass.length > 0
          ? Math.max(...inClass.map((s) => s.rollNumber)) + 1
          : 1,
      );
    }
  };

  const validateRoll = (val: number, cId: string) => {
    const conflict = dataset.students.some(
      (s) => s.classId === cId && s.rollNumber === val && s.id !== existing?.id,
    );
    setRollError(
      conflict ? `Roll number ${val} is already assigned in this class` : "",
    );
    return !conflict;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRoll(rollNumber, classId)) return;

    setSaving(true);
    setApiError("");

    try {
      if (mode === "add") {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to add student");
        }
        const newStudent: Student = await res.json();
        setDataset((d) => ({ ...d, students: [...d.students, newStudent] }));
        router.push(`/academy/${academy.id}/students`);
      } else if (existing) {
        const res = await fetch(`/api/students/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to update student");
        }
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
              : s,
          ),
        }));
        router.push(`/academy/${academy.id}/students/${existing.id}`);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {apiError && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <div>
        <Label htmlFor="classId">Class</Label>
        <Select
          id="classId"
          value={classId}
          onChange={(e) => handleClassChange(e.target.value)}
          required
        >
          {dataset.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {classLabel(c.name, c.section)}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student's full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="fatherName">Father's name</Label>
        <Input
          id="fatherName"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          placeholder="Father's name (optional)"
        />
      </div>

      <div>
        <Label htmlFor="rollNumber">Roll number</Label>
        <Input
          id="rollNumber"
          type="number"
          min={1}
          value={rollNumber}
          onChange={(e) => {
            const v = Number(e.target.value);
            setRollNumber(v);
            validateRoll(v, classId);
          }}
          required
        />
        {rollError && <p className="mt-1 text-xs text-red-400">{rollError}</p>}
      </div>

      <div>
        <Label htmlFor="monthlyFee">Monthly fee (PKR)</Label>
        <Input
          id="monthlyFee"
          type="number"
          min={0}
          value={monthlyFee}
          onChange={(e) => setMonthlyFee(e.target.value)}
          placeholder="Leave blank if not set"
        />
      </div>

      <div>
        <Label htmlFor="admissionDate">Admission date</Label>
        <Input
          id="admissionDate"
          type="date"
          value={admissionDate}
          onChange={(e) => setAdmissionDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number (optional)"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (optional)"
        />
      </div>

      <div>
        <Label htmlFor="teacherRemarks">Remarks</Label>
        <Textarea
          id="teacherRemarks"
          value={teacherRemarks}
          onChange={(e) => setTeacherRemarks(e.target.value)}
          placeholder="Teacher remarks (optional)"
          rows={3}
        />
      </div>

      {mode === "edit" && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Student["status"])}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      )}

      <Button type="submit" variant="primary" size="md" disabled={saving}>
        {saving ? "Saving…" : mode === "add" ? "Add student" : "Save changes"}
      </Button>
    </form>
  );
}
