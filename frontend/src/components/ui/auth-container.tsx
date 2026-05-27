import React from "react";

interface AuthContainerProps {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex justify-center items-center overflow-hidden relative p-4 md:p-6">
      {/* Clean centered card container for desktop, full-bleed on mobile */}
      <div className="w-full h-full max-w-md md:h-auto md:max-h-[85vh] bg-cream shadow-2xl md:rounded-3xl overflow-hidden flex flex-col relative border border-neutral-100/10">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
