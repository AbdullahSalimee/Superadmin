"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import type { Academy, AcademyStatus } from "@/types";

export function EditAcademyModal({
  academy,
  open,
  onClose,
  onSave,
}: {
  academy: Academy;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Academy>) => void;
}) {
  const [name, setName] = useState(academy.name);
  const [status, setStatus] = useState<AcademyStatus>(academy.status);
  const [contactName, setContactName] = useState(academy.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(academy.contactPhone ?? "");

  return (
    <Modal open={open} onClose={onClose} title="Edit academy">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, status, contactName, contactPhone });
          onClose();
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="ea-name">Academy name</Label>
          <Input id="ea-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="ea-status">Status</Label>
          <Select id="ea-status" value={status} onChange={(e) => setStatus(e.target.value as AcademyStatus)}>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </Select>
          {status === "suspended" && (
            <p className="mt-1.5 text-xs text-amber-400/90">
              Suspending blocks Admin/Teacher login at this academy without deleting any data.
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="ea-contact">Contact name</Label>
            <Input id="ea-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ea-phone">Contact phone</Label>
            <Input id="ea-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
