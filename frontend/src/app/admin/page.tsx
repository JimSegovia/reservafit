"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Dumbbell, LogOut, Calendar, Users, Wallet, ChevronRight, UserSquare, FolderGit, Receipt } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const logout = useAppStore((state) => state.logout);
  const classes = useAppStore((state) => state.classes);
  const instructors = useAppStore((state) => state.instructors);
  const reservations = useAppStore((state) => state.reservations);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Calculations based on local Zustand mock state
  const activeClassesCount = classes.filter((c) => c.status === "Activo").length;
  const totalReservationsCount = reservations.filter((r) => r.status === "Pagado").length;
  const activeInstructorsCount = instructors.filter((i) => i.status === "Activo").length;
  const totalIncome = reservations
    .filter((r) => r.status === "Pagado")
    .reduce((sum, r) => sum + r.price, 0);

  const quickLinks = [
    { label: "Instructores", icon: Users, route: "/admin/instructors" },
    { label: "Clases", icon: FolderGit, route: "/admin/classes" },
    { label: "Historial", icon: Receipt, route: "/admin/bookings-history" },
    { label: "Registrar reserva manual", icon: Calendar, route: "/admin/manual-booking" },
  ];

  const kpis = [
    { label: "Clases hoy", val: activeClassesCount, icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-50/50" },
    { label: "Reservas hoy", val: totalReservationsCount, icon: Calendar, color: "text-primary", bg: "bg-orange-50/50" },
    { label: "Instructores", val: activeInstructorsCount, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50/50" },
    { label: "Ingresos hoy", val: `S/ ${totalIncome}`, icon: Wallet, color: "text-neutral-500", bg: "bg-neutral-100/50" },
  ];

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6 md:max-w-4xl md:mx-auto md:w-full md:px-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 select-none">
        <div className="flex items-center gap-1.5">
          <Dumbbell className="h-6 w-6 text-primary stroke-[2.5]" />
          <span className="text-2xl font-black text-neutral-900 tracking-tight">
            Reserva<span className="text-primary font-black">Fit</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors active:scale-95 duration-150 md:hidden"
        >
          <LogOut className="h-6 w-6 text-neutral-950" />
        </button>
      </header>

      {/* Salutation */}
      <div className="mb-6 select-none animate-fadeIn">
        <h2 className="text-2xl font-black text-neutral-950">¡Hola, Admin! 👋</h2>
        <p className="text-xs text-neutral-450 font-black mt-1 uppercase tracking-wider">
          Resumen general
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-neutral-150 rounded-3xl p-4 shadow-sm flex flex-col items-center justify-center text-center select-none"
            >
              <div className={`p-2 rounded-xl mb-2 ${kpi.bg} ${kpi.color}`}>
                <Icon className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide">
                {kpi.label}
              </span>
              <span className="text-xl font-black text-neutral-950 mt-1">
                {kpi.val}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Links Section */}
      <div className="bg-white border border-neutral-150 rounded-3xl p-5 shadow-sm mb-4">
        <h3 className="text-sm font-black text-neutral-950 mb-4 select-none uppercase tracking-wider">
          Accesos rápidos
        </h3>
        
        <div className="flex flex-col gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => router.push(link.route)}
                className="flex items-center justify-between border border-neutral-150 hover:border-neutral-250 rounded-2xl p-4 bg-neutral-50/40 hover:bg-neutral-50 transition-all text-left active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-neutral-950 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-neutral-950">{link.label}</span>
                </div>
                <ChevronRight className="h-4.5 w-4.5 text-neutral-400 group-hover:text-neutral-600 transition-all group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
