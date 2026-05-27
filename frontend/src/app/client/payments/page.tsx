"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft } from "lucide-react";

export default function ClientPaymentsHistoryPage() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);
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
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6">
      {/* Header */}
      <header className="flex items-center mb-6 select-none">
        <button
          onClick={() => router.replace("/client")}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-neutral-950" />
        </button>
        <h2 className="text-2xl font-black text-neutral-950">Historial</h2>
      </header>

      {/* Sub tab headers (Pagos) */}
      <div className="flex border-b border-neutral-200 mb-6 select-none font-bold">
        <div className="flex-1 pb-3 border-b-2 border-primary text-primary text-center text-base">
          Pagos
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-4 mb-4">
        {reservations.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm select-none">
            <p className="text-neutral-500 text-sm font-semibold">
              No tienes transacciones registradas.
            </p>
          </div>
        ) : (
          reservations.map((res) => {
            const isPaid = res.status === "Pagado";
            
            return (
              <div
                key={res.id}
                className="bg-white border border-neutral-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
              >
                <div className="flex-1 mr-2 select-none">
                  <span className="text-[10px] text-neutral-450 font-black block mb-1">
                    {res.date}. {res.time.split(" ")[0]}
                  </span>
                  <h3 className="text-base font-black text-neutral-950 leading-tight">
                    {res.className}
                  </h3>
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
