"use client";

import { useCallback, useState } from "react";
import {
    Link2, Copy, ExternalLink, RefreshCw,
    CheckCheck, Globe, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegenerateLinkDialog } from "./regenerate-link-dialog";
import { useToastActions } from "@/hooks/use-toast-actions";

function buildProgressUrl(token: string): string {
    // In production this would be the real domain; for dev we use localhost
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${base}/progress/${token}`;
}

interface PublicProgressCardProps {
    clientName: string;
    initialToken?: string;
}

export function PublicProgressCard({ clientName, initialToken }: PublicProgressCardProps) {
    const [copied, setCopied] = useState(false);
    const [regenOpen, setRegenOpen] = useState(false);
    const router = useRouter();
    const t = useToastActions();
    const token = initialToken ?? null;

    const progressUrl = token ? buildProgressUrl(token) : null;

    // Copy to clipboard
    const handleCopy = useCallback(async () => {
        if (!progressUrl) return;
        try {
            await navigator.clipboard.writeText(progressUrl);
            setCopied(true);
            t.exportStarted(); // reuse "info" toast
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for browsers that block clipboard
            const el = document.createElement("textarea");
            el.value = progressUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [progressUrl, t]);

    function handleGenerate() {
        router.push("/progress");
    }

    function handleRegenConfirm() {
        setRegenOpen(false);
        router.push("/progress");
    }

    return (
        <>
            <div className="rounded-xl border border-white/[0.06] bg-[#111827] overflow-hidden">
                {/* Card header */}
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A3E635]/10">
                            <Globe size={15} className="text-[#A3E635]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#F4F4F5]">Public Progress Portal</p>
                            <p className="text-xs text-[#A1A1AA]">Share a live project status page with your client</p>
                        </div>
                    </div>
                    {token && (
                        <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                            Active
                        </span>
                    )}
                </div>

                <div className="p-5">
                    {/* ── No token: empty state ─────────────────────────────── */}
                    {!token && (
                        <div className="flex flex-col items-center py-8 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#18181B]">
                                <Link2 size={22} className="text-[#A1A1AA]" />
                            </div>
                            <p className="text-sm font-semibold text-[#F4F4F5]">No public link yet</p>
                            <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-[#A1A1AA]">
                                Generate a shareable link so {clientName} can track project progress in real time.
                            </p>
                            <Button
                                size="sm"
                                className="mt-5 gap-2"
                                onClick={handleGenerate}
                            >
                                <Sparkles size={13} />
                                Generate Public Link
                            </Button>
                        </div>
                    )}

                    {/* ── Has token: URL display + actions ──────────────────── */}
                    {token && progressUrl && (
                        <div className="space-y-4">
                            {/* URL bar */}
                            <div className="group relative flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#18181B] px-3 py-2.5 transition-colors hover:border-white/[0.14]">
                                <Link2 size={13} className="shrink-0 text-[#A1A1AA]" />
                                <input
                                    readOnly
                                    value={progressUrl}
                                    className="min-w-0 flex-1 bg-transparent font-mono text-xs text-[#F4F4F5] focus:outline-none"
                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                                <button
                                    onClick={handleCopy}
                                    className="shrink-0 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-white/[0.08]"
                                    title="Copy link"
                                >
                                    {copied ? (
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCheck size={12} /> Copied
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[#A1A1AA]">
                                            <Copy size={12} /> Copy
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Token display */}
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#A1A1AA]/50">Token:</span>
                                <code className="font-mono text-[11px] text-[#A1A1AA]">{token}</code>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Link href={`/progress/${token}`} target="_blank" className="flex-1 sm:flex-none">
                                    <Button size="sm" className="w-full gap-2 sm:w-auto">
                                        <ExternalLink size={13} />
                                        Open Portal
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2 sm:flex-none"
                                    onClick={handleCopy}
                                >
                                    {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                                    {copied ? "Copied!" : "Copy Link"}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 gap-2 text-[#A1A1AA] hover:text-amber-400 sm:flex-none"
                                    onClick={() => setRegenOpen(true)}
                                >
                                    <RefreshCw size={13} />
                                    Regenerate
                                </Button>
                            </div>

                            {/* Helper text */}
                            <p className="text-[11px] leading-relaxed text-[#A1A1AA]/50">
                                Anyone with this link can view the project progress page. No login required.
                                Regenerating will invalidate the current link.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <RegenerateLinkDialog
                open={regenOpen}
                onClose={() => setRegenOpen(false)}
                onConfirm={handleRegenConfirm}
            />
        </>
    );
}
