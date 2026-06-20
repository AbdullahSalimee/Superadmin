// ════════════════════════════════════════════════════════════════
// Dummy data — shaped to match the live Supabase/Postgres schema
// (see project `supabase` schema dump). Field names, types, and
// relations mirror the real tables 1:1 so this swaps for live
// queries with no UI changes.
// ════════════════════════════════════════════════════════════════

export type AcademyStatus = 'active' | 'trial' | 'suspended';
export type StaffRole = 'admin' | 'teacher';

// ─── academies ─────────────────────────────────────────────────
export interface Academy {
  id: string;               // uuid
  name: string;
  logo_url: string | null;
  logo_updated_at: string | null;
  created_at: string;       // timestamptz
  // platform-only fields (SA addendum SA.6.1, not in base schema yet)
  status: AcademyStatus;
  contact_name: string | null;
  contact_phone: string | null;
  city: string;
  updated_at: string;
}

// ─── academy_roles — one row per (academy_id, role), holds the
// shared password_hash for that role at that academy ───────────
export interface AcademyRole {
  id: string;          // uuid
  academy_id: string;  // fk -> academies.id
  role: StaffRole;
  password_hash: string;
  created_at: string;
}

// ─── session_logs — login activity per academy/role ────────────
export interface SessionLog {
  id: string;
  academy_id: string;
  role: StaffRole | 'super_admin';
  ip_address: string | null;
  logged_in_at: string;
  is_active: boolean;
}

// ─── classes ─────────────────────────────────────────────────
export interface ClassRow {
  id: string;
  academy_id: string;
  name: string;
  section: string | null;
  created_at: string;
}

// ─── subjects ────────────────────────────────────────────────
export interface SubjectRow {
  id: string;
  academy_id: string;
  name: string;
  created_at: string;
}

// ─── students (counts only, aggregated per academy for this console) ─
export interface StudentAgg {
  academy_id: string;
  active_count: number;
  inactive_count: number;
}

// ─── fee_records (aggregated current-month rollup per academy) ─
export interface FeeAgg {
  academy_id: string;
  month: number;
  year: number;
  collected: number;   // sum(amount_due) where status='paid'
  due: number;          // sum(amount_due) where status='unpaid'
}

export const PALETTES = [
  ['#00E599', '#00A36C'],
  ['#8B8FFF', '#5B5FD9'],
  ['#3DC4E8', '#1E8FB3'],
  ['#E8A33D', '#B97A1F'],
  ['#F2495C', '#C12E40'],
  ['#C9A8FF', '#9A6FE0'],
];

export const SA_PASSWORD = 'superadmin123';

// current operating month for "this month" rollups, kept in sync
// with system date the way the real fee-rollover job would resolve it
export const CURRENT_MONTH = 6;  // June
export const CURRENT_YEAR = 2026;

// ─── academies ─────────────────────────────────────────────────
export const ACADEMIES: Academy[] = [
  {
    id: 'a1f3c9e2-4b8d-4a1c-9e2f-1d6c8b3a7f01',
    name: 'Scholars Hub', logo_url: null, logo_updated_at: null,
    created_at: '2023-08-10T06:12:00Z', status: 'active',
    contact_name: 'Fatima Malik', contact_phone: '0321-1122334',
    city: 'Lahore', updated_at: '2026-05-02T11:04:00Z',
  },
  {
    id: 'b27e4d81-9c3a-4f6e-8b1d-2a9f7c5e4b02',
    name: 'Superior Academy', logo_url: null, logo_updated_at: null,
    created_at: '2024-01-15T09:30:00Z', status: 'active',
    contact_name: 'Dr. Imran Khan', contact_phone: '0300-1234567',
    city: 'Karachi', updated_at: '2026-06-11T14:22:00Z',
  },
  {
    id: 'c3a85f72-1d4e-4c9b-a3f8-5e2b9d6c1f03',
    name: 'Pinnacle Institute', logo_url: null, logo_updated_at: null,
    created_at: '2024-06-01T07:45:00Z', status: 'active',
    contact_name: 'Sana Baig', contact_phone: '0301-5544332',
    city: 'Islamabad', updated_at: '2026-04-28T08:50:00Z',
  },
  {
    id: 'd49f6a13-8e2c-4b7d-9f1a-6c3d8e5f2a04',
    name: 'Beacon Institute', logo_url: null, logo_updated_at: null,
    created_at: '2024-03-02T10:15:00Z', status: 'active',
    contact_name: 'Maryam Siddiqui', contact_phone: '0312-9876543',
    city: 'Lahore', updated_at: '2026-05-19T16:08:00Z',
  },
  {
    id: 'e5b07c24-3f9d-4a8e-b2c6-7d4e9f0a3b05',
    name: 'Horizon Academy', logo_url: null, logo_updated_at: null,
    created_at: '2025-05-20T12:00:00Z', status: 'trial',
    contact_name: 'Ahmed Raza', contact_phone: '0333-4567890',
    city: 'Peshawar', updated_at: '2026-06-01T09:00:00Z',
  },
  {
    id: 'f6c18d35-4a0e-4b9f-c3d7-8e5f0a1b4c06',
    name: 'Roots Academy', logo_url: null, logo_updated_at: null,
    created_at: '2023-11-22T05:40:00Z', status: 'suspended',
    contact_name: 'Tariq Hussain', contact_phone: '0345-9988776',
    city: 'Faisalabad', updated_at: '2026-03-14T13:30:00Z',
  },
];

