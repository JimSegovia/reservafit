"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read the latest reservation
  const latestReservation = reservations[0];

  const handleGoHome = () => {
    router.replace("/client");
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full justify-center px-6 py-6 overflow-y-auto custom-scroll">
      {/* Success Icon Block */}
      <div className="flex flex-col items-center mb-8 text-center select-none">
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 text-white animate-bounce-short">
          <Check className="h-14 w-14 stroke-[3]" />
        </div>
        <h2 className="text-2xl font-black text-neutral-950 mt-6 leading-tight">
          ¡Pago realizado<br />con éxito!
        </h2>
        <p className="text-neutral-500 text-sm font-semibold mt-3 leading-relaxed px-4">
          Tu reserva ha sido confirmada. Hemos enviado los detalles a tu correo.
        </p>
      </div>

      {/* Ticket Details Card */}
      {latestReservation && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm mb-10 mx-1 select-none">
          <div className="flex flex-col gap-3.5 text-sm font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold">Clase</span>
              <span className="text-neutral-900 font-black">{latestReservation.className}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold">Horario</span>
              <span className="text-neutral-900 font-black">{latestReservation.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold">Asiento</span>
              <span className="text-neutral-900 font-black bg-neutral-100 px-2 py-0.5 rounded-md">
                {latestReservation.seats.join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold">Fecha</span>
              <span className="text-neutral-900 font-black">{latestReservation.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div>
        <button
          onClick={handleGoHome}
          className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 text-center"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
