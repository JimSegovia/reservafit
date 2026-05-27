"use client";

import React from "react";
import { Dumbbell } from "lucide-react";

interface AuthContainerProps {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="w-full h-full bg-cream flex flex-col overflow-hidden">
      {/* Full-width Header on Desktop */}
      <header className="hidden md:flex h-20 bg-cream border-b border-neutral-200/50 items-center justify-between px-12 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-7 w-7 text-primary stroke-[2.5]" />
          <span className="text-2xl font-black text-neutral-900 tracking-tight">
            Reserva<span className="text-primary font-black">Fit</span>
          </span>
        </div>
      </header>

      {/* Main Container Area */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto custom-scroll bg-cream p-0 md:p-8">
        {/* Floating Card on Desktop, Full screen on Mobile */}
        <div className="w-full h-full md:h-auto md:max-h-[90%] md:max-w-[560px] bg-cream md:bg-white md:shadow-xl md:border md:border-neutral-200/40 md:rounded-[28px] p-6 md:p-10 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
