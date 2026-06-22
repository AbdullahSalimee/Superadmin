"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { AlertTriangle } from "lucide-react";
import type { Academy } from "@/types";

export function DeleteAcademyModal({
  academy,
  open,
  onClose,
  onConfirm,
}: {
  academy: Academy;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const match = typed.trim() === academy.name;

  return (
    <Modal open={open} onClose={onClose} title="Delete academy">
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
        <p className="text-xs text-red-300">
          This soft-deletes <strong>{academy.name}</strong> — it will be hidden from the academy
          list and excluded from all platform totals, but its data is retained, not permanently
          erased.
        </p>
      </div>
      <Label htmlFor="confirm-name">
        Type <span className="text-[var(--text)] font-medium">{academy.name}</span> to confirm
      </Label>
      <Input
        id="confirm-name"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder={academy.name}
        autoComplete="off"
      />
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={!match}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete academy
        </Button>
      </div>
    </Modal>
  );
}
