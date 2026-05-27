import { cn } from "@/lib/utils";

interface SectionLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function SectionLayout({ children, className }: SectionLayoutProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {children}
        </div>
    );
}

interface SectionProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function Section({ title, description, action, children, className }: SectionProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {(title || action) && (
                <div className="flex items-center justify-between gap-4">
                    <div>
                        {title && <h2 className="text-[15px] font-semibold text-[#F4F4F5]">{title}</h2>}
                        {description && <p className="mt-0.5 text-xs text-[#A1A1AA]">{description}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}

export function TwoColLayout({ left, right, leftSpan = 1 }: {
    left: React.ReactNode;
    right: React.ReactNode;
    leftSpan?: 1 | 2;
}) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className={cn("space-y-6", leftSpan === 2 ? "lg:col-span-2" : "lg:col-span-1")}>
                {left}
            </div>
            <div className={cn("space-y-6", leftSpan === 2 ? "lg:col-span-1" : "lg:col-span-2")}>
                {right}
            </div>
        </div>
    );
}