"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  LogIn,
  Pencil,
  KeyRound,
  Trash2,
  Users,
  GraduationCap,
  Building2,
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
import {
  fetchAcademies,
  createAcademy,
  updateAcademy,
  updateAcademyPasswords,
  deleteAcademy,
  fetchAcademyMetrics,
} from "@/lib/api/academies";
import { formatDate, formatPKR, initials } from "@/lib/utils";
import type { Academy, AcademyMetrics, AcademyStatus } from "@/types";

export function AcademyListLive({ title }: { title?: string }) {
  const router = useRouter();
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [metrics, setMetrics] = useState<Record<string, AcademyMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AcademyStatus | "all">(
    "all",
  );
  const [editTarget, setEditTarget] = useState<Academy | null>(null);
  const [adminsTarget, setAdminsTarget] = useState<Academy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Academy | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, metricsData] = await Promise.all([
        fetchAcademies(),
        fetchAcademyMetrics(),
      ]);
      setAcademies(data);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load academies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = academies;
    if (statusFilter !== "all")
      list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    return list;
  }, [academies, statusFilter, search]);

  const handleCreate = async (data: Omit<Academy, "id" | "createdAt">) => {
    setSaving(true);
    try {
      const created = await createAcademy(data);
      setAcademies((prev) => [created, ...prev]);
      toast("Academy created");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (updates: Partial<Academy>) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await updateAcademy(editTarget.id, updates);
      setAcademies((prev) =>
        prev.map((a) => (a.id === editTarget.id ? { ...a, ...updates } : a)),
      );
      toast("Academy updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
      setEditTarget(null);
    }
  };

  const handlePasswords = async (updates: {
    adminPassword?: string;
    teacherPassword?: string;
  }) => {
    if (!adminsTarget) return;
    setSaving(true);
    try {
      await updateAcademyPasswords(adminsTarget.id, updates);
      toast("Passwords updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteAcademy(deleteTarget.id);
      setAcademies((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast("Academy deleted");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-[var(--border-hover)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)] shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">
            {title ?? "Academies"}
          </h3>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setCreateOpen(true)}
            disabled={saving}
          >
            <Plus className="h-3.5 w-3.5" /> Add academy
          </Button>
        </div>

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
            onChange={(e) =>
              setStatusFilter(e.target.value as AcademyStatus | "all")
            }
            className="w-auto min-w-[130px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </Select>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </div>

        {error && (
          <div className="mx-5 mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error} —{" "}
            <button className="underline" onClick={load}>
              retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="px-5 pb-8 pt-4 text-center text-sm text-[var(--text-faint)]">
            Loading academies…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              icon={Building2}
              title="No academies found"
              description="Try adjusting your search or filters, or add a new academy."
            />
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {filtered.map((academy) => (
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
                      <p className="truncate text-sm font-medium text-[var(--text)]">
                        {academy.name}
                      </p>
                      <AcademyStatusBadge status={academy.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                      Created {formatDate(academy.createdAt)}
                      {academy.contactName ? ` · ${academy.contactName}` : ""}
                    </p>
                  </div>
                </div>

                <div
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                    <GraduationCap className="h-3.5 w-3.5 text-[var(--text-faint)]" />
                    {metrics[academy.id]?.activeStudents ?? 0} students
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                    <Users className="h-3.5 w-3.5 text-[var(--text-faint)]" />
                    {metrics[academy.id]?.staffCount ?? 0} staff
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--text-faint)]">Revenue </span>
                    <span className="font-medium text-[var(--text)]">
                      {formatPKR(metrics[academy.id]?.revenueThisMonth ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/academy/${academy.id}/dashboard`)
                      }
                    >
                      <LogIn className="h-3.5 w-3.5" /> Enter
                    </Button>
                    <KebabMenu
                      items={[
                        {
                          label: "Edit academy",
                          icon: Pencil,
                          onClick: () => setEditTarget(academy),
                        },
                        {
                          label: "Manage passwords",
                          icon: KeyRound,
                          onClick: () => setAdminsTarget(academy),
                        },
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
            ))}
          </div>
        )}

        {editTarget && (
          <EditAcademyModal
            academy={editTarget}
            open
            onClose={() => setEditTarget(null)}
            onSave={handleEdit}
          />
        )}
        {adminsTarget && (
          <ManageAdminsModal
            academy={adminsTarget}
            open
            onClose={() => setAdminsTarget(null)}
            onUpdatePasswords={handlePasswords}
          />
        )}
        {deleteTarget && (
          <DeleteAcademyModal
            academy={deleteTarget}
            open
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
        <CreateAcademyModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={async (data) => {
            setCreateOpen(false);
            await handleCreate(data);
          }}
        />
      </Card>
    </>
  );
}
