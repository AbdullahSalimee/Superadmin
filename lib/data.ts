export type Status = 'active' | 'trial' | 'suspended';

export interface Academy {
  id: string;
  name: string;
  status: Status;
  students: number;
  admins: number;
  teachers: number;
  revenueMonth: number;
  dueMonth: number;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  city: string;
  colorIdx: number;
}

export const PALETTES = [
  ['#3B7BFF','#1A4FC7'],
  ['#9B59F5','#6B35CC'],
  ['#22D37E','#129A56'],
  ['#F5A623','#C17D0E'],
  ['#FF5B8D','#CC2E62'],
  ['#38BEFF','#1A8FCC'],
];

export const SA_PASSWORD = 'superadmin123';

export const ACADEMIES: Academy[] = [
  { id:'1', name:'Scholars Hub', status:'active', students:420, admins:4, teachers:20, revenueMonth:1890000, dueMonth:60000, createdAt:'2023-08-10', contactName:'Fatima Malik', contactPhone:'0321-1122334', city:'Lahore', colorIdx:0 },
  { id:'2', name:'Superior Academy', status:'active', students:312, admins:3, teachers:15, revenueMonth:1042087, dueMonth:40333, createdAt:'2024-01-15', contactName:'Dr. Imran Khan', contactPhone:'0300-1234567', city:'Karachi', colorIdx:1 },
  { id:'3', name:'Pinnacle Institute', status:'active', students:256, admins:3, teachers:13, revenueMonth:896000, dueMonth:32000, createdAt:'2024-06-01', contactName:'Sana Baig', contactPhone:'0301-5544332', city:'Islamabad', colorIdx:2 },
  { id:'4', name:'Beacon Institute', status:'active', students:198, admins:2, teachers:10, revenueMonth:742000, dueMonth:28000, createdAt:'2024-03-02', contactName:'Maryam Siddiqui', contactPhone:'0312-9876543', city:'Lahore', colorIdx:3 },
  { id:'5', name:'Horizon Academy', status:'trial', students:54, admins:1, teachers:5, revenueMonth:0, dueMonth:162000, createdAt:'2025-05-20', contactName:'Ahmed Raza', contactPhone:'0333-4567890', city:'Peshawar', colorIdx:4 },
  { id:'6', name:'Roots Academy', status:'suspended', students:87, admins:2, teachers:7, revenueMonth:0, dueMonth:261000, createdAt:'2023-11-22', contactName:'Tariq Hussain', contactPhone:'0345-9988776', city:'Faisalabad', colorIdx:5 },
];
