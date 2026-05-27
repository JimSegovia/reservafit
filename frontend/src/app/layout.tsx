import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReservaFit - Reserva tu lugar, vive la experiencia",
  description: "Reserva tus clases favoritas en nuestra única sala. Entrena, aprende y disfruta al máximo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex justify-center items-center overflow-hidden font-sans select-none">
        {/* Device frame container for desktop, full-bleed on mobile */}
        <div className="w-full h-full max-w-md md:h-[90vh] md:max-h-[850px] bg-cream shadow-2xl md:rounded-[40px] md:border-[12px] md:border-neutral-800 overflow-hidden flex flex-col relative">
          {/* Subtle phone-like notch highlight on desktop only */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-neutral-800 rounded-b-2xl z-50"></div>
          
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
