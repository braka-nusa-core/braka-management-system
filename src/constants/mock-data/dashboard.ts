// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
}

export interface Invoice {
  id: string;
  client: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export interface Activity {
  id: string;
  type: "invoice_paid" | "client_created" | "maintenance_updated" | "invoice_overdue";
  description: string;
  timestamp: string;
  meta?: string;
}

export interface Notification {
  id: string;
  type: "due_soon" | "overdue" | "payment_received";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  target: number;
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

export const STAT_CARDS: StatCard[] = [
  {
    label: "Total Clients",
    value: "84",
    change: "+6 this month",
    changePositive: true,
    icon: "Users",
  },
  {
    label: "Active Maintenance",
    value: "23",
    change: "+3 this week",
    changePositive: true,
    icon: "Wrench",
  },
  {
    label: "Pending Invoices",
    value: "17",
    change: "-2 from last week",
    changePositive: false,
    icon: "FileText",
  },
  {
    label: "Overdue Invoices",
    value: "5",
    change: "+1 today",
    changePositive: false,
    icon: "AlertCircle",
  },
  {
    label: "Monthly Revenue",
    value: "Rp 48.2M",
    change: "+12.4% vs last month",
    changePositive: true,
    icon: "TrendingUp",
  },
];

// ─── Revenue Chart ─────────────────────────────────────────────────────────────

export const REVENUE_DATA: RevenueMonth[] = [
  { month: "Jan", revenue: 32_000_000, target: 35_000_000 },
  { month: "Feb", revenue: 38_500_000, target: 35_000_000 },
  { month: "Mar", revenue: 29_000_000, target: 38_000_000 },
  { month: "Apr", revenue: 41_200_000, target: 40_000_000 },
  { month: "May", revenue: 35_800_000, target: 40_000_000 },
  { month: "Jun", revenue: 44_600_000, target: 42_000_000 },
  { month: "Jul", revenue: 39_900_000, target: 42_000_000 },
  { month: "Aug", revenue: 52_100_000, target: 45_000_000 },
  { month: "Sep", revenue: 47_300_000, target: 45_000_000 },
  { month: "Oct", revenue: 43_800_000, target: 47_000_000 },
  { month: "Nov", revenue: 56_400_000, target: 50_000_000 },
  { month: "Dec", revenue: 48_200_000, target: 50_000_000 },
];

// ─── Upcoming Invoices ────────────────────────────────────────────────────────

export const UPCOMING_INVOICES: Invoice[] = [
  { id: "INV-0041", client: "PT Maju Bersama", dueDate: "2025-01-28", amount: 4_500_000, status: "pending" },
  { id: "INV-0039", client: "CV Cipta Karya", dueDate: "2025-01-30", amount: 2_200_000, status: "overdue" },
  { id: "INV-0042", client: "UD Sinar Terang", dueDate: "2025-02-02", amount: 7_800_000, status: "pending" },
  { id: "INV-0035", client: "PT Global Indo", dueDate: "2025-02-05", amount: 1_350_000, status: "overdue" },
  { id: "INV-0043", client: "CV Duta Niaga", dueDate: "2025-02-08", amount: 3_100_000, status: "pending" },
  { id: "INV-0044", client: "PT Karya Utama", dueDate: "2025-02-12", amount: 9_250_000, status: "pending" },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

export const RECENT_ACTIVITY: Activity[] = [
  {
    id: "act-1",
    type: "invoice_paid",
    description: "Invoice INV-0038 paid",
    meta: "PT Sumber Rejeki",
    timestamp: "2 minutes ago",
  },
  {
    id: "act-2",
    type: "client_created",
    description: "New client added",
    meta: "CV Harapan Jaya",
    timestamp: "1 hour ago",
  },
  {
    id: "act-3",
    type: "maintenance_updated",
    description: "Maintenance job completed",
    meta: "Job #MNT-117",
    timestamp: "3 hours ago",
  },
  {
    id: "act-4",
    type: "invoice_overdue",
    description: "Invoice marked overdue",
    meta: "INV-0035 · PT Global Indo",
    timestamp: "5 hours ago",
  },
  {
    id: "act-5",
    type: "invoice_paid",
    description: "Invoice INV-0036 paid",
    meta: "UD Prima Mandiri",
    timestamp: "Yesterday, 4:30 PM",
  },
  {
    id: "act-6",
    type: "client_created",
    description: "New client added",
    meta: "PT Bangun Sejahtera",
    timestamp: "Yesterday, 2:12 PM",
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "overdue",
    message: "INV-0039 from CV Cipta Karya is overdue by 3 days",
    timestamp: "Just now",
    read: false,
  },
  {
    id: "notif-2",
    type: "due_soon",
    message: "INV-0041 from PT Maju Bersama is due in 2 days",
    timestamp: "30 min ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "payment_received",
    message: "Payment received for INV-0038 — Rp 6.200.000",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "notif-4",
    type: "due_soon",
    message: "INV-0042 from UD Sinar Terang due in 5 days",
    timestamp: "3 hours ago",
    read: true,
  },
];
