"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft, Clock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const decrementTimer = useAppStore((state) => state.decrementTimer);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect back if no booking is active
  useEffect(() => {
    if (mounted && !currentBooking) {
      router.replace("/client/classes");
    }
  }, [currentBooking, mounted, router]);

  // Sync Timer countdown
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, decrementTimer]);

  if (!mounted || !currentBooking) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cell number
    if (!phone || phone.length < 9 || !phone.startsWith("9")) {
      setError("Por favor ingresa un número de celular Yape válido (9 dígitos comenzando con 9).");
      return;
    }

    const reservation = confirmBooking(phone);
    if (reservation) {
      setError("");
      router.push("/client/success");
    } else {
      setError("Ocurrió un error al procesar el pago.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6">
      {/* Header */}
      <header className="flex items-center mb-6 select-none">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-neutral-950" />
        </button>
        <h2 className="text-xl font-black text-neutral-950">Pagar con Yape</h2>
      </header>

      {/* Yape Logo / Mascot Circle */}
      <div className="flex flex-col items-center mb-6 select-none">
        <div className="h-16 flex items-center justify-center select-none">
          <img
            src="/images/yapelogo.png"
            alt="Yape"
            className="h-full object-contain"
          />
        </div>
        <p className="text-neutral-400 text-xs font-bold mt-3 text-center">
          Yape es el único medio de pago aceptado.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
          {error}
        </div>
      )}

      {/* Order Summary Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm mb-6 select-none">
        <h3 className="text-base font-black text-neutral-950 mb-4">Resumen del pedido</h3>

        <div className="flex flex-col gap-3 mb-4 text-sm font-semibold">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-bold">Clase</span>
            <span className="text-neutral-900 font-black">{currentBooking.className}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-bold">Horario</span>
            <span className="text-neutral-900 font-black">{currentBooking.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-bold">Asiento(s)</span>
            <span className="text-neutral-900 font-black bg-neutral-100 px-2 py-0.5 rounded-md">
              {currentBooking.selectedSeats.join(", ")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-bold">Fecha</span>
            <span className="text-neutral-900 font-black">
              {currentBooking.day.split(" ").slice(1).join(" ")}
            </span>
          </div>
        </div>

        {/* Total block */}
        <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4 flex justify-between items-center mt-2">
          <div>
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block">
              Monto a pagar
            </span>
            <span className="text-3xl font-black text-primary mt-0.5 block">
              S/ {currentBooking.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handlePay} className="flex flex-col flex-1 justify-between">
        <div className="mb-6">
          <label className="text-neutral-500 font-extrabold text-xs ml-1 block mb-2">
            Número de celular Yape
          </label>
          <input
            type="tel"
            placeholder="9XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={9}
            className="w-full border border-neutral-300 rounded-xl bg-white px-4 py-4 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 text-center"
          >
            Pagar con Yape
          </button>

          {/* Locked Seat Timer */}
          <div className="flex items-center justify-center gap-1.5 py-2 mt-4 select-none">
            <Clock className="h-4.5 w-4.5 text-neutral-950" />
            <span className="text-xs text-neutral-950 font-black">
              Reserva bloqueada por {formatTime(currentBooking.timeLeft)} min
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
