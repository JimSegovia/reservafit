"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { LogOut, Calendar, Users, User } from "lucide-react";
import Logo from "@/components/ui/logo";

const getClassImage = (className: string) => {
  const nameLower = className.toLowerCase();
  if (nameLower.includes("zumba")) {
    return "/images/zumba.jpg";
  }
  if (nameLower.includes("salsa")) {
    return "/images/salsa.png";
  }
  return "/images/bachata.png"; // Fallback para Reageton
};

export default function ClientHomePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const reservations = useAppStore((state) => state.reservations);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Filter reservations for this client (only paid ones)
  const clientReservations = reservations.filter(
    (res) => res.status === "Pagado" && (res.clientPhone === user?.phone || res.clientName === user?.name)
  );

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto no-scrollbar px-6 py-6 md:max-w-4xl md:mx-auto md:w-full md:px-8 animate-page-slide">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5">
          <Logo className="h-12" />
        </div>
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Avatar sphere placeholder */}
          <button
            className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 overflow-hidden flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            title="Ver perfil"
          >
            <User className="h-5 w-5 text-primary stroke-[2.2]" />
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors active:scale-95 duration-150 cursor-pointer"
          >
            <LogOut className="h-6 w-6 text-neutral-950" />
          </button>
        </div>
      </header>

      {/* Salutation */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-neutral-950">
          ¡Hola, {user?.name.split(" ")[0] || "Ana"}! 👋
        </h2>
      </div>

      {/* Heading */}
      <div className="text-center mb-4 select-none">
        <span className="text-neutral-500 font-extrabold text-xs tracking-wider uppercase">
          Estas son tus Clases Reservadas
        </span>
      </div>

      {/* Reservation List */}
      <div className="flex flex-col gap-4 mb-4">
        {clientReservations.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm select-none">
            <div className="p-4 bg-orange-50 rounded-2xl mb-4 text-primary">
              <Calendar className="h-10 w-10 stroke-[1.8]" />
            </div>
            <p className="text-neutral-500 text-sm font-semibold leading-relaxed px-4">
              No tienes reservas activas para esta semana.
            </p>
            <button
              onClick={() => router.push("/client/classes")}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-6 py-3 rounded-full mt-5 transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98]"
            >
              Explorar clases
            </button>
          </div>
        ) : (
          clientReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-neutral-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Visual Card Image Header */}
              <div className="w-full h-24 bg-neutral-200 relative select-none">
                <img
                  src={getClassImage(res.className)}
                  alt={res.className}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Card body */}
              <div className="p-4 flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1.5 select-none">
                  <Users className="h-5 w-5 text-primary stroke-[2.2]" />
                  <h3 className="text-lg font-black text-neutral-950 tracking-tight">
                    {res.className}
                  </h3>
                </div>
                
                <span className="text-sm font-extrabold text-neutral-900 mb-3 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1.5 text-center">
                  {res.date} • {res.time}
                </span>
                
                {/* Details Footer */}
                <div className="flex justify-between w-full border-t border-neutral-100 pt-3 mt-1 px-1 text-xs text-neutral-500 font-extrabold select-none">
                  <span>
                    Asientos: <span className="text-neutral-900 font-black">{res.seats.join(", ")}</span>
                  </span>
                  <span>
                    Profesor: <span className="text-neutral-900 font-black">
                      {res.className.toLowerCase().includes("salsa") ? "Profesor B" : "Profesor A"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
