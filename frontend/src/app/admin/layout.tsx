"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import Link from "next/link";
import { Home, Users, FolderGit, Calendar, Receipt, LogOut } from "lucide-react";
import Logo from "@/components/ui/logo";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const _hasHydrated = useAppStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role !== "admin") {
      router.replace("/client");
    }
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const links = [
    { name: "Inicio", path: "/admin", icon: Home, exact: true },
    { name: "Instructores", path: "/admin/instructors", icon: Users },
    { name: "Clases", path: "/admin/classes", icon: FolderGit },
    { name: "Reserva Manual", path: "/admin/manual-booking", icon: Calendar },
    { name: "Historial", path: "/admin/bookings-history", icon: Receipt },
  ];

  return (
    <div className="flex-1 flex h-full overflow-hidden relative bg-cream">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 flex-col justify-between select-none z-45 shrink-0">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-neutral-100">
            <Logo className="h-11" />
            <span className="text-[9px] bg-orange-50 border border-orange-100 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider ml-1 shrink-0">
              Admin
            </span>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 p-4 mt-4">
            {links.map((link) => {
              const Icon = link.icon;
              
              const isActive = link.exact
                ? pathname === link.path
                : pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                    isActive 
                      ? "bg-orange-50/70 text-primary font-black shadow-sm" 
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-bold"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                  <span className="text-sm">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={() => {
              useAppStore.getState().logout();
              router.replace("/");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-neutral-55 hover:bg-red-50 hover:text-red-500 text-neutral-500 hover:border-red-100 border border-transparent font-bold transition-all duration-150 cursor-pointer active:scale-95"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
