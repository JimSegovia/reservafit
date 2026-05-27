"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";

export default function AdminManualBookingPage() {
  const router = useRouter();
  
  const allClasses = useAppStore((state) => state.classes);
  const classes = allClasses.filter((c) => c.status === "Activo");
  const addManualBooking = useAppStore((state) => state.addManualBooking);

  const [mounted, setMounted] = useState(false);

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [paymentType, setPaymentType] = useState<'Efectivo' | 'Tarjeta'>("Efectivo");
  const [price, setPrice] = useState("40.00");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load default class selections
  useEffect(() => {
    if (mounted && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, mounted]);

  // Load default schedules based on class selection
  useEffect(() => {
    if (!mounted) return;
    const selectedClass = classes.find((c) => c.id === selectedClassId);
    if (selectedClass) {
      setSelectedSchedule(selectedClass.slots?.[0] || selectedClass.schedule.split(" ").slice(-2).join(" ") || "6:00 PM - 7:00 PM");
      setPrice(selectedClass.price.toFixed(2));
    }
  }, [selectedClassId, mounted]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientLastName || !clientEmail || !clientPhone || !selectedClassId || !selectedSchedule) {
      setError("Por favor llena todos los campos de cliente y reserva.");
      return;
    }

    const success = addManualBooking({
      clientName,
      clientLastName,
      clientEmail,
      clientPhone,
      classId: selectedClassId,
      schedule: selectedSchedule,
      paymentType,
      price: parseFloat(price) || 40.00
    });

    if (success) {
      setError("");
      setSuccessMsg("¡La reserva manual fue registrada exitosamente!");
      
      // Clear fields
      setClientName("");
      setClientLastName("");
      setClientEmail("");
      setClientPhone("");
      
      setTimeout(() => {
        router.push("/admin/bookings-history");
      }, 1500);
    } else {
      setError("No se pudo registrar la reserva. Intenta de nuevo.");
    }
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const activeClass = classes.find((c) => c.id === selectedClassId);
  const enrolledStr = activeClass ? `${activeClass.enrolled}/${activeClass.capacity}` : "15/30";

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
        <h2 className="text-xl font-black text-neutral-950">Registrar reserva manual</h2>
      </header>

      {error && (
        <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-success-text border border-green-150 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-6">
        {/* Section: Datos del cliente */}
        <div>
          <h3 className="text-base font-black text-neutral-950 mb-3">Datos del cliente</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Nombre"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-1/2 border border-neutral-300 rounded-xl bg-white px-3.5 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
              <input
                type="text"
                required
                placeholder="Apellido"
                value={clientLastName}
                onChange={(e) => setClientLastName(e.target.value)}
                className="w-1/2 border border-neutral-300 rounded-xl bg-white px-3.5 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4.5 w-4.5 text-neutral-405 stroke-[2.2]" />
              <input
                type="email"
                required
                placeholder="Correo electrónico"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl bg-white pl-10 pr-4 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 h-4.5 w-4.5 text-neutral-405 stroke-[2.2]" />
              <input
                type="tel"
                required
                placeholder="Número de celular"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-neutral-300 rounded-xl bg-white pl-10 pr-4 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section: Clase y horario */}
        <div>
          <h3 className="text-base font-black text-neutral-950 mb-2">Clase y horario</h3>

          <div className="flex flex-col gap-3">
            {/* Class list */}
            <div>
              <span className="text-neutral-500 font-extrabold text-[11px] block ml-1 mb-1.5 uppercase tracking-wide">
                Clase
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {classes.map((c) => {
                  const isSelected = c.id === selectedClassId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedClassId(c.id)}
                      className={`px-4 py-2.5 rounded-xl border shrink-0 text-xs font-black transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-neutral-300 text-neutral-950 hover:border-neutral-400"
                      }`}
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule list */}
            <div>
              <span className="text-neutral-500 font-extrabold text-[11px] block ml-1 mb-1.5 uppercase tracking-wide">
                Horario
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {activeClass?.slots?.map((slot, index) => {
                  const isSelected = slot === selectedSchedule;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSchedule(slot)}
                      className={`px-4 py-2.5 rounded-xl border shrink-0 text-xs font-black transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-neutral-300 text-neutral-950 hover:border-neutral-400"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                }) || (
                  <div className="border border-neutral-300 rounded-xl bg-white px-4 py-3 w-full text-neutral-900 text-sm font-semibold">
                    {selectedSchedule}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Pago */}
        <div>
          <h3 className="text-base font-black text-neutral-950 mb-3">Pago</h3>

          <div className="flex flex-col gap-3">
            <span className="text-neutral-500 font-extrabold text-[11px] block ml-1 uppercase tracking-wide">
              Tipo de pago
            </span>
            <div className="flex gap-6 mb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-extrabold text-neutral-950 select-none">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "Efectivo"}
                  onChange={() => setPaymentType("Efectivo")}
                  className="accent-primary h-4.5 w-4.5"
                />
                Efectivo
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-extrabold text-neutral-950 select-none">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "Tarjeta"}
                  onChange={() => setPaymentType("Tarjeta")}
                  className="accent-primary h-4.5 w-4.5"
                />
                Tarjeta
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500 font-extrabold text-[11px] block ml-1 uppercase tracking-wide">
                Monto (S/.)
              </label>
              <input
                type="number"
                step="any"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="S/ 40.00"
                className="w-full border border-neutral-300 rounded-xl bg-white px-4 py-3 text-neutral-900 text-sm font-semibold focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 text-center"
          >
            Registrar reserva
          </button>
        </div>

        {/* Capacity Indicator */}
        <p className="text-center text-neutral-450 text-xs font-black select-none mb-4">
          Cupos ocupados hoy: {enrolledStr}
        </p>
      </form>
    </div>
  );
}
