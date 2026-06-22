"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Academy, AcademyDataset } from "@/types";

interface AcademyContextValue {
  academy: Academy;
  dataset: AcademyDataset;
  setDataset: React.Dispatch<React.SetStateAction<AcademyDataset>>;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export function AcademyProvider({
  academy,
  initialDataset,
  children,
}: {
  academy: Academy;
  initialDataset: AcademyDataset;
  children: React.ReactNode;
}) {
  const [dataset, setDataset] = useState(initialDataset);
  const value = useMemo(() => ({ academy, dataset, setDataset }), [academy, dataset]);
  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademyData() {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error("useAcademyData must be used within AcademyProvider");
  return ctx;
}
