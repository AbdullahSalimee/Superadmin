"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, RefreshCw, Check } from "lucide-react";
import type { Academy } from "@/types";

function PasswordRow({
  roleLabel,
  password,
  onReset,
}: {
  roleLabel: string;
  password: string;
  onReset: (newPw: string) => void;
}) {
  const [reveal, setReveal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  return (
    <div className="rounded-lg border border-[var(--border-hover)] bg-[var(--surface-2)] p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-dim)]">{roleLabel} password</span>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" /> Reset
          </span>
        )}
      </div>

      {!resetting ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <code className="mono text-sm text-[var(--text)]">
            {reveal ? password : "•".repeat(Math.max(password.length, 8))}
          </code>
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => setReveal((v) => !v)}>
              {reveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {reveal ? "Hide" : "Reveal"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setResetting(true)}>
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <Input
            autoFocus
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="h-8 text-sm"
          />
          <Button
            size="sm"
            variant="primary"
            disabled={newPw.length < 4}
            onClick={() => {
              onReset(newPw);
              setResetting(false);
              setNewPw("");
              setJustSaved(true);
              setTimeout(() => setJustSaved(false), 2000);
            }}
          >
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setResetting(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export function ManageAdminsModal({
  academy,
  open,
  onClose,
  onUpdatePasswords,
}: {
  academy: Academy;
  open: boolean;
  onClose: () => void;
  onUpdatePasswords: (updates: { adminPassword?: string; teacherPassword?: string }) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={`Manage admins — ${academy.name}`}>
      <p className="mb-4 text-xs text-[var(--text-faint)]">
        Resetting a password immediately invalidates the old one for future logins at this academy.
        This screen is platform-only and isn&apos;t reachable from inside the academy.
      </p>
      <div className="space-y-3">
        <PasswordRow
          roleLabel="Admin"
          password={academy.adminPassword}
          onReset={(pw) => onUpdatePasswords({ adminPassword: pw })}
        />
        <PasswordRow
          roleLabel="Teacher"
          password={academy.teacherPassword}
          onReset={(pw) => onUpdatePasswords({ teacherPassword: pw })}
        />
      </div>
      <div className="mt-5 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
