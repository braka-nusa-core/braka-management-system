"use client";

import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
    key: string | null;
    direction: SortDirection;
}

export function useTableSort<T>(data: T[]) {
    const [sort, setSort] = useState<SortState>({ key: null, direction: null });

    function toggleSort(key: string) {
        setSort((prev) => {
            if (prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return { key: null, direction: null };
        });
    }

    const sorted = useMemo(() => {
        if (!sort.key || !sort.direction) return data;
        return [...data].sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[sort.key!];
            const bVal = (b as Record<string, unknown>)[sort.key!];
            if (aVal === undefined || bVal === undefined) return 0;
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sort.direction === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
    }, [data, sort]);

    return { sorted, sort, toggleSort };
}