"use client";

import React from "react";
import Logo from "@/components/ui/logo";

interface AuthContainerProps {
  children: React.ReactNode;
  mobileBgImage?: string;
}

export default function AuthContainer({ children, mobileBgImage }: AuthContainerProps) {
  return (
    <div className="w-full h-full bg-cream md:flex md:flex-row overflow-hidden">
      {/* Dynamic Style for Mobile Background */}
      {mobileBgImage && (
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 767px) {
            .mobile-custom-bg {
              background-image: url('${mobileBgImage}') !important;
              background-size: cover !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
            }
          }
        `}} />
      )}

      {/* Left Side - Image/Branding (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-neutral-900 relative flex-col justify-between p-12 overflow-hidden shadow-2xl z-10">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/gym-hero.png')", opacity: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-0" />
        
        {/* Content */}
        <div className="relative z-10">
          <Logo className="h-12 brightness-0 invert" />
        </div>
        
        <div className="relative z-10 text-white max-w-lg mb-8">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Desata tu <span className="text-primary">potencial</span> físico.
          </h1>
          <p className="text-neutral-300 text-lg font-medium leading-relaxed">
            Reserva tus clases favoritas en nuestra sala exclusiva. Entrena, aprende y disfruta al máximo de la mejor experiencia fitness.
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className={`w-full md:w-1/2 lg:w-2/5 h-full flex flex-col overflow-y-auto custom-scroll bg-cream relative z-0 mobile-custom-bg`}>
        {/* Mobile Header (Hidden on Desktop & when custom mobile background is present) */}
        {!mobileBgImage && (
          <header className="flex md:hidden h-20 items-center justify-center px-6 select-none shrink-0 border-b border-neutral-200/50 bg-cream z-10 sticky top-0">
            <Logo className="h-10" />
          </header>
        )}

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[420px] mx-auto flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
