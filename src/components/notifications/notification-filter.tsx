type FilterTab = "all" | "unread" | "read";

interface NotificationFilterProps {
    active: FilterTab;
    onChange: (tab: FilterTab) => void;
    unreadCount: number;
}

const TABS: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Read", value: "read" },
];

export function NotificationFilter({ active, onChange, unreadCount }: NotificationFilterProps) {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
            {TABS.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active === tab.value
                            ? "bg-[#A3E635] text-[#09090B]"
                            : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                        }`}
                >
                    {tab.label}
                    {tab.value === "unread" && unreadCount > 0 && (
                        <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${active === "unread" ? "bg-[#09090B] text-[#A3E635]" : "bg-[#A3E635] text-[#09090B]"
                            }`}>
                            {unreadCount}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export type { FilterTab };