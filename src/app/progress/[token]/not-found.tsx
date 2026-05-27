import Link from "next/link";

export default function ProgressNotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635] mb-6">
                <span className="text-xl font-black text-[#09090B]">B</span>
            </div>
            <h1 className="text-xl font-bold text-white">Project Not Found</h1>
            <p className="mt-2 max-w-sm text-sm text-white/40">
                This progress link is invalid or has expired. Please contact your project manager for a new link.
            </p>
            <p className="mt-8 text-xs text-white/20">Braka · Professional Maintenance & Engineering Services</p>
        </div>
    );
}