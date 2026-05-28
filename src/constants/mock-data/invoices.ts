// ─── Types ────────────────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
    id: string;
    description: string;
    qty: number;
    unitPrice: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    clientPic: string;
    status: InvoiceStatus;
    invoiceDate: string;
    dueDate: string;
    paidDate?: string;
    paidAt?: string;
    relatedMaintenance?: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    taxRate: number;
    total: number;
    notes?: string;
    paymentInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

// ─── Payment Info (shared) ────────────────────────────────────────────────────

const COMPANY_PAYMENT = {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234 5678 9012",
    accountName: "PT Braka Solusi Teknik",
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const INVOICES: Invoice[] = [
    {
        id: "inv-001",
        invoiceNumber: "INV-0041",
        clientId: "CLT-001",
        clientName: "PT Maju Bersama",
        clientEmail: "budi@majubersama.co.id",
        clientPhone: "0812-3456-7890",
        clientAddress: "Jl. Sudirman No. 12, Jakarta Pusat 10220",
        clientPic: "Budi Santoso",
        status: "pending" as unknown as InvoiceStatus,
        invoiceDate: "2025-01-15",
        dueDate: "2025-01-28",
        relatedMaintenance: "MNT-101",
        items: [
            { id: "i1", description: "Annual AC Maintenance – Q1 Service Visit", qty: 1, unitPrice: 3_000_000, amount: 3_000_000 },
            { id: "i2", description: "Refrigerant Recharge (R410A)", qty: 2, unitPrice: 650_000, amount: 1_300_000 },
            { id: "i3", description: "Filter Replacement & Cleaning", qty: 4, unitPrice: 50_000, amount: 200_000 },
        ],
        subtotal: 4_500_000,
        taxRate: 11,
        tax: 495_000,
        total: 4_995_000,
        notes: "Payment via bank transfer. Please include invoice number as reference.",
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-002",
        invoiceNumber: "INV-0039",
        clientId: "CLT-002",
        clientName: "CV Cipta Karya",
        clientEmail: "dewi@ciptakarya.com",
        clientPhone: "0821-9876-5432",
        clientAddress: "Jl. Gatot Subroto No. 45, Bandung 40262",
        clientPic: "Dewi Rahayu",
        status: "overdue",
        invoiceDate: "2025-01-05",
        dueDate: "2025-01-30",
        relatedMaintenance: "MNT-102",
        items: [
            { id: "i4", description: "Monthly Plumbing Inspection – January 2025", qty: 1, unitPrice: 2_200_000, amount: 2_200_000 },
        ],
        subtotal: 2_200_000,
        taxRate: 11,
        tax: 242_000,
        total: 2_442_000,
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-003",
        invoiceNumber: "INV-0038",
        clientId: "CLT-001",
        clientName: "PT Maju Bersama",
        clientEmail: "budi@majubersama.co.id",
        clientPhone: "0812-3456-7890",
        clientAddress: "Jl. Sudirman No. 12, Jakarta Pusat 10220",
        clientPic: "Budi Santoso",
        status: "paid",
        invoiceDate: "2024-12-28",
        dueDate: "2025-01-10",
        paidDate: "2025-01-10",
        paidAt: "2025-01-10",
        items: [
            { id: "i5", description: "Annual AC Maintenance – Q4 Service Visit", qty: 1, unitPrice: 3_000_000, amount: 3_000_000 },
            { id: "i6", description: "Emergency Call-out Fee", qty: 1, unitPrice: 500_000, amount: 500_000 },
            { id: "i7", description: "Spare Part – Capacitor Replacement", qty: 2, unitPrice: 350_000, amount: 700_000 },
            { id: "i8", description: "Labour – Technician (4 hrs)", qty: 4, unitPrice: 150_000, amount: 600_000 },
        ],
        subtotal: 4_800_000,
        taxRate: 11,
        tax: 528_000,
        total: 5_328_000,
        notes: "Thank you for prompt payment.",
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-004",
        invoiceNumber: "INV-0042",
        clientId: "CLT-003",
        clientName: "UD Sinar Terang",
        clientEmail: "andi@sinarterang.id",
        clientPhone: "0857-1122-3344",
        clientAddress: "Jl. Diponegoro No. 8, Surabaya 60271",
        clientPic: "Andi Wijaya",
        status: "sent",
        invoiceDate: "2025-01-18",
        dueDate: "2025-02-02",
        items: [
            { id: "i9", description: "Electrical Panel Inspection & Testing", qty: 1, unitPrice: 4_500_000, amount: 4_500_000 },
            { id: "i10", description: "MCB Replacement (20A)", qty: 3, unitPrice: 250_000, amount: 750_000 },
            { id: "i11", description: "Grounding System Check", qty: 1, unitPrice: 1_200_000, amount: 1_200_000 },
            { id: "i12", description: "Cable Tray Installation (per meter)", qty: 12, unitPrice: 95_000, amount: 1_140_000 },
            { id: "i13", description: "Technician Labour (8 hrs)", qty: 8, unitPrice: 150_000, amount: 1_200_000 },
        ],
        subtotal: 8_790_000,
        taxRate: 11,
        tax: 966_900,
        total: 9_756_900,
        notes: "Work completed on 17 Jan 2025. Site supervisor: Pak Andi.",
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-005",
        invoiceNumber: "INV-0035",
        clientId: "CLT-004",
        clientName: "PT Global Indo",
        clientEmail: "siti@globalindo.co.id",
        clientPhone: "0813-5566-7788",
        clientAddress: "Kawasan SCBD Lot 8, Jakarta Selatan 12190",
        clientPic: "Siti Nurhaliza",
        status: "overdue",
        invoiceDate: "2024-12-20",
        dueDate: "2025-01-05",
        items: [
            { id: "i14", description: "Generator Maintenance – December 2024", qty: 1, unitPrice: 4_500_000, amount: 4_500_000 },
        ],
        subtotal: 4_500_000,
        taxRate: 11,
        tax: 495_000,
        total: 4_995_000,
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-006",
        invoiceNumber: "INV-0043",
        clientId: "CLT-005",
        clientName: "CV Duta Niaga",
        clientEmail: "hendra@dutaniaga.com",
        clientPhone: "0878-4455-6677",
        clientAddress: "Jl. Pemuda No. 33, Semarang 50132",
        clientPic: "Hendra Kusuma",
        status: "draft",
        invoiceDate: "2025-01-20",
        dueDate: "2025-02-08",
        relatedMaintenance: "MNT-104",
        items: [
            { id: "i15", description: "HVAC Preventive Maintenance – January 2025", qty: 1, unitPrice: 3_200_000, amount: 3_200_000 },
        ],
        subtotal: 3_200_000,
        taxRate: 11,
        tax: 352_000,
        total: 3_552_000,
        paymentInfo: COMPANY_PAYMENT,
    },
    {
        id: "inv-007",
        invoiceNumber: "INV-0044",
        clientId: "CLT-007",
        clientName: "UD Prima Mandiri",
        clientEmail: "joko@primamandiri.id",
        clientPhone: "0856-9988-7766",
        clientAddress: "Jl. Raya Darmo No. 55, Surabaya 60264",
        clientPic: "Joko Prasetyo",
        status: "sent",
        invoiceDate: "2025-01-19",
        dueDate: "2025-02-12",
        relatedMaintenance: "MNT-105",
        items: [
            { id: "i16", description: "Annual Fire Safety System Inspection", qty: 1, unitPrice: 5_500_000, amount: 5_500_000 },
            { id: "i17", description: "Fire Extinguisher Refill (6kg APAR)", qty: 6, unitPrice: 280_000, amount: 1_680_000 },
            { id: "i18", description: "Smoke Detector Replacement", qty: 4, unitPrice: 450_000, amount: 1_800_000 },
            { id: "i19", description: "Sprinkler Head Check & Pressure Test", qty: 1, unitPrice: 1_200_000, amount: 1_200_000 },
        ],
        subtotal: 10_180_000,
        taxRate: 11,
        tax: 1_119_800,
        total: 11_299_800,
        notes: "Certificate of compliance will be issued upon payment.",
        paymentInfo: COMPANY_PAYMENT,
    },
];

// ─── Client options for form ──────────────────────────────────────────────────

export const INVOICE_CLIENT_OPTIONS = [
    { id: "CLT-001", name: "PT Maju Bersama", email: "budi@majubersama.co.id", pic: "Budi Santoso", phone: "0812-3456-7890", address: "Jl. Sudirman No. 12, Jakarta Pusat 10220" },
    { id: "CLT-002", name: "CV Cipta Karya", email: "dewi@ciptakarya.com", pic: "Dewi Rahayu", phone: "0821-9876-5432", address: "Jl. Gatot Subroto No. 45, Bandung 40262" },
    { id: "CLT-003", name: "UD Sinar Terang", email: "andi@sinarterang.id", pic: "Andi Wijaya", phone: "0857-1122-3344", address: "Jl. Diponegoro No. 8, Surabaya 60271" },
    { id: "CLT-004", name: "PT Global Indo", email: "siti@globalindo.co.id", pic: "Siti Nurhaliza", phone: "0813-5566-7788", address: "Kawasan SCBD Lot 8, Jakarta Selatan 12190" },
    { id: "CLT-005", name: "CV Duta Niaga", email: "hendra@dutaniaga.com", pic: "Hendra Kusuma", phone: "0878-4455-6677", address: "Jl. Pemuda No. 33, Semarang 50132" },
    { id: "CLT-007", name: "UD Prima Mandiri", email: "joko@primamandiri.id", pic: "Joko Prasetyo", phone: "0856-9988-7766", address: "Jl. Raya Darmo No. 55, Surabaya 60264" },
    { id: "CLT-008", name: "PT Bangun Sejahtera", email: "maya@bangunsejahtera.com", pic: "Maya Indah", phone: "0811-7766-5544", address: "Jl. Thamrin No. 7, Jakarta Pusat 10350" },
];

export const MAINTENANCE_OPTIONS = [
    { id: "MNT-101", label: "MNT-101 – Annual AC Maintenance (PT Maju Bersama)" },
    { id: "MNT-102", label: "MNT-102 – Monthly Plumbing Check (CV Cipta Karya)" },
    { id: "MNT-104", label: "MNT-104 – HVAC Preventive Maintenance (CV Duta Niaga)" },
    { id: "MNT-105", label: "MNT-105 – Fire Safety System Check (UD Prima Mandiri)" },
];
