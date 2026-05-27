"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Home, Dumbbell, Receipt } from "lucide-react";
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
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Content scroll area, offset by the bottom bar height */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16">
        {children}
      </div>

      {/* Persistent Mobile Bottom Navigation Tab Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-100 flex justify-around items-center z-40 select-none shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          
          // Match active route exactly for home, or by prefix for sub-routes (e.g. /client/classes/[id])
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
  );
}
