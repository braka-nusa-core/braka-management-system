import { Clock, AlertTriangle, CheckCircle2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/constants/mock-data/notifications";

const CONFIG: Record<NotificationType, {
    label: string;
    icon: React.ElementType;
    iconCls: string;
    bgCls: string;
    badgeCls: string;
}> = {
    due_soon: {
        label: "Due Soon",
        icon: Clock,
        iconCls: "text-amber-400",
        bgCls: "bg-amber-500/10",
        badgeCls: "bg-amber-500/10 text-amber-400",
    },
    overdue: {
        label: "Overdue",
        icon: AlertTriangle,
        iconCls: "text-red-400",
        bgCls: "bg-red-500/10",
        badgeCls: "bg-red-500/10 text-red-400",
    },
    payment_received: {
        label: "Payment Received",
        icon: CheckCircle2,
        iconCls: "text-emerald-400",
        bgCls: "bg-emerald-500/10",
        badgeCls: "bg-emerald-500/10 text-emerald-400",
    },
    system: {
        label: "System",
        icon: Bell,
        iconCls: "text-sky-400",
        bgCls: "bg-sky-500/10",
        badgeCls: "bg-sky-500/10 text-sky-400",
    },
};

export function NotificationTypeBadge({ type }: { type: NotificationType }) {
    const cfg = CONFIG[type];
    return (
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", cfg.badgeCls)}>
            {cfg.label}
        </span>
    );
}

export function NotificationTypeIcon({ type, size = 16 }: { type: NotificationType; size?: number }) {
    const cfg = CONFIG[type];
    const Icon = cfg.icon;
    return (
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", cfg.bgCls)}>
            <Icon size={size} className={cfg.iconCls} />
        </div>
    );
}