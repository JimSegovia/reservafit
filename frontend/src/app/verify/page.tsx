"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Mail } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const verifyOtp = useAppStore((state) => state.verifyOtp);

  const [code, setCode] = useState<string[]>(["2", "4", "7", "1", "9", "6"]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(45);
  const [mounted, setMounted] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChangeText = (val: string, index: number) => {
    const cleanVal = val.slice(-1); // Only take last character
    const newCode = [...code];
    newCode[index] = cleanVal;
    setCode(newCode);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Go to previous input on Backspace
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    const success = verifyOtp(fullCode);
    if (success) {
      setError("");
      router.replace("/client");
    } else {
      setError('Código OTP inválido o expirado. Usa el código simulado "247196".');
    }
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
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* OTP Graphic Icon */}
        <div className="items-center mb-8 flex flex-col select-none">
          <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center shadow-inner">
            <div className="w-24 h-24 rounded-full bg-orange-300 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Mail className="h-12 w-12 text-white stroke-[2.2]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 mt-6">Verifica tu cuenta</h2>
          <p className="text-neutral-500 text-center mt-2 text-sm leading-relaxed px-4 font-semibold">
            Hemos enviado un código OTP a tu correo electrónico
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold w-full">
            {error}
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
          <div className="flex justify-between gap-2.5 mb-8 w-full max-w-[280px]">
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleChangeText(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-11 h-14 border border-neutral-300 rounded-xl text-center text-xl font-bold bg-white text-neutral-950 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
            ))}
          </div>

          {/* Resend Link */}
          <div className="text-center mb-8 select-none">
            <p className="text-neutral-500 text-sm font-semibold">
              ¿No recibiste el código?{" "}
              <button
                type="button"
                disabled={countdown > 0}
                className={`font-black hover:underline ${countdown > 0 ? "text-primary/70 cursor-default" : "text-primary"}`}
              >
                Reenviar {countdown > 0 ? `(00:${countdown < 10 ? "0" : ""}${countdown})` : ""}
              </button>
            </p>
          </div>

          {/* Verification Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
}
