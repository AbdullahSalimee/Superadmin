import type { Academy } from "@/types";

export async function fetchAcademies(): Promise<Academy[]> {
  const res = await fetch("/api/academies");
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Failed to fetch academies");
  return res.json();
}

export async function createAcademy(
  data: Omit<Academy, "id" | "createdAt">,
): Promise<Academy> {
  const res = await fetch("/api/academies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Failed to create academy");
  return res.json();
}

export async function updateAcademy(
  id: string,
  updates: Partial<
    Pick<Academy, "name" | "status" | "contactName" | "contactPhone">
  >,
): Promise<void> {
  const res = await fetch(`/api/academies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Failed to update academy");
}

export async function updateAcademyPasswords(
  id: string,
  updates: { adminPassword?: string; teacherPassword?: string },
): Promise<void> {
  const res = await fetch(`/api/academies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Failed to update passwords");
}

export async function deleteAcademy(id: string): Promise<void> {
  const res = await fetch(`/api/academies/${id}`, { method: "DELETE" });
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Failed to delete academy");
}
