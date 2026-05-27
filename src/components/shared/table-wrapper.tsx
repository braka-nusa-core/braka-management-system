import { cn } from "@/lib/utils";

interface TableWrapperProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function TableWrapper({ children, footer, className }: TableWrapperProps) {
    return (
        <div className={cn("overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]", className)}>
            <div className="overflow-x-auto">{children}</div>
            {footer && (
                <div className="border-t border-white/[0.06] px-4 py-3">
                    {footer}
                </div>
            )}
        </div>
    );
}

interface DataTableProps {
    headers: string[];
    children: React.ReactNode;
    isEmpty?: boolean;
    emptyState?: React.ReactNode;
}

export function DataTable({ headers, children, isEmpty, emptyState }: DataTableProps) {
    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-white/[0.06]">
                    {headers.map((h) => (
                        <th
                            key={h}
                            className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {isEmpty
                    ? <tr><td colSpan={headers.length}>{emptyState}</td></tr>
                    : children
                }
            </tbody>
        </table>
    );
}

export function DataTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <tr className={cn(
            "border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]",
            className
        )}>
            {children}
        </tr>
    );
}

export function DataTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <td className={cn("px-4 py-3 text-[#F4F4F5]", className)}>
            {children}
        </td>
    );
}