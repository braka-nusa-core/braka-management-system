export type MilestoneStatus = "completed" | "in_progress" | "pending";
export type ProjectStatus = "planning" | "design" | "development" | "revision" | "testing" | "completed";

export interface Milestone {
    id: string;
    title: string;
    description: string;
    status: MilestoneStatus;
    date?: string;
}

export interface ProgressProject {
    token: string;
    projectName: string;
    clientName: string;
    clientPic: string;
    status: ProjectStatus;
    progress: number;
    startDate: string;
    estimatedCompletion: string;
    lastUpdated: string;
    description: string;
    milestones: Milestone[];
    updates: { date: string; message: string }[];
}

export const PROGRESS_PROJECTS: Record<string, ProgressProject> = {
    "abc123xyz": {
        token: "abc123xyz",
        projectName: "HQ Renovation – Phase 2",
        clientName: "PT Maju Bersama",
        clientPic: "Budi Santoso",
        status: "development",
        progress: 72,
        startDate: "2024-10-01",
        estimatedCompletion: "2025-03-31",
        lastUpdated: "2025-01-24",
        description:
            "Full renovation of headquarters second floor including electrical upgrades, HVAC installation, and interior finishing.",
        milestones: [
            {
                id: "m1",
                title: "Project Kickoff & Planning",
                description: "Initial site survey, scope finalization, and project timeline agreed.",
                status: "completed",
                date: "2024-10-05",
            },
            {
                id: "m2",
                title: "Design & Material Procurement",
                description: "Interior design approved, all materials sourced and delivered to site.",
                status: "completed",
                date: "2024-11-15",
            },
            {
                id: "m3",
                title: "Electrical & HVAC Installation",
                description: "Complete rewiring of floor 2, HVAC units installed and tested.",
                status: "completed",
                date: "2024-12-20",
            },
            {
                id: "m4",
                title: "Interior Works & Finishing",
                description: "Partitioning, flooring, ceiling works, and painting currently ongoing.",
                status: "in_progress",
                date: "2025-01-25",
            },
            {
                id: "m5",
                title: "Final Inspection & Handover",
                description: "Quality inspection, punch list resolution, and client walkthrough.",
                status: "pending",
                date: "2025-03-25",
            },
        ],
        updates: [
            { date: "2025-01-24", message: "Interior partition works 80% complete. Flooring starts next week." },
            { date: "2025-01-10", message: "HVAC commissioning completed and signed off by client." },
            { date: "2024-12-20", message: "Electrical rewiring passed inspection. HVAC installation underway." },
        ],
    },

    "braka-demo-001": {
        token: "braka-demo-001",
        projectName: "Fire Safety System Upgrade",
        clientName: "UD Prima Mandiri",
        clientPic: "Joko Prasetyo",
        status: "testing",
        progress: 90,
        startDate: "2024-11-01",
        estimatedCompletion: "2025-02-15",
        lastUpdated: "2025-01-22",
        description:
            "Full replacement and upgrade of fire suppression systems, sprinklers, smoke detectors, and emergency lighting across all 3 floors.",
        milestones: [
            {
                id: "m1",
                title: "Site Assessment & Planning",
                description: "Existing system audit, regulatory compliance review, scope finalized.",
                status: "completed",
                date: "2024-11-05",
            },
            {
                id: "m2",
                title: "Equipment Procurement",
                description: "All fire safety equipment, sprinkler heads, and detectors sourced.",
                status: "completed",
                date: "2024-11-25",
            },
            {
                id: "m3",
                title: "System Installation",
                description: "Full installation of sprinkler system, detectors, and emergency lighting.",
                status: "completed",
                date: "2025-01-05",
            },
            {
                id: "m4",
                title: "Pressure Testing & Commissioning",
                description: "Hydraulic pressure tests, alarm system commissioning, and integration checks.",
                status: "in_progress",
                date: "2025-01-22",
            },
            {
                id: "m5",
                title: "Authority Inspection & Certification",
                description: "Final inspection by fire authority, certification issuance.",
                status: "pending",
                date: "2025-02-10",
            },
            {
                id: "m6",
                title: "Client Handover",
                description: "System handover, documentation delivery, and staff training.",
                status: "pending",
                date: "2025-02-15",
            },
        ],
        updates: [
            { date: "2025-01-22", message: "Pressure testing phase 1 passed. Phase 2 alarm integration in progress." },
            { date: "2025-01-10", message: "All 3 floors installation complete. Moving to testing phase." },
            { date: "2024-12-15", message: "Ground floor and first floor installation complete." },
        ],
    },

    "client-preview-99": {
        token: "client-preview-99",
        projectName: "Server Room Cooling Installation",
        clientName: "PT Maju Bersama",
        clientPic: "Budi Santoso",
        status: "completed",
        progress: 100,
        startDate: "2024-08-01",
        estimatedCompletion: "2024-10-30",
        lastUpdated: "2024-10-28",
        description:
            "Precision cooling system installation for main server room including redundant CRAC units, hot aisle containment, and monitoring sensors.",
        milestones: [
            { id: "m1", title: "Site Survey & Design", description: "Thermal load calculation, equipment layout designed.", status: "completed", date: "2024-08-10" },
            { id: "m2", title: "Equipment Delivery", description: "2× CRAC units, PDUs, and containment panels delivered.", status: "completed", date: "2024-09-01" },
            { id: "m3", title: "Installation", description: "CRAC units mounted, piping and electrical connections completed.", status: "completed", date: "2024-09-28" },
            { id: "m4", title: "Commissioning & Testing", description: "System run-in, temperature mapping, alarm testing.", status: "completed", date: "2024-10-20" },
            { id: "m5", title: "Handover & Documentation", description: "As-built drawings, warranties, and operation manuals delivered.", status: "completed", date: "2024-10-28" },
        ],
        updates: [
            { date: "2024-10-28", message: "Project completed and handed over. All documentation delivered." },
            { date: "2024-10-20", message: "Commissioning complete. Temperature within spec across all zones." },
        ],
    },
};