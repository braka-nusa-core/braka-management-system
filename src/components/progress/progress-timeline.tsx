import { MilestoneItem } from "./milestone-item";
import type { Milestone } from "@/constants/mock-data/project-progress";

export function ProgressTimeline({ milestones }: { milestones: Milestone[] }) {
    return (
        <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/30">
                Project Milestones
            </h3>
            <ol className="space-y-0">
                {milestones.map((m, i) => (
                    <MilestoneItem key={m.id} milestone={m} isLast={i === milestones.length - 1} />
                ))}
            </ol>
        </div>
    );
}