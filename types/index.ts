// ===== Platform-level (Super Admin / Addendum) =====

export type AcademyStatus = "active" | "trial" | "suspended";

export interface Academy {
  id: string;
  name: string;
  status: AcademyStatus;
  contactName?: string;
  contactPhone?: string;
  createdAt: string; // ISO date
  adminPassword: string; // masked in UI, dummy plaintext for demo only
  teacherPassword: string;
}

export interface AcademyMetrics {
  academyId: string;
  activeStudents: number;
  staffCount: number; // admin + teacher accounts (always 2 in v1, shared password model)
  revenueThisMonth: number;
  dueThisMonth: number;
  totalClasses: number;
  totalTests: number;
}

// ===== Academy-level (Base PRD) =====

export type Role = "admin" | "teacher";

export interface SchoolClass {
  id: string;
  academyId: string;
  name: string;
  section?: string | null;
  createdAt: string;
}

export interface Subject {
  id: string;
  academyId: string;
  name: string;
  createdAt: string;
}

export type StudentStatus = "active" | "inactive";

export interface Student {
  id: string;
  academyId: string;
  classId: string;
  rollNumber: number;
  name: string;
  fatherName?: string | null;
  monthlyFee: number | null; // null = "Fee Not Set"
  admissionDate: string;
  phone?: string | null;
  address?: string | null;
  teacherRemarks?: string | null;
  status: StudentStatus;
  addedByRole: Role;
}

export type AttendanceStatus = "P" | "A" | "L";

export interface AttendanceRecord {
  id: string;
  academyId: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export type FeeStatus = "paid" | "unpaid";

export interface FeeRecord {
  id: string;
  academyId: string;
  studentId: string;
  month: number; // 1-12
  year: number;
  amountDue: number;
  status: FeeStatus;
  paidDate?: string | null;
}

export interface Test {
  id: string;
  academyId: string;
  classId: string;
  subjectId: string;
  name: string;
  date: string;
  totalMarks: number;
}

export interface TestResult {
  id: string;
  academyId: string;
  testId: string;
  studentId: string;
  marksObtained: number | null;
  isAbsent: boolean;
}

export type NotificationType = "fee_not_set";

export interface AppNotification {
  id: string;
  academyId: string;
  type: NotificationType;
  studentId?: string | null;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

// ===== Aggregate bundle for a single academy's dummy dataset =====

export interface AcademyDataset {
  classes: SchoolClass[];
  subjects: Subject[];
  students: Student[];
  attendance: AttendanceRecord[];
  feeRecords: FeeRecord[];
  tests: Test[];
  testResults: TestResult[];
  notifications: AppNotification[];
}
