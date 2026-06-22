"use client";

import { useState } from "react";
import { Building2, UserPlus, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAcademyModal } from "@/components/superadmin/CreateAcademyModal";

export function QuickActionsClient() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreate = () => {
    // Demo: new academies created via Quick Actions route to the full Academies
    // page where the list (and its own create flow) lives with persistent local state.
    router.push("/academies");
  };

  const items = [
    { label: "Add Academy", icon: Building2, onClick: () => setCreateOpen(true) },
    { label: "Add Admin", icon: UserPlus, onClick: () => router.push("/academies") },
    { label: "View All Academies", icon: List, onClick: () => router.push("/academies") },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Quick actions</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {items.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] cursor-pointer"
          >
            <action.icon className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />
            {action.label}
          </button>
        ))}
      </div>
      <CreateAcademyModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
