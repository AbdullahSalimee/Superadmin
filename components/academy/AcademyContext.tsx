"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  Academy,
  AcademyDataset,
  AttendanceRecord,
  FeeRecord,
  SchoolClass,
  Student,
  Subject,
  Test,
  TestResult,
  AppNotification,
} from "@/types";

interface AcademyContextValue {
  academy: Academy;
  dataset: AcademyDataset;
  setDataset: React.Dispatch<React.SetStateAction<AcademyDataset>>;
  refresh: () => Promise<void>;
  refreshing: boolean;
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
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/academy/${academy.id}/dataset`);
      if (!res.ok) return;
      const data: AcademyDataset = await res.json();
      setDataset(data);
    } finally {
      setRefreshing(false);
    }
  }, [academy.id]);

  const value = useMemo(
    () => ({ academy, dataset, setDataset, refresh, refreshing }),
    [academy, dataset, refresh, refreshing],
  );

  return (
    <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
  );
}

export function useAcademyData() {
  const ctx = useContext(AcademyContext);
  if (!ctx)
    throw new Error("useAcademyData must be used within AcademyProvider");
  return ctx;
}
