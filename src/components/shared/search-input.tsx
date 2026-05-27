"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "h-9 w-full rounded-md border border-white/10 bg-[#18181B] pl-8 pr-8 text-sm text-[#F4F4F5]",
                    "placeholder:text-[#A1A1AA]",
                    "focus:outline-none focus:ring-1 focus:ring-[#A3E635] focus:border-[#A3E635]/30",
                    "transition-colors"
                )}
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    );
}