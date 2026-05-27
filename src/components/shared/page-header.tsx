import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    breadcrumbs?: Breadcrumb[];
    className?: string;
}

export function PageHeader({ title, description, action, breadcrumbs, className }: PageHeaderProps) {
    return (
        <div className={cn("mb-6 space-y-1", className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1 text-xs text-[#A1A1AA]">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1">
                            {i > 0 && <ChevronRight size={12} className="text-[#A1A1AA]/40" />}
                            {crumb.href ? (
                                <a href={crumb.href} className="hover:text-[#F4F4F5] transition-colors">{crumb.label}</a>
                            ) : (
                                <span className="text-[#F4F4F5]">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F4F5]">{title}</h1>
                    {description && <p className="mt-0.5 text-sm text-[#A1A1AA]">{description}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        </div>
    );
}