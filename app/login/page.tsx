"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, GraduationCap, UserCog } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Role = "super_admin" | "admin" | "teacher";

const ROLES: { id: Role; label: string; icon: typeof ShieldCheck }[] = [
  { id: "super_admin", label: "Super Admin", icon: ShieldCheck },
  { id: "admin", label: "Admin", icon: UserCog },
  { id: "teacher", label: "Teacher", icon: GraduationCap },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("super_admin");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <ShieldCheck className="h-5 w-5 text-black" strokeWidth={2} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">
            Academy Management Platform
          </h1>
          <p className="mt-1 text-sm text-[var(--text-faint)]">Sign in to continue</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-5 grid grid-cols-3 gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-1">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium transition-colors cursor-pointer",
                  role === r.id
                    ? "bg-white text-black"
                    : "text-[var(--text-faint)] hover:text-[var(--text-dim)]"
                )}
              >
                <r.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {r.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Sign in as {ROLES.find((r) => r.id === role)?.label}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--text-faint)]">
          Demo build — any password signs you in.
        </p>
      </div>
    </div>
  );
}
