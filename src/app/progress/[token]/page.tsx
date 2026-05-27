import { notFound } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ProgressHeader } from "@/components/progress/progress-header";
import { ProgressTimeline } from "@/components/progress/progress-timeline";
import { PROGRESS_PROJECTS } from "@/constants/mock-data/project-progress";

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function ProjectProgressPage({ params }: PageProps) {
    const { token } = await params;
    const project = PROGRESS_PROJECTS[token];
    if (!project) notFound();

    return (
        <div className="min-h-screen bg-[#09090B]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A3E635]/40 to-transparent" />

            <div className="page-enter mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
                <ProgressHeader project={project} />

                <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                <ProgressTimeline milestones={project.milestones} />

                {project.updates.length > 0 && (
                    <>
                        <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                        <div>
                            <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                                Recent Updates
                            </p>
                            <div className="space-y-3">
                                {project.updates.map((update, i) => (
                                    <div key={i} className="flex gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.03]">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#A3E635]/10">
                                            <MessageSquare size={13} className="text-[#A3E635]" />
                                        </div>
                                        <div>
                                            <p className="text-sm leading-relaxed text-white/70">{update.message}</p>
                                            <p className="mt-1.5 text-[11px] text-white/25">
                                                {new Date(update.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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