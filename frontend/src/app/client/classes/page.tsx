"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Users, Calendar } from "lucide-react";

export default function ClassesPage() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter only classes that correspond to client view categories (c7, c8, c9)
  const categoryClasses = classes.filter(
    (cls) => cls.id === "c7" || cls.id === "c8" || cls.id === "c9"
  );

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6">
      {/* Header Title */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-neutral-950 mt-2">
          Reserva tu Próxima Clase
        </h2>
      </div>

      {/* Tab Headers (Categorías / Calendario) */}
      <div className="flex border-b border-neutral-200 mb-6 select-none font-bold">
        <button className="flex-1 pb-3 border-b-2 border-primary text-primary text-center text-base">
          Categorías
        </button>
        <button
          onClick={() => router.push("/client/classes/calendar")}
          className="flex-1 pb-3 text-neutral-400 hover:text-neutral-500 text-center text-base transition-colors"
        >
          Calendario
        </button>
      </div>

      {/* Catalog List */}
      <div className="flex flex-col gap-6 mb-4">
        {categoryClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border border-neutral-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="w-full h-32 bg-neutral-200 relative select-none">
              <img
                src={
                  cls.id === "c7"
                    ? "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
                    : cls.id === "c8"
                    ? "https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop"
                }
                alt={cls.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="p-4 flex flex-col items-center">
              {/* Title */}
              <h3 className="text-lg font-black text-neutral-950 mb-2">{cls.title}</h3>

              {/* Sub-info layout */}
              <div className="flex items-center gap-3 mb-4 select-none text-xs">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-primary font-black">Esta Semana</span>
                </div>
                <span className="text-neutral-400 font-bold">
                  {cls.id === "c7"
                    ? "Lunes - Miércoles - Viernes"
                    : cls.id === "c8"
                    ? "Martes - Jueves - Sábado"
                    : "Lunes - Jueves - Viernes"}
                </span>
              </div>

              {/* View Details Link */}
              <button
                onClick={() => {
                  if (cls.id === "c7") {
                    router.push("/client/classes/c7/schedules");
                  } else {
                    router.push(`/client/classes/${cls.id}`);
                  }
                }}
                className="w-full border-t border-neutral-100 mt-2 pt-3 text-center text-primary font-black text-sm hover:underline active:scale-95 duration-100"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
