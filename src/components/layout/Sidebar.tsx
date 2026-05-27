"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Wrench,
  FileText, Bell, Settings, X, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/constants/navigation";
import { NOTIFICATIONS_DATA } from "@/constants/mock-data/notifications";

const ICON_MAP = {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  Bell,
  Settings,
  BarChart2,
} as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const unreadCount = NOTIFICATIONS_DATA.filter((n) => !n.read).length;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col",
        "border-r border-white/[0.06] bg-[#09090B]",
        "transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#A3E635]">
              <span className="text-[11px] font-black text-[#09090B]">B</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-[#F4F4F5]">
              {APP_NAME}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5] transition-colors lg:hidden"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">
            Menu
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const isBell = item.icon === "Bell";

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-[#A3E635]/10 text-[#A3E635]"
                        : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                    )}
                  >
                    <Icon size={16} className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-[#A3E635]" : "text-[#A1A1AA] group-hover:text-[#F4F4F5]"
                    )} />
                    <span className="flex-1">{item.label}</span>
                    {isBell && unreadCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A3E635] px-1 text-[10px] font-bold text-[#09090B]">
                        {unreadCount}
                      </span>
                    )}
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#A3E635]" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#18181B] px-3 py-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/20 text-xs font-bold text-[#A3E635]">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#F4F4F5]">Admin</p>
              <p className="truncate text-[10px] text-[#A1A1AA]">admin@braka.co.id</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}