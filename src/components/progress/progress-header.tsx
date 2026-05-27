import { Calendar, User, ExternalLink } from "lucide-react";
import { ProgressStatusBadge } from "./progress-status-badge";
import { ProgressBar } from "./progress-bar";
import type { PublicProgressProject } from "@/types/progress";

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function ProgressHeader({ project }: { project: PublicProgressProject }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A3E635] shadow-[0_0_16px_rgba(163,230,53,0.3)]">
                        <span className="text-sm font-black text-[#09090B]">B</span>
                    </div>
                    <span className="tracking-tight text-sm font-bold text-white/50">
                        Braka
                    </span>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-widest text-white/20">
                    Project Status
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <ProgressStatusBadge status={project.status} size="md" />
                    <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                        {project.projectName}
                    </h1>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/40">
                    <span className="flex items-center gap-1.5">
                        <User size={13} className="shrink-0" />
                        {project.clientName}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="shrink-0" />
                        Updated {formatDate(project.lastUpdated)}
                    </span>
                </div>
                {project.description && (
                    <p className="max-w-xl text-sm leading-relaxed text-white/35">
                        {project.description}
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                <ProgressBar value={project.progress} showLabel size="lg" animated />
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-white/25">
                        Last updated: {formatDate(project.lastUpdated)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-white/20">
                        <ExternalLink size={10} /> braka.co.id
                    </div>
                </div>
            </div>
        </div>
    );
}
