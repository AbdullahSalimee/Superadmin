export const shortId = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`;

export const fmtRs = (n: number) =>
  n >= 1_000_000 ? `Rs ${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `Rs ${(n / 1_000).toFixed(0)}K` : `Rs ${n}`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
