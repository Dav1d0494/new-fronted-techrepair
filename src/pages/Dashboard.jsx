// src/pages/Dashboard.jsx
import React, { useState } from "react";
import CardEquipment from "../components/CardEquipment";

/*
  Yo: Dashboard con lista mock de equipos y acciones simples.
*/
export default function Dashboard() {
  const [items, setItems] = useState([
    { id: 1, name: "PC - Oficina A", owner: "Empresa Alpha", status: "pending" },
    { id: 2, name: "Laptop - Juan P.", owner: "Usuario Juan", status: "inprogress" },
    { id: 3, name: "PC - Soporte B", owner: "Cliente Beta", status: "repaired" },
    { id: 4, name: "Laptop - María", owner: "María C", status: "pending" },
  ]);

  function handleConnect(id) {
    // Simulo pasar a "inprogress"
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "inprogress" } : it)));
    alert("Simulé conexión al equipo: " + id);
  }

  function handleFinish(id) {
    // Simulo marcar como reparado
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "repaired" } : it)));
  }

  // Filtrar por estado
  const pending = items.filter((i) => i.status === "pending");
  const inprogress = items.filter((i) => i.status === "inprogress");
  const repaired = items.filter((i) => i.status === "repaired");

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido a TechRepair</h1>
          <p className="text-sm text-gray-500 mt-1">Aquí puedo ver las conexiones activas, historial y configuraciones.</p>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Solicitudes activas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pending.length === 0 ? <p className="text-gray-500">No hay solicitudes pendientes.</p> :
            pending.map((it) => <CardEquipment key={it.id} item={it} onConnect={handleConnect} onFinish={handleFinish} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">En proceso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inprogress.length === 0 ? <p className="text-gray-500">No hay equipos en proceso.</p> :
            inprogress.map((it) => <CardEquipment key={it.id} item={it} onConnect={handleConnect} onFinish={handleFinish} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-4">Reparados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repaired.length === 0 ? <p className="text-gray-500">No hay equipos reparados aún.</p> :
            repaired.map((it) => <CardEquipment key={it.id} item={it} onConnect={handleConnect} onFinish={handleFinish} />)}
        </div>
      </section>
    </div>
  );
}
