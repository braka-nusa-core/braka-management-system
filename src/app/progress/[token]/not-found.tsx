import Image from "next/image";
import brakaLogo from "@/assets/braka-nusa-core-logo.png";

export default function ProgressNotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-4 text-center">
            <Image
                src={brakaLogo}
                alt="Braka logo"
                className="mb-6 h-12 w-auto"
                priority
            />
            <h1 className="text-xl font-bold text-white">Project Not Found</h1>
            <p className="mt-2 max-w-sm text-sm text-white/40">
                This progress link is invalid or has expired. Please contact your project manager for a new link.
            </p>
            <p className="mt-8 text-xs text-white/20">Braka · Professional Maintenance & Engineering Services</p>
        </div>
    );
}
