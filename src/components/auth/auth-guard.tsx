"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#111827] p-8 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A3E635]">
            <span className="text-base font-black text-[#09090B]">B</span>
          </div>
          <h1 className="text-base font-semibold text-[#F4F4F5]">
            {isLoading ? "Checking your session" : "Redirecting to login"}
          </h1>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            {isLoading
              ? "Please wait while we verify your account."
              : "Your session is required to access the dashboard."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