// ─── academy_roles — 2 rows per academy (admin + teacher) ─────
export const ACADEMY_ROLES: AcademyRole[] = ACADEMIES.flatMap((a, i) => ([
  { id: `role-${a.id}-admin`, academy_id: a.id, role: 'admin' as const,
    password_hash: `$2b$10$${'a'.repeat(6)}${i}hashStub.fixedSaltDemo`,
    created_at: a.created_at },
  { id: `role-${a.id}-teacher`, academy_id: a.id, role: 'teacher' as const,
    password_hash: `$2b$10$${'t'.repeat(6)}${i}hashStub.fixedSaltDemo`,
    created_at: a.created_at },
]));

// ─── classes — a handful per academy ───────────────────────────
const CLASS_NAMES: [string, string | null][] = [
  ['9th', 'blue'], ['9th', 'red'], ['10th', 'blue'], ['10th', 'red'],
  ['Grade 5', 'A'], ['Grade 6', 'B'], ['O-Level', null], ['A-Level', null],
];
export const CLASSES: ClassRow[] = ACADEMIES.flatMap((a, ai) =>
  CLASS_NAMES.slice(0, 4 + (ai % 3)).map(([name, section], ci) => ({
    id: `class-${a.id}-${ci}`,
    academy_id: a.id,
    name, section,
    created_at: a.created_at,
  }))
);

// ─── subjects — global per academy ─────────────────────────────
const SUBJECT_NAMES = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science'];
export const SUBJECTS: SubjectRow[] = ACADEMIES.flatMap((a) =>
  SUBJECT_NAMES.map((name, si) => ({
    id: `subj-${a.id}-${si}`,
    academy_id: a.id,
    name,
    created_at: a.created_at,
  }))
);

// ─── student aggregates (per-academy counts) ───────────────────
export const STUDENT_AGGS: Record<string, StudentAgg> = {
  [ACADEMIES[0].id]: { academy_id: ACADEMIES[0].id, active_count: 420, inactive_count: 18 },
  [ACADEMIES[1].id]: { academy_id: ACADEMIES[1].id, active_count: 312, inactive_count: 9 },
  [ACADEMIES[2].id]: { academy_id: ACADEMIES[2].id, active_count: 256, inactive_count: 11 },
  [ACADEMIES[3].id]: { academy_id: ACADEMIES[3].id, active_count: 198, inactive_count: 6 },
  [ACADEMIES[4].id]: { academy_id: ACADEMIES[4].id, active_count: 54, inactive_count: 1 },
  [ACADEMIES[5].id]: { academy_id: ACADEMIES[5].id, active_count: 87, inactive_count: 14 },
};

// ─── fee aggregates (this month, per academy) ──────────────────
export const FEE_AGGS: Record<string, FeeAgg> = {
  [ACADEMIES[0].id]: { academy_id: ACADEMIES[0].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 1890000, due: 60000 },
  [ACADEMIES[1].id]: { academy_id: ACADEMIES[1].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 1042087, due: 40333 },
  [ACADEMIES[2].id]: { academy_id: ACADEMIES[2].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 896000, due: 32000 },
  [ACADEMIES[3].id]: { academy_id: ACADEMIES[3].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 742000, due: 28000 },
  [ACADEMIES[4].id]: { academy_id: ACADEMIES[4].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 0, due: 162000 },
  [ACADEMIES[5].id]: { academy_id: ACADEMIES[5].id, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 0, due: 261000 },
};

