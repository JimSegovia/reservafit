"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft } from "lucide-react";

export default function AdminBookingsHistoryPage() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);

  const [activeTab, setActiveTab] = useState<'Reservas' | 'Pagos'>("Reservas");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6 select-none">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => router.replace("/admin")}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 mr-4 animate-fadeIn"
        >
          <ArrowLeft className="h-6 w-6 text-neutral-950" />
        </button>
        <h2 className="text-2xl font-black text-neutral-950">Historial</h2>
      </header>

      {/* Tab Selection (Reservas / Pagos) */}
      <div className="flex border border-neutral-200 mb-6 bg-white rounded-2xl p-1.5 shadow-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("Reservas")}
          className={`flex-1 py-2.5 rounded-xl text-center text-sm transition-all duration-150 ${
            activeTab === "Reservas"
              ? "bg-primary text-white shadow-sm"
              : "bg-transparent text-neutral-500 hover:text-neutral-600"
          }`}
        >
          Reservas
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab("Pagos")}
          className={`flex-1 py-2.5 rounded-xl text-center text-sm transition-all duration-150 ${
            activeTab === "Pagos"
              ? "bg-primary text-white shadow-sm"
              : "bg-transparent text-neutral-500 hover:text-neutral-600"
          }`}
        >
          Pagos
        </button>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-4 mb-4">
        {reservations.length === 0 ? (
          <p className="text-center text-neutral-500 font-bold py-8">
            No hay registros en el historial.
          </p>
        ) : (
          reservations.map((res) => {
            const isPaid = res.status === "Pagado";
            return (
              <div
                key={res.id}
                className="bg-white border border-neutral-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
              >
                <div className="flex-1 mr-2 text-left">
                  <span className="text-[10px] text-neutral-455 font-black block mb-1">
                    {res.date}. {res.time.split(" ")[0]}
                  </span>
                  <h3 className="text-base font-black text-neutral-950 leading-tight">
                    {res.className}
                  </h3>
                  
                  {/* Dynamic Detail based on Active Tab */}
                  {activeTab === "Reservas" ? (
                    <p className="text-xs text-neutral-500 font-bold mt-1.5">
                      Cliente: <span className="text-neutral-950 font-black">{res.clientName}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400 font-bold mt-1.5">
                      Celular: <span className="text-neutral-900 font-black">{res.clientPhone}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end shrink-0 select-none">
                  <span className="text-base font-black text-neutral-950 mb-1.5">
                    S/ {res.price.toFixed(2)}
                  </span>
                  
                  <div
                    className={`px-3 py-1 rounded-full border text-[11px] font-black ${
                      isPaid
                        ? "bg-success-bg border-success-border/50 text-success-text"
                        : "bg-orange-50 border-orange-350 text-orange-700"
                    }`}
                  >
                    {res.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
