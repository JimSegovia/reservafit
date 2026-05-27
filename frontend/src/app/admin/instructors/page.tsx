"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, Instructor } from "@/store/useStore";
import { ArrowLeft, Plus, Search, Edit2, Trash2, X, User } from "lucide-react";

export default function AdminInstructorsPage() {
  const router = useRouter();
  const instructors = useAppStore((state) => state.instructors);
  const addInstructor = useAppStore((state) => state.addInstructor);
  const updateInstructor = useAppStore((state) => state.updateInstructor);
  const deleteInstructor = useAppStore((state) => state.deleteInstructor);

  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Modal states for Add/Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>("Activo");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredInstructors = instructors.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setSpecialty("");
    setStatus("Activo");
    setModalVisible(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingId(inst.id);
    setName(inst.name);
    setSpecialty(inst.specialty);
    setStatus(inst.status);
    setModalVisible(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) return;
    
    if (editingId) {
      updateInstructor(editingId, { name, specialty, status });
    } else {
      addInstructor({ name, specialty, status });
    }
    
    setModalVisible(false);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-hidden relative">
      <div className="flex-grow flex flex-col overflow-y-auto custom-scroll px-6 py-6 pb-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.replace("/admin")}
              className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90"
            >
              <ArrowLeft className="h-6 w-6 text-neutral-950" />
            </button>
            <h2 className="text-2xl font-black text-neutral-950">Instructores</h2>
          </div>

          {/* Add Button */}
          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </header>

        {/* Search bar */}
        <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-3 py-3.5 mb-6 select-none focus-within:border-primary transition-all">
          <Search className="h-5 w-5 text-neutral-400 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Buscar instructor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 ml-2 bg-transparent text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none"
          />
        </div>

        {/* Instructors list */}
        <div className="flex flex-col gap-4 mb-4 select-none">
          {filteredInstructors.length === 0 ? (
            <p className="text-center text-neutral-500 font-bold py-8">
              No se encontraron instructores.
            </p>
          ) : (
            filteredInstructors.map((inst) => {
              const isActive = inst.status === "Activo";
              return (
                <div
                  key={inst.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {/* Photo Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-neutral-100 shrink-0 mr-3 flex items-center justify-center text-neutral-400">
                      <User className="h-6 w-6 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-neutral-950 truncate leading-tight">
                        {inst.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-extrabold mt-0.5 truncate uppercase">
                        {inst.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ml-2">
                    {/* Status badge */}
                    <div
                      className={`px-3 py-1 rounded-full border text-[11px] font-black ${
                        isActive
                          ? "bg-success-bg border-success-border/50 text-success-text"
                          : "bg-neutral-100 border-neutral-250 text-neutral-500"
                      }`}
                    >
                      {inst.status}
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(inst)}
                      className="p-1 hover:bg-neutral-100 rounded-full text-neutral-950 transition-colors active:scale-90"
                    >
                      <Edit2 className="h-4.5 w-4.5 stroke-[2.2]" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteInstructor(inst.id)}
                      className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors active:scale-90"
                    >
                      <Trash2 className="h-4.5 w-4.5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal (Bottom Sheet style overlaid inside the mobile shell) */}
      {modalVisible && (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end z-50 animate-fadeIn">
          <form
            onSubmit={handleSave}
            className="bg-cream rounded-t-[32px] p-6 flex flex-col gap-4 border-t border-neutral-150 shadow-2xl animate-slideUp select-none"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-black text-neutral-950">
                {editingId ? "Editar Instructor" : "Agregar Instructor"}
              </h3>
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-1">
              <label className="text-neutral-500 font-extrabold text-xs ml-1">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full border border-neutral-300 rounded-xl bg-white px-4 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500 font-extrabold text-xs ml-1">Especialidad</label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Salsa / Bachata"
                className="w-full border border-neutral-300 rounded-xl bg-white px-4 py-3 text-neutral-900 text-sm font-semibold placeholder-neutral-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 font-extrabold text-xs ml-1">Estado</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("Activo")}
                  className={`flex-1 py-3 border rounded-xl text-sm font-black transition-all ${
                    status === "Activo"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-neutral-300 text-neutral-950 hover:border-neutral-400"
                  }`}
                >
                  Activo
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("Inactivo")}
                  className={`flex-1 py-3 border rounded-xl text-sm font-black transition-all ${
                    status === "Inactivo"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-neutral-300 text-neutral-950 hover:border-neutral-400"
                  }`}
                >
                  Inactivo
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.99] mt-3"
            >
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
