"use client";

import { LogOut, Menu, Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS_DATA } from "@/constants/mock-data/notifications";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const { logout, user } = useAuth();
  const unreadCount = NOTIFICATIONS_DATA.filter((n) => !n.read).length;
  const initials = user?.name?.trim().charAt(0).toUpperCase() ?? "A";

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#09090B] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5] transition-colors lg:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-[15px] font-semibold text-[#F4F4F5]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative h-8 w-8 text-[#A1A1AA] hover:text-[#F4F4F5]">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-[#A3E635]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
              </span>
            )}
          </Button>
        </Link>

        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-white/[0.06] bg-[#111827] px-2 py-1 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-[#A3E635] ring-1 ring-[#A3E635]/20">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#F4F4F5]">
              {user?.name ?? "Admin"}
            </p>
            <p className="truncate text-[10px] text-[#A1A1AA]">
              {user?.email ?? "admin@braka.co.id"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#A1A1AA] hover:text-red-400"
          onClick={logout}
          title="Logout"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}
