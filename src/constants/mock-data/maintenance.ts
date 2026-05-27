// ─── Types ────────────────────────────────────────────────────────────────────

export type MaintenanceStatus = "active" | "paused" | "expired" | "cancelled";
export type BillingType = "monthly" | "yearly";

export interface MaintenanceContract {
    id: string;
    clientId: string;
    clientName: string;
    serviceName: string;
    billingType: BillingType;
    price: number;
    startDate: string;
    nextDueDate: string;
    status: MaintenanceStatus;
    notes?: string;
    contactPerson: string;
    contactPhone: string;
    address: string;
    reminderDaysBefore: number;
    autoRenew: boolean;
}

export interface RelatedInvoice {
    id: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    date: string;
}

export interface ContractActivity {
    id: string;
    description: string;
    timestamp: string;
    type: "created" | "renewed" | "paused" | "invoice_sent" | "payment_received";
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export const MAINTENANCE_CONTRACTS: MaintenanceContract[] = [
    {
        id: "MNT-101",
        clientId: "CLT-001",
        clientName: "PT Maju Bersama",
        serviceName: "Annual AC Maintenance",
        billingType: "yearly",
        price: 24_000_000,
        startDate: "2024-01-01",
        nextDueDate: "2025-01-01",
        status: "active",
        notes: "Includes 4 service visits per year. Client prefers morning slots.",
        contactPerson: "Budi Santoso",
        contactPhone: "0812-3456-7890",
        address: "Jl. Sudirman No. 12, Jakarta Pusat",
        reminderDaysBefore: 14,
        autoRenew: true,
    },
    {
        id: "MNT-102",
        clientId: "CLT-002",
        clientName: "CV Cipta Karya",
        serviceName: "Monthly Plumbing Check",
        billingType: "monthly",
        price: 2_500_000,
        startDate: "2024-03-01",
        nextDueDate: "2025-02-01",
        status: "active",
        contactPerson: "Dewi Rahayu",
        contactPhone: "0821-9876-5432",
        address: "Jl. Gatot Subroto No. 45, Bandung",
        reminderDaysBefore: 7,
        autoRenew: false,
    },
    {
        id: "MNT-103",
        clientId: "CLT-003",
        clientName: "UD Sinar Terang",
        serviceName: "Electrical System Inspection",
        billingType: "yearly",
        price: 18_000_000,
        startDate: "2023-06-01",
        nextDueDate: "2024-06-01",
        status: "expired",
        notes: "Client has not renewed. Follow up scheduled.",
        contactPerson: "Andi Wijaya",
        contactPhone: "0857-1122-3344",
        address: "Jl. Diponegoro No. 8, Surabaya",
        reminderDaysBefore: 30,
        autoRenew: false,
    },
    {
        id: "MNT-104",
        clientId: "CLT-005",
        clientName: "CV Duta Niaga",
        serviceName: "HVAC Preventive Maintenance",
        billingType: "monthly",
        price: 3_200_000,
        startDate: "2024-05-01",
        nextDueDate: "2025-02-01",
        status: "active",
        contactPerson: "Hendra Kusuma",
        contactPhone: "0878-4455-6677",
        address: "Jl. Pemuda No. 33, Semarang",
        reminderDaysBefore: 7,
        autoRenew: true,
    },
    {
        id: "MNT-105",
        clientId: "CLT-007",
        clientName: "UD Prima Mandiri",
        serviceName: "Fire Safety System Check",
        billingType: "yearly",
        price: 9_600_000,
        startDate: "2024-02-01",
        nextDueDate: "2025-02-01",
        status: "active",
        contactPerson: "Joko Prasetyo",
        contactPhone: "0856-9988-7766",
        address: "Jl. Raya Darmo No. 55, Surabaya",
        reminderDaysBefore: 14,
        autoRenew: true,
    },
    {
        id: "MNT-106",
        clientId: "CLT-004",
        clientName: "PT Global Indo",
        serviceName: "Generator Maintenance",
        billingType: "monthly",
        price: 4_500_000,
        startDate: "2023-01-01",
        nextDueDate: "2024-01-01",
        status: "cancelled",
        notes: "Cancelled by client after contract dispute in Q4 2023.",
        contactPerson: "Siti Nurhaliza",
        contactPhone: "0813-5566-7788",
        address: "Kawasan SCBD Lot 8, Jakarta Selatan",
        reminderDaysBefore: 7,
        autoRenew: false,
    },
    {
        id: "MNT-107",
        clientId: "CLT-008",
        clientName: "PT Bangun Sejahtera",
        serviceName: "Building Facade Inspection",
        billingType: "yearly",
        price: 15_000_000,
        startDate: "2024-09-01",
        nextDueDate: "2025-09-01",
        status: "paused",
        notes: "Paused pending building permit renewal from client side.",
        contactPerson: "Maya Indah",
        contactPhone: "0811-7766-5544",
        address: "Jl. Thamrin No. 7, Jakarta Pusat",
        reminderDaysBefore: 14,
        autoRenew: false,
    },
];

// ─── Related Invoices ─────────────────────────────────────────────────────────

export const CONTRACT_INVOICES: Record<string, RelatedInvoice[]> = {
    "MNT-101": [
        { id: "INV-0038", amount: 6_200_000, status: "paid", date: "2025-01-10" },
        { id: "INV-0029", amount: 6_000_000, status: "paid", date: "2024-12-05" },
        { id: "INV-0041", amount: 6_000_000, status: "pending", date: "2025-01-28" },
    ],
    "MNT-102": [
        { id: "INV-0039", amount: 2_500_000, status: "overdue", date: "2025-01-30" },
        { id: "INV-0031", amount: 2_500_000, status: "paid", date: "2024-11-20" },
    ],
    "MNT-104": [
        { id: "INV-0042", amount: 3_200_000, status: "pending", date: "2025-02-01" },
        { id: "INV-0033", amount: 3_200_000, status: "paid", date: "2024-12-15" },
    ],
};

// ─── Contract Activity ────────────────────────────────────────────────────────

export const CONTRACT_ACTIVITY: Record<string, ContractActivity[]> = {
    "MNT-101": [
        { id: "a1", type: "invoice_sent", description: "Invoice INV-0041 sent to client", timestamp: "2 days ago" },
        { id: "a2", type: "payment_received", description: "Payment received for INV-0038", timestamp: "Jan 10, 2025" },
        { id: "a3", type: "renewed", description: "Contract renewed for 2024", timestamp: "Jan 1, 2024" },
        { id: "a4", type: "created", description: "Contract MNT-101 created", timestamp: "Jan 1, 2024" },
    ],
    "MNT-102": [
        { id: "b1", type: "invoice_sent", description: "Invoice INV-0039 sent — awaiting payment", timestamp: "3 days ago" },
        { id: "b2", type: "payment_received", description: "Payment received for INV-0031", timestamp: "Nov 20, 2024" },
        { id: "b3", type: "created", description: "Contract MNT-102 created", timestamp: "Mar 1, 2024" },
    ],
};

// ─── Client options for form select ──────────────────────────────────────────

export const CLIENT_OPTIONS = [
    { id: "CLT-001", name: "PT Maju Bersama" },
    { id: "CLT-002", name: "CV Cipta Karya" },
    { id: "CLT-003", name: "UD Sinar Terang" },
    { id: "CLT-004", name: "PT Global Indo" },
    { id: "CLT-005", name: "CV Duta Niaga" },
    { id: "CLT-007", name: "UD Prima Mandiri" },
    { id: "CLT-008", name: "PT Bangun Sejahtera" },
];