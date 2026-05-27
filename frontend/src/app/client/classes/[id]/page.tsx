"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ChevronLeft, User, Calendar, Clock, Users, Palette } from "lucide-react";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const classes = useAppStore((state) => state.classes);
  const startBooking = useAppStore((state) => state.startBooking);

  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [translateY, setTranslateY] = useState("100%");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startY, setStartY] = useState(0);
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setTranslateY("0%");
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setDragOffset(diff);
    } else {
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 120) {
      setTranslateY("100%");
      setDragOffset(0);
      setTimeout(() => {
        router.back();
      }, 250);
    } else {
      setDragOffset(0);
    }
  };

  const handleBack = () => {
    setTranslateY("100%");
    setTimeout(() => {
      router.back();
    }, 250);
  };

  const classId = (params.id as string) || "c10";
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  // Read search overrides if redirected from a specific schedule slot (e.g. Zumba)
  const queryDay = searchParams.get("day");
  const queryTime = searchParams.get("time");

  const displayDay = queryDay || classItem.days?.[0] || "LUNES 12/05";
  const displayTime = queryTime || classItem.slots?.[0] || classItem.schedule.split(" ").slice(-2).join(" ") || "6:00 PM - 7:00 PM";

  const capacityPercentage = Math.round((classItem.enrolled / classItem.capacity) * 100);

  const handleEnroll = () => {
    // Start booking process
    startBooking({
      classId: classItem.id,
      className: classItem.title,
      day: displayDay,
      time: displayTime,
      instructorName: classItem.instructorName,
      pricePerSeat: classItem.price
    });

    // Go to Seat Selector (position selector)
    router.push(`/client/classes/${classItem.id}/position`);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll ${
        isDragging ? "" : "bottom-sheet-transition"
      }`}
      style={{
        transform: isDragging
          ? `translateY(${dragOffset}px)`
          : `translateY(${translateY})`
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .bottom-sheet-transition {
          transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />
      {/* Header Hero Image with Back Button */}
      <div className="relative w-full h-60 bg-neutral-200 select-none">
        <img
          src={
            classItem.id === "c7"
              ? "/images/zumba.jpg"
              : classItem.id === "c8"
              ? "/images/salsa.png"
              : "/images/bachata.png"
          }
          alt={classItem.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/45 hover:bg-black/60 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Content Body */}
      <div className="px-6 py-6 bg-cream rounded-t-[32px] -mt-6 flex-1 flex flex-col z-10 relative">
        {/* Header Title Row */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-2xl font-black text-neutral-950 leading-tight flex-1">
            {classItem.title}
          </h2>
          <div className="bg-green-50 px-3 py-1 rounded-full border border-green-300 shrink-0 select-none">
            <span className="text-green-700 text-xs font-black">Disponible</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-500 text-sm leading-relaxed mb-6 font-semibold">
          Entrenamiento cardiovascular de alta intensidad guiado por un instructor. Mejora tu resistencia, quema calorías, fortalece tu cuerpo y pásala bien con una rutina de baile.
        </p>

        {/* Metadata Grid */}
        <div className="flex flex-col gap-4 mb-8 select-none">
          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shrink-0">
              <User className="h-5 w-5 stroke-[2.2]" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
              alt={classItem.instructorName}
              className="w-9 h-9 rounded-full shrink-0 object-cover border border-neutral-100 shadow-sm"
            />
            <div>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
                Instructor
              </span>
              <span className="text-sm font-black text-neutral-950">
                {classItem.instructorName}
              </span>
            </div>
          </div>

          {/* Día */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shrink-0">
              <Calendar className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
                Día
              </span>
              <span className="text-sm font-black text-neutral-950 uppercase">
                {displayDay}
              </span>
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shrink-0">
              <Clock className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
                Horario
              </span>
              <span className="text-sm font-black text-neutral-950">
                {displayTime}
              </span>
            </div>
          </div>

          {/* Cupos (Capacity Progress bar) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shrink-0">
              <Users className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
                    Cupos
                  </span>
                  <span className="text-sm font-black text-neutral-950">
                    {classItem.enrolled}/{classItem.capacity} inscritos
                  </span>
                </div>
                <span className="font-black text-neutral-950">{capacityPercentage}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${capacityPercentage}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                ></div>
              </div>
            </div>
          </div>

          {/* Temática */}
          {classItem.theme && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shrink-0">
                <Palette className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
                  Temática
                </span>
                <span className="inline-block bg-pink-150/70 border border-pink-300 text-pink-700 text-xs font-black px-3 py-1 rounded-full mt-0.5 uppercase tracking-wide">
                  {classItem.theme}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            onClick={handleEnroll}
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 text-center"
          >
            Inscribirse
          </button>
          
          <p className="text-neutral-400 text-[11px] text-center font-bold mt-3 leading-relaxed px-4 select-none">
            Tu cupo será reservado por 10 minutos para completar el pago.
          </p>
        </div>
      </div>
    </div>
  );
}
