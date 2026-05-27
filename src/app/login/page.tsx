"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login({ email, password });
      toast({
        type: "success",
        title: "Login successful",
        description: "Welcome back to Braka Dashboard.",
      });
      router.replace("/dashboard");
    } catch (error) {
      toast({
        type: "error",
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Please check your credentials.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%)]" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white/[0.08] bg-[#111827]/95 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A3E635] shadow-[0_0_24px_rgba(163,230,53,0.28)]">
            <span className="text-lg font-black text-[#09090B]">B</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A3E635]/70">
            Braka Dashboard
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[#F4F4F5]">
            Login to your admin workspace
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
            We will call `POST /auth/login`, store the bearer token, then fetch your
            profile from `GET /auth/me`.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Email</label>
            <Input
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Password</label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <Button className="h-10 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck />
                Sign in
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
