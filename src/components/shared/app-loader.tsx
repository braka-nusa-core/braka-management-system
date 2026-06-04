import Image from "next/image";
import brakaLogo from "@/assets/braka-nusa-core-logo.png";

export function AppLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B]">
            <div className="flex items-center gap-3 mb-8">
                <Image
                    src={brakaLogo}
                    alt="Braka logo"
                    className="h-10 w-auto"
                    priority
                />
                <span className="text-lg font-bold text-[#F4F4F5]">Braka</span>
            </div>

            {/* Animated bar */}
            <div className="h-0.5 w-48 overflow-hidden rounded-full bg-[#18181B]">
                <div className="h-full w-1/3 rounded-full bg-[#A3E635] animate-[loading_1.2s_ease-in-out_infinite]" />
            </div>

            <p className="mt-4 text-xs text-[#A1A1AA]">Loading...</p>

            <style jsx>{`
        @keyframes loading {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
        </div>
    );
}
