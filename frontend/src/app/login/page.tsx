"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Dumbbell, Eye, EyeOff, Square, CheckSquare, Clock, User, Mail, Lock } from "lucide-react";
import AuthContainer from "@/components/ui/auth-container";
import Logo from "@/components/ui/logo";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const user = useAppStore((state) => state.user);

  const [email, setEmail] = useState("cliente@reservafit.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const _hasHydrated = useAppStore((state) => state._hasHydrated);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/client");
      }
    }
  }, [user, router, _hasHydrated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const role = email.toLowerCase().includes("admin") ? "admin" : "client";
      login(email, role);
      setIsLoading(false);
      
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/client");
      }
    }, 1200);
  };

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContainer mobileBgImage="/images/iniciar-sesion-mobile.jpg">
      <div className="flex-1 flex flex-col bg-transparent justify-between select-none relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute -inset-6 md:-inset-12 bg-neutral-950/75 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <span className="text-white font-bold text-sm tracking-wide">Iniciando sesión...</span>
          </div>
        )}

        <div>
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            {/* Desktop: User Avatar. Mobile: ReservaFit Logo */}
            <div className="hidden md:flex w-24 h-24 rounded-full bg-primary items-center justify-center shadow-lg shadow-orange-500/10">
              <User className="h-12 w-12 text-white stroke-[2.2]" />
            </div>
            
            <div className="flex md:hidden mb-2 justify-center w-full px-8">
              <Logo className="h-16" />
            </div>

            <h2 className="text-2xl font-black text-neutral-950 mt-4">Iniciar Sesión</h2>
            
            {/* Subtitles */}
            <p className="text-neutral-500 text-xs text-center mt-2 leading-relaxed px-4 font-semibold hidden md:block">
              Inicia sesión para ver las clases que tenemos preparadas para ti.
            </p>
            <p className="text-neutral-700 text-sm text-center mt-2 leading-relaxed px-4 font-black md:hidden">
              Continúa reservando tu clase favorita.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1 w-full">
              <label className="hidden md:block text-neutral-500 font-extrabold text-xs ml-1">Correo electrónico</label>
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <Mail className="hidden md:block h-5 w-5 text-neutral-400 stroke-[2.2]" />
                <input
                  type="email"
                  placeholder={isMobile ? "Usuario o correo electrónico" : "Correo@ejemplo.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 md:ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1 w-full">
              <label className="hidden md:block text-neutral-500 font-extrabold text-xs ml-1">Contraseña</label>
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all relative">
                <Lock className="hidden md:block h-5 w-5 text-neutral-400 stroke-[2.2]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 md:ml-2 pr-10 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center mt-1 select-none">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {rememberMe ? (
                  <CheckSquare className="h-5 w-5 text-primary fill-orange-50" />
                ) : (
                  <Square className="h-5 w-5 text-neutral-400" />
                )}
                <span className="text-neutral-600 text-sm font-bold">Recordarme</span>
              </div>
              
              <button type="button" className="text-primary font-bold text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Register redirection */}
            <div className="flex justify-center items-center mt-3 text-sm font-medium">
              <span className="text-neutral-500">¿No tienes cuenta?&nbsp;</span>
              <Link
                href="/register"
                className="text-primary font-black hover:underline"
              >
                Regístrate
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 mt-4 cursor-pointer"
            >
              Ingresar
            </button>
          </form>
        </div>

        {/* Minimum duration warning */}
        <div className="flex items-center justify-center gap-1.5 mt-6 py-1 select-none text-neutral-550 font-bold">
          <Clock className="h-4 w-4" />
          <span className="text-xs">
            Reserva mínima: 10 minutos
          </span>
        </div>
      </div>
    </AuthContainer>
  );
}
