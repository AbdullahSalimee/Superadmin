"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import type { Academy, AcademyStatus } from "@/types";

export function CreateAcademyModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (academy: Omit<Academy, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [status, setStatus] = useState<AcademyStatus>("active");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const reset = () => {
    setName("");
    setAdminPassword("");
    setTeacherPassword("");
    setStatus("active");
    setContactName("");
    setContactPhone("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add academy">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ name, adminPassword, teacherPassword, status, contactName, contactPhone });
          reset();
          onClose();
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="ca-name">Academy name</Label>
          <Input
            id="ca-name"
            placeholder="e.g. Superior Academy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">
            Shown on this academy&apos;s own login screen.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="ca-admin-pw">Admin password</Label>
            <Input
              id="ca-admin-pw"
              type="text"
              placeholder="Initial password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ca-teacher-pw">Teacher password</Label>
            <Input
              id="ca-teacher-pw"
              type="text"
              placeholder="Initial password"
              value={teacherPassword}
              onChange={(e) => setTeacherPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="ca-status">Status</Label>
          <Select id="ca-status" value={status} onChange={(e) => setStatus(e.target.value as AcademyStatus)}>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="ca-contact">Contact name</Label>
            <Input id="ca-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ca-phone">Contact phone</Label>
            <Input id="ca-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create academy
          </Button>
        </div>
      </form>
    </Modal>
  );
}
