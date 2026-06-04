import Image from "next/image";
import { Calendar, User, ExternalLink } from "lucide-react";
import { ProgressStatusBadge } from "./progress-status-badge";
import { ProgressBar } from "./progress-bar";
import type { PublicProgressProject } from "@/types/progress";
import brakaLogo from "@/assets/braka-nusa-core-logo.png";

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
                <div className="flex items-center">
                    <Image
                        src={brakaLogo}
                        alt="Braka logo"
                        className="h-8 w-auto"
                        priority
                    />
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
                        <ExternalLink size={10} /> brakanusacore.com
                    </div>
                </div>
            </div>
        </div>
    );
}
