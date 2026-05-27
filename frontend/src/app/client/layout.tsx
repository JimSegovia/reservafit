"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Home, Dumbbell, Receipt, LogOut } from "lucide-react";
import Link from "next/link";

export default function ClientLayout({
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
    } else if (user.role !== "client") {
      router.replace("/admin");
    }
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const tabs = [
    { name: "Inicio", path: "/client", icon: Home },
    { name: "Clases", path: "/client/classes", icon: Dumbbell },
    { name: "Pagos", path: "/client/payments", icon: Receipt },
  ];

  return (
    <div className="flex-1 flex h-full overflow-hidden relative bg-cream">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 flex-col justify-between select-none z-45 shrink-0">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-neutral-100">
            <Dumbbell className="h-6 w-6 text-primary stroke-[2.5]" />
            <span className="text-xl font-black text-neutral-900 tracking-tight">
              Reserva<span className="text-primary font-black">Fit</span>
            </span>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 p-4 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              
              // Match active route exactly for home, or by prefix for sub-routes
              const isActive = tab.path === "/client"
                ? pathname === "/client"
                : pathname.startsWith(tab.path);

              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                    isActive 
                      ? "bg-orange-50/70 text-primary font-black shadow-sm" 
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-bold"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                  <span className="text-sm">
                    {tab.name}
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
        {/* Content area: offset bottom on mobile, no offset on desktop */}
        <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-100 flex justify-around items-center z-40 select-none shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            
            const isActive = tab.path === "/client"
              ? pathname === "/client"
              : pathname.startsWith(tab.path);

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-all duration-150 active:scale-90 ${
                  isActive ? "text-primary font-black" : "text-neutral-400 hover:text-neutral-500 font-bold"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                <span className="text-[10px] tracking-wider uppercase">
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
