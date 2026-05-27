"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { User, Mail, Phone, Lock, Eye, EyeOff, SlidersHorizontal } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAppStore((state) => state.registerUser);
  const currentUser = useAppStore((state) => state.user);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const _hasHydrated = useAppStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (currentUser) {
      if (currentUser.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/client");
      }
    }
  }, [currentUser, router, _hasHydrated]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastName || !email || !phone || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    registerUser({
      name: `${name} ${lastName}`,
      email,
      phone,
      role: "client"
    });

    setError("");
    router.push("/verify");
  };

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6 justify-between">
      <div>
        {/* Top Header Mock Icon */}
        <div className="flex justify-end mb-4">
          <SlidersHorizontal className="h-5 w-5 text-neutral-300 stroke-[2]" />
        </div>

        {/* Large Profile Icon */}
        <div className="flex flex-col items-center mb-6 select-none">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-orange-500/10">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-neutral-950 mt-4">Registro de usuario</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-danger-text border border-red-100 rounded-xl p-3 text-sm text-center mb-5 font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-500 font-extrabold text-xs ml-1">Nombre</label>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <User className="h-5 w-5 text-neutral-450 stroke-[2.2]" />
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Apellido */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-500 font-extrabold text-xs ml-1">Apellido</label>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <User className="h-5 w-5 text-neutral-450 stroke-[2.2]" />
              <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-500 font-extrabold text-xs ml-1">Correo electrónico</label>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Mail className="h-5 w-5 text-neutral-450 stroke-[2.2]" />
              <input
                type="email"
                placeholder="Correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Número de celular */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-500 font-extrabold text-xs ml-1">Número de celular</label>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Phone className="h-5 w-5 text-neutral-450 stroke-[2.2]" />
              <input
                type="tel"
                placeholder="9XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-500 font-extrabold text-xs ml-1">Contraseña</label>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all relative">
              <Lock className="h-5 w-5 text-neutral-450 stroke-[2.2]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="****************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 ml-2 pr-10 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] duration-150 mt-2"
          >
            Registrar
          </button>
        </form>

        {/* Login redirection */}
        <div className="flex justify-center items-center text-sm font-medium">
          <span className="text-neutral-500">¿Ya tienes cuenta?&nbsp;</span>
          <button
            onClick={() => router.push("/login")}
            className="text-primary font-black hover:underline"
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
