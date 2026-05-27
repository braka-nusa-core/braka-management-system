import { Clock, AlertTriangle, CheckCircle2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types/notification";

const CONFIG: Record<
    NotificationType,
    {
        label: string;
        icon: React.ElementType;
        iconCls: string;
        bgCls: string;
        badgeCls: string;
    }
> = {
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

export function NotificationTypeIcon({ type }: { type: NotificationType }) {
    const { icon: Icon, iconCls, bgCls } = CONFIG[type];
    return (
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bgCls)}>
            <Icon size={18} className={iconCls} />
        </div>
    );
}

export function NotificationTypeBadge({ type }: { type: NotificationType }) {
    const { label, badgeCls } = CONFIG[type];
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                badgeCls
            )}
        >
            {label}
        </span>
    );
}
