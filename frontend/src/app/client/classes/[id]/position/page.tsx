"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft, Clock } from "lucide-react";

export default function PositionSelectorPage() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const occupiedSeats = useAppStore((state) => state.occupiedSeats);
  const selectSeat = useAppStore((state) => state.selectSeat);
  const deselectSeat = useAppStore((state) => state.deselectSeat);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const clearBooking = useAppStore((state) => state.clearBooking);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect back if booking expires or is cleared
  useEffect(() => {
    if (mounted && !currentBooking) {
      router.replace("/client/classes");
    }
  }, [currentBooking, mounted, router]);

  // Countdown timer interval
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, decrementTimer]);

  if (!mounted || !currentBooking) return null;

  const lockKey = `${currentBooking.classId}_${currentBooking.day}_${currentBooking.time}`;
  const occupiedList = occupiedSeats[lockKey] || [];

  const handleSeatPress = (seatNum: number) => {
    if (occupiedList.includes(seatNum)) return;
    
    if (currentBooking.selectedSeats.includes(seatNum)) {
      deselectSeat(seatNum);
    } else {
      selectSeat(seatNum);
    }
  };

  const handleContinue = () => {
    if (currentBooking.selectedSeats.length === 0) return;
    router.push("/client/checkout");
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate 30 seats
  const seatNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6">
      {/* Header */}
      <header className="flex items-center mb-6 select-none">
        <button
          onClick={() => {
            clearBooking();
            router.back();
          }}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-neutral-950" />
        </button>
        <div>
          <h2 className="text-xl font-black text-neutral-950 uppercase tracking-tight leading-none mb-1">
            {currentBooking.className}
          </h2>
          <p className="text-[11px] text-neutral-450 font-black uppercase tracking-wider">
            {currentBooking.day.split(" ")[0]}, {currentBooking.time}
          </p>
        </div>
      </header>

      {/* Sala Unique Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm mb-6">
        <div className="mb-4 select-none">
          <h3 className="text-base font-black text-neutral-950">Sala Única</h3>
          <p className="text-xs text-neutral-400 font-extrabold mt-0.5">Cupos: 30 alumnos máximo</p>
        </div>

        {/* Seat Grid Map 6 columns */}
        <div className="grid grid-cols-6 gap-2 px-1">
          {seatNumbers.map((seatNum) => {
            const isOccupied = occupiedList.includes(seatNum);
            const isSelected = currentBooking.selectedSeats.includes(seatNum);

            let bgStyle = "bg-white border-neutral-300 text-neutral-900 hover:border-neutral-400";

            if (isOccupied) {
              bgStyle = "bg-neutral-300 border-neutral-300 text-neutral-400 cursor-not-allowed";
            } else if (isSelected) {
              bgStyle = "bg-primary border-primary text-white";
            }

            return (
              <button
                key={seatNum}
                onClick={() => handleSeatPress(seatNum)}
                disabled={isOccupied}
                className={`w-full aspect-square border rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                  !isOccupied && "active:scale-[0.9] duration-100"
                } ${bgStyle}`}
              >
                {seatNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-around mb-8 select-none text-xs font-bold text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border border-neutral-350 bg-white inline-block"></span>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-primary inline-block"></span>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-neutral-300 inline-block"></span>
          <span>Ocupado</span>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-auto">
        <button
          onClick={handleContinue}
          disabled={currentBooking.selectedSeats.length === 0}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all shadow-lg text-center ${
            currentBooking.selectedSeats.length === 0
              ? "bg-neutral-350 text-white cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark text-white shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98]"
          }`}
        >
          Continuar con el pago
        </button>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-1.5 py-2 mt-4 select-none">
          <Clock className="h-4.5 w-4.5 text-neutral-900" />
          <span className="text-xs text-neutral-950 font-black">
            Reserva bloqueada por {formatTime(currentBooking.timeLeft)} min
          </span>
        </div>
      </div>
    </div>
  );
}
