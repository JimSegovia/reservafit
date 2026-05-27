"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { Dumbbell, Eye, EyeOff, Square, CheckSquare, Clock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const user = useAppStore((state) => state.user);

  const [email, setEmail] = useState("cliente@reservafit.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const _hasHydrated = useAppStore((state) => state._hasHydrated);

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

    const role = email.toLowerCase().includes("admin") ? "admin" : "client";
    
    login(email, role);
    setError("");

    if (role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/client");
    }
  };

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full justify-between overflow-y-auto custom-scroll">
      <div className="px-6 py-6 flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1.5 mt-2 mb-6">
          <Dumbbell className="h-7 w-7 text-primary stroke-[2.5]" />
          <span className="text-3xl font-black text-neutral-900 tracking-tight">
            Reserva<span className="text-primary">Fit</span>
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-neutral-950">Iniciar Sesión</h2>
          <p className="text-neutral-500 text-sm mt-1.5 font-medium">
            Continúa reservando tu clase favorita.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
            {error}
          </div>
        )}

        {/* Inputs Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="w-full">
            <input
              type="email"
              placeholder="Usuario o correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-xl bg-white px-4 py-4 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="w-full relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-xl bg-white pl-4 pr-12 py-4 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center mt-1 mb-4 select-none">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150"
          >
            Ingresar
          </button>
        </form>

        {/* Register redirection */}
        <div className="flex justify-center items-center mt-6 text-sm font-medium">
          <span className="text-neutral-500">¿No tienes cuenta?&nbsp;</span>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary font-black hover:underline"
          >
            Regístrate
          </button>
        </div>

        {/* Minimum duration warning */}
        <div className="flex items-center justify-center gap-1.5 mt-6 py-1 select-none">
          <Clock className="h-4 w-4 text-neutral-900" />
          <span className="text-xs text-neutral-950 font-bold">
            Reserva mínima: 10 minutos
          </span>
        </div>
      </div>

      {/* Decorative images at the bottom */}
      <div className="flex justify-between items-end mt-auto opacity-35 select-none pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop"
          alt="Gym plates mockup"
          className="w-20 h-20 rounded-tr-3xl object-cover shadow-inner"
        />
        <img
          src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200&auto=format&fit=crop"
          alt="Yoga mat mockup"
          className="w-20 h-20 rounded-tl-3xl object-cover shadow-inner"
        />
      </div>
    </div>
  );
}
