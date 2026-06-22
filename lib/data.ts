import type {
  Academy,
  AcademyDataset,
  AcademyMetrics,
  AcademyStatus,
  AppNotification,
  AttendanceRecord,
  AttendanceStatus,
  FeeRecord,
  SchoolClass,
  Student,
  Subject,
  Test,
  TestResult,
} from "@/types";

// ---- deterministic pseudo-random (seeded) so the dataset is stable across renders ----
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

const FIRST_NAMES = [
  "Ahmed", "Ali", "Bilal", "Hamza", "Usman", "Hassan", "Hussain", "Zain",
  "Fatima", "Ayesha", "Sara", "Mariam", "Zainab", "Amna", "Hira", "Iqra",
  "Abdullah", "Faizan", "Talha", "Saad", "Omar", "Rayyan", "Eman", "Noor",
  "Areeba", "Laiba", "Maham", "Rida", "Shaheer", "Danish", "Asad", "Waqas",
];
const LAST_NAMES = [
  "Khan", "Ahmed", "Malik", "Hussain", "Raza", "Sheikh", "Iqbal", "Farooq",
  "Javed", "Akhtar", "Qureshi", "Butt", "Cheema", "Chaudhry", "Rizwan", "Saeed",
];

const CLASS_NAMES = ["Nursery", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
const SECTIONS = ["Blue", "Red", "Green", undefined, undefined]; // some classes have no section
const SUBJECT_POOL = [
  "Mathematics", "English", "Urdu", "Science", "Physics", "Chemistry",
  "Biology", "Computer Science", "Islamiyat", "Social Studies", "Pakistan Studies",
];

const ACADEMIC_MONTHS = [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]; // May..March

function pad(n: number) {
  return String(n).length === 1 ? `0${n}` : String(n);
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

// "Today" for the dummy dataset — keeps fee rollover / dashboard math consistent
export const TODAY = new Date("2026-06-20T00:00:00");
export const CURRENT_MONTH = TODAY.getMonth() + 1; // 6
export const CURRENT_YEAR = TODAY.getFullYear(); // 2026

interface BuildOptions {
  academyId: string;
  academyName: string;
  numClasses: number;
  studentsPerClassRange: [number, number];
}

function buildAcademyDataset(opts: BuildOptions): AcademyDataset {
  const rand = mulberry32(hashSeed(opts.academyId));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

  // ---- classes ----
  const classes: SchoolClass[] = [];
  const usedClassNames = new Set<string>();
  let cIdx = 0;
  while (classes.length < opts.numClasses) {
    const name = CLASS_NAMES[cIdx % CLASS_NAMES.length];
    const section = pick(SECTIONS);
    const key = `${name}-${section ?? ""}`;
    cIdx++;
    if (usedClassNames.has(key)) continue;
    usedClassNames.add(key);
    classes.push({
      id: `${opts.academyId}-class-${classes.length + 1}`,
      academyId: opts.academyId,
      name,
      section: section ?? null,
      createdAt: isoDate(2025, 1, 10 + classes.length),
    });
  }

  // ---- subjects (global per academy) ----
  const numSubjects = int(6, SUBJECT_POOL.length);
  const subjectNames = [...SUBJECT_POOL].sort(() => rand() - 0.5).slice(0, numSubjects);
  const subjects: Subject[] = subjectNames.map((name, i) => ({
    id: `${opts.academyId}-subject-${i + 1}`,
    academyId: opts.academyId,
    name,
    createdAt: isoDate(2025, 1, 11 + i),
  }));

  // ---- students ----
  const students: Student[] = [];
  let studentCounter = 0;
  for (const cls of classes) {
    const count = int(opts.studentsPerClassRange[0], opts.studentsPerClassRange[1]);
    for (let roll = 1; roll <= count; roll++) {
      studentCounter++;
      const first = pick(FIRST_NAMES);
      const last = pick(LAST_NAMES);
      const status: Student["status"] = rand() < 0.06 ? "inactive" : "active";
      const feeNotSet = rand() < 0.05;
      const addedByRole: Student["addedByRole"] = feeNotSet ? "teacher" : "admin";
      const admissionMonth = int(1, 12);
      const admissionDay = int(1, 27);
      const admissionYear = rand() < 0.7 ? 2025 : 2024;
      students.push({
        id: `${opts.academyId}-student-${studentCounter}`,
        academyId: opts.academyId,
        classId: cls.id,
        rollNumber: roll,
        name: `${first} ${last}`,
        fatherName: `${pick(FIRST_NAMES)} ${last}`,
        monthlyFee: feeNotSet ? null : int(1500, 6000),
        admissionDate: isoDate(admissionYear, admissionMonth, admissionDay),
        phone: `03${int(10, 49)}-${int(1000000, 9999999)}`,
        address: `House ${int(1, 200)}, Street ${int(1, 40)}, ${["Lahore", "Kasur", "Multan", "Faisalabad"][int(0, 3)]}`,
        teacherRemarks: rand() < 0.25 ? pick([
          "Needs more practice in homework.",
          "Excellent participation in class.",
          "Improving steadily this term.",
          "Should focus more during lectures.",
          "Great progress since last term.",
        ]) : null,
        status,
        addedByRole,
      });
    }
  }

  // ---- attendance (last ~70 days up to TODAY, per active student) ----
  const attendance: AttendanceRecord[] = [];
  let attCounter = 0;
  const activeStudents = students.filter((s) => s.status === "active");
  for (const student of activeStudents) {
    const admission = new Date(student.admissionDate);
    const start = admission > new Date("2026-04-01") ? admission : new Date("2026-04-01");
    const days: Date[] = [];
    const cursor = new Date(start);
    while (cursor <= TODAY) {
      const dow = cursor.getDay();
      if (dow !== 0) days.push(new Date(cursor)); // skip Sundays
      cursor.setDate(cursor.getDate() + 1);
    }
    for (const day of days) {
      const r = rand();
      const status: AttendanceStatus = r < 0.84 ? "P" : r < 0.94 ? "A" : "L";
      attCounter++;
      attendance.push({
        id: `${opts.academyId}-att-${attCounter}`,
        academyId: opts.academyId,
        studentId: student.id,
        classId: student.classId,
        date: isoDate(day.getFullYear(), day.getMonth() + 1, day.getDate()),
        status,
      });
    }
  }

  // ---- fee records (academic year May..March, up to current month) ----
  const feeRecords: FeeRecord[] = [];
  let feeCounter = 0;
  for (const student of students) {
    if (student.monthlyFee === null) continue;
    for (const month of ACADEMIC_MONTHS) {
      const year = month >= 5 ? 2025 : 2026;
      // skip months before admission
      const admission = new Date(student.admissionDate);
      const monthStart = new Date(year, month - 1, 1);
      if (monthStart < new Date(admission.getFullYear(), admission.getMonth(), 1)) continue;
      // skip months after "today"
      if (year > CURRENT_YEAR || (year === CURRENT_YEAR && month > CURRENT_MONTH)) continue;
      if (year === 2026 && month > CURRENT_MONTH) continue;

      const isCurrentMonth = month === CURRENT_MONTH && year === CURRENT_YEAR;
      const paid = isCurrentMonth ? rand() < 0.55 : rand() < 0.88;
      feeCounter++;
      feeRecords.push({
        id: `${opts.academyId}-fee-${feeCounter}`,
        academyId: opts.academyId,
        studentId: student.id,
        month,
        year,
        amountDue: student.monthlyFee,
        status: paid ? "paid" : "unpaid",
        paidDate: paid ? isoDate(year, month, int(1, 27)) : null,
      });
    }
  }

  // ---- tests + results ----
  const tests: Test[] = [];
  const testResults: TestResult[] = [];
  let testCounter = 0;
  let resultCounter = 0;
  for (const cls of classes) {
    const classStudents = students.filter((s) => s.classId === cls.id && s.status === "active");
    if (classStudents.length === 0) continue;
    const classSubjects = subjects.slice(0, int(3, Math.min(5, subjects.length)));
    for (const subject of classSubjects) {
      const numTests = int(2, 5);
      for (let t = 1; t <= numTests; t++) {
        testCounter++;
        const totalMarks = pick([20, 25, 30, 50, 100]);
        const testId = `${opts.academyId}-test-${testCounter}`;
        tests.push({
          id: testId,
          academyId: opts.academyId,
          classId: cls.id,
          subjectId: subject.id,
          name: `T${t}`,
          date: isoDate(2026, int(1, CURRENT_MONTH), int(1, 27)),
          totalMarks,
        });
        // not every test has marks fully entered — simulate partial entry on the latest test
        const isLatest = t === numTests;
        for (const student of classStudents) {
          const enterMarks = !isLatest || rand() < 0.7;
          if (!enterMarks) continue;
          resultCounter++;
          const isAbsent = rand() < 0.05;
          testResults.push({
            id: `${opts.academyId}-result-${resultCounter}`,
            academyId: opts.academyId,
            testId,
            studentId: student.id,
            marksObtained: isAbsent ? null : Math.round(totalMarks * (0.35 + rand() * 0.65)),
            isAbsent,
          });
        }
      }
    }
  }

  // ---- notifications (fee_not_set) ----
  const notifications: AppNotification[] = [];
  let notifCounter = 0;
  for (const student of students) {
    if (student.monthlyFee === null && student.addedByRole === "teacher") {
      notifCounter++;
      const cls = classes.find((c) => c.id === student.classId);
      notifications.push({
        id: `${opts.academyId}-notif-${notifCounter}`,
        academyId: opts.academyId,
        type: "fee_not_set",
        studentId: student.id,
        message: `New student "${student.name}" added to ${cls?.name}${cls?.section ? ` (${cls.section})` : ""} by Teacher — fee not set.`,
        isResolved: false,
        createdAt: student.admissionDate,
      });
    }
  }

  return { classes, subjects, students, attendance, feeRecords, tests, testResults, notifications };
}

// ===== Academies (platform level) =====

const ACADEMY_SEEDS: {
  id: string;
  name: string;
  status: AcademyStatus;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  numClasses: number;
  studentsPerClassRange: [number, number];
}[] = [
  {
    id: "superior-academy",
    name: "Superior Academy",
    status: "active",
    createdAt: "2024-08-12",
    contactName: "Imran Sheikh",
    contactPhone: "0300-1234567",
    numClasses: 8,
    studentsPerClassRange: [18, 32],
  },
  {
    id: "bright-future-school",
    name: "Bright Future School",
    status: "active",
    createdAt: "2025-01-05",
    contactName: "Sana Malik",
    contactPhone: "0321-7654321",
    numClasses: 6,
    studentsPerClassRange: [12, 24],
  },
  {
    id: "al-noor-academy",
    name: "Al-Noor Academy",
    status: "trial",
    createdAt: "2026-04-02",
    contactName: "Hamza Tariq",
    contactPhone: "0333-9988776",
    numClasses: 3,
    studentsPerClassRange: [8, 15],
  },
  {
    id: "city-grammar-school",
    name: "City Grammar School",
    status: "active",
    createdAt: "2025-06-20",
    contactName: "Ayesha Raza",
    contactPhone: "0345-2233445",
    numClasses: 9,
    studentsPerClassRange: [20, 35],
  },
  {
    id: "rising-stars-academy",
    name: "Rising Stars Academy",
    status: "suspended",
    createdAt: "2024-11-30",
    contactName: "Faisal Qureshi",
    contactPhone: "0312-5566778",
    numClasses: 5,
    studentsPerClassRange: [10, 20],
  },
];

export const ACADEMIES: Academy[] = ACADEMY_SEEDS.map((a) => ({
  id: a.id,
  name: a.name,
  status: a.status,
  contactName: a.contactName,
  contactPhone: a.contactPhone,
  createdAt: a.createdAt,
  adminPassword: "admin123",
  teacherPassword: "teacher123",
}));

const DATASET_CACHE = new Map<string, AcademyDataset>();

export function getAcademyDataset(academyId: string): AcademyDataset {
  if (DATASET_CACHE.has(academyId)) return DATASET_CACHE.get(academyId)!;
  const seed = ACADEMY_SEEDS.find((a) => a.id === academyId);
  if (!seed) {
    const empty: AcademyDataset = {
      classes: [], subjects: [], students: [], attendance: [],
      feeRecords: [], tests: [], testResults: [], notifications: [],
    };
    return empty;
  }
  const dataset = buildAcademyDataset({
    academyId: seed.id,
    academyName: seed.name,
    numClasses: seed.numClasses,
    studentsPerClassRange: seed.studentsPerClassRange,
  });
  DATASET_CACHE.set(academyId, dataset);
  return dataset;
}

export function getAcademy(academyId: string): Academy | undefined {
  return ACADEMIES.find((a) => a.id === academyId);
}

export function getAcademyMetrics(academyId: string): AcademyMetrics {
  const ds = getAcademyDataset(academyId);
  const activeStudents = ds.students.filter((s) => s.status === "active").length;
  const currentFees = ds.feeRecords.filter(
    (f) => f.month === CURRENT_MONTH && f.year === CURRENT_YEAR
  );
  const revenueThisMonth = currentFees
    .filter((f) => f.status === "paid")
    .reduce<number>((sum, f) => sum + f.amountDue, 0);
  const dueThisMonth = currentFees
    .filter((f) => f.status === "unpaid")
    .reduce<number>((sum, f) => sum + f.amountDue, 0);
  return {
    academyId,
    activeStudents,
    staffCount: 2, // shared admin + teacher password model (v1)
    revenueThisMonth,
    dueThisMonth,
    totalClasses: ds.classes.length,
    totalTests: ds.tests.length,
  };
}

export function getPlatformTotals() {
  const allMetrics = ACADEMIES.map((a) => getAcademyMetrics(a.id));
  return {
    totalAcademies: ACADEMIES.length,
    activeAcademies: ACADEMIES.filter((a) => a.status === "active").length,
    totalStudents: allMetrics.reduce((s, m) => s + m.activeStudents, 0),
    totalStaff: allMetrics.reduce((s, m) => s + m.staffCount, 0),
    platformRevenue: allMetrics.reduce((s, m) => s + m.revenueThisMonth, 0),
    platformDue: allMetrics.reduce((s, m) => s + m.dueThisMonth, 0),
  };
}
