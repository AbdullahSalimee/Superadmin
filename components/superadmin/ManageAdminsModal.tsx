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
  const [showNew, setShowNew] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // If a bcrypt hash somehow got stored, treat as unknown and force reset
  const isBcrypt = password.startsWith("$2");
  const displayPw = isBcrypt ? "" : password;

  const handleSave = () => {
    onReset(newPw);
    setResetting(false);
    setNewPw("");
    setShowNew(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="rounded-lg border border-[var(--border-hover)] bg-[var(--surface-2)] p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-dim)]">
          {roleLabel} password
        </span>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" /> Updated
          </span>
        )}
      </div>

      {!resetting ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            {isBcrypt ? (
              <span className="text-sm text-amber-400 italic">
                Password hashed — use Reset to set a new one
              </span>
            ) : (
              <code className="mono text-sm text-[var(--text)]">
                {reveal ? displayPw : "•".repeat(Math.max(displayPw.length, 8))}
              </code>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            {!isBcrypt && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReveal((v) => !v)}
              >
                {reveal ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                {reveal ? "Hide" : "Reveal"}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResetting(true)}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Input
              autoFocus
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newPw.length >= 4) handleSave();
              }}
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
            >
              {showNew ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              disabled={newPw.length < 4}
              onClick={handleSave}
            >
              <Check className="h-3.5 w-3.5" /> Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setResetting(false);
                setNewPw("");
              }}
            >
              Cancel
            </Button>
          </div>
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
  onUpdatePasswords: (updates: {
    adminPassword?: string;
    teacherPassword?: string;
  }) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Manage admins — ${academy.name}`}
    >
      <p className="mb-4 text-xs text-[var(--text-faint)]">
        Resetting a password immediately invalidates the old one for future
        logins at this academy. This screen is platform-only and isn&apos;t
        reachable from inside the academy.
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
