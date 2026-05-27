import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center gap-1 text-xs text-[#A1A1AA]", className)}>
            <Link href="/dashboard" className="flex items-center hover:text-[#F4F4F5] transition-colors">
                <Home size={12} />
            </Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                    <ChevronRight size={12} className="text-[#A1A1AA]/30" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#F4F4F5] transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-[#F4F4F5]">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}