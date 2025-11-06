import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AccessCodeCard from "./components/AccessCodeCard";
import Permissions from "./components/Permissions";
import FileTransferPanel from "./components/FileTransferPanel";
import SessionLogPanel from "./components/SessionLogPanel";
import RemoteView from "./components/RemoteView";
import ChatPanel from "./components/ChatPanel";
import "./index.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [remoteInfo, setRemoteInfo] = useState({ id: null, name: "" });
  const [theme, setTheme] = useState(() => {
    // Detectar tema guardado o preferencia del sistema
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Aplicar modo claro/oscuro
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header
        theme={theme}
        setTheme={setTheme}
        isConnected={isConnected}
        remoteInfo={remoteInfo}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-3">
        {/* COLUMNA IZQUIERDA */}
        <section className="lg:col-span-2 space-y-6">
          {/* Sección de código de acceso */}
          <AccessCodeCard
            onConnect={(info) => {
              setIsConnected(true);
              setRemoteInfo(info);
            }}
          />

          
          <div className="rounded-xl border border-white/10 bg-white dark:bg-[#111a2b] shadow-lg p-2">
            <ChatPanel isConnected={isConnected} remoteInfo={remoteInfo} />
          </div>

          {/* Vista remota */}
          {isConnected && (
            <RemoteView
              remoteInfo={remoteInfo}
              onDisconnect={() => {
                setIsConnected(false);
                setRemoteInfo({ id: null, name: "" });
              }}
            />
          )}
        </section>

        {/* COLUMNA DERECHA */}
        <aside className="space-y-6">
          <Permissions />
          <FileTransferPanel />
          <SessionLogPanel />
        </aside>
      </main>
    </div>
  );
}
