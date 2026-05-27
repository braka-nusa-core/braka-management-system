import { cn } from "@/lib/utils";
import { Users, FileText, Wrench, Bell, SearchX, FolderOpen, type LucideIcon } from "lucide-react";

type EmptyStateVariant = "clients" | "invoices" | "maintenance" | "notifications" | "search" | "generic";

const CONFIG: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string; iconBg: string; }> = {
    clients: { icon: Users, title: "No clients yet", description: "Add your first client to get started.", iconBg: "bg-sky-500/10 text-sky-400" },
    invoices: { icon: FileText, title: "No invoices found", description: "Create your first invoice or adjust your filters.", iconBg: "bg-violet-500/10 text-violet-400" },
    maintenance: { icon: Wrench, title: "No contracts found", description: "Add a maintenance contract to start tracking.", iconBg: "bg-amber-500/10 text-amber-400" },
    notifications: { icon: Bell, title: "All caught up", description: "No notifications to show right now.", iconBg: "bg-[#A3E635]/10 text-[#A3E635]" },
    search: { icon: SearchX, title: "No results found", description: "Try adjusting your search or filter criteria.", iconBg: "bg-[#18181B] text-[#A1A1AA]" },
    generic: { icon: FolderOpen, title: "Nothing here yet", description: "Content will appear here once added.", iconBg: "bg-[#18181B] text-[#A1A1AA]" },
};

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ variant = "generic", title, description, action, className }: EmptyStateProps) {
    const cfg = CONFIG[variant];
    const Icon = cfg.icon;

    return (
        <div className={cn("flex flex-col items-center justify-center py-16 text-center fade-in", className)}>
            <div className={cn(
                "mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06]",
                cfg.iconBg
            )}>
                <Icon size={26} strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-semibold text-[#F4F4F5]">{title ?? cfg.title}</p>
            <p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-[#A1A1AA]">{description ?? cfg.description}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}