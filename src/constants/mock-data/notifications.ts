export type NotificationType = "due_soon" | "overdue" | "payment_received" | "system";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    relatedId?: string;
}

export const NOTIFICATIONS_DATA: Notification[] = [
    {
        id: "n-001",
        type: "overdue",
        title: "Invoice Overdue",
        description: "INV-0039 from CV Cipta Karya is overdue by 4 days. Amount: Rp 2.442.000.",
        timestamp: "2025-01-25T09:15:00",
        read: false,
        relatedId: "INV-0039",
    },
    {
        id: "n-002",
        type: "overdue",
        title: "Invoice Overdue",
        description: "INV-0035 from PT Global Indo is overdue by 20 days. Amount: Rp 4.995.000.",
        timestamp: "2025-01-24T08:00:00",
        read: false,
        relatedId: "INV-0035",
    },
    {
        id: "n-003",
        type: "due_soon",
        title: "Invoice Due Soon",
        description: "INV-0041 from PT Maju Bersama is due in 3 days. Amount: Rp 4.995.000.",
        timestamp: "2025-01-25T07:30:00",
        read: false,
        relatedId: "INV-0041",
    },
    {
        id: "n-004",
        type: "payment_received",
        title: "Payment Received",
        description: "INV-0038 from PT Maju Bersama has been paid. Amount: Rp 5.328.000.",
        timestamp: "2025-01-23T14:22:00",
        read: false,
        relatedId: "INV-0038",
    },
    {
        id: "n-005",
        type: "due_soon",
        title: "Maintenance Contract Due",
        description: "MNT-101 – Annual AC Maintenance for PT Maju Bersama is due in 7 days.",
        timestamp: "2025-01-22T10:00:00",
        read: true,
        relatedId: "MNT-101",
    },
    {
        id: "n-006",
        type: "due_soon",
        title: "Invoice Due Soon",
        description: "INV-0042 from UD Sinar Terang is due in 8 days. Amount: Rp 9.756.900.",
        timestamp: "2025-01-21T09:00:00",
        read: true,
        relatedId: "INV-0042",
    },
    {
        id: "n-007",
        type: "payment_received",
        title: "Payment Received",
        description: "INV-0036 from UD Prima Mandiri has been paid. Amount: Rp 3.200.000.",
        timestamp: "2025-01-20T16:45:00",
        read: true,
        relatedId: "INV-0036",
    },
    {
        id: "n-008",
        type: "overdue",
        title: "Maintenance Contract Expired",
        description: "MNT-103 – Electrical System Inspection for UD Sinar Terang expired 30 days ago.",
        timestamp: "2025-01-18T08:00:00",
        read: true,
        relatedId: "MNT-103",
    },
    {
        id: "n-009",
        type: "system",
        title: "System Update",
        description: "Braka Dashboard has been updated to v0.2.0. New features are available.",
        timestamp: "2025-01-15T12:00:00",
        read: true,
    },
    {
        id: "n-010",
        type: "due_soon",
        title: "Invoice Due Soon",
        description: "INV-0044 from UD Prima Mandiri is due in 18 days. Amount: Rp 11.299.800.",
        timestamp: "2025-01-14T09:00:00",
        read: true,
        relatedId: "INV-0044",
    },
];