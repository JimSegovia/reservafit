"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {children}
    </div>
  );
}
