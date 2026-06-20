"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Users, BookOpen, CalendarCheck, Wallet,
  FileSpreadsheet, Bell, ShieldAlert, Hash,
} from "lucide-react";
import type {
  Academy, ClassRow, SubjectRow, Student, FeeRecord, TestRow, NotificationRow, AcademyRole,
} from "@/lib/queries/types";
import { shortId } from "@/lib/format";
import StudentsModule from "@/components/workspace/StudentsModule";
import ClassesModule from "@/components/workspace/ClassesModule";
import AttendanceModule from "@/components/workspace/AttendanceModule";
import FeesModule from "@/components/workspace/FeesModule";
import TestsModule from "@/components/workspace/TestsModule";
import NotificationsModule from "@/components/workspace/NotificationsModule";
import CredentialsModule from "@/components/workspace/CredentialsModule";

type Tab = "students" | "classes" | "attendance" | "fees" | "tests" | "notifications" | "credentials";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "students", label: "students", icon: Users },
  { id: "classes", label: "classes_subjects", icon: BookOpen },
  { id: "attendance", label: "attendance", icon: CalendarCheck },
  { id: "fees", label: "fee_records", icon: Wallet },
  { id: "tests", label: "tests_results", icon: FileSpreadsheet },
  { id: "notifications", label: "notifications", icon: Bell },
  { id: "credentials", label: "academy_roles", icon: ShieldAlert },
];

export default function Workspace({
  academy, initialClasses, initialSubjects, initialStudents, initialFees,
  initialTests, initialNotifications, roles, month, year,
}: {
  academy: Academy;
  initialClasses: ClassRow[];
  initialSubjects: SubjectRow[];
  initialStudents: Student[];
  initialFees: FeeRecord[];
  initialTests: TestRow[];
  initialNotifications: NotificationRow[];
  roles: AcademyRole[];
  month: number;
  year: number;
}) {
  const [tab, setTab] = useState<Tab>("students");
  const [classes, setClasses] = useState(initialClasses);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [students, setStudents] = useState(initialStudents);
  const [fees, setFees] = useState(initialFees);
  const [tests, setTests] = useState(initialTests);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unresolvedCount = notifications.filter((n) => !n.is_resolved).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--base)" }}>
      {/* ── Context banner ── */}
      <div className="imp-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="mono"
            style={{
              padding: "3px 9px", borderRadius: "var(--r-sm)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.05em", textTransform: "uppercase",
              background: "rgba(139,143,255,0.14)", color: "var(--vio)",
              border: "1px solid rgba(139,143,255,0.3)",
            }}
          >
            full access
          </div>
          <span style={{ fontSize: 12.5, color: "var(--t2)" }}>
            operating directly on <strong style={{ color: "var(--t1)", fontWeight: 700 }}>{academy.name}</strong>&apos;s live data — every action writes to the same Supabase project the academy&apos;s own admin uses
          </span>
          <span className={`badge badge-${academy.status}`}>{academy.status}</span>
        </div>
        <Link href="/dashboard/academies" className="btn btn-ghost btn-sm">
          <ChevronLeft size={12} /> exit workspace
        </Link>
      </div>

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="label mono" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Hash size={10} /> academies / {shortId(academy.id)}
            </div>
            <h2 className="heading">{academy.name}</h2>
            <p className="body mono" style={{ marginTop: 5, fontSize: 11.5 }}>
              academy_id = <span style={{ color: "var(--acc)" }}>&apos;{academy.id}&apos;</span> · {academy.city}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "students.active", val: students.filter((s) => s.status === "active").length },
              { label: "classes", val: classes.length },
              { label: "fee_records.unpaid", val: fees.filter((f) => f.status === "unpaid").length },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: "10px 16px" }}>
                <div className="data" style={{ fontSize: 18, fontWeight: 700, color: "var(--acc)" }}>{s.val}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--t3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid var(--line)", padding: "0 18px", display: "flex", gap: 2, overflowX: "auto" }}>
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="mono"
                  style={{
                    padding: "12px 13px 11px", fontSize: 12, fontWeight: active ? 700 : 500,
                    color: active ? "var(--acc)" : "var(--t3)",
                    borderBottom: active ? "2px solid var(--acc)" : "2px solid transparent",
                    cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.12s",
                    background: "none", border: "none", borderBottomWidth: 2,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <Icon size={12} /> {t.label}
                  {t.id === "notifications" && unresolvedCount > 0 && (
                    <span style={{
                      background: "var(--red)", color: "#fff", borderRadius: 8,
                      fontSize: 9, padding: "1px 5px", fontWeight: 700,
                    }}>{unresolvedCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ padding: 22 }}>
            {tab === "students" && (
              <StudentsModule academyId={academy.id} classes={classes} students={students} setStudents={setStudents} />
            )}
            {tab === "classes" && (
              <ClassesModule academyId={academy.id} classes={classes} subjects={subjects} setClasses={setClasses} setSubjects={setSubjects} />
            )}
            {tab === "attendance" && (
              <AttendanceModule academyId={academy.id} classes={classes} students={students} />
            )}
            {tab === "fees" && (
              <FeesModule academyId={academy.id} students={students} fees={fees} setFees={setFees} month={month} year={year} />
            )}
            {tab === "tests" && (
              <TestsModule academyId={academy.id} classes={classes} subjects={subjects} students={students} tests={tests} setTests={setTests} />
            )}
            {tab === "notifications" && (
              <NotificationsModule notifications={notifications} setNotifications={setNotifications} />
            )}
            {tab === "credentials" && (
              <CredentialsModule academyId={academy.id} initialRoles={roles} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
