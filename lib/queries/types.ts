// Mirrors supabase_schema 1:1 — see /mnt/project/supabase_schema in the AMS project.

export type AcademyStatus = "active" | "trial" | "suspended" | "deleted";
export type StaffRole = "admin" | "teacher";
export type AttendanceStatus = "P" | "A" | "L";
export type FeeStatus = "paid" | "unpaid";

export interface Academy {
  id: string;
  name: string;
  logo_url: string | null;
  logo_updated_at: string | null;
  created_at: string;
  status: AcademyStatus;
  contact_name: string | null;
  contact_phone: string | null;
  city: string;
  updated_at: string;
}

export interface AcademyRole {
  id: string;
  academy_id: string;
  role: StaffRole;
  password_hash: string;
  created_at: string;
}

export interface SessionLog {
  id: string;
  academy_id: string;
  role: StaffRole;
  ip_address: string | null;
  logged_in_at: string;
  is_active: boolean;
}

export interface ClassRow {
  id: string;
  academy_id: string;
  name: string;
  section: string | null;
  created_at: string;
}

export interface SubjectRow {
  id: string;
  academy_id: string;
  name: string;
  created_at: string;
}

export interface Student {
  id: string;
  academy_id: string;
  class_id: string;
  roll_number: number;
  name: string;
  father_name: string | null;
  monthly_fee: number | null;
  admission_date: string;
  phone: string | null;
  address: string | null;
  teacher_remarks: string | null;
  status: "active" | "inactive";
  added_by_role: StaffRole;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  academy_id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface FeeRecord {
  id: string;
  academy_id: string;
  student_id: string;
  month: number;
  year: number;
  amount_due: number;
  status: FeeStatus;
  paid_date: string | null;
  created_at: string;
}

export interface TestRow {
  id: string;
  academy_id: string;
  class_id: string;
  subject_id: string;
  name: string;
  date: string;
  total_marks: number;
  created_at: string;
}

export interface TestResult {
  id: string;
  academy_id: string;
  test_id: string;
  student_id: string;
  marks_obtained: number | null;
  is_absent: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationRow {
  id: string;
  academy_id: string;
  type: string;
  student_id: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
}
