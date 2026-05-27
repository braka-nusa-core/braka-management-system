"use client";

import { MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "@/components/progress/progress-header";
import { ProgressTimeline } from "@/components/progress/progress-timeline";
import { getPublicProgressByToken } from "@/services";

export default function ProjectProgressPage() {
    const { token } = useParams<{ token: string }>();
    const { data: project, isLoading, error } = useQuery({
        queryKey: ["public-progress", token],
        queryFn: () => getPublicProgressByToken(token),
        enabled: Boolean(token),
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
                <p className="text-sm text-white/40">Loading project progress...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-4 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <span className="text-xl font-black text-[#09090B]">B</span>
                </div>
                <h1 className="text-xl font-bold text-white">Project Not Found</h1>
                <p className="mt-2 max-w-sm text-sm text-white/40">
                    This progress link is invalid or has expired. Please contact your project manager for a new link.
                </p>
                <p className="mt-8 text-xs text-white/20">
                    Braka · Professional Maintenance & Engineering Services
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090B]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A3E635]/40 to-transparent" />

            <div className="page-enter mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
                <ProgressHeader project={project} />

                <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                <ProgressTimeline milestones={project.milestones} />

                {project.description && (
                    <>
                        <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                        <div>
                            <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                                Project Summary
                            </p>
                            <div className="flex gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#A3E635]/10">
                                    <MessageSquare size={13} className="text-[#A3E635]" />
                                </div>
                                <div>
                                    <p className="text-sm leading-relaxed text-white/70">
                                        {project.description}
                                    </p>
                                    <p className="mt-1.5 text-[11px] text-white/25">
                                        Last updated{" "}
                                        {new Date(project.lastUpdated).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-20 border-t border-white/[0.05] pt-8">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#A3E635]">
                                <span className="text-[9px] font-black text-[#09090B]">B</span>
                            </div>
                            <span className="text-xs font-semibold text-white/30">Braka</span>
                        </div>
                        <p className="text-[11px] text-white/15">
                            Professional Maintenance & Engineering Services
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
