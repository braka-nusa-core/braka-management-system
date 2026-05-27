import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090B] px-4">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[500px] w-[500px] rounded-full bg-[#A3E635]/[0.04] blur-[120px]" />
            </div>

            <div className="page-enter relative text-center">
                <div className="mb-8 flex items-center justify-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                        <span className="text-lg font-black text-[#09090B]">B</span>
                    </div>
                    <span className="text-base font-semibold text-[#F4F4F5]">Braka</span>
                </div>

                <p className="text-[120px] font-black leading-none tracking-tighter text-[#A3E635]/[0.08] select-none sm:text-[160px]">
                    404
                </p>

                <div className="-mt-4 space-y-2">
                    <h1 className="text-2xl font-bold text-[#F4F4F5]">Page not found</h1>
                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-lg bg-[#A3E635] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-all hover:bg-[#b5f23f] hover:shadow-[0_0_16px_rgba(163,230,53,0.3)] active:scale-95"
                    >
                        <Home size={14} /> Go to Dashboard
                    </Link>
                    <Link
                        href="javascript:history.back()"
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#A1A1AA] transition-all hover:bg-[#1f1f23] hover:text-[#F4F4F5] hover:border-white/20 active:scale-95"
                    >
                        <ArrowLeft size={14} /> Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
}
