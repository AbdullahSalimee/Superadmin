"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, LogIn, Pencil, KeyRound, Trash2, Users, GraduationCap, Building2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { AcademyStatusBadge } from "@/components/superadmin/AcademyStatusBadge";
import { EditAcademyModal } from "@/components/superadmin/EditAcademyModal";
import { ManageAdminsModal } from "@/components/superadmin/ManageAdminsModal";
import { DeleteAcademyModal } from "@/components/superadmin/DeleteAcademyModal";
import { CreateAcademyModal } from "@/components/superadmin/CreateAcademyModal";
import { formatDate, formatPKR, initials } from "@/lib/utils";
import type { Academy, AcademyMetrics, AcademyStatus } from "@/types";

interface Props {
  initialAcademies: Academy[];
  metricsById: Record<string, AcademyMetrics>;
  defaultStatusFilter?: AcademyStatus | "all";
  limit?: number;
  showAddButton?: boolean;
  showFilters?: boolean;
  title?: string;
}

export function AcademyList({
  initialAcademies,
  metricsById,
  defaultStatusFilter = "all",
  limit,
  showAddButton = true,
  showFilters = true,
  title,
}: Props) {
  const router = useRouter();
  const [academies, setAcademies] = useState(initialAcademies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AcademyStatus | "all">(defaultStatusFilter);

  const [editTarget, setEditTarget] = useState<Academy | null>(null);
  const [adminsTarget, setAdminsTarget] = useState<Academy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Academy | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = academies;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (limit) list = list.slice(0, limit);
    return list;
  }, [academies, statusFilter, search, limit]);

  const updateAcademy = (id: string, updates: Partial<Academy>) => {
    setAcademies((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAcademy = (id: string) => {
    setAcademies((prev) => prev.filter((a) => a.id !== id));
  };

  const createAcademy = (data: Omit<Academy, "id" | "createdAt">) => {
    const id = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const newAcademy: Academy = {
      ...data,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAcademies((prev) => [newAcademy, ...prev]);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">{title ?? "Academies"}</h3>
        {showAddButton && (
          <Button size="sm" variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add academy
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-faint)]" />
            <Input
              placeholder="Search academies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AcademyStatus | "all")}
            className="w-auto min-w-[130px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState
            icon={Building2}
            title="No academies found"
            description="Try adjusting your search or filters, or add a new academy to the platform."
          />
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {filtered.map((academy) => {
            const metrics = metricsById[academy.id];
            return (
              <div
                key={academy.id}
                className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]/40 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                onClick={() => router.push(`/academy/${academy.id}/dashboard`)}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-dim)]">
                    {initials(academy.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{academy.name}</p>
                      <AcademyStatusBadge status={academy.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                      Created {formatDate(academy.createdAt)}
                      {academy.contactName ? ` · ${academy.contactName}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                    <GraduationCap className="h-3.5 w-3.5 text-[var(--text-faint)]" />
                    {metrics?.activeStudents ?? 0} students
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                    <Users className="h-3.5 w-3.5 text-[var(--text-faint)]" />
                    {metrics?.staffCount ?? 0} staff
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--text-faint)]">Revenue </span>
                    <span className="font-medium text-[var(--text)]">
                      {formatPKR(metrics?.revenueThisMonth ?? 0)}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/academy/${academy.id}/dashboard`)}
                    >
                      <LogIn className="h-3.5 w-3.5" /> Enter
                    </Button>
                    <KebabMenu
                      items={[
                        { label: "Edit academy", icon: Pencil, onClick: () => setEditTarget(academy) },
                        { label: "Manage admins", icon: KeyRound, onClick: () => setAdminsTarget(academy) },
                        {
                          label: "Delete academy",
                          icon: Trash2,
                          danger: true,
                          onClick: () => setDeleteTarget(academy),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editTarget && (
        <EditAcademyModal
          academy={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(updates) => updateAcademy(editTarget.id, updates)}
        />
      )}
      {adminsTarget && (
        <ManageAdminsModal
          academy={adminsTarget}
          open={!!adminsTarget}
          onClose={() => setAdminsTarget(null)}
          onUpdatePasswords={(updates) => updateAcademy(adminsTarget.id, updates)}
        />
      )}
      {deleteTarget && (
        <DeleteAcademyModal
          academy={deleteTarget}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteAcademy(deleteTarget.id)}
        />
      )}
      <CreateAcademyModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createAcademy} />
    </Card>
  );
}
