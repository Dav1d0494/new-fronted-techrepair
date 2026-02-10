import React from "react";
import { useAuth } from "../hooks/useAuth";

// Importamos usando las subcarpetas correctas de tu estructura
import { Header } from "../components/layouts/Header";
import { Sidebar } from "../components/layouts/Sidebar";
import { StatsCard } from "../components/dashboard/StatsCard";
import { ActivityChart } from "../components/dashboard/ActivityChart";
import { TicketList } from "../components/tickets/TicketList";
import { ChatWindow } from "../components/chat/ChatWindow";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-purple-600">
        Cargando...
      </div>
    );
  }

  const role = user?.role?.toLowerCase().trim() || "cliente";

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* VISTA ADMIN */}
          {role === "admin" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Ventas Totales" value="$12,400" />
                <StatsCard title="Técnicos" value="3" />
                <StatsCard title="Tickets Hoy" value="12" />
              </div>
              <ActivityChart />
            </div>
          )}

          {/* VISTA TÉCNICO */}
          {role === "tecnico" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TicketList title="Mis Reparaciones" />
              </div>
              <ChatWindow title="Chat Soporte" />
            </div>
          )}

          {/* VISTA CLIENTE */}
          {role === "cliente" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-purple-600 text-white p-8 rounded-3xl">
                <h1 className="text-3xl font-bold">
                  Bienvenido, {user?.name}
                </h1>
                <p className="opacity-90">
                  Tu conexión está cifrada. Comparte tu ID solo con personal autorizado.
                </p>
              </div>
              <ChatWindow />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
