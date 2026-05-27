"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Dumbbell, Calendar, Users, Menu, Clock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const _hasHydrated = useAppStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/client");
      }
    }
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-cream flex flex-col overflow-y-auto custom-scroll select-none">
      {/* Full-width Header */}
      <header className="w-full h-20 bg-cream border-b border-neutral-200/50 flex justify-between items-center px-6 md:px-16 shrink-0">
        <div className="flex items-center gap-1.5">
          <Dumbbell className="h-7 w-7 text-primary stroke-[2.5]" />
          <span className="text-2xl font-black text-neutral-900 tracking-tight">
            Reserva<span className="text-primary">Fit</span>
          </span>
        </div>
        
        {/* Desktop Header Links */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => router.push("/register")}
            className="text-neutral-900 font-extrabold text-sm hover:text-primary transition-colors cursor-pointer"
          >
            Registrarse
          </button>
          <button 
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary-dark text-white font-extrabold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Mobile Header Menu Button */}
        <button className="md:hidden p-1.5 hover:bg-neutral-100 rounded-full transition-colors active:scale-95 duration-150">
          <Menu className="h-6 w-6 text-neutral-950" />
        </button>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 py-8 md:px-16 max-w-7xl mx-auto w-full">
        {/* Left Column (Text & Description) */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-[32px] md:text-5xl lg:text-6xl font-black text-neutral-950 leading-tight tracking-tight">
            Reserva tu lugar,<br />
            vive la <span className="text-primary font-black">experiencia</span>
          </h1>
          <p className="text-neutral-500 text-sm md:text-base mt-4 leading-relaxed font-medium md:max-w-xl">
            Reserva tus clases favoritas en nuestra única sala. Entrena, aprende y disfruta al máximo.
          </p>

          {/* Info Cards Row (Mobile/Desktop) */}
          <div className="grid grid-cols-2 gap-4 bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mt-6 mb-6 md:max-w-md">
            <div className="flex items-center gap-3 border-r border-neutral-100 pr-2">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 leading-tight">Una sala</h3>
                <p className="text-xs text-neutral-400 font-bold mt-0.5">Cupo 30</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 leading-tight">Clases</h3>
                <p className="text-xs text-neutral-400 font-bold mt-0.5">Lun a Sab</p>
              </div>
            </div>
          </div>

          {/* Action Button (Mobile only) */}
          <div className="w-full md:hidden mt-2">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 text-center cursor-pointer"
            >
              Iniciar Sesión
            </button>
            
            <div className="flex flex-col items-center mt-5 mb-2 gap-3.5">
              <button className="text-neutral-900 font-bold text-sm hover:underline">
                ¿Cómo funciona?
              </button>

              <div className="flex items-center gap-1.5 border border-neutral-250 rounded-full px-4 py-1.5 bg-neutral-50/80">
                <Clock className="h-4.5 w-4.5 text-neutral-950 stroke-[2]" />
                <span className="text-xs text-neutral-950 font-bold tracking-tight">
                  Reserva mínima: 10 minutos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Hero Image) */}
        <div className="flex-1 w-full h-64 md:h-[450px] lg:h-[500px] rounded-[32px] md:rounded-[48px] overflow-hidden bg-neutral-200 relative shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop"
            alt="Clase ReservaFit"
            className="w-full h-full object-cover"
          />
        </div>
      </main>
    </div>
  );
}
