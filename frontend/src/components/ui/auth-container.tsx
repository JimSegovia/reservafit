import React from "react";

interface AuthContainerProps {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex justify-center items-center overflow-hidden relative">
      {/* Device frame container for desktop, full-bleed on mobile */}
      <div className="w-full h-full max-w-md md:h-[90vh] md:max-h-[850px] bg-cream shadow-2xl md:rounded-[40px] md:border-[12px] md:border-neutral-800 overflow-hidden flex flex-col relative">
        {/* Subtle phone-like notch highlight on desktop only */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-neutral-800 rounded-b-2xl z-50"></div>
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