// ─── session_logs — recent login activity across the platform ──
export const SESSION_LOGS: SessionLog[] = [
  { id: 'sl-01', academy_id: ACADEMIES[1].id, role: 'admin', ip_address: '203.124.45.12', logged_in_at: '2026-06-20T08:14:22Z', is_active: true },
  { id: 'sl-02', academy_id: ACADEMIES[1].id, role: 'teacher', ip_address: '203.124.45.88', logged_in_at: '2026-06-20T07:52:09Z', is_active: true },
  { id: 'sl-03', academy_id: ACADEMIES[0].id, role: 'admin', ip_address: '39.45.12.201', logged_in_at: '2026-06-20T06:30:41Z', is_active: false },
  { id: 'sl-04', academy_id: ACADEMIES[2].id, role: 'teacher', ip_address: '182.180.9.44', logged_in_at: '2026-06-19T19:05:13Z', is_active: false },
  { id: 'sl-05', academy_id: ACADEMIES[3].id, role: 'admin', ip_address: '111.119.182.6', logged_in_at: '2026-06-19T15:48:02Z', is_active: false },
  { id: 'sl-06', academy_id: ACADEMIES[4].id, role: 'admin', ip_address: '101.50.66.130', logged_in_at: '2026-06-19T11:22:55Z', is_active: false },
  { id: 'sl-07', academy_id: ACADEMIES[1].id, role: 'admin', ip_address: '203.124.45.12', logged_in_at: '2026-06-19T08:09:30Z', is_active: false },
  { id: 'sl-08', academy_id: ACADEMIES[5].id, role: 'teacher', ip_address: '94.74.130.18', logged_in_at: '2026-06-12T10:00:00Z', is_active: false },
];

// ─── notifications — fee_not_set style alerts, platform view ───
export interface NotificationRow {
  id: string;
  academy_id: string;
  type: string;
  student_id: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
}
export const NOTIFICATIONS: NotificationRow[] = [
  { id: 'n1', academy_id: ACADEMIES[1].id, type: 'fee_not_set', student_id: 'stu-201', message: "New student 'Hassan Ali' added to 10th blue by Teacher — fee not set.", is_resolved: false, created_at: '2026-06-19T09:00:00Z' },
  { id: 'n2', academy_id: ACADEMIES[0].id, type: 'fee_not_set', student_id: 'stu-088', message: "New student 'Areeba Noor' added to Grade 6 B by Teacher — fee not set.", is_resolved: false, created_at: '2026-06-18T13:20:00Z' },
  { id: 'n3', academy_id: ACADEMIES[5].id, type: 'academy_suspended', student_id: null, message: 'Academy suspended — overdue platform license.', is_resolved: false, created_at: '2026-03-14T13:30:00Z' },
];

// ─── derived helpers (computed the way RLS-bypassed platform
// queries would compute them — kept here so pages stay thin) ───
export function studentsOf(academyId: string): StudentAgg {
  return STUDENT_AGGS[academyId] ?? { academy_id: academyId, active_count: 0, inactive_count: 0 };
}
export function feesOf(academyId: string): FeeAgg {
  return FEE_AGGS[academyId] ?? { academy_id: academyId, month: CURRENT_MONTH, year: CURRENT_YEAR, collected: 0, due: 0 };
}
export function rolesOf(academyId: string): AcademyRole[] {
  return ACADEMY_ROLES.filter(r => r.academy_id === academyId);
}
export function classesOf(academyId: string): ClassRow[] {
  return CLASSES.filter(c => c.academy_id === academyId);
}
export function staffCountOf(academyId: string): number {
  // v1 schema is shared-credential (1 admin "seat" + 1 teacher "seat"
  // per role row) — headcount here reflects distinct logged-in actors
  // seen in session_logs for that academy, which is what's actually
  // knowable from the schema as given.
  const seen = new Set(SESSION_LOGS.filter(s => s.academy_id === academyId).map(s => s.ip_address));
  return Math.max(seen.size, 1);
}

export const colorOf = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
};

export const shortId = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`;
