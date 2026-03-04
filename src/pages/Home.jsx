import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  Camera,
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  Copy,
  FileWarning,
  FolderOpen,
  Globe,
  Headphones,
  Home as HomeIcon,
  Lock,
  LogOut,
  MessageSquare,
  Mic,
  Monitor,
  PauseCircle,
  PhoneCall,
  PieChart,
  PlayCircle,
  Paperclip,
  Plus,
  Shield,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShieldAlert,
  Timer,
  TerminalSquare,
  UploadCloud,
  UserCheck,
  UserPlus,
  UserCog,
  Users,
  Video,
  Keyboard,
  MousePointer2,
  Maximize2,
  CameraOff,
  FileUp,
  X,
  Wifi,
  Wrench,
  Zap,
  KeyRound,
  Trash2,
} from "lucide-react";
import { auth } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getUserRole } from "../config/roles";
import remoteSessionService from "../services/remoteSessionService";
import { TicketList } from "../components/tickets/TicketList";
import { ChatWindow } from "../components/chat/ChatWindow";
import logo from "../assets/logo.png";

const ACCENT = "#7F00FF";
const ACCENT_HOVER = "#5E00CC";
const cx = (...v) => v.filter(Boolean).join(" ");

function Pill({ children, tone = "neutral" }) {
  const styles = {
    neutral: "bg-[#F7F7F7] text-[#333333] border-[#D1D1D1]",
    ok: "bg-green-50 text-green-700 border-green-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    bad: "bg-red-50 text-red-700 border-red-200",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs border ${styles[tone]}`}>{children}</span>;
}

function AdminWorkspace({ user }) {
  const [section, setSection] = useState("dashboard");
  const [settingsTab, setSettingsTab] = useState("interface");
  const [selectedDevice, setSelectedDevice] = useState(0);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("app_theme_mode") || localStorage.getItem("admin_theme_mode") || "auto");
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [heartbeatSeconds, setHeartbeatSeconds] = useState("30");
  const [deviceAccessPolicy, setDeviceAccessPolicy] = useState("confirm");
  const [maxDevicesPerUser, setMaxDevicesPerUser] = useState(3);
  const [allowUnmanagedDevices, setAllowUnmanagedDevices] = useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [ipAllowlist, setIpAllowlist] = useState("10.10.0.0/16, 192.168.1.20");
  const [requireMfaForAdmins, setRequireMfaForAdmins] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [performanceMode, setPerformanceMode] = useState("balanced");
  const [telemetryLevel, setTelemetryLevel] = useState("standard");
  const [bandwidthLimitMbps, setBandwidthLimitMbps] = useState(50);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupRetentionDays, setBackupRetentionDays] = useState(30);
  const [backupIntegrityCheck, setBackupIntegrityCheck] = useState(true);
  const [targetRole, setTargetRole] = useState("client");
  const [adminTargetId, setAdminTargetId] = useState("");
  const [adminSessionActive, setAdminSessionActive] = useState(false);
  const [showAdminInviteModal, setShowAdminInviteModal] = useState(false);
  const [showAdminControlModal, setShowAdminControlModal] = useState(false);
  const [adminInviteStatus, setAdminInviteStatus] = useState("idle");
  const [adminActiveTarget, setAdminActiveTarget] = useState({ id: "", role: "client" });
  const [adminSessionSeconds, setAdminSessionSeconds] = useState(0);
  const [adminChatInput, setAdminChatInput] = useState("");
  const [adminAudioCallActive, setAdminAudioCallActive] = useState(false);
  const [adminVideoCallActive, setAdminVideoCallActive] = useState(false);
  const [adminStealthMode, setAdminStealthMode] = useState(false);
  const [adminForceReadOnly, setAdminForceReadOnly] = useState(false);
  const [adminRecordSession, setAdminRecordSession] = useState(true);
  const [adminPriorityOverride, setAdminPriorityOverride] = useState(false);
  const [adminRemoteAttachments, setAdminRemoteAttachments] = useState([]);
  const [adminRemoteMessages, setAdminRemoteMessages] = useState([
    { from: "system", text: "Canal administrativo seguro iniciado.", time: new Date().toLocaleTimeString() },
  ]);
  const [showAdminCallModal, setShowAdminCallModal] = useState(false);
  const [showAdminVideoModal, setShowAdminVideoModal] = useState(false);
  const [showAdminFileModal, setShowAdminFileModal] = useState(false);
  const [adminCallMuted, setAdminCallMuted] = useState(false);
  const [adminCallSpeakerOn, setAdminCallSpeakerOn] = useState(true);
  const [adminVideoMicOn, setAdminVideoMicOn] = useState(true);
  const [adminVideoCamOn, setAdminVideoCamOn] = useState(true);
  const [adminVideoShareOn, setAdminVideoShareOn] = useState(false);
  const [adminPendingFiles, setAdminPendingFiles] = useState([]);
  const adminFileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("admin_theme_mode", themeMode);
    localStorage.setItem("app_theme_mode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemTheme(event.matches ? "dark" : "light");
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const effectiveTheme = themeMode === "auto" ? systemTheme : themeMode;
  const isDark = effectiveTheme === "dark";

  useEffect(() => {
    const normalized = effectiveTheme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", normalized);
    document.documentElement.classList.toggle("dark", normalized === "dark");
  }, [effectiveTheme]);

  const theme = isDark
    ? { bg: "#111111", panel: "#1A1A1A", card: "#161616", border: "#3A3A3A", text: "#F3F3F3", sub: "#B8B8B8" }
    : { bg: "#FFFFFF", panel: "#F7F7F7", card: "#FFFFFF", border: "#D1D1D1", text: "#333333", sub: "#6B6B6B" };

  const card = "card-surface rounded-lg shadow-sm border";

  const nav = [
    { id: "dashboard", label: "Inicio / Dashboard", icon: Activity },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "tickets", label: "Solicitudes / Tickets", icon: FileWarning },
    { id: "devices", label: "Dispositivos Corporativos", icon: Monitor },
    { id: "reports", label: "Reportes", icon: PieChart },
    { id: "settings", label: "Configuracion", icon: Wrench },
  ];

  const settingsNav = [
    ["interface", "Interfaz de Usuario"],
    ["connection", "Estado de Conexion y Modo Offline"],
    ["devices", "Gestion de Dispositivos"],
    ["security", "Seguridad y Control"],
    ["notifications", "Notificaciones"],
    ["performance", "Rendimiento"],
    ["backup", "Backup y Recuperacion"],
  ];

  const devices = useMemo(
    () => [
      { name: "HQ-PC-001", type: "PC", owner: "Paula Gomez", state: "Online", last: "2 min", os: "Windows 11", ip: "10.10.2.14", av: "Activo" },
      { name: "FIN-LAP-008", type: "Laptop", owner: "Carlos Rivas", state: "Inestable", last: "11 min", os: "Windows 10", ip: "10.10.4.88", av: "Pendiente" },
      { name: "OPS-MOB-021", type: "Movil", owner: "Marta Leon", state: "Offline", last: "1 h", os: "Android 14", ip: "10.10.8.51", av: "Sin senal" },
      { name: "DIR-TAB-004", type: "Tablet", owner: "Luis Ortega", state: "Online", last: "5 min", os: "iPadOS", ip: "10.10.9.10", av: "Activo" },
    ],
    []
  );
  const adminUsers = useMemo(
    () => [
      { name: "Cristian Alarcon", email: "cristian.alarcon@itegperformance.com", role: "Admin", status: "Activa", last: "Ahora", access: "127" },
      { name: "Nain Zuniga", email: "nain.zuniga@itegperformance.com", role: "Soporte", status: "Activa", last: "Hace 4 min", access: "98" },
      { name: "Leonardo Martinez", email: "leonardo.martinez@hotmail.com", role: "Cliente", status: "Activa", last: "Hace 11 min", access: "35" },
      { name: "Paula Gomez", email: "paula.gomez@empresa.com", role: "Cliente", status: "Suspendida", last: "Ayer 18:22", access: "22" },
      { name: "Luis Ortega", email: "luis.ortega@empresa.com", role: "Soporte", status: "Activa", last: "Hace 2 h", access: "61" },
    ],
    []
  );
  const techAccounts = useMemo(
    () => [
      { name: "Nain Zuniga", username: "nain.zuniga", role: "Soporte L2", status: "Habilitada", updated: "Hoy 16:22" },
      { name: "Luis Ortega", username: "luis.ortega", role: "Soporte L1", status: "Habilitada", updated: "Hoy 14:05" },
      { name: "Marta Leon", username: "marta.leon", role: "Supervisor", status: "Deshabilitada", updated: "Ayer 18:47" },
    ],
    []
  );
  const device = devices[selectedDevice];

  const startAdminConnection = () => {
    const normalizedTarget = adminTargetId.trim().toUpperCase();
    if (!normalizedTarget) return;

    setAdminActiveTarget({ id: normalizedTarget, role: targetRole });
    setAdminInviteStatus("waiting");
    setShowAdminInviteModal(true);
    setAdminRemoteMessages((prev) => [
      {
        from: "system",
        text: `Invitacion enviada a ${targetRole === "tech" ? "tecnico" : "cliente"} ${normalizedTarget}.`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const acceptAdminInvitation = () => {
    setAdminInviteStatus("accepted");
    setShowAdminInviteModal(false);
    setAdminSessionActive(true);
    setShowAdminControlModal(true);
    setAdminSessionSeconds(0);
    setAdminRemoteMessages((prev) => [
      {
        from: "system",
        text: `Conexion autorizada por ${adminActiveTarget.role === "tech" ? "tecnico" : "cliente"} ${adminActiveTarget.id}.`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const rejectAdminInvitation = () => {
    setAdminInviteStatus("rejected");
    setShowAdminInviteModal(false);
    setAdminSessionActive(false);
    setShowAdminControlModal(false);
    setAdminRemoteMessages((prev) => [
      {
        from: "system",
        text: `Invitacion rechazada por ${adminActiveTarget.role === "tech" ? "tecnico" : "cliente"} ${adminActiveTarget.id}.`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const stopAdminSession = () => {
    setAdminSessionActive(false);
    setShowAdminInviteModal(false);
    setShowAdminControlModal(false);
    setAdminInviteStatus("idle");
    setAdminSessionSeconds(0);
    setAdminAudioCallActive(false);
    setAdminVideoCallActive(false);
    setAdminRemoteMessages((prev) => [
      {
        from: "system",
        text: "Sesion administrativa finalizada por el administrador.",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    if (!adminSessionActive || !showAdminControlModal) return;
    const timer = setInterval(() => setAdminSessionSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [adminSessionActive, showAdminControlModal]);

  const formatDuration = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const sendAdminMessage = () => {
    const text = adminChatInput.trim();
    if (!text) return;
    setAdminRemoteMessages((prev) => [{ from: "admin", text, time: new Date().toLocaleTimeString() }, ...prev]);
    setAdminChatInput("");
  };

  const attachAdminFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const stagedFiles = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      originalName: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      selected: true,
    }));
    setAdminPendingFiles((prev) => [...stagedFiles, ...prev]);
    setShowAdminFileModal(true);
    event.target.value = "";
  };

  const toggleAdminPendingFile = (fileId) => {
    setAdminPendingFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, selected: !file.selected } : file))
    );
  };

  const removeAdminPendingFile = (fileId) => {
    setAdminPendingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const sendAdminPendingFiles = () => {
    const selectedFiles = adminPendingFiles.filter((file) => file.selected);
    if (!selectedFiles.length) return;
    const normalizedFiles = selectedFiles.map((file) => ({ originalName: file.originalName, size: file.size, type: file.type }));
    setAdminRemoteAttachments((prev) => [...normalizedFiles, ...prev]);
    setAdminRemoteMessages((prev) => [
      {
        from: "admin",
        text: `Adjuntos enviados: ${normalizedFiles.map((file) => `${file.originalName} (${formatFileSize(file.size)})`).join(", ")}`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setAdminPendingFiles((prev) => prev.filter((file) => !file.selected));
    setShowAdminFileModal(false);
  };

  const dashboard = (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          ["Total de usuarios", "1,248", "+4.1% este mes"],
          ["Tickets abiertos / cerrados", "73 / 412", "18 criticos activos"],
          ["Tiempo promedio de respuesta", "09m 42s", "SLA objetivo: 12m"],
          ["Dispositivos conectados", "286", "12 en monitoreo intensivo"],
          ["Conexiones recientes", "147", "ultimas 24h"],
        ].map((m) => (
          <article key={m[0]} className={`${card} p-4`}>
            <p className="text-sm text-[#6B6B6B]">{m[0]}</p>
            <p className="text-[28px] leading-8 font-bold text-[#333333] mt-2">{m[1]}</p>
            <p className="text-xs text-[#6B6B6B] mt-2">{m[2]}</p>
          </article>
        ))}
      </div>

      <section className={`${card} p-5`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-[22px] font-semibold" style={{ color: theme.text }}>Centro Operativo Remoto</h2>
          <Pill tone={adminSessionActive ? "ok" : "neutral"}>{adminSessionActive ? "Sesion admin activa" : "Canal remoto disponible"}</Pill>
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-[1.05fr_1.35fr] gap-4">
          <article className="rounded-xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Consola de Conexion</h3>
            <div className="mt-4 rounded-lg border border-dashed p-4" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: theme.sub }}>Mi ID de Administrador</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[40px] leading-10 font-bold" style={{ color: ACCENT }}>ADM 808 544</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText("ADM808544")}
                  className="p-2 rounded-md border transition-colors"
                  style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}
                  title="Copiar ID"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: theme.sub }}>Puede conectarse a cualquier dispositivo de cliente o tecnico con trazabilidad forense.</p>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: theme.text }}>Tipo de destino</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                    style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                  >
                    <option value="client">Cliente</option>
                    <option value="tech">Tecnico</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: theme.text }}>ID de destino</label>
                  <input
                    value={adminTargetId}
                    onChange={(e) => setAdminTargetId(e.target.value)}
                    placeholder={targetRole === "tech" ? "Ej. TEC-442991" : "Ej. CLI-809541123"}
                    className="w-full mt-2 border rounded-lg px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                    style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!adminTargetId.trim()}
                  onClick={startAdminConnection}
                  className="px-6 py-3 rounded-lg text-white font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: ACCENT }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = ACCENT)}
                >
                  ENVIAR INVITACION
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminControlModal(true)}
                  disabled={!adminSessionActive}
                  className="px-4 py-3 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}
                >
                  Consola avanzada
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTargetId("")}
                  className="px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}
                >
                  Limpiar
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Chat remoto</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdminCallModal(true)}
                  className="px-3 py-2 rounded-lg border text-xs flex items-center gap-1.5"
                  style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}
                >
                  <PhoneCall size={14} /> Llamada
                </button>
                <button
                  onClick={() => setShowAdminVideoModal(true)}
                  className="px-3 py-2 rounded-lg border text-xs flex items-center gap-1.5"
                  style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}
                >
                  <Video size={14} /> Videollamada
                </button>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg border h-56 overflow-auto space-y-2" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
              {adminRemoteMessages.slice(0, 4).map((msg, idx) => (
                <div
                  key={`${msg.time}-${idx}`}
                  className={cx("max-w-[85%] rounded-lg px-3 py-2", msg.from === "admin" ? "text-white ml-auto" : "border")}
                  style={msg.from === "admin" ? { backgroundColor: ACCENT } : { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={cx("text-xs mt-1", msg.from === "admin" ? "text-white/80" : "")} style={msg.from === "admin" ? {} : { color: theme.sub }}>
                    {msg.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => adminFileInputRef.current?.click()}
                className="h-10 w-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                title="Adjuntar documentos"
              >
                <Paperclip size={16} />
              </button>
              <button
                onClick={() => adminFileInputRef.current?.click()}
                className="h-10 w-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                title="Enviar archivo"
              >
                <FolderOpen size={16} />
              </button>
              <button
                onClick={() => adminFileInputRef.current?.click()}
                className="h-10 w-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                title="Enviar imagen"
              >
                <Camera size={16} />
              </button>
              <input ref={adminFileInputRef} type="file" multiple className="hidden" onChange={attachAdminFiles} />
              <input
                value={adminChatInput}
                onChange={(e) => setAdminChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAdminMessage()}
                className="flex-1 min-w-[260px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF] placeholder:text-[#6B6B6B]"
                style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                placeholder="Escribe un mensaje..."
              />
              <button onClick={sendAdminMessage} className="px-3 h-10 rounded-lg text-white" style={{ backgroundColor: ACCENT }}>
                <Send size={16} />
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );

  const users = (
    <section className={`${card} p-4`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: theme.text }}>Gestion de Usuarios</h2>
          <p className="text-sm mt-2" style={{ color: theme.sub }}>Ver, crear y editar usuarios, activar/desactivar cuentas, resetear contrasenas y asignar roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
            Exportar CSV
          </button>
          <button className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: ACCENT }}>
            + Nuevo usuario
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
        <Search size={16} style={{ color: theme.sub }} />
        <input
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: theme.text }}
          placeholder="Buscar por nombre, correo o rol"
        />
      </div>

      <div className="mt-4 overflow-auto">
        <table className="w-full min-w-[980px] text-sm" style={{ color: theme.text }}>
          <thead>
            <tr className="text-left border-b" style={{ borderColor: theme.border, color: theme.sub }}>
              <th className="py-3">Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Ultimo acceso</th>
              <th>Historial accesos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.email} className="border-b" style={{ borderColor: theme.border }}>
                <td className="py-3">
                  <p className="font-semibold">{u.name}</p>
                </td>
                <td style={{ color: theme.sub }}>{u.email}</td>
                <td>
                  <Pill tone={u.role === "Admin" ? "bad" : u.role === "Soporte" ? "warn" : "neutral"}>{u.role}</Pill>
                </td>
                <td>
                  <Pill tone={u.status === "Activa" ? "ok" : "bad"}>{u.status}</Pill>
                </td>
                <td style={{ color: theme.sub }}>{u.last}</td>
                <td style={{ color: theme.sub }}>{u.access} eventos</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                      Editar
                    </button>
                    <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                      Reset clave
                    </button>
                    <button
                      className="px-2 py-1 rounded-md text-xs text-white"
                      style={{ backgroundColor: u.status === "Activa" ? "#D14343" : "#1B8E4B" }}
                    >
                      {u.status === "Activa" ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-5 rounded-lg border p-4" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[18px] font-semibold" style={{ color: theme.text }}>Gestion de cuentas de tecnicos</h3>
            <p className="text-sm mt-1" style={{ color: theme.sub }}>Crear usuarios tecnicos, asignar rol, habilitar o eliminar cuentas y cambiar contrasena.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg text-sm text-white inline-flex items-center gap-2" style={{ backgroundColor: ACCENT }}>
              <UserPlus size={16} />
              Crear tecnico
            </button>
            <button className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-2" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              <KeyRound size={16} />
              Cambio masivo de clave
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cuentas tecnicas activas</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>24</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Sin rol asignado</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>2</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cambio de clave pendiente</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>5</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cuentas deshabilitadas</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>3</p>
          </article>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[980px] text-sm" style={{ color: theme.text }}>
            <thead>
              <tr className="text-left border-b" style={{ borderColor: theme.border, color: theme.sub }}>
                <th className="py-3">Tecnico</th>
                <th>Usuario</th>
                <th>Rol asignado</th>
                <th>Estado</th>
                <th>Ultima accion</th>
                <th>Acciones de cuenta</th>
              </tr>
            </thead>
            <tbody>
              {techAccounts.map((tech) => (
                <tr key={tech.username} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{tech.name}</td>
                  <td style={{ color: theme.sub }}>{tech.username}</td>
                  <td>
                    <button className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
                      <UserCog size={14} />
                      {tech.role}
                    </button>
                  </td>
                  <td>
                    <Pill tone={tech.status === "Habilitada" ? "ok" : "bad"}>{tech.status}</Pill>
                  </td>
                  <td style={{ color: theme.sub }}>{tech.updated}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
                        <UserCheck size={14} />
                        Asignar rol
                      </button>
                      <button className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
                        <KeyRound size={14} />
                        Cambiar clave
                      </button>
                      <button
                        className="px-2 py-1 rounded-md text-xs text-white"
                        style={{ backgroundColor: tech.status === "Habilitada" ? "#D14343" : "#1B8E4B" }}
                      >
                        {tech.status === "Habilitada" ? "Deshabilitar" : "Habilitar"}
                      </button>
                      <button className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5 text-red-600" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );

  const tickets = (
    <div className="space-y-4">
      <section className={`${card} p-4`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[20px] font-semibold" style={{ color: theme.text }}>Gestion de Solicitudes / Tickets</h2>
            <p className="text-sm mt-3" style={{ color: theme.sub }}>Asignar/reasignar, cambiar estados y prioridades, marcar tickets criticos y ver historial completo.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: theme.panel, borderColor: theme.border, borderWidth: 1 }}>
            <Search size={16} style={{ color: theme.sub }} />
            <input className="bg-transparent outline-none text-sm" style={{ color: theme.text }} placeholder="Buscar ticket, usuario o equipo" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Abiertos", value: "73", detail: "12 de alta prioridad" },
          { label: "En progreso", value: "29", detail: "8 en atencion activa" },
          { label: "Criticos", value: "18", detail: "SLA comprometido" },
          { label: "Cerrados (mes)", value: "412", detail: "Tasa de cierre 94%" },
        ].map((item) => (
          <article key={item.label} className={`${card} p-4`}>
            <p className="text-sm" style={{ color: theme.sub }}>{item.label}</p>
            <p className="text-[28px] leading-8 font-bold mt-2" style={{ color: theme.text }}>{item.value}</p>
            <p className="text-xs mt-2" style={{ color: theme.sub }}>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className={`${card} p-4`}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {["Todos", "Pendientes", "En progreso", "Criticos", "Cerrados"].map((f) => (
            <button
              key={f}
              className="px-3 py-1.5 rounded-full text-xs border"
              style={{ borderColor: theme.border, backgroundColor: f === "Todos" ? ACCENT : theme.panel, color: f === "Todos" ? "#fff" : theme.text }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[1100px] text-sm" style={{ color: theme.text }}>
            <thead>
              <tr className="text-left border-b" style={{ borderColor: theme.border, color: theme.sub }}>
                <th className="py-3">Ticket</th>
                <th>Solicitante</th>
                <th>Tecnico asignado</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>SLA</th>
                <th>Actualizado</th>
                <th>Historial</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "TK-9388", user: "Paula Gomez", tech: "Nain Zuniga", priority: "Alta", status: "Pendiente", sla: "09m", updated: "Hace 2 min", history: "14 eventos" },
                { id: "TK-9382", user: "Luis Ortega", tech: "Carlos Rivas", priority: "Media", status: "En progreso", sla: "22m", updated: "Hace 5 min", history: "8 eventos" },
                { id: "TK-9369", user: "Marta Leon", tech: "Sin asignar", priority: "Critica", status: "Pendiente", sla: "04m", updated: "Ahora", history: "19 eventos" },
                { id: "TK-9344", user: "Leonardo Martinez", tech: "Nain Zuniga", priority: "Baja", status: "Cerrado", sla: "Cumplido", updated: "Ayer 17:44", history: "21 eventos" },
              ].map((t) => (
                <tr key={t.id} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{t.id}</td>
                  <td>{t.user}</td>
                  <td style={{ color: theme.sub }}>{t.tech}</td>
                  <td><Pill tone={t.priority === "Critica" ? "bad" : t.priority === "Alta" ? "warn" : "neutral"}>{t.priority}</Pill></td>
                  <td><Pill tone={t.status === "Cerrado" ? "ok" : t.status === "En progreso" ? "warn" : "bad"}>{t.status}</Pill></td>
                  <td style={{ color: theme.sub }}>{t.sla}</td>
                  <td style={{ color: theme.sub }}>{t.updated}</td>
                  <td style={{ color: theme.sub }}>{t.history}</td>
                  <td>
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                        Asignar
                      </button>
                      <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                        Estado
                      </button>
                      <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                        Prioridad
                      </button>
                      <button className="px-2 py-1 rounded-md text-xs text-white" style={{ backgroundColor: "#D14343" }}>
                        Critico
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const devicesSection = (
    <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
      <section className={`${card} p-4 2xl:col-span-2`}>
        <h2 className="text-[20px] font-semibold" style={{ color: theme.text }}>Dispositivos Corporativos</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[880px] text-sm" style={{ color: theme.text }}>
            <thead>
              <tr className="text-left border-b" style={{ color: theme.sub, borderColor: theme.border }}>
                <th className="py-3">Nombre</th>
                <th>Tipo</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Ultima conexion</th>
                <th>SO</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d, i) => (
                <tr
                  key={d.name}
                  onClick={() => setSelectedDevice(i)}
                  className="border-b cursor-pointer transition-colors"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: i === selectedDevice ? theme.panel : theme.card,
                    color: theme.text,
                  }}
                >
                  <td className="py-3 font-medium">{d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.owner}</td>
                  <td><Pill tone={d.state === "Online" ? "ok" : d.state === "Inestable" ? "warn" : "bad"}>{d.state}</Pill></td>
                  <td style={{ color: theme.sub }}>{d.last}</td>
                  <td style={{ color: theme.sub }}>{d.os}</td>
                  <td style={{ color: theme.sub }}>{d.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-4">
        <article className={`${card} p-4`}>
          <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Vista detallada: {device.name}</h3>
          <p className="text-sm mt-2" style={{ color: theme.sub }}>SO: {device.os} | IP: {device.ip} | Antivirus: {device.av}</p>
        </article>
      </section>
    </div>
  );

  const reports = (
    <div className="space-y-4">
      <section className={`${card} p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-semibold" style={{ color: theme.text }}>Reportes</h2>
            <p className="text-sm mt-2" style={{ color: theme.sub }}>Exportacion CSV/PDF, SLA, incidentes por sede y riesgo operativo.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              Exportar CSV
            </button>
            <button className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              Exportar PDF
            </button>
            <button className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: ACCENT }}>
              Generar reporte
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Cumplimiento SLA", value: "96.4%", detail: "Objetivo: 95%" },
          { label: "Incidentes criticos", value: "18", detail: "Ultimos 7 dias" },
          { label: "Riesgo operativo", value: "Medio", detail: "2 sedes con alerta" },
          { label: "Tickets cerrados", value: "412", detail: "Mes actual" },
        ].map((item) => (
          <article key={item.label} className={`${card} p-4`}>
            <p className="text-sm" style={{ color: theme.sub }}>{item.label}</p>
            <p className="text-[28px] leading-8 font-bold mt-2" style={{ color: theme.text }}>{item.value}</p>
            <p className="text-xs mt-2" style={{ color: theme.sub }}>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className={`${card} p-4`}>
        <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Reportes recientes</h3>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[980px] text-sm" style={{ color: theme.text }}>
            <thead>
              <tr className="text-left border-b" style={{ borderColor: theme.border, color: theme.sub }}>
                <th className="py-3">Reporte</th>
                <th>Periodo</th>
                <th>Propietario</th>
                <th>Estado</th>
                <th>Formato</th>
                <th>Ultima generacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "SLA Global", period: "Enero 2026", owner: "Cristian Alarcon", status: "Completado", format: "PDF", updated: "Hoy 10:30" },
                { name: "Incidentes por sede", period: "Semana 06", owner: "Nain Zuniga", status: "Completado", format: "CSV", updated: "Hoy 09:12" },
                { name: "Riesgo operativo", period: "Q1 2026", owner: "Cristian Alarcon", status: "En proceso", format: "PDF", updated: "Hoy 08:40" },
                { name: "Eficiencia de tecnicos", period: "Enero 2026", owner: "Luis Ortega", status: "Completado", format: "CSV", updated: "Ayer 17:22" },
              ].map((r) => (
                <tr key={`${r.name}-${r.period}`} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{r.name}</td>
                  <td style={{ color: theme.sub }}>{r.period}</td>
                  <td style={{ color: theme.sub }}>{r.owner}</td>
                  <td><Pill tone={r.status === "Completado" ? "ok" : "warn"}>{r.status}</Pill></td>
                  <td style={{ color: theme.sub }}>{r.format}</td>
                  <td style={{ color: theme.sub }}>{r.updated}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                        Ver
                      </button>
                      <button className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                        Descargar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const settings = (
    <section className={`${card} p-0 overflow-hidden`}>
      <div className="grid grid-cols-1 xl:grid-cols-[290px_1fr] min-h-[560px]">
        <aside className="border-r p-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h2 className="text-[20px] font-semibold mb-3" style={{ color: theme.text }}>Configuracion</h2>
          <div className="space-y-1">
            {settingsNav.map(([id, label]) => {
              const active = settingsTab === id;
              return (
                <button key={id} onClick={() => setSettingsTab(id)} className={cx("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors", active ? "text-white" : "hover:text-white hover:bg-[#5E00CC]")} style={{ backgroundColor: active ? ACCENT : "transparent", color: active ? "#FFFFFF" : theme.text }}>
                  {label}
                </button>
              );
            })}
          </div>
        </aside>
        <main className="p-4 md:p-6" style={{ backgroundColor: theme.panel }}>
          <article className={`${card} p-4`}>
            <h3 className="text-lg font-semibold" style={{ color: theme.text }}>{settingsNav.find((s) => s[0] === settingsTab)?.[1]}</h3>
            <div className="mt-3 text-sm space-y-2" style={{ color: theme.text }}>
              {settingsTab === "interface" && (
                <>
                  <p className="font-medium">Tema de la plataforma</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["light", "Claro"],
                      ["dark", "Oscuro"],
                      ["auto", "Automatico"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setThemeMode(id)}
                        className="px-3 py-2 rounded-lg border text-sm transition-colors"
                        style={{
                          borderColor: theme.border,
                          backgroundColor: themeMode === id ? ACCENT : theme.card,
                          color: themeMode === id ? "#FFFFFF" : theme.text,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p style={{ color: theme.sub }}>
                    Modo actual aplicado: <span style={{ color: theme.text, fontWeight: 600 }}>{effectiveTheme === "dark" ? "Oscuro" : "Claro"}</span>
                    {themeMode === "auto" ? " (detectado desde el sistema operativo)." : "."}
                  </p>
                  <p>Idioma, densidad visual y color de acento morado TechRepair.</p>
                </>
              )}
              {settingsTab === "connection" && (
                <>
                  <p className="font-medium">Estado de conectividad y modo offline</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setOfflineModeEnabled((value) => !value)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      Modo offline: {offlineModeEnabled ? "Activado" : "Desactivado"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoReconnect((value) => !value)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      Reconexion automatica: {autoReconnect ? "Activada" : "Desactivada"}
                    </button>
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Frecuencia de verificacion de enlace</label>
                    <select
                      value={heartbeatSeconds}
                      onChange={(event) => setHeartbeatSeconds(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      <option value="15">Cada 15 segundos</option>
                      <option value="30">Cada 30 segundos</option>
                      <option value="60">Cada 60 segundos</option>
                    </select>
                  </div>
                </>
              )}
              {settingsTab === "devices" && (
                <>
                  <p className="font-medium">Gestion de dispositivos corporativos</p>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Politica de acceso para nuevos dispositivos</label>
                    <select
                      value={deviceAccessPolicy}
                      onChange={(event) => setDeviceAccessPolicy(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      <option value="confirm">Requiere confirmacion manual</option>
                      <option value="auto">Aprobacion automatica por inventario</option>
                      <option value="deny">Bloquear por defecto</option>
                    </select>
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Limite de dispositivos por usuario: {maxDevicesPerUser}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={maxDevicesPerUser}
                      onChange={(event) => setMaxDevicesPerUser(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowUnmanagedDevices((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                  >
                    Permitir dispositivos no gestionados: {allowUnmanagedDevices ? "Si" : "No"}
                  </button>
                </>
              )}
              {settingsTab === "security" && (
                <>
                  <p className="font-medium">Seguridad y control de acceso</p>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Tiempo maximo de sesion inactiva: {sessionTimeoutMinutes} min</label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={sessionTimeoutMinutes}
                      onChange={(event) => setSessionTimeoutMinutes(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Lista blanca de IP (separadas por coma)</label>
                    <input
                      type="text"
                      value={ipAllowlist}
                      onChange={(event) => setIpAllowlist(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequireMfaForAdmins((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                  >
                    MFA obligatorio para administradores: {requireMfaForAdmins ? "Activado" : "Desactivado"}
                  </button>
                </>
              )}
              {settingsTab === "notifications" && (
                <>
                  <p className="font-medium">Notificaciones operativas</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setNotifyEmail((value) => !value)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      Correo electronico: {notifyEmail ? "Activado" : "Desactivado"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyPush((value) => !value)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      Notificacion push: {notifyPush ? "Activada" : "Desactivada"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifySms((value) => !value)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      SMS critico: {notifySms ? "Activado" : "Desactivado"}
                    </button>
                  </div>
                </>
              )}
              {settingsTab === "performance" && (
                <>
                  <p className="font-medium">Rendimiento de sesiones remotas</p>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Perfil de rendimiento</label>
                    <select
                      value={performanceMode}
                      onChange={(event) => setPerformanceMode(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      <option value="quality">Maxima calidad</option>
                      <option value="balanced">Balanceado</option>
                      <option value="latency">Baja latencia</option>
                    </select>
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Nivel de telemetria</label>
                    <select
                      value={telemetryLevel}
                      onChange={(event) => setTelemetryLevel(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      <option value="basic">Basico</option>
                      <option value="standard">Estandar</option>
                      <option value="detailed">Detallado</option>
                    </select>
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Limite de ancho de banda: {bandwidthLimitMbps} Mbps</label>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={bandwidthLimitMbps}
                      onChange={(event) => setBandwidthLimitMbps(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              {settingsTab === "backup" && (
                <>
                  <p className="font-medium">Backup y recuperacion</p>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Frecuencia de respaldo</label>
                    <select
                      value={backupFrequency}
                      onChange={(event) => setBackupFrequency(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: theme.sub }}>Retencion historica: {backupRetentionDays} dias</label>
                    <input
                      type="range"
                      min="7"
                      max="180"
                      step="1"
                      value={backupRetentionDays}
                      onChange={(event) => setBackupRetentionDays(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setBackupIntegrityCheck((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: theme.border, backgroundColor: theme.card, color: theme.text }}
                  >
                    Verificacion de integridad post-backup: {backupIntegrityCheck ? "Activada" : "Desactivada"}
                  </button>
                </>
              )}
            </div>
          </article>
        </main>
      </div>
    </section>
  );

  return (
    <div className={cx("min-h-screen admin-shell role-shell", isDark ? "admin-dark" : "admin-light")} style={{ fontFamily: "Inter, Roboto, sans-serif", backgroundColor: theme.bg, color: theme.text }}>
      <style>{`
        .admin-shell .card-surface { background: ${theme.card}; border-color: ${theme.border}; }
        .admin-shell .text-\\[\\#333333\\] { color: ${theme.text}; }
        .admin-shell .text-\\[\\#6B6B6B\\] { color: ${theme.sub}; }
        .admin-shell .bg-\\[\\#F7F7F7\\] { background: ${theme.panel}; }
        .admin-shell .border-\\[\\#D1D1D1\\] { border-color: ${theme.border}; }
        .admin-dark input, .admin-dark select { background: ${theme.card} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
      `}</style>

      <div className="flex">
        <aside className="w-[290px] border-r min-h-screen sticky top-0 flex flex-col" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="TechRepair" className="h-10 w-10 object-contain rounded-lg border p-1" style={{ borderColor: theme.border }} />
              <div><p className="font-semibold" style={{ color: theme.text }}>TechRepair</p><p className="text-xs" style={{ color: theme.sub }}>Enterprise Control</p></div>
            </div>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {nav.map((item) => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => setSection(item.id)} className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors", active ? "text-white bg-[#7F00FF]" : "hover:text-white hover:bg-[#5E00CC]")} style={{ backgroundColor: active ? ACCENT : "transparent", color: active ? "#FFFFFF" : theme.text }}>
                  <item.icon size={18} /> {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3">
            <button onClick={() => auth.signOut()} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm transition-colors" style={{ backgroundColor: ACCENT }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}>
              <LogOut size={16} /> Cerrar sesion
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b px-6 py-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div><h1 className="text-[24px] font-semibold" style={{ color: theme.text }}>Panel Administrador</h1><p className="text-sm" style={{ color: theme.sub }}>{user?.email} - Rol: Administrador</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs"><CheckCircle2 size={14} /> Conectado</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}><Lock size={14} /> Seguro</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}><Globe size={14} /> Dispositivos activos</span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-4 role-main" style={{ backgroundColor: theme.bg }}>
            {section === "dashboard" && dashboard}
            {section === "users" && users}
            {section === "tickets" && tickets}
            {section === "devices" && devicesSection}
            {section === "reports" && reports}
            {section === "settings" && settings}
          </main>
        </div>
      </div>

      {showAdminCallModal && (
        <div className="fixed inset-0 z-[58] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border shadow-2xl" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.sub }}>Llamada remota</p>
                <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Canal de voz con {adminActiveTarget.id || "destino activo"}</h3>
              </div>
              <button type="button" onClick={() => setShowAdminCallModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: theme.border, color: theme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                <p className="text-sm" style={{ color: theme.text }}>Estado: {adminAudioCallActive ? "Llamada en curso" : "Lista para iniciar"}</p>
                <p className="text-xs mt-1" style={{ color: theme.sub }}>Cifrado de voz activo y registro de evento habilitado.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAdminAudioCallActive((prev) => !prev)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminAudioCallActive ? "#16A34A" : theme.panel, color: adminAudioCallActive ? "#FFFFFF" : theme.text, border: `1px solid ${theme.border}` }}
                >
                  {adminAudioCallActive ? "Colgar llamada" : "Iniciar llamada"}
                </button>
                <button
                  onClick={() => setAdminCallMuted((prev) => !prev)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminCallMuted ? "#F59E0B" : theme.panel, color: adminCallMuted ? "#FFFFFF" : theme.text, border: `1px solid ${theme.border}` }}
                >
                  {adminCallMuted ? "Microfono silenciado" : "Silenciar microfono"}
                </button>
                <button
                  onClick={() => setAdminCallSpeakerOn((prev) => !prev)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminCallSpeakerOn ? "#7F00FF" : theme.panel, color: adminCallSpeakerOn ? "#FFFFFF" : theme.text, border: `1px solid ${theme.border}` }}
                >
                  {adminCallSpeakerOn ? "Parlante activo" : "Activar parlante"}
                </button>
                <button
                  onClick={() => setShowAdminCallModal(false)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}` }}
                >
                  Cerrar ventana
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminVideoModal && (
        <div className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.sub }}>Videollamada remota</p>
                <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Canal de video con {adminActiveTarget.id || "destino activo"}</h3>
              </div>
              <button type="button" onClick={() => setShowAdminVideoModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: theme.border, color: theme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              <div className="rounded-xl border min-h-[300px] flex items-center justify-center text-center p-4" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                <div>
                  <Video size={44} className="mx-auto mb-2" style={{ color: ACCENT }} />
                  <p className="font-semibold" style={{ color: theme.text }}>Vista de videollamada</p>
                  <p className="text-sm mt-1" style={{ color: theme.sub }}>Aqui se renderiza el stream remoto y local.</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setAdminVideoCallActive((prev) => !prev)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminVideoCallActive ? "#16A34A" : theme.panel, color: adminVideoCallActive ? "#FFFFFF" : theme.text, border: `1px solid ${theme.border}` }}
                >
                  {adminVideoCallActive ? "Finalizar videollamada" : "Iniciar videollamada"}
                </button>
                <button
                  onClick={() => setAdminVideoMicOn((prev) => !prev)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminVideoMicOn ? theme.panel : "#F59E0B", color: adminVideoMicOn ? theme.text : "#FFFFFF", border: `1px solid ${theme.border}` }}
                >
                  {adminVideoMicOn ? "Microfono ON" : "Microfono OFF"}
                </button>
                <button
                  onClick={() => setAdminVideoCamOn((prev) => !prev)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminVideoCamOn ? theme.panel : "#F59E0B", color: adminVideoCamOn ? theme.text : "#FFFFFF", border: `1px solid ${theme.border}` }}
                >
                  {adminVideoCamOn ? "Camara ON" : "Camara OFF"}
                </button>
                <button
                  onClick={() => setAdminVideoShareOn((prev) => !prev)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: adminVideoShareOn ? "#7F00FF" : theme.panel, color: adminVideoShareOn ? "#FFFFFF" : theme.text, border: `1px solid ${theme.border}` }}
                >
                  {adminVideoShareOn ? "Compartiendo pantalla" : "Compartir pantalla"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminFileModal && (
        <div className="fixed inset-0 z-[57] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.sub }}>Adjuntar archivos</p>
                <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Selecciona los archivos para enviar</h3>
              </div>
              <button type="button" onClick={() => setShowAdminFileModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: theme.border, color: theme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => adminFileInputRef.current?.click()} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: ACCENT }}>
                  Elegir mas archivos
                </button>
                <button
                  onClick={sendAdminPendingFiles}
                  disabled={!adminPendingFiles.some((file) => file.selected)}
                  className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: `1px solid ${theme.border}`, color: theme.text, backgroundColor: theme.panel }}
                >
                  Enviar seleccionados
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto space-y-2">
                {adminPendingFiles.length === 0 && (
                  <p className="text-sm" style={{ color: theme.sub }}>No hay archivos pendientes. Usa "Elegir mas archivos".</p>
                )}
                {adminPendingFiles.map((file) => (
                  <div key={file.id} className="rounded-lg border px-3 py-2 flex items-center justify-between gap-2" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                    <button onClick={() => toggleAdminPendingFile(file.id)} className="text-left flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text }}>{file.selected ? "✓ " : ""}{file.originalName}</p>
                      <p className="text-xs" style={{ color: theme.sub }}>{formatFileSize(file.size)} · {file.type || "archivo"}</p>
                    </button>
                    <button onClick={() => removeAdminPendingFile(file.id)} className="px-2 py-1 rounded-md text-xs" style={{ border: `1px solid ${theme.border}`, color: theme.text }}>
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminInviteModal && (
        <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[calc(100vh-48px)] rounded-2xl border shadow-2xl overflow-y-auto" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.sub }}>Invitacion remota administrativa</p>
                <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Esperando autorizacion del {adminActiveTarget.role === "tech" ? "tecnico" : "cliente"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminInviteModal(false)}
                className="h-9 w-9 rounded-lg border flex items-center justify-center"
                style={{ borderColor: theme.border, color: theme.text }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
              <section className="p-5 border-r" style={{ borderColor: theme.border }}>
                <div className="rounded-xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: theme.sub }}>Destino autorizado</p>
                  <p className="text-3xl font-black mt-1 text-[#7F00FF]">
                    {adminActiveTarget.role === "tech" ? "TEC" : "CLI"}-{adminActiveTarget.id || "000000"}
                  </p>
                  <p className="text-sm mt-2" style={{ color: theme.sub }}>
                    El administrador solicita permisos extendidos de pantalla, control de entrada y auditoria.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                    <Monitor size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: theme.text }}>Pantalla</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                    <Keyboard size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: theme.text }}>Teclado</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                    <MousePointer2 size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: theme.text }}>Mouse</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                    <ShieldCheck size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: theme.text }}>Auditoria</p>
                  </div>
                </div>
              </section>

              <section className="p-5">
                <p className="text-sm font-semibold" style={{ color: theme.text }}>Estado de invitacion</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                    1. Invitacion enviada con privilegios administrativos
                  </div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                    2. Esperando validacion de identidad del destino...
                  </div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                    3. Estado actual: {adminInviteStatus === "waiting" ? "En espera" : adminInviteStatus === "accepted" ? "Aceptada" : adminInviteStatus === "rejected" ? "Rechazada" : "Pendiente"}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={acceptAdminInvitation} className="px-4 py-2.5 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white text-sm font-medium">
                    Simular aceptar
                  </button>
                  <button onClick={rejectAdminInvitation} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                    Simular rechazar
                  </button>
                  <button onClick={startAdminConnection} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text }}>
                    Reenviar invitacion
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showAdminControlModal && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-3 md:p-6">
          <div className="h-full w-full max-w-[1680px] max-h-[calc(100vh-24px)] mx-auto rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: "#2B3752", backgroundColor: "#0B0F18" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#1E2638" }}>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm text-white">Control administrativo activo · {adminActiveTarget.role === "tech" ? "Tecnico" : "Cliente"} {adminActiveTarget.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-[#7F00FF]/30 text-[#DCCBFF]">{formatDuration(adminSessionSeconds)}</span>
                <button className="h-8 w-8 rounded-md border border-[#28324A] text-[#D6DEEF] flex items-center justify-center hover:bg-[#1B253A]">
                  <Maximize2 size={15} />
                </button>
                <button onClick={stopAdminSession} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">
                  Finalizar
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_360px]">
              <section className="relative border-r border-[#1E2638] bg-[#0D1320]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(127,0,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(29,107,255,0.18),transparent_40%)]" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-[92%] h-[85%] rounded-xl border border-[#2B3752] bg-[#121A2C] shadow-inner flex items-center justify-center text-center p-6">
                    <div>
                      <Monitor size={56} className="mx-auto text-[#7F00FF]" />
                      <p className="text-lg text-[#E5EBFF] mt-3 font-semibold">Vista remota de alto privilegio</p>
                      <p className="text-sm text-[#9EABC8] mt-2">
                        Supervisa y controla cualquier dispositivo del ecosistema (cliente o tecnico) con trazabilidad.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="bg-[#0F1729] p-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
                <div className="rounded-xl border border-[#2B3752] p-3">
                  <p className="text-xs uppercase tracking-wide text-[#9EABC8]">Comunicacion</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setAdminAudioCallActive(true);
                        setShowAdminCallModal(true);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${adminAudioCallActive ? "bg-emerald-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      <PhoneCall size={14} /> {adminAudioCallActive ? "Llamada activa" : "Llamada"}
                    </button>
                    <button
                      onClick={() => {
                        setAdminVideoCallActive(true);
                        setShowAdminVideoModal(true);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${adminVideoCallActive ? "bg-emerald-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      <Video size={14} /> {adminVideoCallActive ? "Video activo" : "Videollamada"}
                    </button>
                    <button
                      onClick={() => adminFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-lg bg-[#1A2440] text-[#E5EBFF] text-xs flex items-center gap-2"
                    >
                      <FileUp size={14} /> Enviar archivo
                    </button>
                    <button
                      onClick={() => setAdminRecordSession((prev) => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${adminRecordSession ? "bg-[#7F00FF] text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      <ClipboardCheck size={14} /> {adminRecordSession ? "Grabando sesion" : "Grabar sesion"}
                    </button>
                  </div>
                  <input ref={adminFileInputRef} type="file" multiple className="hidden" onChange={attachAdminFiles} />
                  <p className="mt-2 text-[11px] text-[#9EABC8]">Adjuntos en sesión: {adminRemoteAttachments.length}</p>
                </div>

                <div className="rounded-xl border border-[#2B3752] p-3">
                  <p className="text-sm font-semibold text-[#E5EBFF]">Funciones avanzadas de administrador</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setAdminStealthMode((prev) => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs text-left ${adminStealthMode ? "bg-amber-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      Modo sigiloso: {adminStealthMode ? "Activado" : "Desactivado"}
                    </button>
                    <button
                      onClick={() => setAdminForceReadOnly((prev) => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs text-left ${adminForceReadOnly ? "bg-[#7F00FF] text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      Control de entrada remoto: {adminForceReadOnly ? "Solo lectura" : "Completo"}
                    </button>
                    <button
                      onClick={() => setAdminPriorityOverride((prev) => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs text-left ${adminPriorityOverride ? "bg-emerald-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      Override de prioridad SLA: {adminPriorityOverride ? "Activo" : "Inactivo"}
                    </button>
                    <button className="px-3 py-2 rounded-lg text-xs text-left bg-[#1A2440] text-[#E5EBFF]">
                      Reinicio remoto forzado (simulado)
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#2B3752] p-3 flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#E5EBFF] flex items-center gap-2"><MessageSquare size={14} /> Chat administrativo</p>
                    <span className="text-[11px] text-[#9EABC8]">{adminRemoteAttachments.length} archivos</span>
                  </div>
                  <div className="mt-3 flex-1 rounded-lg border border-[#27324A] bg-[#111B31] p-2.5 overflow-auto space-y-2">
                    {adminRemoteMessages.map((msg, idx) => (
                      <div
                        key={`${msg.time}-${idx}`}
                        className={`rounded-lg px-3 py-2 text-xs ${msg.from === "admin" ? "ml-8 bg-[#7F00FF] text-white" : "mr-8 bg-[#1B2742] text-[#DDE6FF]"}`}
                      >
                        <p>{msg.text}</p>
                        <p className={`mt-1 ${msg.from === "admin" ? "text-white/80" : "text-[#9CB0D8]"}`}>{msg.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={adminChatInput}
                      onChange={(e) => setAdminChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendAdminMessage()}
                      placeholder="Escribe una instruccion administrativa..."
                      className="flex-1 rounded-lg border border-[#2B3752] bg-[#0D1426] px-3 py-2 text-sm text-[#E5EBFF] outline-none focus:ring-2 focus:ring-[#7F00FF]/30 focus:border-[#7F00FF]"
                    />
                    <button onClick={sendAdminMessage} className="h-10 w-10 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white flex items-center justify-center">
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TechnicianWorkspace({ user }) {
  const [section, setSection] = useState("dashboard");
  const [techSettingsTab, setTechSettingsTab] = useState("interface");
  const [clientCode, setClientCode] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("idle");
  const [showRemoteControlModal, setShowRemoteControlModal] = useState(false);
  const [activeRemoteClient, setActiveRemoteClient] = useState("");
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [remoteChatInput, setRemoteChatInput] = useState("");
  const [audioCallActive, setAudioCallActive] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [remoteCameraEnabled, setRemoteCameraEnabled] = useState(true);
  const [remoteAttachments, setRemoteAttachments] = useState([]);
  const [showTechCallModal, setShowTechCallModal] = useState(false);
  const [showTechVideoModal, setShowTechVideoModal] = useState(false);
  const [showTechFileModal, setShowTechFileModal] = useState(false);
  const [techCallMuted, setTechCallMuted] = useState(false);
  const [techSpeakerOn, setTechSpeakerOn] = useState(true);
  const [techVideoMicOn, setTechVideoMicOn] = useState(true);
  const [techVideoCamOn, setTechVideoCamOn] = useState(true);
  const [techVideoShareOn, setTechVideoShareOn] = useState(false);
  const [techPendingFiles, setTechPendingFiles] = useState([]);
  const [remoteMessages, setRemoteMessages] = useState([
    { from: "system", text: "Canal de soporte seguro iniciado.", time: new Date().toLocaleTimeString() },
  ]);
  const remoteFileInputRef = useRef(null);
  const [techThemeMode, setTechThemeMode] = useState(() => localStorage.getItem("app_theme_mode") || localStorage.getItem("tech_theme_mode") || "auto");
  const [techSystemTheme, setTechSystemTheme] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [techNotifyCriticalTickets, setTechNotifyCriticalTickets] = useState(true);
  const [techNotifyClientIdle, setTechNotifyClientIdle] = useState(true);
  const [techNotifyEmail, setTechNotifyEmail] = useState(true);
  const [techNotifyInApp, setTechNotifyInApp] = useState(true);
  const [techTransmissionMode, setTechTransmissionMode] = useState("auto");
  const [techAutoReconnect, setTechAutoReconnect] = useState(true);
  const [techBandwidthLimit, setTechBandwidthLimit] = useState(80);
  const [techMaskSensitiveData, setTechMaskSensitiveData] = useState(true);
  const [techRequireFullControlConfirm, setTechRequireFullControlConfirm] = useState(true);
  const [techActionAuditLog, setTechActionAuditLog] = useState(true);
  const [sessionLogs, setSessionLogs] = useState([
    "17:45 - Verificacion de conectividad remota.",
    "17:47 - Diagnostico inicial de latencia.",
    "17:48 - Esperando codigo de cliente.",
  ]);

  const nav = [
    { id: "dashboard", label: "Inicio tecnico", icon: Activity },
    { id: "tickets", label: "Mis tickets", icon: ClipboardCheck },
    { id: "sessions", label: "Sesiones remotas", icon: Headphones },
    { id: "devices", label: "Dispositivos asignados", icon: Monitor },
    { id: "knowledge", label: "Base de conocimiento", icon: BookOpen },
    { id: "shift", label: "Turno y bitacora", icon: Clock3 },
    { id: "settings", label: "Configuracion", icon: Wrench },
  ];

  useEffect(() => {
    localStorage.setItem("tech_theme_mode", techThemeMode);
    localStorage.setItem("app_theme_mode", techThemeMode);
  }, [techThemeMode]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setTechSystemTheme(event.matches ? "dark" : "light");
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const effectiveTechTheme = techThemeMode === "auto" ? techSystemTheme : techThemeMode;
  const isTechDark = effectiveTechTheme === "dark";
  useEffect(() => {
    const normalized = effectiveTechTheme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", normalized);
    document.documentElement.classList.toggle("dark", normalized === "dark");
  }, [effectiveTechTheme]);
  const techTheme = isTechDark
    ? { bg: "#111111", panel: "#1A1A1A", card: "#161616", border: "#3A3A3A", text: "#F3F3F3", sub: "#B8B8B8" }
    : { bg: "#FFFFFF", panel: "#F7F7F7", card: "#FFFFFF", border: "#D1D1D1", text: "#333333", sub: "#6B6B6B" };

  const settingsNav = [
    ["interface", "Interfaz y tema"],
    ["notifications", "Notificaciones tecnicas"],
    ["connection", "Conexion remota"],
    ["privacy", "Privacidad de sesion"],
  ];

  const tickets = [
    { id: "TK-9321", user: "Paula Gomez", priority: "Alta", status: "Pendiente", eta: "12 min" },
    { id: "TK-9312", user: "Luis Ortega", priority: "Media", status: "En progreso", eta: "25 min" },
    { id: "TK-9298", user: "Marta Leon", priority: "Critica", status: "Pendiente", eta: "5 min" },
  ];

  const devices = [
    { name: "HQ-PC-001", os: "Windows 11", state: "Online", ping: "18ms", last: "Ahora" },
    { name: "OPS-MOB-021", os: "Android 14", state: "Inestable", ping: "98ms", last: "2 min" },
    { name: "DIR-TAB-004", os: "iPadOS", state: "Online", ping: "26ms", last: "Ahora" },
  ];
  const remoteSessions = useMemo(
    () => [
      { id: "RS-1402", client: "CL-809115", category: "Correctivo", priority: "Alta", status: "Activa", date: "2026-02-16 17:45", duration: "22 min" },
      { id: "RS-1401", client: "CL-772201", category: "Preventivo", priority: "Media", status: "Finalizada", date: "2026-02-16 16:30", duration: "38 min" },
      { id: "RS-1398", client: "CL-550980", category: "Instalacion", priority: "Baja", status: "Finalizada", date: "2026-02-16 14:10", duration: "19 min" },
      { id: "RS-1395", client: "CL-991204", category: "Correctivo", priority: "Critica", status: "Pendiente", date: "2026-02-16 12:55", duration: "Sin iniciar" },
      { id: "RS-1393", client: "CL-664030", category: "Auditoria", priority: "Media", status: "Finalizada", date: "2026-02-15 18:20", duration: "41 min" },
      { id: "RS-1390", client: "CL-440312", category: "Preventivo", priority: "Alta", status: "Activa", date: "2026-02-15 11:05", duration: "15 min" },
    ],
    []
  );
  const remoteSessionId = useMemo(() => {
    const normalized = (activeRemoteClient || "general").trim().replace(/\s+/g, "-");
    return `tech-${normalized}`;
  }, [activeRemoteClient]);

  const startSession = () => {
    if (!clientCode.trim()) return;
    setActiveRemoteClient(clientCode.trim());
    setInviteStatus("waiting");
    setShowInviteModal(true);
    setSessionLogs((prev) => [`${new Date().toLocaleTimeString()} - Invitacion enviada al cliente ${clientCode.trim()}.`, ...prev]);
  };

  const stopSession = () => {
    setSessionActive(false);
    setShowInviteModal(false);
    setShowRemoteControlModal(false);
    setInviteStatus("idle");
    setSessionSeconds(0);
    setSessionLogs((prev) => [`${new Date().toLocaleTimeString()} - Sesion finalizada por tecnico.`, ...prev]);
  };

  const acceptInvitation = () => {
    setInviteStatus("accepted");
    setShowInviteModal(false);
    setSessionActive(true);
    setShowRemoteControlModal(true);
    setSessionSeconds(0);
    setSessionLogs((prev) => [`${new Date().toLocaleTimeString()} - Cliente ${activeRemoteClient} acepto la invitacion.`, ...prev]);
  };

  const rejectInvitation = () => {
    setInviteStatus("rejected");
    setShowInviteModal(false);
    setSessionActive(false);
    setShowRemoteControlModal(false);
    setSessionLogs((prev) => [`${new Date().toLocaleTimeString()} - Cliente ${activeRemoteClient} rechazo la invitacion.`, ...prev]);
  };

  useEffect(() => {
    if (!sessionActive || !showRemoteControlModal) return;
    const timer = setInterval(() => setSessionSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [sessionActive, showRemoteControlModal]);

  const formatDuration = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatMessageTime = (value) => {
    if (!value) return new Date().toLocaleTimeString();
    const dateValue = new Date(value);
    if (Number.isNaN(dateValue.getTime())) return new Date().toLocaleTimeString();
    return dateValue.toLocaleTimeString();
  };

  const toUiMessage = (message) => ({
    from: message.senderRole === "tech" ? "tech" : "system",
    text: message.text,
    time: formatMessageTime(message.createdAt),
  });

  useEffect(() => {
    if (!sessionActive || !showRemoteControlModal || !activeRemoteClient) return;
    let isCancelled = false;

    const loadRemoteSessionData = async () => {
      try {
        const [messages, files] = await Promise.all([
          remoteSessionService.getMessages(remoteSessionId),
          remoteSessionService.getFiles(remoteSessionId),
        ]);

        if (isCancelled) return;

        const normalizedMessages = Array.isArray(messages) ? messages.map(toUiMessage) : [];
        setRemoteMessages(
          normalizedMessages.length
            ? normalizedMessages
            : [{ from: "system", text: "Canal de soporte seguro iniciado.", time: new Date().toLocaleTimeString() }]
        );
        setRemoteAttachments(Array.isArray(files) ? files : []);
      } catch (error) {
        if (isCancelled) return;
        setRemoteMessages((prev) => {
          const alreadyNotified = prev.some((item) => item.text === "No se pudo sincronizar el chat remoto.");
          if (alreadyNotified) return prev;
          return [{ from: "system", text: "No se pudo sincronizar el chat remoto.", time: new Date().toLocaleTimeString() }, ...prev];
        });
      }
    };

    loadRemoteSessionData();
    const poller = setInterval(loadRemoteSessionData, 3000);

    return () => {
      isCancelled = true;
      clearInterval(poller);
    };
  }, [sessionActive, showRemoteControlModal, activeRemoteClient, remoteSessionId]);

  const sendRemoteMessage = async () => {
    const text = remoteChatInput.trim();
    if (!text) return;

    try {
      const savedMessage = await remoteSessionService.sendMessage(remoteSessionId, {
        senderName: user?.displayName || user?.email || "Tecnico",
        senderRole: "tech",
        text,
      });
      setRemoteMessages((prev) => [toUiMessage(savedMessage), ...prev]);
      setRemoteChatInput("");
    } catch (error) {
      setRemoteMessages((prev) => [
        { from: "system", text: "No se pudo enviar el mensaje.", time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    }
  };

  const attachRemoteFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const stagedFiles = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      originalName: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      file,
      selected: true,
    }));
    setTechPendingFiles((prev) => [...stagedFiles, ...prev]);
    setShowTechFileModal(true);
    event.target.value = "";
  };

  const toggleTechPendingFile = (fileId) => {
    setTechPendingFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, selected: !file.selected } : file))
    );
  };

  const removeTechPendingFile = (fileId) => {
    setTechPendingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const sendTechPendingFiles = async () => {
    const selectedFiles = techPendingFiles.filter((file) => file.selected && file.file);
    if (!selectedFiles.length) return;
    if (!sessionActive || !activeRemoteClient) {
      setRemoteMessages((prev) => [
        { from: "system", text: "Inicia una sesion remota para enviar archivos.", time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
      return;
    }
    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map((entry) =>
          remoteSessionService.uploadFile(
            remoteSessionId,
            entry.file,
            user?.displayName || user?.email || "Tecnico",
            "tech"
          )
        )
      );

      setRemoteAttachments((prev) => [...uploadedFiles, ...prev]);
      setRemoteMessages((prev) => [
        {
          from: "tech",
          text: `Adjuntos: ${uploadedFiles.map((file) => `${file.originalName} (${formatFileSize(file.size)})`).join(", ")}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (error) {
      setRemoteMessages((prev) => [
        { from: "system", text: "No se pudieron subir los archivos.", time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    }
    setTechPendingFiles((prev) => prev.filter((file) => !file.selected));
    setShowTechFileModal(false);
  };

  const card = "tech-card rounded-xl shadow-sm border";
  const technicianId = "808 544 541";

  const dashboard = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Tickets asignados", value: "12", icon: ClipboardCheck, tone: "text-[#7F00FF]" },
          { label: "En progreso", value: "4", icon: Activity, tone: "text-blue-600" },
          { label: "SLA personal", value: "96.1%", icon: Zap, tone: "text-green-600" },
          { label: "Sesiones hoy", value: "9", icon: Headphones, tone: "text-[#5E00CC]" },
        ].map((s) => (
          <article key={s.label} className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B6B6B]">{s.label}</p>
              <s.icon size={18} className={s.tone} />
            </div>
            <p className="text-3xl font-bold text-[#333333] mt-2">{s.value}</p>
          </article>
        ))}
      </div>
      <section className={`${card} p-5`}>
        <h2 className="text-xl font-semibold text-[#333333]">Consola rapida de soporte tecnico</h2>
        <p className="text-sm text-[#6B6B6B] mt-1">Conecta, diagnostica y ejecuta acciones remotas de primer nivel.</p>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <button className="rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] px-4 py-3 text-left">
            <p className="font-semibold text-[#333333]">Diagnostico rapido</p>
            <p className="text-xs text-[#6B6B6B] mt-1">CPU, RAM, red y logs de errores del endpoint.</p>
          </button>
          <button className="rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] px-4 py-3 text-left">
            <p className="font-semibold text-[#333333]">Checklist de cierre</p>
            <p className="text-xs text-[#6B6B6B] mt-1">Valida servicio, evidencia y confirmacion de usuario.</p>
          </button>
          <button className="rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] px-4 py-3 text-left">
            <p className="font-semibold text-[#333333]">Escalar a nivel 2</p>
            <p className="text-xs text-[#6B6B6B] mt-1">Transferencia con contexto tecnico y adjuntos.</p>
          </button>
        </div>
      </section>

      <section className={`${card} p-5`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-[#333333]">Consola de sesiones remotas</h2>
          <Pill tone="ok">{sessionActive ? "Sesion activa" : "Canal disponible"}</Pill>
        </div>
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-4">
          <article className="rounded-lg border border-dashed border-[#D1D1D1] bg-[#F7F7F7] p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">ID del tecnico</p>
              <p className="text-[38px] leading-10 font-bold text-[#7F00FF]">{technicianId}</p>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(technicianId.replace(/\s/g, ""))}
              className="px-3 py-2 rounded-lg border border-[#D1D1D1] text-sm"
            >
              Copiar ID
            </button>
          </article>

          <article className="rounded-lg border p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.card }}>
            <label className="text-sm font-medium" style={{ color: techTheme.text }}>Codigo de cliente</label>
            <div className="mt-2 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
              <input
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                placeholder="Ej: CL-809-115-001"
                className="w-full rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel, color: techTheme.text }}
              />
              <div className="flex gap-2">
                <button
                  onClick={startSession}
                  className="px-4 py-2.5 rounded-lg bg-[#7F00FF] text-white font-medium flex items-center gap-2 disabled:opacity-50"
                  disabled={!clientCode.trim()}
                >
                  <PlayCircle size={16} /> Iniciar
                </button>
                <button
                  onClick={stopSession}
                  className="px-4 py-2.5 rounded-lg border flex items-center gap-2"
                  style={{ borderColor: techTheme.border, color: techTheme.text, backgroundColor: techTheme.card }}
                  disabled={!sessionActive}
                >
                  <PauseCircle size={16} /> Finalizar
                </button>
              </div>
            </div>
          </article>
        </div>
        <article className="mt-4 rounded-lg border p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.card }}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-lg font-semibold" style={{ color: techTheme.text }}>Chat remoto integrado</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAudioCallActive(true);
                  setShowTechCallModal(true);
                }}
                className={`px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 ${audioCallActive ? "bg-emerald-600 text-white" : ""}`}
                style={audioCallActive ? {} : { border: `1px solid ${techTheme.border}`, color: techTheme.text, backgroundColor: techTheme.panel }}
              >
                <PhoneCall size={14} /> {audioCallActive ? "Llamada activa" : "Llamada"}
              </button>
              <button
                onClick={() => {
                  setVideoCallActive(true);
                  setShowTechVideoModal(true);
                }}
                className={`px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 ${videoCallActive ? "bg-emerald-600 text-white" : ""}`}
                style={videoCallActive ? {} : { border: `1px solid ${techTheme.border}`, color: techTheme.text, backgroundColor: techTheme.panel }}
              >
                <Video size={14} /> {videoCallActive ? "Video activo" : "Videollamada"}
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-lg border h-56 overflow-auto p-2.5 space-y-2" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
            {remoteMessages.map((msg, idx) => (
              <div
                key={`${msg.time}-${idx}`}
                className={cx("max-w-[88%] rounded-lg px-3 py-2 text-sm", msg.from === "tech" ? "ml-auto text-white" : "")}
                style={msg.from === "tech" ? { backgroundColor: ACCENT } : { backgroundColor: techTheme.card, border: `1px solid ${techTheme.border}`, color: techTheme.text }}
              >
                <p>{msg.text}</p>
                <p className={cx("text-xs mt-1", msg.from === "tech" ? "text-white/80" : "")} style={msg.from === "tech" ? {} : { color: techTheme.sub }}>
                  {msg.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => remoteFileInputRef.current?.click()}
              className="h-10 w-10 rounded-lg border flex items-center justify-center"
              style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel, color: techTheme.text }}
              title="Adjuntar archivos"
            >
              <Paperclip size={16} />
            </button>
            <input ref={remoteFileInputRef} type="file" multiple className="hidden" onChange={attachRemoteFiles} />
            <input
              value={remoteChatInput}
              onChange={(e) => setRemoteChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendRemoteMessage()}
              placeholder={sessionActive ? "Escribe un mensaje tecnico..." : "Inicia una sesion para habilitar el chat"}
              className="flex-1 min-w-[260px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
              style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
              disabled={!sessionActive}
            />
            <button
              onClick={sendRemoteMessage}
              className="px-3 h-10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
              disabled={!sessionActive || !remoteChatInput.trim()}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: techTheme.sub }}>
            Archivos adjuntos en sesion: {remoteAttachments.length}
          </p>
        </article>
      </section>
    </div>
  );

  const ticketSection = (
    <section className={`${card} p-4`}>
      <h2 className="text-[20px] font-semibold text-[#333333]">Tickets asignados al tecnico</h2>
      <div className="mt-4 overflow-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="text-left text-[#6B6B6B] border-b border-[#D1D1D1]">
              <th className="py-3">ID</th><th>Usuario</th><th>Prioridad</th><th>Estado</th><th>ETA</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b border-[#D1D1D1]">
                <td className="py-3 font-semibold text-[#333333]">{t.id}</td>
                <td>{t.user}</td>
                <td><Pill tone={t.priority === "Critica" ? "bad" : t.priority === "Alta" ? "warn" : "neutral"}>{t.priority}</Pill></td>
                <td className="text-[#333333]">{t.status}</td>
                <td className="text-[#6B6B6B]">{t.eta}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded-md border border-[#D1D1D1]">Abrir</button>
                    <button className="px-2 py-1 rounded-md border border-[#D1D1D1]">Diagnosticar</button>
                    <button className="px-2 py-1 rounded-md bg-[#7F00FF] text-white">Cerrar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const sessionsSection = (
    <div className="space-y-4">
      <section className={`${card} p-4`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-[20px] font-semibold text-[#333333]">Sesiones remotas del tecnico</h2>
          <div className="flex flex-wrap gap-2">
            <Pill tone="bad">Criticas</Pill>
            <Pill tone="warn">Alta prioridad</Pill>
            <Pill tone="neutral">Todas</Pill>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            ["Total sesiones", String(remoteSessions.length), "Ultimos 2 dias"],
            ["Activas", String(remoteSessions.filter((s) => s.status === "Activa").length), "Atencion en curso"],
            ["Pendientes", String(remoteSessions.filter((s) => s.status === "Pendiente").length), "Sin iniciar"],
            ["Criticas", String(remoteSessions.filter((s) => s.priority === "Critica").length), "Escalar si supera SLA"],
          ].map((kpi) => (
            <article key={kpi[0]} className="rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] p-3">
              <p className="text-xs text-[#6B6B6B]">{kpi[0]}</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">{kpi[1]}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">{kpi[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${card} p-4`}>
        <h3 className="text-lg font-semibold text-[#333333]">Listado organizado por categoria, fecha e importancia</h3>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="text-left border-b border-[#D1D1D1] text-[#6B6B6B]">
                <th className="py-3">Sesion</th>
                <th>Categoria</th>
                <th>Cliente</th>
                <th>Importancia</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Duracion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {remoteSessions.map((s) => (
                <tr key={s.id} className="border-b border-[#D1D1D1]">
                  <td className="py-3 font-semibold text-[#333333]">{s.id}</td>
                  <td className="text-[#333333]">{s.category}</td>
                  <td className="text-[#6B6B6B]">{s.client}</td>
                  <td><Pill tone={s.priority === "Critica" ? "bad" : s.priority === "Alta" ? "warn" : "neutral"}>{s.priority}</Pill></td>
                  <td><Pill tone={s.status === "Activa" ? "ok" : s.status === "Pendiente" ? "warn" : "neutral"}>{s.status}</Pill></td>
                  <td className="text-[#6B6B6B]">{s.date}</td>
                  <td className="text-[#6B6B6B]">{s.duration}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded-md border border-[#D1D1D1]">Abrir</button>
                      <button className="px-2 py-1 rounded-md border border-[#D1D1D1]">Historial</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${card} p-4`}>
        <h3 className="text-lg font-semibold text-[#333333]">Bitacora de sesion</h3>
        <div className="mt-3 p-3 rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] h-44 overflow-auto">
          <ul className="space-y-2">
            {sessionLogs.map((line, idx) => (
              <li key={`${line}-${idx}`} className="text-sm text-[#333333]">{line}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );

  const devicesSection = (
    <section className={`${card} p-4`}>
      <h2 className="text-[20px] font-semibold text-[#333333]">Dispositivos asignados</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {devices.map((d) => (
          <article key={d.name} className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
            <p className="font-semibold text-[#333333]">{d.name}</p>
            <p className="text-sm text-[#6B6B6B] mt-1">{d.os}</p>
            <div className="mt-3 flex items-center justify-between">
              <Pill tone={d.state === "Online" ? "ok" : d.state === "Inestable" ? "warn" : "bad"}>{d.state}</Pill>
              <span className="text-xs text-[#6B6B6B]">Ping {d.ping}</span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-2">Ultima conexion: {d.last}</p>
          </article>
        ))}
      </div>
    </section>
  );

  const knowledgeSection = (
    <section className={`${card} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-semibold text-[#333333]">Base de conocimiento tecnico</h2>
        <div className="flex items-center gap-2 border border-[#D1D1D1] rounded-lg px-3 py-2 bg-[#F7F7F7]">
          <Search size={16} className="text-[#6B6B6B]" />
          <input className="bg-transparent outline-none text-sm" placeholder="Buscar procedimiento..." />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          "Guia de diagnostico remoto para red inestable",
          "Checklist de cierre de ticket critico",
          "Procedimiento de reinstalacion de agente",
          "Matriz de escalamiento L1 -> L2",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
            <p className="text-sm font-medium text-[#333333]">{item}</p>
            <button className="mt-3 text-xs text-[#7F00FF] font-semibold">Abrir documento</button>
          </article>
        ))}
      </div>
    </section>
  );

  const shiftSection = (
    <section className={`${card} p-4`}>
      <h2 className="text-[20px] font-semibold text-[#333333]">Turno y bitacora tecnica</h2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <article className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
          <p className="text-xs text-[#6B6B6B]">Estado de turno</p>
          <p className="text-xl font-semibold text-green-700 mt-1">Activo</p>
          <p className="text-xs text-[#6B6B6B] mt-2">Inicio: 08:00 AM</p>
        </article>
        <article className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
          <p className="text-xs text-[#6B6B6B]">Tickets cerrados hoy</p>
          <p className="text-xl font-semibold text-[#333333] mt-1">7</p>
          <p className="text-xs text-[#6B6B6B] mt-2">Meta diaria: 8</p>
        </article>
        <article className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
          <p className="text-xs text-[#6B6B6B]">Alertas activas</p>
          <p className="text-xl font-semibold text-amber-700 mt-1">2</p>
          <p className="text-xs text-[#6B6B6B] mt-2">1 pendiente de seguimiento</p>
        </article>
      </div>
      <div className="mt-4 rounded-lg border border-[#D1D1D1] p-4">
        <p className="text-sm font-medium text-[#333333] mb-2">Notas del turno</p>
        <textarea
          className="w-full min-h-[110px] rounded-lg border border-[#D1D1D1] bg-[#F7F7F7] p-3 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
          placeholder="Documenta acciones, bloqueos y siguientes pasos para el siguiente tecnico."
        />
      </div>
    </section>
  );

  const settingsSection = (
    <section className={`${card} p-0 overflow-hidden`}>
      <div className="grid grid-cols-1 xl:grid-cols-[290px_1fr] min-h-[520px]">
        <aside className="border-r p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.card }}>
          <h2 className="text-[20px] font-semibold mb-3" style={{ color: techTheme.text }}>Configuracion tecnica</h2>
          <div className="space-y-1">
            {settingsNav.map(([id, label]) => {
              const active = techSettingsTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTechSettingsTab(id)}
                  className={cx("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors", active ? "text-white bg-[#7F00FF]" : "hover:text-white hover:bg-[#5E00CC]")}
                  style={{ color: active ? "#FFFFFF" : techTheme.text }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </aside>
        <main className="p-4 md:p-6" style={{ backgroundColor: techTheme.panel }}>
          <article className={`${card} p-4`}>
            <h3 className="text-lg font-semibold" style={{ color: techTheme.text }}>{settingsNav.find((s) => s[0] === techSettingsTab)?.[1]}</h3>
            <div className="mt-3 text-sm space-y-2" style={{ color: techTheme.text }}>
              {techSettingsTab === "interface" && (
                <>
                  <p className="font-medium">Tema de la plataforma</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["light", "Claro"],
                      ["dark", "Oscuro"],
                      ["auto", "Automatico"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTechThemeMode(id)}
                        className={cx("px-3 py-2 rounded-lg border text-sm transition-colors", techThemeMode === id ? "text-white bg-[#7F00FF] border-transparent" : "border-[#D1D1D1]")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p style={{ color: techTheme.sub }}>
                    Modo actual aplicado: <span className="font-semibold" style={{ color: techTheme.text }}>{effectiveTechTheme === "dark" ? "Oscuro" : "Claro"}</span>
                    {techThemeMode === "auto" ? " (detectado desde el sistema operativo)." : "."}
                  </p>
                  <p>Tamano de fuente y densidad de paneles tecnicos.</p>
                  <p>Atajos de teclado para sesiones remotas.</p>
                </>
              )}
              {techSettingsTab === "notifications" && (
                <>
                  <p className="font-medium">Notificaciones tecnicas</p>
                  <button
                    type="button"
                    onClick={() => setTechNotifyCriticalTickets((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Alertas de ticket critico: {techNotifyCriticalTickets ? "Activadas" : "Desactivadas"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechNotifyClientIdle((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Notificacion de inactividad del cliente: {techNotifyClientIdle ? "Activada" : "Desactivada"}
                  </button>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: techTheme.sub }}>Canales habilitados</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setTechNotifyInApp((value) => !value)}
                        className="px-3 py-2 rounded-lg border text-xs"
                        style={{
                          borderColor: techTheme.border,
                          backgroundColor: techNotifyInApp ? "#7F00FF" : techTheme.card,
                          color: techNotifyInApp ? "#FFFFFF" : techTheme.text,
                        }}
                      >
                        App
                      </button>
                      <button
                        type="button"
                        onClick={() => setTechNotifyEmail((value) => !value)}
                        className="px-3 py-2 rounded-lg border text-xs"
                        style={{
                          borderColor: techTheme.border,
                          backgroundColor: techNotifyEmail ? "#7F00FF" : techTheme.card,
                          color: techNotifyEmail ? "#FFFFFF" : techTheme.text,
                        }}
                      >
                        Email
                      </button>
                    </div>
                  </div>
                </>
              )}
              {techSettingsTab === "connection" && (
                <>
                  <p className="font-medium">Conexion remota</p>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: techTheme.sub }}>Calidad de transmision</label>
                    <select
                      value={techTransmissionMode}
                      onChange={(event) => setTechTransmissionMode(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                    >
                      <option value="auto">Automatica</option>
                      <option value="quality">Maxima calidad</option>
                      <option value="latency">Baja latencia</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTechAutoReconnect((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Reconexion automatica en perdida de red: {techAutoReconnect ? "Activada" : "Desactivada"}
                  </button>
                  <div className="pt-1">
                    <label className="block text-sm mb-1" style={{ color: techTheme.sub }}>Limite de ancho de banda por sesion: {techBandwidthLimit} Mbps</label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={techBandwidthLimit}
                      onChange={(event) => setTechBandwidthLimit(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              {techSettingsTab === "privacy" && (
                <>
                  <p className="font-medium">Privacidad de sesion</p>
                  <button
                    type="button"
                    onClick={() => setTechMaskSensitiveData((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Ocultar datos sensibles en capturas: {techMaskSensitiveData ? "Activado" : "Desactivado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechRequireFullControlConfirm((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Solicitar confirmacion para control total: {techRequireFullControlConfirm ? "Activado" : "Desactivado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechActionAuditLog((value) => !value)}
                    className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-[#7F00FF]/15"
                    style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
                  >
                    Registro de acciones del tecnico: {techActionAuditLog ? "Habilitado" : "Deshabilitado"}
                  </button>
                </>
              )}
            </div>
          </article>
        </main>
      </div>
    </section>
  );

  return (
    <div className={cx("min-h-screen tech-shell role-shell", isTechDark ? "tech-dark" : "tech-light")} style={{ fontFamily: "Inter, Roboto, sans-serif", backgroundColor: techTheme.bg, color: techTheme.text }}>
      <style>{`
        .tech-shell .tech-card { background: ${techTheme.card}; border-color: ${techTheme.border}; }
        .tech-shell .text-\\[\\#333333\\] { color: ${techTheme.text}; }
        .tech-shell .text-\\[\\#6B6B6B\\] { color: ${techTheme.sub}; }
        .tech-shell .bg-\\[\\#F7F7F7\\] { background: ${techTheme.panel}; }
        .tech-shell .border-\\[\\#D1D1D1\\] { border-color: ${techTheme.border}; }
        .tech-dark input, .tech-dark textarea, .tech-dark select {
          background: ${techTheme.card} !important;
          color: ${techTheme.text} !important;
          border-color: ${techTheme.border} !important;
        }
      `}</style>
      <div className="flex">
        <aside className="w-[290px] border-r min-h-screen sticky top-0 flex flex-col" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
          <div className="p-4 border-b" style={{ borderColor: techTheme.border }}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="TechRepair" className="h-10 w-10 object-contain rounded-lg border border-[#D1D1D1] p-1" />
              <div>
                <p className="font-semibold text-[#333333]">TechRepair</p>
                <p className="text-xs text-[#6B6B6B]">Tecnico Workstation</p>
              </div>
            </div>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {nav.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors", active ? "text-white bg-[#7F00FF]" : "hover:text-white hover:bg-[#5E00CC]")}
                  style={{ color: active ? "#FFFFFF" : techTheme.text }}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3">
            <button onClick={() => auth.signOut()} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm bg-[#7F00FF] hover:bg-[#5E00CC] transition-colors">
              <LogOut size={16} /> Cerrar sesion
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b px-6 py-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.card }}>
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h1 className="text-[24px] font-semibold text-[#333333]">Panel Tecnico</h1>
                <p className="text-sm text-[#6B6B6B]">{user?.email} · Rol: Tecnico</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs"><CheckCircle2 size={14} /> Disponible</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D1D1D1] bg-[#F7F7F7] text-[#333333] text-xs"><TerminalSquare size={14} /> Diagnostico listo</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D1D1D1] bg-[#F7F7F7] text-[#333333] text-xs"><Clock3 size={14} /> SLA en objetivo</span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-4 role-main" style={{ backgroundColor: techTheme.bg }}>
            {section === "dashboard" && dashboard}
            {section === "tickets" && ticketSection}
            {section === "sessions" && sessionsSection}
            {section === "devices" && devicesSection}
            {section === "knowledge" && knowledgeSection}
            {section === "shift" && shiftSection}
            {section === "settings" && settingsSection}
          </main>
        </div>
      </div>

      {showTechCallModal && (
        <div className="fixed inset-0 z-[58] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border shadow-2xl" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: techTheme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: techTheme.sub }}>Llamada remota</p>
                <h3 className="text-xl font-semibold" style={{ color: techTheme.text }}>Canal de voz con cliente {activeRemoteClient || "activo"}</h3>
              </div>
              <button type="button" onClick={() => setShowTechCallModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: techTheme.border, color: techTheme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl border p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                <p className="text-sm" style={{ color: techTheme.text }}>Estado: {audioCallActive ? "Llamada en curso" : "Lista para iniciar"}</p>
                <p className="text-xs mt-1" style={{ color: techTheme.sub }}>Canal de voz cifrado para asistencia remota.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setAudioCallActive((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: audioCallActive ? "#16A34A" : techTheme.panel, color: audioCallActive ? "#FFFFFF" : techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  {audioCallActive ? "Colgar llamada" : "Iniciar llamada"}
                </button>
                <button onClick={() => setTechCallMuted((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techCallMuted ? "#F59E0B" : techTheme.panel, color: techCallMuted ? "#FFFFFF" : techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  {techCallMuted ? "Microfono silenciado" : "Silenciar microfono"}
                </button>
                <button onClick={() => setTechSpeakerOn((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techSpeakerOn ? "#7F00FF" : techTheme.panel, color: techSpeakerOn ? "#FFFFFF" : techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  {techSpeakerOn ? "Parlante activo" : "Activar parlante"}
                </button>
                <button onClick={() => setShowTechCallModal(false)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techTheme.panel, color: techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  Cerrar ventana
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTechVideoModal && (
        <div className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: techTheme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: techTheme.sub }}>Videollamada remota</p>
                <h3 className="text-xl font-semibold" style={{ color: techTheme.text }}>Canal de video con cliente {activeRemoteClient || "activo"}</h3>
              </div>
              <button type="button" onClick={() => setShowTechVideoModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: techTheme.border, color: techTheme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              <div className="rounded-xl border min-h-[300px] flex items-center justify-center text-center p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                <div>
                  <Video size={44} className="mx-auto mb-2 text-[#7F00FF]" />
                  <p className="font-semibold" style={{ color: techTheme.text }}>Vista de videollamada</p>
                  <p className="text-sm mt-1" style={{ color: techTheme.sub }}>Render de stream remoto/local durante asistencia.</p>
                </div>
              </div>
              <div className="space-y-2">
                <button onClick={() => setVideoCallActive((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: videoCallActive ? "#16A34A" : techTheme.panel, color: videoCallActive ? "#FFFFFF" : techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  {videoCallActive ? "Finalizar videollamada" : "Iniciar videollamada"}
                </button>
                <button onClick={() => setTechVideoMicOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techVideoMicOn ? techTheme.panel : "#F59E0B", color: techVideoMicOn ? techTheme.text : "#FFFFFF", border: `1px solid ${techTheme.border}` }}>
                  {techVideoMicOn ? "Microfono ON" : "Microfono OFF"}
                </button>
                <button onClick={() => setTechVideoCamOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techVideoCamOn ? techTheme.panel : "#F59E0B", color: techVideoCamOn ? techTheme.text : "#FFFFFF", border: `1px solid ${techTheme.border}` }}>
                  {techVideoCamOn ? "Camara ON" : "Camara OFF"}
                </button>
                <button onClick={() => setTechVideoShareOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: techVideoShareOn ? "#7F00FF" : techTheme.panel, color: techVideoShareOn ? "#FFFFFF" : techTheme.text, border: `1px solid ${techTheme.border}` }}>
                  {techVideoShareOn ? "Compartiendo pantalla" : "Compartir pantalla"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTechFileModal && (
        <div className="fixed inset-0 z-[57] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: techTheme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: techTheme.sub }}>Adjuntar archivos</p>
                <h3 className="text-xl font-semibold" style={{ color: techTheme.text }}>Selecciona los archivos a enviar</h3>
              </div>
              <button type="button" onClick={() => setShowTechFileModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: techTheme.border, color: techTheme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => remoteFileInputRef.current?.click()} className="px-3 py-2 rounded-lg text-sm text-white bg-[#7F00FF]">
                  Elegir mas archivos
                </button>
                <button onClick={sendTechPendingFiles} disabled={!techPendingFiles.some((file) => file.selected)} className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: `1px solid ${techTheme.border}`, color: techTheme.text, backgroundColor: techTheme.panel }}>
                  Enviar seleccionados
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto space-y-2">
                {techPendingFiles.length === 0 && (
                  <p className="text-sm" style={{ color: techTheme.sub }}>No hay archivos pendientes. Usa "Elegir mas archivos".</p>
                )}
                {techPendingFiles.map((file) => (
                  <div key={file.id} className="rounded-lg border px-3 py-2 flex items-center justify-between gap-2" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                    <button onClick={() => toggleTechPendingFile(file.id)} className="text-left flex-1">
                      <p className="text-sm font-medium" style={{ color: techTheme.text }}>{file.selected ? "✓ " : ""}{file.originalName}</p>
                      <p className="text-xs" style={{ color: techTheme.sub }}>{formatFileSize(file.size)} · {file.type || "archivo"}</p>
                    </button>
                    <button onClick={() => removeTechPendingFile(file.id)} className="px-2 py-1 rounded-md text-xs" style={{ border: `1px solid ${techTheme.border}`, color: techTheme.text }}>
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[calc(100vh-48px)] rounded-2xl border shadow-2xl overflow-y-auto" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: techTheme.border }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: techTheme.sub }}>Invitacion remota</p>
                <h3 className="text-xl font-semibold" style={{ color: techTheme.text }}>Esperando respuesta del cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="h-9 w-9 rounded-lg border flex items-center justify-center"
                style={{ borderColor: techTheme.border, color: techTheme.text }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0">
              <section className="p-5 border-r" style={{ borderColor: techTheme.border }}>
                <div className="rounded-xl border p-4" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: techTheme.sub }}>Cliente destino</p>
                  <p className="text-3xl font-black mt-1 text-[#7F00FF]">{activeRemoteClient || "Sin codigo"}</p>
                  <p className="text-sm mt-2" style={{ color: techTheme.sub }}>
                    La solicitud fue enviada. El cliente debe aceptar permisos de pantalla, teclado y mouse.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                    <Monitor size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: techTheme.text }}>Pantalla</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                    <Keyboard size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: techTheme.text }}>Teclado</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel }}>
                    <MousePointer2 size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: techTheme.text }}>Mouse</p>
                  </div>
                </div>
              </section>

              <section className="p-5">
                <p className="text-sm font-semibold" style={{ color: techTheme.text }}>Estado de invitacion</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel, color: techTheme.text }}>
                    1. Invitacion enviada correctamente
                  </div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: techTheme.border, backgroundColor: techTheme.panel, color: techTheme.text }}>
                    2. Esperando confirmacion del cliente...
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={acceptInvitation} className="px-4 py-2.5 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white text-sm font-medium">
                    Simular aceptar
                  </button>
                  <button onClick={rejectInvitation} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: techTheme.border, color: techTheme.text, backgroundColor: techTheme.panel }}>
                    Simular rechazar
                  </button>
                  <button onClick={startSession} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: techTheme.border, color: techTheme.text }}>
                    Reenviar invitacion
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showRemoteControlModal && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm p-3 md:p-6">
          <div className="h-full w-full max-w-[1680px] max-h-[calc(100vh-24px)] mx-auto rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: techTheme.border, backgroundColor: "#0B0F18" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#1E2638" }}>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm text-white">Control remoto activo · Cliente {activeRemoteClient}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-[#7F00FF]/30 text-[#DCCBFF]">{formatDuration(sessionSeconds)}</span>
                <button className="h-8 w-8 rounded-md border border-[#28324A] text-[#D6DEEF] flex items-center justify-center hover:bg-[#1B253A]">
                  <Maximize2 size={15} />
                </button>
                <button onClick={stopSession} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">
                  Finalizar
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_320px]">
              <section className="relative border-r border-[#1E2638] bg-[#0D1320]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(127,0,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(29,107,255,0.18),transparent_40%)]" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-[92%] h-[85%] rounded-xl border border-[#2B3752] bg-[#121A2C] shadow-inner flex items-center justify-center text-center p-6">
                    <div>
                      <Monitor size={56} className="mx-auto text-[#7F00FF]" />
                      <p className="text-lg text-[#E5EBFF] mt-3 font-semibold">Vista de escritorio remoto</p>
                      <p className="text-sm text-[#9EABC8] mt-2">
                        Aqui se renderiza la pantalla del cliente y el tecnico controla mouse/teclado.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="bg-[#0F1729] p-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
                <div className="rounded-xl border border-[#2B3752] p-3">
                  <p className="text-xs uppercase tracking-wide text-[#9EABC8]">Comunicacion</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setAudioCallActive(true);
                        setShowTechCallModal(true);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${audioCallActive ? "bg-emerald-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      <PhoneCall size={14} /> {audioCallActive ? "Llamada activa" : "Llamada"}
                    </button>
                    <button
                      onClick={() => {
                        setVideoCallActive(true);
                        setShowTechVideoModal(true);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${videoCallActive ? "bg-emerald-600 text-white" : "bg-[#1A2440] text-[#E5EBFF]"}`}
                    >
                      <Video size={14} /> {videoCallActive ? "Video activo" : "Videollamada"}
                    </button>
                    <button
                      onClick={() => setRemoteCameraEnabled((prev) => !prev)}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${remoteCameraEnabled ? "bg-[#1A2440] text-[#E5EBFF]" : "bg-amber-600 text-white"}`}
                    >
                      {remoteCameraEnabled ? <Camera size={14} /> : <CameraOff size={14} />}
                      {remoteCameraEnabled ? "Camara ON" : "Camara OFF"}
                    </button>
                    <button
                      onClick={() => remoteFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-lg bg-[#1A2440] text-[#E5EBFF] text-xs flex items-center gap-2"
                    >
                      <FileUp size={14} /> Enviar archivo
                    </button>
                    <input ref={remoteFileInputRef} type="file" multiple className="hidden" onChange={attachRemoteFiles} />
                  </div>
                  <p className="mt-2 text-[11px] text-[#9EABC8]">Adjuntos sin limite configurado desde interfaz.</p>
                </div>

                <div className="rounded-xl border border-[#2B3752] p-3">
                  <p className="text-sm font-semibold text-[#E5EBFF]">Canal de sesion</p>
                  <div className="mt-2 space-y-1 text-xs text-[#9EABC8]">
                    <p className="flex items-center gap-2"><Wifi size={13} /> Latencia estable (24ms)</p>
                    <p className="flex items-center gap-2"><ShieldCheck size={13} /> Cifrado extremo a extremo</p>
                    <p className="flex items-center gap-2"><Clock3 size={13} /> Inicio: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#2B3752] p-3 flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#E5EBFF] flex items-center gap-2"><MessageSquare size={14} /> Chat remoto</p>
                    <span className="text-[11px] text-[#9EABC8]">{remoteAttachments.length} archivos</span>
                  </div>
                  <div className="mt-3 flex-1 rounded-lg border border-[#27324A] bg-[#111B31] p-2.5 overflow-auto space-y-2">
                    {remoteMessages.map((msg, idx) => (
                      <div
                        key={`${msg.time}-${idx}`}
                        className={`rounded-lg px-3 py-2 text-xs ${msg.from === "tech" ? "ml-8 bg-[#7F00FF] text-white" : "mr-8 bg-[#1B2742] text-[#DDE6FF]"}`}
                      >
                        <p>{msg.text}</p>
                        <p className={`mt-1 ${msg.from === "tech" ? "text-white/80" : "text-[#9CB0D8]"}`}>{msg.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={remoteChatInput}
                      onChange={(e) => setRemoteChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendRemoteMessage()}
                      placeholder="Escribe un mensaje tecnico..."
                      className="flex-1 rounded-lg border border-[#2B3752] bg-[#0D1426] px-3 py-2 text-sm text-[#E5EBFF] outline-none focus:ring-2 focus:ring-[#7F00FF]/30 focus:border-[#7F00FF]"
                    />
                    <button onClick={sendRemoteMessage} className="h-10 w-10 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white flex items-center justify-center">
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientWorkspace({ user }) {
  const [clientSection, setClientSection] = useState("home");
  const [workspaceTab, setWorkspaceTab] = useState("workspace");
  const [settingsTab, setSettingsTab] = useState("appearance");
  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [showClientCallModal, setShowClientCallModal] = useState(false);
  const [showClientVideoModal, setShowClientVideoModal] = useState(false);
  const [showClientFileModal, setShowClientFileModal] = useState(false);
  const [clientCallMuted, setClientCallMuted] = useState(false);
  const [clientSpeakerOn, setClientSpeakerOn] = useState(true);
  const [clientVideoMicOn, setClientVideoMicOn] = useState(true);
  const [clientVideoCamOn, setClientVideoCamOn] = useState(true);
  const [clientVideoShareOn, setClientVideoShareOn] = useState(false);
  const [clientPendingFiles, setClientPendingFiles] = useState([]);
  const [remoteCode, setRemoteCode] = useState("");
  const [clientTheme, setClientTheme] = useState(() => localStorage.getItem("app_theme_mode") || localStorage.getItem("client_theme_mode") || "auto");
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const clientFileInputRef = useRef(null);
  const baseClientId = "809541";
  const clientExtraDigits = "001";
  const expandedClientId = `${baseClientId}${clientExtraDigits}`;
  const connectionCode = `TR-${expandedClientId.slice(0, 3)}-${expandedClientId.slice(3, 6)}-${expandedClientId.slice(6, 9)}`;
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  useEffect(() => {
    localStorage.setItem("client_theme_mode", clientTheme);
    localStorage.setItem("app_theme_mode", clientTheme);
  }, [clientTheme]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemTheme(event.matches ? "dark" : "light");
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const effectiveTheme = clientTheme === "auto" ? systemTheme : clientTheme;
  const isDark = effectiveTheme === "dark";
  useEffect(() => {
    const normalized = effectiveTheme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", normalized);
    document.documentElement.classList.toggle("dark", normalized === "dark");
  }, [effectiveTheme]);
  const ui = isDark
    ? {
        pageBg: "bg-[#070B16]",
        frame: "bg-[#0F1729]/90 border-[#27324B]",
        card: "bg-[#101A2F] border-[#2B3754]",
        soft: "bg-[#121D33]",
        textMain: "text-[#E5EBFF]",
        textSub: "text-[#9EABC8]",
        input: "bg-[#0D1426] border-[#293651] text-[#E5EBFF]",
        sidebar: "bg-[#0B1326]/90 border-[#26314A]",
      }
    : {
        pageBg: "bg-[#F4F6FB]",
        frame: "bg-white/95 border-[#D6DCEC]",
        card: "bg-white border-[#DCE2F0]",
        soft: "bg-[#F1F4FC]",
        textMain: "text-[#1B2642]",
        textSub: "text-[#617094]",
        input: "bg-white border-[#CDD6EA] text-[#1B2642]",
        sidebar: "bg-white/90 border-[#D6DCEC]",
      };

  const sidebarItems = [
    { id: "home", label: "Centro", icon: HomeIcon },
    { id: "support", label: "Soporte en vivo", icon: MessageSquare },
    { id: "files", label: "Archivos", icon: FolderOpen },
    { id: "settings", label: "Configuracion", icon: Wrench },
    { id: "account", label: "Cuenta", icon: Users },
  ];

  const [supportMessages, setSupportMessages] = useState([
    { from: "system", text: "Hola, soy tu asistente. El tecnico se unira en breve.", time: "12:45" },
    { from: "client", text: "Mi equipo esta muy lento desde esta manana.", time: "12:47" },
    { from: "system", text: "Gracias. Estamos revisando tu caso, no cierres esta ventana.", time: "12:48" },
  ]);

  const sendClientMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setSupportMessages((prev) => [{ from: "client", text, time: new Date().toLocaleTimeString() }, ...prev]);
    setChatInput("");
  };

  const onPickClientFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const staged = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      originalName: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      selected: true,
    }));
    setClientPendingFiles((prev) => [...staged, ...prev]);
    setShowClientFileModal(true);
    event.target.value = "";
  };

  const toggleClientPendingFile = (fileId) => {
    setClientPendingFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, selected: !file.selected } : file))
    );
  };

  const removeClientPendingFile = (fileId) => {
    setClientPendingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const sendClientPendingFiles = () => {
    const selectedFiles = clientPendingFiles.filter((file) => file.selected);
    if (!selectedFiles.length) return;
    setSupportMessages((prev) => [
      {
        from: "client",
        text: `Adjuntos enviados: ${selectedFiles.map((file) => `${file.originalName} (${formatFileSize(file.size)})`).join(", ")}`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setClientPendingFiles((prev) => prev.filter((file) => !file.selected));
    setShowClientFileModal(false);
  };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(connectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const clientHeader = (
    <header className={cx("rounded-3xl border p-4 md:p-5 backdrop-blur-xl shadow-[0_18px_45px_-25px_rgba(127,0,255,0.35)]", ui.frame)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={cx("text-xs uppercase tracking-[0.18em]", ui.textSub)}>TechRepair Client Orbit</p>
          <h1 className={cx("text-2xl md:text-3xl font-black mt-1", ui.textMain)}>Panel de asistencia personal</h1>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <div className={cx("h-11 rounded-xl border px-3 flex items-center gap-2", ui.input)}>
          <PhoneCall size={15} className={ui.textSub} />
          <input
            value={remoteCode}
            onChange={(e) => setRemoteCode(e.target.value)}
            placeholder="Ingresa el codigo del dispositivo remoto (ej. CL-402-991-123)"
            className={cx("w-full bg-transparent outline-none text-sm", isDark ? "placeholder:text-[#8292B2]" : "placeholder:text-[#8B98B6]")}
          />
        </div>
        <button className="h-11 px-4 rounded-xl bg-[#7F00FF] hover:bg-[#5E00CC] text-white text-sm font-medium">
          Conectar por remoto
        </button>
      </div>
      <p className={cx("mt-2 text-xs", ui.textSub)}>Comparte tu codigo o ingresa el codigo del otro dispositivo para iniciar la conexion.</p>
    </header>
  );

  const workspaceTabs = [
    { id: "workspace", label: "Workspace" },
    { id: "sessions", label: "Sesiones" },
    { id: "insights", label: "Novedades" },
    { id: "invites", label: "Invitaciones" },
  ];

  const workspaceCards = {
    workspace: [
      { title: "Proteccion activa", status: "Listo", detail: "Tu equipo esta protegido y listo para soporte.", tone: "progress" },
      { title: "Diagnostico rapido", status: "Disponible", detail: "Escaneo inicial en 1 clic.", tone: "ok" },
      { title: "Centro de ayuda", status: "Nuevo", detail: "Guias visuales para resolver incidencias.", tone: "ocean" },
    ],
    sessions: [
      { title: "Sesion con Nain", status: "Exito", detail: "Mantenimiento remoto finalizado.", tone: "ok" },
      { title: "Soporte de impresora", status: "Cerrado", detail: "Ticket completado sin alertas.", tone: "ocean" },
      { title: "Respaldo de documentos", status: "Exito", detail: "Transferencia completada.", tone: "ok" },
    ],
    insights: [
      { title: "Salud del dispositivo", status: "Estable", detail: "Rendimiento normal en las ultimas 24h.", tone: "ocean" },
      { title: "Conectividad", status: "Sin cortes", detail: "No se detectaron interrupciones de red.", tone: "progress" },
      { title: "Consejo TechRepair", status: "Recomendado", detail: "Actualiza tus apps antes de cada sesion.", tone: "warn" },
    ],
    invites: [
      { title: "Invitacion enviada", status: "Pendiente", detail: "Esperando aprobacion del colaborador.", tone: "warn" },
      { title: "Invitacion aceptada", status: "Activa", detail: "El acceso temporal ya esta habilitado.", tone: "ok" },
    ],
  };

  const cardTone = {
    ok: "border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 to-emerald-300/5",
    progress: "border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/5",
    warn: "border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-yellow-300/5",
    ocean: "border-sky-400/30 bg-gradient-to-br from-sky-500/20 to-blue-400/5",
  };

  const workspaceView = (
    <section className="space-y-4">
      <article className={cx("rounded-3xl border p-5 md:p-6 relative overflow-hidden", ui.frame)}>
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#7F00FF]/20 blur-2xl" />
        <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-[#1D6BFF]/20 blur-2xl" />
        <p className={cx("text-center text-sm relative", ui.textSub)}>Nodo principal del cliente</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <p className="text-4xl md:text-5xl font-black tracking-wider text-[#A57BFF] relative">{connectionCode.replace("TR-", "").replace(/-/g, " ")}</p>
          <Lock size={22} className={cx("relative", ui.textSub)} />
          <button className="px-4 py-2 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white text-sm flex items-center gap-2">
            <Users size={16} /> Compartir acceso
          </button>
        </div>
      </article>

      <article className={cx("rounded-3xl border", ui.frame)}>
        <div className="border-b border-[#2A3552] px-4 md:px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {workspaceTabs.map((tab) => {
              const active = workspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setWorkspaceTab(tab.id)}
                  className={cx("px-3 py-1.5 rounded-lg text-sm transition-colors", active ? "bg-[#7F00FF] text-white" : `${ui.textSub} hover:bg-[#7F00FF]/15`)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className={cx("text-xs", ui.textSub)}>TechRepair Client Orbit</div>
        </div>
        <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(workspaceCards[workspaceTab] || workspaceCards.workspace).map((card, idx) => (
            <article key={`${card.title}-${idx}`} className={cx("rounded-xl border p-4 min-h-[150px]", cardTone[card.tone])}>
              <p className={cx("text-lg font-bold", ui.textMain)}>{card.title}</p>
              <p className="mt-1 text-sm font-semibold text-[#C9B6FF] uppercase tracking-wide">{card.status}</p>
              <p className={cx("mt-3 text-sm", ui.textSub)}>{card.detail}</p>
              <button className="mt-4 px-3 py-1.5 text-sm rounded-lg border border-[#7F00FF]/40 text-[#DCCBFF] hover:bg-[#7F00FF]/20">
                Ver detalles
              </button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );

  const homeView = (
    <div className="space-y-4">
      <section className={cx("rounded-3xl border p-4 md:p-5", ui.frame)}>
        <p className={cx("text-xs uppercase tracking-[0.16em]", ui.textSub)}>Soporte en progreso</p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">Conectado con tecnico</span>
          </div>
          <p className={cx("text-sm", ui.textSub)}>Estamos trabajando en tu caso.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <section className={cx("rounded-3xl border p-4 md:p-5 min-h-[520px] flex flex-col", ui.frame)}>
          <div className="flex items-center justify-between pb-3 border-b border-[#2A3552]">
            <p className={cx("text-sm font-semibold", ui.textMain)}>Chat de soporte</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowClientCallModal(true)} className="text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1" style={{ borderColor: isDark ? "#2B3754" : "#CDD6EA", color: isDark ? "#E5EBFF" : "#1B2642" }}>
                <PhoneCall size={14} /> Llamada
              </button>
              <button onClick={() => setShowClientVideoModal(true)} className="text-xs px-3 py-1.5 rounded-lg bg-[#7F00FF] hover:bg-[#5E00CC] text-white flex items-center gap-1">
                <Video size={14} /> {callActive ? "Videollamada activa" : "Iniciar videollamada"}
              </button>
            </div>
          </div>
          <div className="flex-1 py-5 space-y-4 overflow-auto">
            {supportMessages.map((m, i) => (
              <div key={`${m.time}-${i}`} className={`max-w-[94%] rounded-2xl px-4 py-3 ${m.from === "client" ? "ml-auto bg-[#7F00FF] text-white" : `${ui.soft} ${ui.textMain}`}`}>
                <p className="text-[15px] leading-relaxed">{m.text}</p>
                <p className={cx("text-[11px] mt-1", m.from === "client" ? "text-white/80" : ui.textSub)}>{m.time}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2A3552] pt-3 relative">
            {showActions && (
              <div className={cx("absolute bottom-14 left-0 rounded-xl border p-2 flex gap-2", ui.input)}>
                <button onClick={() => clientFileInputRef.current?.click()} className={cx("h-9 w-9 rounded-lg hover:bg-[#7F00FF]/20", ui.soft)} title="Adjuntar archivo"><Paperclip size={16} /></button>
                <button className={cx("h-9 w-9 rounded-lg hover:bg-[#7F00FF]/20", ui.soft)} title="Enviar audio"><Mic size={16} /></button>
                <button onClick={() => clientFileInputRef.current?.click()} className={cx("h-9 w-9 rounded-lg hover:bg-[#7F00FF]/20", ui.soft)} title="Captura rapida"><Camera size={16} /></button>
                <button onClick={() => setShowClientVideoModal(true)} className={cx("h-9 w-9 rounded-lg hover:bg-[#7F00FF]/20", ui.soft)} title="Videollamada"><Video size={16} /></button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowActions((v) => !v)}
                className={cx("h-10 w-10 rounded-lg border hover:bg-[#7F00FF]/20", ui.input)}
                title="Adjuntar archivos / iniciar llamada"
                aria-label="Adjuntar archivos o iniciar llamada"
              >
                <Plus size={16} />
              </button>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendClientMessage()}
                placeholder="Describe tu problema o adjunta un archivo"
                className={cx("flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#7F00FF]/30 focus:border-[#7F00FF]", ui.input)}
              />
              <input ref={clientFileInputRef} type="file" multiple className="hidden" onChange={onPickClientFiles} />
              <button onClick={sendClientMessage} className="h-10 w-10 rounded-lg bg-[#7F00FF] text-white flex items-center justify-center hover:bg-[#5E00CC] transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
          {callActive && (
            <div className={cx("mt-3 rounded-xl border p-3 flex items-center justify-between", ui.input)}>
              <div>
                <p className={cx("text-sm font-semibold", ui.textMain)}>Videollamada activa</p>
                <p className={cx("text-xs", ui.textSub)}>Camara y microfono encendidos</p>
              </div>
              <div className="h-14 w-24 rounded-lg bg-[#1A2440] border border-[#28324A] flex items-center justify-center text-[#D6DEEF] text-xs">PiP</div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <article className={cx("rounded-3xl border p-4", ui.frame)}>
            <p className={cx("text-xs uppercase tracking-[0.14em] font-semibold", ui.textSub)}>Codigo de asistencia</p>
            <p className={cx("text-4xl font-black mt-2 tracking-wide", ui.textMain)}>{connectionCode}</p>
            <button onClick={copyCode} className="mt-4 w-full px-3 py-2.5 rounded-lg bg-[#7F00FF] text-white text-sm hover:bg-[#5E00CC]">
              {copied ? "Codigo copiado" : "Copiar codigo"}
            </button>
            <p className={cx("text-sm mt-3", ui.textSub)}>Compartelo con tu tecnico para continuar.</p>
          </article>

          <article className={cx("rounded-3xl border p-4", ui.frame)}>
            <p className={cx("text-sm font-semibold", ui.textMain)}>Tu soporte</p>
            <div className="mt-3 space-y-2.5">
              <div className={cx("flex items-center gap-2 text-sm", ui.textSub)}><UserCheck size={15} /> Tecnico: Nain Zuniga</div>
              <div className={cx("flex items-center gap-2 text-sm", ui.textSub)}><Timer size={15} /> Tiempo estimado: 6 min</div>
              <div className={cx("flex items-center gap-2 text-sm", ui.textSub)}><Shield size={15} /> Conexion segura</div>
              <div className={cx("flex items-center gap-2 text-sm", ui.textSub)}><Wifi size={15} /> Conexion estable</div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );

  const filesView = (
    <section className={cx("rounded-3xl border p-6", ui.frame)}>
      <h2 className={cx("text-2xl font-bold", ui.textMain)}>Archivos compartidos</h2>
      <p className={cx("text-sm mt-1", ui.textSub)}>Arrastra o selecciona archivos para compartir con tu tecnico.</p>
      <div className={cx("mt-5 rounded-2xl border-2 border-dashed p-8 text-center", ui.input)}>
        <UploadCloud className={cx("mx-auto", ui.textSub)} size={34} />
        <p className={cx("mt-3 font-medium", ui.textMain)}>Arrastra o selecciona archivos</p>
        <p className={cx("text-xs mt-1", ui.textSub)}>Documentos · Imagenes · Audios</p>
        <button className="mt-4 px-4 py-2 rounded-lg bg-[#7F00FF] text-white hover:bg-[#5E00CC]">Seleccionar archivo</button>
      </div>
    </section>
  );

  const sessionView = (
    <section className={cx("rounded-3xl border p-6", ui.frame)}>
      <h2 className={cx("text-2xl font-bold", ui.textMain)}>Conexion remota entre dispositivos</h2>
      <p className={cx("text-sm mt-1", ui.textSub)}>Conectate tambien a otros dispositivos desde tu panel cliente.</p>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <article className={cx("rounded-xl border p-4", ui.card)}>
          <label className={cx("text-sm", ui.textMain)}>Codigo de conexion del dispositivo</label>
          <input
            value={remoteCode}
            onChange={(e) => setRemoteCode(e.target.value)}
            placeholder="Ej. CL-402-991-123"
            className={cx("w-full mt-2 rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-[#7F00FF]/30 focus:border-[#7F00FF]", ui.input)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#7F00FF] text-white hover:bg-[#5E00CC]">Conectar a dispositivo</button>
            <button onClick={copyCode} className={cx("px-4 py-2 rounded-lg border hover:bg-[#7F00FF]/15", ui.input)}>
              {copied ? "Codigo copiado" : "Copiar mi codigo"}
            </button>
          </div>
          <p className={cx("text-xs mt-3", ui.textSub)}>Comparte tu codigo con quien te dara soporte para iniciar la asistencia.</p>
        </article>
        <article className={cx("rounded-xl border p-4", ui.card)}>
          <p className={cx("text-sm font-semibold", ui.textMain)}>Funciones disponibles</p>
          <div className={cx("mt-3 space-y-2 text-sm", ui.textSub)}>
            <div className="flex items-center gap-2"><MessageSquare size={15} className="text-[#A7B3CE]" /> Chat en vivo</div>
            <div className="flex items-center gap-2"><Video size={15} className="text-[#A7B3CE]" /> Videollamada integrada</div>
            <div className="flex items-center gap-2"><FolderOpen size={15} className="text-[#A7B3CE]" /> Compartir archivos y documentos</div>
            <div className="flex items-center gap-2"><Shield size={15} className="text-[#A7B3CE]" /> Conexion segura cifrada</div>
          </div>
        </article>
      </div>
    </section>
  );

  const settingsView = (
    <section className={cx("rounded-3xl border p-6", ui.frame)}>
      <h2 className={cx("text-2xl font-bold", ui.textMain)}>Configuracion</h2>
      <p className={cx("text-sm mt-1", ui.textSub)}>Personaliza tu experiencia de soporte.</p>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <aside className={cx("rounded-xl border p-3", ui.card)}>
          {[
            { id: "appearance", label: "Interfaz y tema" },
            { id: "notifications", label: "Notificaciones" },
            { id: "privacy", label: "Privacidad y seguridad" },
            { id: "session", label: "Sesion remota" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              className={cx("w-full text-left px-3 py-2 rounded-lg text-sm mb-1", settingsTab === tab.id ? "bg-[#7F00FF] text-white" : `${ui.textSub} hover:bg-[#7F00FF]/15`)}
            >
              {tab.label}
            </button>
          ))}
        </aside>
        <article className={cx("rounded-xl border p-4", ui.card)}>
          {settingsTab === "appearance" && (
            <div>
              <p className={cx("text-lg font-semibold", ui.textMain)}>Interfaz y tema</p>
              <p className={cx("text-sm mt-1", ui.textSub)}>Selecciona como quieres ver tu panel.</p>
              <div className="mt-3 flex gap-2">
                {["light", "dark", "auto"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setClientTheme(mode)}
                    className={cx("px-4 py-2 rounded-lg border text-sm capitalize", clientTheme === mode ? "bg-[#7F00FF] border-[#7F00FF] text-white" : `${ui.input} hover:bg-[#7F00FF]/15`)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className={cx("text-xs mt-2", ui.textSub)}>Modo aplicado: {effectiveTheme}</p>
            </div>
          )}
          {settingsTab === "notifications" && (
            <div>
              <p className={cx("text-lg font-semibold", ui.textMain)}>Notificaciones</p>
              <p className={cx("text-sm mt-1", ui.textSub)}>Recibe avisos cuando haya actividad en tu soporte.</p>
              <button
                onClick={() => setNotificationsEnabled((v) => !v)}
                className={cx("mt-3 px-4 py-2 rounded-lg border text-sm", notificationsEnabled ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300" : "border-[#28324A] text-[#D6DEEF]")}
              >
                {notificationsEnabled ? "Notificaciones activadas" : "Notificaciones desactivadas"}
              </button>
            </div>
          )}
          {settingsTab === "privacy" && (
            <div>
              <p className={cx("text-lg font-semibold", ui.textMain)}>Privacidad y seguridad</p>
              <p className={cx("text-sm mt-1", ui.textSub)}>Controla permisos para llamadas y sesiones.</p>
              <div className="mt-3 space-y-2">
                <button onClick={() => setCameraEnabled((v) => !v)} className={cx("w-full text-left px-3 py-2 rounded-lg border hover:bg-[#7F00FF]/15", ui.input)}>
                  Camara: {cameraEnabled ? "Habilitada" : "Deshabilitada"}
                </button>
                <button onClick={() => setMicEnabled((v) => !v)} className={cx("w-full text-left px-3 py-2 rounded-lg border hover:bg-[#7F00FF]/15", ui.input)}>
                  Microfono: {micEnabled ? "Habilitado" : "Deshabilitado"}
                </button>
              </div>
            </div>
          )}
          {settingsTab === "session" && (
            <div>
              <p className={cx("text-lg font-semibold", ui.textMain)}>Sesion remota</p>
              <p className={cx("text-sm mt-1", ui.textSub)}>Define como te conectas a otros dispositivos.</p>
              <div className={cx("mt-3 text-sm space-y-2", ui.textSub)}>
                <p>Conexion automatica segura: habilitada</p>
                <p>Solicitar confirmacion antes de iniciar: activado</p>
                <p>Calidad de video: adaptativa</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );

  const accountView = (
    <section className={cx("rounded-3xl border p-6", ui.frame)}>
      <h2 className={cx("text-2xl font-bold", ui.textMain)}>Cuenta</h2>
      <div className="mt-4 space-y-3">
        <div className={cx("rounded-lg border p-4", ui.card)}>
          <p className={cx("text-xs", ui.textSub)}>Usuario</p>
          <p className={cx("text-sm", ui.textMain)}>{user?.displayName || "Cliente"}</p>
        </div>
        <div className={cx("rounded-lg border p-4", ui.card)}>
          <p className={cx("text-xs", ui.textSub)}>Correo</p>
          <p className={cx("text-sm", ui.textMain)}>{user?.email}</p>
        </div>
      </div>
    </section>
  );

  return (
    <div className={cx("min-h-screen relative overflow-hidden role-shell", ui.pageBg)} style={{ fontFamily: "Inter, Roboto, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[#7F00FF]/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[340px] w-[340px] rounded-full bg-[#2E6BFF]/20 blur-3xl" />
      </div>
      <div className="relative flex min-h-screen">
        <aside className={cx("w-[250px] min-h-screen border-r p-4 hidden md:flex md:flex-col backdrop-blur-lg", ui.sidebar)}>
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="TechRepair" className="h-11 w-11 rounded-xl border border-[#2B3652] p-1.5 object-contain bg-[#0D1426]" />
            <div>
              <p className={cx("font-semibold", ui.textMain)}>TechRepair</p>
              <p className={cx("text-xs", ui.textSub)}>Client Orbit</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            {sidebarItems.map((item) => {
              const active = clientSection === item.id;
              return (
                <button key={item.id} onClick={() => setClientSection(item.id)} className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors", active ? "bg-[#7F00FF] text-white shadow-[0_8px_22px_-12px_rgba(127,0,255,0.8)]" : `${ui.textSub} hover:bg-[#7F00FF]/15`)}>
                  <item.icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button onClick={() => auth.signOut()} className={cx("mt-3 w-full px-3 py-2.5 rounded-xl border text-sm", ui.input)}>
            Salir
          </button>
        </aside>

        <main className="flex-1 p-4 md:p-6 space-y-4 role-main">
          {clientHeader}
          {clientSection === "home" && workspaceView}
          {clientSection === "support" && homeView}
          {clientSection === "files" && filesView}
          {clientSection === "settings" && settingsView}
          {clientSection === "account" && accountView}
        </main>
      </div>

      {showClientCallModal && (
        <div className="fixed inset-0 z-[58] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cx("w-full max-w-xl rounded-2xl border shadow-2xl", ui.frame)}>
            <div className={cx("px-5 py-4 border-b flex items-center justify-between", ui.input)}>
              <div>
                <p className={cx("text-xs uppercase tracking-wider", ui.textSub)}>Llamada de soporte</p>
                <h3 className={cx("text-xl font-semibold", ui.textMain)}>Canal de voz con soporte</h3>
              </div>
              <button type="button" onClick={() => setShowClientCallModal(false)} className={cx("h-9 w-9 rounded-lg border flex items-center justify-center", ui.input)}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className={cx("rounded-xl border p-4", ui.input)}>
                <p className={cx("text-sm", ui.textMain)}>Estado: {callActive ? "Llamada en curso" : "Lista para iniciar"}</p>
                <p className={cx("text-xs mt-1", ui.textSub)}>Puedes hablar con el tecnico en tiempo real.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setCallActive((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: callActive ? "#16A34A" : "#7F00FF", color: "#FFFFFF" }}>
                  {callActive ? "Finalizar llamada" : "Iniciar llamada"}
                </button>
                <button onClick={() => setClientCallMuted((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: clientCallMuted ? "#F59E0B" : "#334155", color: "#FFFFFF" }}>
                  {clientCallMuted ? "Microfono OFF" : "Silenciar microfono"}
                </button>
                <button onClick={() => setClientSpeakerOn((prev) => !prev)} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: clientSpeakerOn ? "#7F00FF" : "#334155", color: "#FFFFFF" }}>
                  {clientSpeakerOn ? "Parlante ON" : "Parlante OFF"}
                </button>
                <button onClick={() => setShowClientCallModal(false)} className={cx("px-3 py-2 rounded-lg text-sm border", ui.input)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClientVideoModal && (
        <div className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cx("w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden", ui.frame)}>
            <div className={cx("px-5 py-4 border-b flex items-center justify-between", ui.input)}>
              <div>
                <p className={cx("text-xs uppercase tracking-wider", ui.textSub)}>Videollamada de soporte</p>
                <h3 className={cx("text-xl font-semibold", ui.textMain)}>Canal de video con tecnico</h3>
              </div>
              <button type="button" onClick={() => setShowClientVideoModal(false)} className={cx("h-9 w-9 rounded-lg border flex items-center justify-center", ui.input)}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              <div className={cx("rounded-xl border min-h-[300px] flex items-center justify-center text-center p-4", ui.input)}>
                <div>
                  <Video size={44} className="mx-auto mb-2 text-[#7F00FF]" />
                  <p className={cx("font-semibold", ui.textMain)}>Vista de videollamada</p>
                  <p className={cx("text-sm mt-1", ui.textSub)}>Aqui se visualiza la sesion en vivo con tu tecnico.</p>
                </div>
              </div>
              <div className="space-y-2">
                <button onClick={() => setCallActive((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: callActive ? "#16A34A" : "#7F00FF", color: "#FFFFFF" }}>
                  {callActive ? "Finalizar videollamada" : "Iniciar videollamada"}
                </button>
                <button onClick={() => setClientVideoMicOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: clientVideoMicOn ? "#334155" : "#F59E0B", color: "#FFFFFF" }}>
                  {clientVideoMicOn ? "Microfono ON" : "Microfono OFF"}
                </button>
                <button onClick={() => setClientVideoCamOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: clientVideoCamOn ? "#334155" : "#F59E0B", color: "#FFFFFF" }}>
                  {clientVideoCamOn ? "Camara ON" : "Camara OFF"}
                </button>
                <button onClick={() => setClientVideoShareOn((prev) => !prev)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: clientVideoShareOn ? "#7F00FF" : "#334155", color: "#FFFFFF" }}>
                  {clientVideoShareOn ? "Compartiendo pantalla" : "Compartir pantalla"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClientFileModal && (
        <div className="fixed inset-0 z-[57] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cx("w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden", ui.frame)}>
            <div className={cx("px-5 py-4 border-b flex items-center justify-between", ui.input)}>
              <div>
                <p className={cx("text-xs uppercase tracking-wider", ui.textSub)}>Adjuntar archivos</p>
                <h3 className={cx("text-xl font-semibold", ui.textMain)}>Selecciona los archivos para enviar al tecnico</h3>
              </div>
              <button type="button" onClick={() => setShowClientFileModal(false)} className={cx("h-9 w-9 rounded-lg border flex items-center justify-center", ui.input)}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => clientFileInputRef.current?.click()} className="px-3 py-2 rounded-lg text-sm text-white bg-[#7F00FF]">
                  Elegir mas archivos
                </button>
                <button onClick={sendClientPendingFiles} disabled={!clientPendingFiles.some((file) => file.selected)} className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: isDark ? "1px solid #293651" : "1px solid #CDD6EA", color: isDark ? "#E5EBFF" : "#1B2642" }}>
                  Enviar seleccionados
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto space-y-2">
                {clientPendingFiles.length === 0 && (
                  <p className={cx("text-sm", ui.textSub)}>No hay archivos pendientes. Usa "Elegir mas archivos".</p>
                )}
                {clientPendingFiles.map((file) => (
                  <div key={file.id} className={cx("rounded-lg border px-3 py-2 flex items-center justify-between gap-2", ui.input)}>
                    <button onClick={() => toggleClientPendingFile(file.id)} className="text-left flex-1">
                      <p className={cx("text-sm font-medium", ui.textMain)}>{file.selected ? "✓ " : ""}{file.originalName}</p>
                      <p className={cx("text-xs", ui.textSub)}>{formatFileSize(file.size)} · {file.type || "archivo"}</p>
                    </button>
                    <button onClick={() => removeClientPendingFile(file.id)} className={cx("px-2 py-1 rounded-md text-xs border", ui.input)}>
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#7F00FF]" /></div>;

  const normalizedEmail = user?.email?.toLowerCase().trim() || "";
  const role = getUserRole(normalizedEmail) || user?.role?.toLowerCase().trim() || "cliente";
  const isPrimaryAdmin = normalizedEmail === "cristian.alarcon@itegperformance.com";

  if (role === "admin" && isPrimaryAdmin) return <AdminWorkspace user={user} />;
  if (role === "tecnico") return <TechnicianWorkspace user={user} />;
  if (role === "cliente") return <ClientWorkspace user={user} />;
  return <div className="min-h-screen bg-white p-6"><div className="max-w-4xl mx-auto"><ChatWindow /></div></div>;
}







