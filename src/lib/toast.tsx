"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    toast: (opts: Omit<Toast, "id">) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ElementType> = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const STYLES: Record<ToastType, { icon: string; border: string }> = {
    success: { icon: "text-emerald-400", border: "border-emerald-500/20" },
    error: { icon: "text-red-400", border: "border-red-500/20" },
    warning: { icon: "text-amber-400", border: "border-amber-500/20" },
    info: { icon: "text-sky-400", border: "border-sky-500/20" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const Icon = ICONS[toast.type];
    const style = STYLES[toast.type];

    useEffect(() => {
        const timer = setTimeout(onDismiss, toast.duration ?? 4000);
        return () => clearTimeout(timer);
    }, [toast.duration, onDismiss]);

    return (
        <div className={cn(
            "flex w-[340px] items-start gap-3 rounded-xl border bg-[#111827] p-4 shadow-2xl shadow-black/40",
            "animate-in slide-in-from-right-5 fade-in duration-300",
            style.border
        )}>
            <Icon size={17} className={cn("mt-0.5 shrink-0", style.icon)} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#F4F4F5]">{toast.title}</p>
                {toast.description && (
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">{toast.description}</p>
                )}
            </div>
            <button
                onClick={onDismiss}
                className="shrink-0 text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((opts: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { ...opts, id }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            {/* Portal */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}