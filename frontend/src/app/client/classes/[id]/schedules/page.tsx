"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft, Bell, Clock } from "lucide-react";

export default function HorariosDisponiblesPage() {
  const router = useRouter();
  const params = useParams();
  const classes = useAppStore((state) => state.classes);
  
  const classId = (params.id as string) || "c7";
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamically generate all Mondays, Wednesdays, and Fridays starting from May 1, 2026 (156 dates)
  const days = useMemo(() => {
    const result = [];
    const daysOfWeek = [1, 3, 5]; // Mon, Wed, Fri
    const current = new Date(2026, 4, 1); // May 1, 2026
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    let count = 0;
    while (count < 156) {
      const day = current.getDay();
      if (daysOfWeek.includes(day)) {
        const dayName = day === 1 ? "LUN" : day === 3 ? "MIE" : "VIE";
        const dayNum = current.getDate().toString().padStart(2, "0");
        const monthLabel = months[current.getMonth()];
        const formatted = {
          id: `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`,
          dayName,
          dayNum,
          monthLabel,
          fullLabel: `${day === 1 ? "LUNES" : day === 3 ? "MIÉRCOLES" : "VIERNES"} ${dayNum}/${(current.getMonth() + 1).toString().padStart(2, "0")}`,
          date: new Date(current)
        };
        result.push(formatted);
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, []);

  const [selectedDay, setSelectedDay] = useState(days[1].fullLabel);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDayClick = (clickedIndex: number) => {
    setSelectedIndex(clickedIndex);
    setSelectedDay(days[clickedIndex].fullLabel);
  };

  // Generate dynamic slots based on selected date to simulate live availability
  const getSlotsForDay = (day: string) => {
    const seed = day.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      { time: "5:00 PM - 6:00 PM", teacher: "Profesor A", enrolled: `${(seed % 8)}/30`, status: "Disponible" as const },
      { time: "6:00 PM - 7:00 PM", teacher: "Profesor B", enrolled: `${10 + (seed % 10)}/30`, status: "Disponible" as const },
      { time: "7:00 PM - 8:00 PM", teacher: "Profesor C", enrolled: `${15 + (seed % 12)}/30`, status: "Disponible" as const },
      { time: "8:00 PM - 9:00 PM", teacher: "Profesor D", enrolled: `${(seed % 2 === 0 ? 30 : 22)}/30`, status: (seed % 2 === 0 ? "Lleno" : "Disponible") as "Disponible" | "Lleno" | "Cancelada" },
      { time: "9:00 PM - 10:00 PM", teacher: "Profesor E", enrolled: `${(seed % 15)}/30`, status: (seed % 7 === 0 ? "Cancelada" : "Disponible") as "Disponible" | "Lleno" | "Cancelada" },
    ];
  };

  const slots = getSlotsForDay(selectedDay);

  const handleSlotSelect = (slot: typeof slots[0]) => {
    if (slot.status === "Lleno" || slot.status === "Cancelada") return;
    
    // Redirect to detail page with overrides
    router.push(`/client/classes/${classItem.id}?day=${encodeURIComponent(selectedDay)}&time=${encodeURIComponent(slot.time)}`);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6 animate-page-slide">
      {/* Dynamic style for ease-out-expo */}
      <style dangerouslySetInnerHTML={{__html: `
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 select-none shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6 text-neutral-950" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black text-neutral-950">Horarios Disponibles</h2>
          <p className="text-xs text-neutral-400 font-extrabold mt-0.5 uppercase tracking-wider">
            Clase: {classItem.title}
          </p>
        </div>
        <button className="p-1 hover:bg-neutral-100 rounded-full relative transition-colors cursor-pointer">
          <Bell className="h-6 w-6 text-neutral-950" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      {/* Day selection viewport - Shows exactly 3 days */}
      <div className="w-full overflow-hidden relative py-4 select-none mb-6 shrink-0">
        <div
          className="flex gap-0 transition-transform duration-300 ease-out-expo items-center"
          style={{
            width: `${days.length * 33.3333}%`,
            transform: `translateX(calc((1 - ${selectedIndex}) * 100% / ${days.length}))`
          }}
        >
          {days.map((day, idx) => {
            const isSelected = day.fullLabel === selectedDay;
            return (
              <div key={day.id + "-" + idx} style={{ width: `${100 / days.length}%` }} className="px-1 flex justify-center items-center shrink-0">
                <button
                  onClick={() => handleDayClick(idx)}
                  className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black tracking-wide uppercase select-none text-center transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-orange-500/20"
                      : "text-neutral-950 hover:text-neutral-700"
                  }`}
                >
                  {day.fullLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slots List */}
      <div className="flex flex-col gap-4 mb-6">
        {slots.map((slot, index) => {
          let badgeBg = "bg-neutral-100";
          let badgeText = "text-neutral-500";
          let badgeBorder = "border-neutral-200";

          if (slot.status === "Disponible") {
            badgeBg = "bg-success-bg";
            badgeText = "text-success-text";
            badgeBorder = "border-success-border/50";
          } else if (slot.status === "Lleno") {
            badgeBg = "bg-danger-bg";
            badgeText = "text-danger-text";
            badgeBorder = "border-danger-border/30";
          } else if (slot.status === "Cancelada") {
            badgeBg = "bg-special-bg";
            badgeText = "text-special-text";
            badgeBorder = "border-special-border/40";
          }

          const isUnavailable = slot.status === "Lleno" || slot.status === "Cancelada";

          return (
            <button
              key={index}
              onClick={() => handleSlotSelect(slot)}
              disabled={isUnavailable}
              className={`bg-white border border-neutral-200 rounded-2xl p-4 flex justify-between items-center text-left transition-all ${
                isUnavailable ? "opacity-55 cursor-not-allowed" : "hover:border-neutral-300 active:scale-[0.99]"
              }`}
            >
              <div>
                <h3 className="text-base font-black text-neutral-950 mb-0.5">{slot.time}</h3>
                <p className="text-xs text-neutral-400 font-bold mb-1">{slot.teacher}</p>
                <p className="text-xs text-neutral-500 font-extrabold">{slot.enrolled} inscritos</p>
              </div>

              <div className={`px-3 py-1 rounded-full border text-xs font-black select-none ${badgeBg} ${badgeBorder} ${badgeText}`}>
                {slot.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer warning text */}
      <div className="flex flex-col items-center mt-auto mb-2 text-center text-neutral-400 text-xs font-bold leading-relaxed select-none">
        <span>Mínimo para la clase: 7 personas</span>
        <span>Las reservas deben realizarse 3 horas antes</span>
      </div>
    </div>
  );
}
