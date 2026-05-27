import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortState } from "@/hooks/use-table-sort";

interface SortHeaderProps {
    label: string;
    sortKey: string;
    sort: SortState;
    onSort: (key: string) => void;
    className?: string;
}

export function SortHeader({ label, sortKey, sort, onSort, className }: SortHeaderProps) {
    const isActive = sort.key === sortKey;
    return (
        <th
            className={cn(
                "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider cursor-pointer select-none group",
                isActive ? "text-[#F4F4F5]" : "text-[#A1A1AA]",
                className
            )}
            onClick={() => onSort(sortKey)}
        >
            <span className="flex items-center gap-1">
                {label}
                <span className="text-[#A1A1AA]/40 group-hover:text-[#A1A1AA] transition-colors">
                    {!isActive && <ChevronsUpDown size={12} />}
                    {isActive && sort.direction === "asc" && <ChevronUp size={12} className="text-[#A3E635]" />}
                    {isActive && sort.direction === "desc" && <ChevronDown size={12} className="text-[#A3E635]" />}
                </span>
            </span>
        </th>
    );
}