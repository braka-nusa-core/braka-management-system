export type ClientStatus = "active" | "inactive" | "prospect";

export interface Client {
    id: string;
    companyName: string;
    picName: string;
    email: string;
    phone: string;
    address: string;
    status: ClientStatus;
    totalProjects: number;
    notes?: string;
    joinedAt: string;
    progressToken?: string;
}

export interface MaintenanceContract {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: "active" | "expired" | "pending";
    value: number;
}

export interface InvoiceHistory {
    id: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    date: string;
}

export interface ProjectProgress {
    id: string;
    name: string;
    progress: number;
    status: "on_track" | "delayed" | "completed";
}

export const CLIENTS: Client[] = [
    {
        id: "CLT-001",
        companyName: "PT Maju Bersama",
        picName: "Budi Santoso",
        email: "budi@majubersama.co.id",
        phone: "0812-3456-7890",
        address: "Jl. Sudirman No. 12, Jakarta Pusat",
        status: "active",
        totalProjects: 8,
        notes: "Long-term client since 2021. Prefers WhatsApp communication.",
        joinedAt: "2021-03-15",
        progressToken: "abc123xyz",
    },
    {
        id: "CLT-002",
        companyName: "CV Cipta Karya",
        picName: "Dewi Rahayu",
        email: "dewi@ciptakarya.com",
        phone: "0821-9876-5432",
        address: "Jl. Gatot Subroto No. 45, Bandung",
        status: "active",
        totalProjects: 5,
        joinedAt: "2022-07-01",
        progressToken: "braka-demo-001",
    },
    {
        id: "CLT-003",
        companyName: "UD Sinar Terang",
        picName: "Andi Wijaya",
        email: "andi@sinarterang.id",
        phone: "0857-1122-3344",
        address: "Jl. Diponegoro No. 8, Surabaya",
        status: "active",
        totalProjects: 12,
        joinedAt: "2020-11-20",
        progressToken: "client-preview-99",
    },
    {
        id: "CLT-004",
        companyName: "PT Global Indo",
        picName: "Siti Nurhaliza",
        email: "siti@globalindo.co.id",
        phone: "0813-5566-7788",
        address: "Kawasan SCBD Lot 8, Jakarta Selatan",
        status: "inactive",
        totalProjects: 3,
        notes: "Contract ended Q4 2024. May renew in 2025.",
        joinedAt: "2022-01-10",
    },
    {
        id: "CLT-005",
        companyName: "CV Duta Niaga",
        picName: "Hendra Kusuma",
        email: "hendra@dutaniaga.com",
        phone: "0878-4455-6677",
        address: "Jl. Pemuda No. 33, Semarang",
        status: "active",
        totalProjects: 6,
        joinedAt: "2023-02-28",
    },
    {
        id: "CLT-006",
        companyName: "PT Karya Utama",
        picName: "Rini Puspita",
        email: "rini@karyautama.co.id",
        phone: "0819-2233-4455",
        address: "Jl. Asia Afrika No. 21, Bandung",
        status: "prospect",
        totalProjects: 0,
        notes: "First meeting scheduled Feb 2025.",
        joinedAt: "2025-01-15",
    },
    {
        id: "CLT-007",
        companyName: "UD Prima Mandiri",
        picName: "Joko Prasetyo",
        email: "joko@primamandiri.id",
        phone: "0856-9988-7766",
        address: "Jl. Raya Darmo No. 55, Surabaya",
        status: "active",
        totalProjects: 9,
        joinedAt: "2021-08-05",
    },
    {
        id: "CLT-008",
        companyName: "PT Bangun Sejahtera",
        picName: "Maya Indah",
        email: "maya@bangunsejahtera.com",
        phone: "0811-7766-5544",
        address: "Jl. Thamrin No. 7, Jakarta Pusat",
        status: "active",
        totalProjects: 4,
        joinedAt: "2023-09-12",
    },
];

export const CLIENT_MAINTENANCE: Record<string, MaintenanceContract[]> = {
    "CLT-001": [
        { id: "MNT-101", title: "Annual AC Maintenance", startDate: "2024-01-01", endDate: "2024-12-31", status: "active", value: 24_000_000 },
        { id: "MNT-088", title: "Electrical Checkup Q2", startDate: "2023-04-01", endDate: "2023-06-30", status: "expired", value: 8_500_000 },
    ],
    "CLT-002": [
        { id: "MNT-115", title: "Plumbing Contract 2024", startDate: "2024-03-01", endDate: "2024-08-31", status: "active", value: 12_000_000 },
    ],
};

export const CLIENT_INVOICES: Record<string, InvoiceHistory[]> = {
    "CLT-001": [
        { id: "INV-0038", amount: 6_200_000, status: "paid", date: "2025-01-10" },
        { id: "INV-0029", amount: 4_800_000, status: "paid", date: "2024-12-05" },
        { id: "INV-0041", amount: 4_500_000, status: "pending", date: "2025-01-28" },
    ],
    "CLT-002": [
        { id: "INV-0039", amount: 2_200_000, status: "overdue", date: "2025-01-30" },
        { id: "INV-0031", amount: 3_100_000, status: "paid", date: "2024-11-20" },
    ],
};

export const CLIENT_PROJECTS: Record<string, ProjectProgress[]> = {
    "CLT-001": [
        { id: "PRJ-01", name: "HQ Renovation – Phase 2", progress: 72, status: "on_track" },
        { id: "PRJ-02", name: "Server Room Cooling Install", progress: 100, status: "completed" },
        { id: "PRJ-03", name: "Lobby Electrical Upgrade", progress: 35, status: "delayed" },
    ],
    "CLT-002": [
        { id: "PRJ-04", name: "Office Plumbing Overhaul", progress: 58, status: "on_track" },
    ],
};