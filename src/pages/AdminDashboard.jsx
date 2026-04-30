import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  Copy,
  FileWarning,
  FolderOpen,
  Globe,
  Lock,
  LogOut,
  MessageSquare,
  Monitor,
  PhoneCall,
  PieChart,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Timer,
  UserCheck,
  UserPlus,
  UserCog,
  Users,
  Video,
  Keyboard,
  MousePointer2,
  Maximize2,
  FileUp,
  X,
  Wrench,
  KeyRound,
  Trash2,
  Newspaper
} from "lucide-react";
import { ACCENT, ACCENT_HOVER, buildOrbitUi, cx, Pill } from "../components/workspaces/shared";
import { auth } from "../lib/firebase";
import TechnicalNewsPanel from "../components/news/TechnicalNewsPanel";
import logo from "../assets/logo.png";
import ticketService from "../services/ticketService";
import { canAccessTechnicalNews, resolveTechnicalNewsUserMeta } from "../utils/technicalNewsAccess";

const CLIENT_LEONARDO_CHAT_KEY = "techrepair_chat_TR-809-541-001";
const TECH_NAIN_CHAT_KEY = "techrepair_chat_TEC-808-544-541";

const normalizeIdForCompare = (value) => String(value || "").replace(/\D/g, "");

const resolveAdminChatKey = (role, targetId) => {
  const normalizedId = normalizeIdForCompare(targetId);
  if (role === "tech") {
    if (normalizedId === "808544541") return TECH_NAIN_CHAT_KEY;
    return `techrepair_chat_TEC-${normalizedId || "GENERAL"}`;
  }
  if (normalizedId === "809541001") return CLIENT_LEONARDO_CHAT_KEY;
  return `techrepair_chat_TR-${normalizedId || "GENERAL"}`;
};

const readSharedChat = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const writeSharedChat = (key, messages) => {
  localStorage.setItem(key, JSON.stringify(messages));
};

function AdminDashboard({ user }) {
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
  const [adminChatKey, setAdminChatKey] = useState(CLIENT_LEONARDO_CHAT_KEY);
  const [chatTargetRole, setChatTargetRole] = useState("client");
  const [chatTargetId, setChatTargetId] = useState("809541001");
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
    ? { bg: "#070B16", panel: "#0F1729", card: "#0D1426", border: "#27324A", text: "#E5EBFF", sub: "#9EABC8" }
    : { bg: "#F4F6FB", panel: "#F7F7F7", card: "#FFFFFF", border: "#D1D1D1", text: "#1B2642", sub: "#617094" };
  const ui = buildOrbitUi(isDark);
  const card = "card-surface rounded-3xl border shadow-[0_18px_45px_-25px_rgba(127,0,255,0.18)] backdrop-blur-xl";
  const canManageTechnicalNews = canAccessTechnicalNews(user, "admin");
  const adminTechnicalNewsMeta = resolveTechnicalNewsUserMeta(user);

  const nav = [
    { id: "dashboard", label: "Inicio / Dashboard", icon: Activity },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "tickets", label: "Solicitudes / Tickets", icon: FileWarning },
    { id: "devices", label: "Dispositivos Corporativos", icon: Monitor },
    { id: "reports", label: "Reportes", icon: PieChart },
    ...(canManageTechnicalNews ? [{ id: "news", label: "Noticias Tecnicas", icon: Newspaper }] : []),
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
  // Estados para gestión de usuarios
  const [adminUsersList, setAdminUsersList] = useState([
    { name: "Cristian Alarcon", email: "cristian.alarcon@itegperformance.com", role: "Admin", status: "Activa", last: "Ahora", access: "127" },
    { name: "Nain Zuniga", email: "nain.zuniga@itegperformance.com", role: "Soporte", status: "Activa", last: "Hace 4 min", access: "98" },
    { name: "Leonardo Martinez", email: "leonardo.martinez@hotmail.com", role: "Cliente", status: "Activa", last: "Hace 11 min", access: "35" },
    { name: "Paula Gomez", email: "paula.gomez@empresa.com", role: "Cliente", status: "Suspendida", last: "Ayer 18:22", access: "22" },
    { name: "Luis Ortega", email: "luis.ortega@empresa.com", role: "Soporte", status: "Activa", last: "Hace 2 h", access: "61" },
  ]);

  const [techAccountsList, setTechAccountsList] = useState([
    { name: "Nain Zuniga", username: "nain.zuniga", role: "Soporte L2", status: "Habilitada", updated: "Hoy 16:22" },
    { name: "Luis Ortega", username: "luis.ortega", role: "Soporte L1", status: "Habilitada", updated: "Hoy 14:05" },
    { name: "Marta Leon", username: "marta.leon", role: "Supervisor", status: "Deshabilitada", updated: "Ayer 18:47" },
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [resetMode, setResetMode] = useState("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [modalForm, setModalForm] = useState({ name: "", email: "", role: "", username: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [ticketsList, setTicketsList] = useState([
    { id: "TK-9388", user: "Paula Gomez", tech: "Nain Zuniga", priority: "Alta", status: "Pendiente", sla: "09m", updated: "Hace 2 min", history: "14 eventos" },
    { id: "TK-9382", user: "Luis Ortega", tech: "Carlos Rivas", priority: "Media", status: "En progreso", sla: "22m", updated: "Hace 5 min", history: "8 eventos" },
    { id: "TK-9369", user: "Marta Leon", tech: "Sin asignar", priority: "Critica", status: "Pendiente", sla: "04m", updated: "Ahora", history: "19 eventos" },
    { id: "TK-9344", user: "Leonardo Martinez", tech: "Nain Zuniga", priority: "Baja", status: "Cerrado", sla: "Cumplido", updated: "Ayer 17:44", history: "21 eventos" },
  ]);
  const [ticketFilter, setTicketFilter] = useState("Todos");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({ tech: "", status: "", priority: "" });
  const [technicians] = useState(["Nain Zuniga", "Carlos Rivas", "Luis Ortega", "Sin asignar"]);
  const chatTargets = [
    { label: "Leonardo Martinez (Cliente)", role: "client", id: "809541001" },
    { label: "Nain Zuñiga (Tecnico)", role: "tech", id: "808544541" },
  ];
  const [reportsList, setReportsList] = useState([
    { name: "SLA Global", period: "Enero 2026", owner: "Cristian Alarcon", status: "Completado", format: "PDF", updated: "Hoy 10:30" },
    { name: "Incidentes por sede", period: "Semana 06", owner: "Nain Zuniga", status: "Completado", format: "CSV", updated: "Hoy 09:12" },
    { name: "Riesgo operativo", period: "Q1 2026", owner: "Cristian Alarcon", status: "En proceso", format: "PDF", updated: "Hoy 08:40" },
    { name: "Eficiencia de técnicos", period: "Enero 2026", owner: "Luis Ortega", status: "Completado", format: "CSV", updated: "Ayer 17:22" },
  ]);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [newReportForm, setNewReportForm] = useState({ name: "", period: "", format: "PDF" });
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ user: "", tech: "", priority: "Media", status: "Pendiente", description: "" });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const device = devices[selectedDevice];

  const startAdminConnection = () => {
    const normalizedTarget = adminTargetId.trim().toUpperCase();
    if (!normalizedTarget) return;
    const targetDigits = normalizeIdForCompare(normalizedTarget);
    const existsInQuickList = chatTargets.some((target) => target.role === targetRole && target.id === targetDigits);
    if (existsInQuickList) {
      setChatTargetRole(targetRole);
      setChatTargetId(targetDigits);
    }
    const chatKey = resolveAdminChatKey(targetRole, normalizedTarget);
    setAdminChatKey(chatKey);
    const existingChat = readSharedChat(chatKey);
    if (existingChat.length) {
      setAdminRemoteMessages(existingChat);
    } else {
      const seed = [{ from: "system", text: "Canal administrativo seguro iniciado.", time: new Date().toLocaleTimeString() }];
      writeSharedChat(chatKey, seed);
      setAdminRemoteMessages(seed);
    }

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
    setAdminRemoteMessages((prev) => {
      const updated = [{ from: "admin", text, time: new Date().toLocaleTimeString() }, ...prev];
      writeSharedChat(adminChatKey, updated);
      return updated;
    });
    setAdminChatInput("");
  };

  const handleSelectChatTarget = (role, id) => {
    setChatTargetRole(role);
    setChatTargetId(id);
    const key = resolveAdminChatKey(role, id);
    setAdminChatKey(key);
    const existing = readSharedChat(key);
    if (existing.length) {
      setAdminRemoteMessages(existing);
    } else {
      const seed = [{ from: "system", text: "Canal administrativo seguro iniciado.", time: new Date().toLocaleTimeString() }];
      writeSharedChat(key, seed);
      setAdminRemoteMessages(seed);
    }
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
    setAdminRemoteMessages((prev) => {
      const updated = [
        {
          from: "admin",
          text: `Adjuntos enviados: ${normalizedFiles.map((file) => `${file.originalName} (${formatFileSize(file.size)})`).join(", ")}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ];
      writeSharedChat(adminChatKey, updated);
      return updated;
    });
    setAdminPendingFiles((prev) => prev.filter((file) => !file.selected));
    setShowAdminFileModal(false);
  };

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== adminChatKey) return;
      setAdminRemoteMessages(readSharedChat(adminChatKey));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [adminChatKey]);

  useEffect(() => {
    const existing = readSharedChat(adminChatKey);
    if (existing.length) {
      setAdminRemoteMessages(existing);
      return;
    }
    const seed = [{ from: "system", text: "Canal administrativo seguro iniciado.", time: new Date().toLocaleTimeString() }];
    writeSharedChat(adminChatKey, seed);
    setAdminRemoteMessages(seed);
  }, [adminChatKey]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "Correo", "Rol", "Estado", "Último acceso", "Historial"];
    const rows = adminUsersList.map((u) => [u.name, u.email, u.role, u.status, u.last, u.access]);
    let csvContent = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "usuarios_techrepair.csv";
    link.click();
    showNotification("✅ CSV exportado correctamente", "success");
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setModalForm({ name: "", email: "", role: "Cliente" });
    setShowUserModal(true);
  };

  const handleEditUser = (userItem) => {
    setSelectedUser(userItem);
    setModalForm({ name: userItem.name, email: userItem.email, role: userItem.role });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!modalForm.name || !modalForm.email || !modalForm.role) {
      showNotification("❌ Todos los campos son obligatorios", "error");
      return;
    }
    if (selectedUser) {
      setAdminUsersList((prev) => prev.map((u) => u.email === selectedUser.email ? { ...u, ...modalForm } : u));
      showNotification("✅ Usuario actualizado correctamente", "success");
    } else {
      setAdminUsersList((prev) => [...prev, { ...modalForm, status: "Activa", last: "Ahora", access: "0" }]);
      showNotification("✅ Usuario creado correctamente", "success");
    }
    setShowUserModal(false);
  };

  const handleResetPassword = (userItem) => {
    setResetTargetUser(userItem);
    setResetMode("email");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowResetPasswordModal(true);
  };

  const confirmResetPasswordAction = () => {
    if (!resetTargetUser) return;
    if (resetMode === "email") {
      showNotification(`✅ Reset enviado por correo a ${resetTargetUser.email}`, "success");
      setShowResetPasswordModal(false);
      return;
    }
    if (newPassword.length < 8) {
      showNotification("❌ La nueva contraseña debe tener al menos 8 caracteres", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification("❌ Las contraseñas no coinciden", "error");
      return;
    }
    showNotification(`✅ Contraseña actualizada para ${resetTargetUser.name}`, "success");
    setShowResetPasswordModal(false);
  };

  const handleToggleUserStatus = (userItem) => {
    const newStatus = userItem.status === "Activa" ? "Suspendida" : "Activa";
    setAdminUsersList((prev) => prev.map((u) => u.email === userItem.email ? { ...u, status: newStatus } : u));
    showNotification(`✅ Usuario ${newStatus === "Activa" ? "activado" : "desactivado"}`, "success");
  };

  const handleNewTech = () => {
    setSelectedTech(null);
    setModalForm({ name: "", username: "", role: "Soporte L1" });
    setShowTechModal(true);
  };

  const handleNewTicket = () => {
    setNewTicketForm({ user: "", tech: "Sin asignar", priority: "Media", status: "Pendiente", description: "" });
    setShowNewTicketModal(true);
  };

  const handleSaveNewTicket = async () => {
    if (!newTicketForm.user || !newTicketForm.description) {
      showNotification("❌ Completa todos los campos obligatorios", "error");
      return;
    }
    setCreatingTicket(true);
    try {
      let created = null;
      try {
        created = await ticketService.createTicket(newTicketForm);
      } catch (err) {
        // API call failed - fall back to local creation
        console.warn('API createTicket failed, creating locally', err);
      }

      const id = (created && created.id) ? created.id : `TK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id,
        user: newTicketForm.user,
        tech: newTicketForm.tech || 'Sin asignar',
        priority: newTicketForm.priority || 'Media',
        status: newTicketForm.status || 'Pendiente',
        sla: '—',
        updated: 'Ahora',
        history: '0 eventos',
        description: newTicketForm.description,
      };

      setTicketsList((prev) => [newTicket, ...prev]);
      showNotification(`✅ Ticket ${id} creado correctamente`, "success");
      setShowNewTicketModal(false);
    } catch (err) {
      console.error('Error saving new ticket', err);
      showNotification('❌ Error al crear ticket', 'error');
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleEditTech = (tech) => {
    setSelectedTech(tech);
    setModalForm({ name: tech.name, username: tech.username, role: tech.role });
    setShowTechModal(true);
  };

  const handleSaveTech = () => {
    if (!modalForm.name || !modalForm.username || !modalForm.role) {
      showNotification("❌ Todos los campos son obligatorios", "error");
      return;
    }
    if (selectedTech) {
      setTechAccountsList((prev) => prev.map((t) => t.username === selectedTech.username ? { ...t, ...modalForm, updated: "Ahora" } : t));
      showNotification("✅ Técnico actualizado", "success");
    } else {
      setTechAccountsList((prev) => [...prev, { ...modalForm, status: "Habilitada", updated: "Ahora" }]);
      showNotification("✅ Técnico creado", "success");
    }
    setShowTechModal(false);
  };

  const handleAssignRole = (tech) => {
    setSelectedTech(tech);
    setModalForm({ name: tech.name, username: tech.username, role: tech.role });
    setShowTechModal(true);
  };

  const handleChangePassword = (tech) => {
    if (window.confirm(`¿Cambiar contraseña para ${tech.name}?`)) {
      showNotification(`✅ Contraseña cambiada para ${tech.name}`, "success");
    }
  };

  const handleToggleTechStatus = (tech) => {
    const newStatus = tech.status === "Habilitada" ? "Deshabilitada" : "Habilitada";
    setTechAccountsList((prev) => prev.map((t) => t.username === tech.username ? { ...t, status: newStatus, updated: "Ahora" } : t));
    showNotification(`✅ Técnico ${newStatus === "Habilitada" ? "habilitado" : "deshabilitado"}`, "success");
  };

  const handleDeleteTech = (tech) => {
    if (window.confirm(`¿Eliminar permanentemente a ${tech.name}? Esta acción no se puede deshacer.`)) {
      setTechAccountsList((prev) => prev.filter((t) => t.username !== tech.username));
      showNotification("✅ Técnico eliminado correctamente", "success");
    }
  };

  const handleBulkPasswordChange = () => {
    if (window.confirm("¿Realizar cambio masivo de contraseñas para todos los técnicos?")) {
      showNotification("✅ Cambio masivo de contraseñas iniciado", "success");
    }
  };

  const filteredTickets = ticketsList.filter((ticket) => {
    if (ticketFilter === "Todos") return true;
    if (ticketFilter === "Pendientes") return ticket.status === "Pendiente";
    if (ticketFilter === "En progreso") return ticket.status === "En progreso";
    if (ticketFilter === "Criticos") return ticket.priority === "Critica";
    if (ticketFilter === "Cerrados") return ticket.status === "Cerrado";
    return true;
  });

  const ticketStats = {
    abiertos: ticketsList.filter((t) => t.status === "Pendiente").length,
    enProgreso: ticketsList.filter((t) => t.status === "En progreso").length,
    criticos: ticketsList.filter((t) => t.priority === "Critica").length,
    cerrados: ticketsList.filter((t) => t.status === "Cerrado").length,
  };

  const handleAssignTicket = (ticket) => {
    setTicketForm({ tech: ticket.tech, status: ticket.status, priority: ticket.priority });
    setSelectedTicket({ ...ticket });
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedTicket(null);
    setTicketForm({ tech: "", status: "", priority: "" });
  };

  const handleSaveTicketAssignment = () => {
    if (!selectedTicket) return;
    setTicketsList((prev) => prev.map((t) =>
      t.id === selectedTicket.id ? { ...t, ...ticketForm, updated: "Ahora" } : t
    ));
    showNotification(`✅ Ticket ${selectedTicket.id} actualizado`, "success");
    handleCloseAssignModal();
  };

  const handleChangeTicketStatus = (ticket, newStatus) => {
    setTicketsList((prev) => prev.map((t) =>
      t.id === ticket.id ? { ...t, status: newStatus, updated: "Ahora" } : t
    ));
    showNotification(`✅ Ticket ${ticket.id} cambiado a ${newStatus}`, "success");
  };

  const handleChangeTicketPriority = (ticket, newPriority) => {
    setTicketsList((prev) => prev.map((t) =>
      t.id === ticket.id ? { ...t, priority: newPriority, updated: "Ahora" } : t
    ));
    showNotification(`✅ Prioridad de ${ticket.id} cambiada a ${newPriority}`, "success");
  };

  const handleMarkCritical = (ticket) => {
    setTicketsList((prev) => prev.map((t) =>
      t.id === ticket.id ? { ...t, priority: "Critica", updated: "Ahora" } : t
    ));
    showNotification(`⚠️ Ticket ${ticket.id} marcado como CRÍTICO`, "success");
  };

  const handleViewTicketHistory = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
    alert(`📋 Historial de ${ticket.id}:\n${ticket.history}\n\nÚltima actualización: ${ticket.updated}`);
    setShowTicketModal(false);
  };

  const reportStats = {
    cumplimientoSLA: "96.4%",
    incidentesCriticos: ticketsList.filter((t) => t.priority === "Critica").length,
    riesgoOperativo: "Medio",
    ticketsCerrados: ticketsList.filter((t) => t.status === "Cerrado").length,
  };

  const handleExportReportCSV = () => {
    const headers = ["Reporte", "Periodo", "Propietario", "Estado", "Formato", "Última generación"];
    const rows = reportsList.map((r) => [r.name, r.period, r.owner, r.status, r.format, r.updated]);
    let csvContent = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reportes_techrepair.csv";
    link.click();
    showNotification("✅ Reportes exportados a CSV", "success");
  };

  const handleExportReportPDF = () => {
    showNotification("📄 Generando PDF de reportes...", "success");
  };

  const handleGenerateReport = () => {
    setNewReportForm({ name: "", period: "", format: "PDF" });
    setShowGenerateReportModal(true);
  };

  const handleSaveNewReport = () => {
    if (!newReportForm.name || !newReportForm.period) {
      showNotification("❌ Completa todos los campos", "error");
      return;
    }
    const newReport = {
      ...newReportForm,
      owner: "Cristian Alarcon",
      status: "En proceso",
      updated: "Ahora"
    };
    setReportsList((prev) => [newReport, ...prev]);
    showNotification("✅ Reporte generado correctamente", "success");
    setShowGenerateReportModal(false);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportDetailModal(true);
  };

  const handleDownloadReport = (report) => {
    showNotification(`⬇️ Descargando ${report.name}.${report.format.toLowerCase()}`, "success");
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

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                value={chatTargetRole}
                onChange={(e) => {
                  const role = e.target.value;
                  const firstTarget = chatTargets.find((target) => target.role === role) || chatTargets[0];
                  handleSelectChatTarget(firstTarget.role, firstTarget.id);
                }}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
              >
                <option value="client">Cliente</option>
                <option value="tech">Tecnico</option>
              </select>
              <select
                value={`${chatTargetRole}:${chatTargetId}`}
                onChange={(e) => {
                  const [role, id] = e.target.value.split(":");
                  handleSelectChatTarget(role, id);
                }}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
              >
                {chatTargets
                  .filter((target) => target.role === chatTargetRole)
                  .map((target) => (
                    <option key={`${target.role}:${target.id}`} value={`${target.role}:${target.id}`}>
                      {target.label}
                    </option>
                  ))}
              </select>
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
          <button onClick={handleExportCSV} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
            Exportar CSV
          </button>
          <button onClick={handleNewUser} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: ACCENT }}>
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
            {adminUsersList.map((u) => (
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
                    <button onClick={() => handleEditUser(u)} className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                      Editar
                    </button>
                    <button onClick={() => handleResetPassword(u)} className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                      Reset clave
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(u)}
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
            <button onClick={handleNewTech} className="px-3 py-2 rounded-lg text-sm text-white inline-flex items-center gap-2" style={{ backgroundColor: ACCENT }}>
              <UserPlus size={16} />
              Crear tecnico
            </button>
            <button onClick={handleBulkPasswordChange} className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-2" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              <KeyRound size={16} />
              Cambio masivo de clave
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cuentas tecnicas activas</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>{techAccountsList.filter((t) => t.status === "Habilitada").length}</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Sin rol asignado</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>{techAccountsList.filter((t) => !t.role || t.role === "").length}</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cambio de clave pendiente</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>5</p>
          </article>
          <article className="rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
            <p className="text-xs uppercase" style={{ color: theme.sub }}>Cuentas deshabilitadas</p>
            <p className="text-[24px] leading-7 font-bold mt-1" style={{ color: theme.text }}>{techAccountsList.filter((t) => t.status === "Deshabilitada").length}</p>
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
              {techAccountsList.map((tech) => (
                <tr key={tech.username} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{tech.name}</td>
                  <td style={{ color: theme.sub }}>{tech.username}</td>
                  <td>
                    <button onClick={() => handleEditTech(tech)} className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
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
                      <button onClick={() => handleAssignRole(tech)} className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
                        <UserCheck size={14} />
                        Asignar rol
                      </button>
                      <button onClick={() => handleChangePassword(tech)} className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
                        <KeyRound size={14} />
                        Cambiar clave
                      </button>
                      <button
                        onClick={() => handleToggleTechStatus(tech)}
                        className="px-2 py-1 rounded-md text-xs text-white"
                        style={{ backgroundColor: tech.status === "Habilitada" ? "#D14343" : "#1B8E4B" }}
                      >
                        {tech.status === "Habilitada" ? "Deshabilitar" : "Habilitar"}
                      </button>
                      <button onClick={() => handleDeleteTech(tech)} className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1.5 text-red-600" style={{ borderColor: theme.border, backgroundColor: theme.card }}>
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: theme.panel, borderColor: theme.border, borderWidth: 1 }}>
              <Search size={16} style={{ color: theme.sub }} />
              <input className="bg-transparent outline-none text-sm" style={{ color: theme.text }} placeholder="Buscar ticket, usuario o equipo" />
            </div>
            <button onClick={handleNewTicket} className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: ACCENT, color: '#fff' }}>
              Nuevo Ticket
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Abiertos", value: ticketStats.abiertos, detail: "12 de alta prioridad" },
          { label: "En progreso", value: ticketStats.enProgreso, detail: "8 en atencion activa" },
          { label: "Criticos", value: ticketStats.criticos, detail: "SLA comprometido" },
          { label: "Cerrados (mes)", value: ticketStats.cerrados, detail: "Tasa de cierre 94%" },
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
              onClick={() => setTicketFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs border"
              style={{ borderColor: theme.border, backgroundColor: f === ticketFilter ? ACCENT : theme.panel, color: f === ticketFilter ? "#fff" : theme.text }}
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
              {filteredTickets.map((t) => (
                <tr key={t.id} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{t.id}</td>
                  <td>{t.user}</td>
                  <td style={{ color: theme.sub }}>{t.tech}</td>
                  <td><Pill tone={t.priority === "Critica" ? "bad" : t.priority === "Alta" ? "warn" : "neutral"}>{t.priority}</Pill></td>
                  <td><Pill tone={t.status === "Cerrado" ? "ok" : t.status === "En progreso" ? "warn" : "bad"}>{t.status}</Pill></td>
                  <td style={{ color: theme.sub }}>{t.sla}</td>
                  <td style={{ color: theme.sub }}>{t.updated}</td>
                  <td>
                    <button onClick={() => handleViewTicketHistory(t)} className="text-xs underline-offset-2 hover:underline" style={{ color: theme.sub }}>
                      {t.history}
                    </button>
                  </td>
                  <td>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => handleAssignTicket(t)} className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}>
                        Asignar
                      </button>
                      <select
                        value={t.status}
                        onChange={(e) => handleChangeTicketStatus(t, e.target.value)}
                        className="px-2 py-1 rounded-md border text-xs"
                        style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                      <select
                        value={t.priority}
                        onChange={(e) => handleChangeTicketPriority(t, e.target.value)}
                        className="px-2 py-1 rounded-md border text-xs"
                        style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Critica">Critica</option>
                      </select>
                      <button onClick={() => handleMarkCritical(t)} className="px-2 py-1 rounded-md text-xs text-white" style={{ backgroundColor: "#D14343" }}>
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
            <button onClick={handleExportReportCSV} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              Exportar CSV
            </button>
            <button onClick={handleExportReportPDF} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.card }}>
              Exportar PDF
            </button>
            <button onClick={handleGenerateReport} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: ACCENT }}>
              Generar reporte
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Cumplimiento SLA", value: reportStats.cumplimientoSLA, detail: "Objetivo: 95%" },
          { label: "Incidentes criticos", value: reportStats.incidentesCriticos, detail: "Ultimos 7 dias" },
          { label: "Riesgo operativo", value: reportStats.riesgoOperativo, detail: "2 sedes con alerta" },
          { label: "Tickets cerrados", value: reportStats.ticketsCerrados, detail: "Mes actual" },
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
              {reportsList.map((r) => (
                <tr key={`${r.name}-${r.period}`} className="border-b" style={{ borderColor: theme.border }}>
                  <td className="py-3 font-semibold">{r.name}</td>
                  <td style={{ color: theme.sub }}>{r.period}</td>
                  <td style={{ color: theme.sub }}>{r.owner}</td>
                  <td><Pill tone={r.status === "Completado" ? "ok" : "warn"}>{r.status}</Pill></td>
                  <td style={{ color: theme.sub }}>{r.format}</td>
                  <td style={{ color: theme.sub }}>{r.updated}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewReport(r)} className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
                        Ver
                      </button>
                      <button onClick={() => handleDownloadReport(r)} className="px-2 py-1 rounded-md border text-xs" style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.panel }}>
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

  const newsSection = (
    <TechnicalNewsPanel
      active={section === "news"}
      theme={theme}
      accentColor={ACCENT}
      accentHoverColor={ACCENT_HOVER}
      cardClassName={card}
      roleLabel="Administrador"
      accessId={adminTechnicalNewsMeta.displayId}
    />
  );

  return (
    <div className={cx("min-h-screen relative overflow-hidden admin-shell role-shell", ui.pageBg, isDark ? "admin-dark" : "admin-light")} style={{ fontFamily: "Inter, Roboto, sans-serif", color: theme.text }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[#7F00FF]/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[340px] w-[340px] rounded-full bg-[#2E6BFF]/20 blur-3xl" />
      </div>
      <style>{`
        .admin-shell .card-surface { background: ${theme.card}; border-color: ${theme.border}; }
        .admin-shell .text-\\[\\#333333\\] { color: ${theme.text}; }
        .admin-shell .text-\\[\\#6B6B6B\\] { color: ${theme.sub}; }
        .admin-shell .bg-\\[\\#F7F7F7\\] { background: ${theme.panel}; }
        .admin-shell .border-\\[\\#D1D1D1\\] { border-color: ${theme.border}; }
        .admin-dark input, .admin-dark select { background: ${theme.card} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
      `}</style>

      <div className="relative flex min-h-screen">
        <aside className={cx("w-[250px] min-h-screen border-r p-4 hidden md:flex md:flex-col backdrop-blur-lg", ui.sidebar)} style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="TechRepair" className="h-11 w-11 rounded-xl border p-1.5 object-contain bg-[#0D1426]" style={{ borderColor: theme.border }} />
              <div><p className={cx("font-semibold", ui.textMain)}>TechRepair</p><p className={cx("text-xs", ui.textSub)}>Enterprise Control</p></div>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            {nav.map((item) => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => setSection(item.id)} className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors", active ? "bg-[#7F00FF] text-white shadow-[0_8px_22px_-12px_rgba(127,0,255,0.8)]" : `${ui.textSub} hover:bg-[#7F00FF]/15`)}>
                  <item.icon size={18} /> {item.label}
                </button>
              );
            })}
          </nav>
          <button onClick={() => auth.signOut()} className={cx("mt-3 w-full px-3 py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2", ui.input)}>
            <LogOut size={16} /> Salir
          </button>
        </aside>

        <main className="flex-1 p-4 md:p-6 space-y-4 role-main h-full overflow-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <header className={cx("rounded-3xl border p-4 md:p-5 backdrop-blur-xl shadow-[0_18px_45px_-25px_rgba(127,0,255,0.35)]", ui.frame)} style={{ borderColor: theme.border }}>
            <div className="flex flex-wrap gap-3 items-start justify-between">
              <div>
                <p className={cx("text-xs uppercase tracking-[0.18em]", ui.textSub)}>TechRepair Enterprise Control</p>
                <h1 className={cx("text-2xl md:text-3xl font-black mt-1", ui.textMain)}>Panel Administrador</h1>
                <p className={cx("text-sm mt-2 break-all sm:break-words", ui.textSub)}>{user?.email} - Rol: Administrador</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs"><CheckCircle2 size={14} /> Conectado</span>
                <span className={cx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs", ui.soft, ui.textMain)} style={{ borderColor: theme.border }}><Lock size={14} /> Seguro</span>
                <span className={cx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs", ui.soft, ui.textMain)} style={{ borderColor: theme.border }}><Globe size={14} /> Dispositivos activos</span>
              </div>
            </div>
          </header>

          <div className="space-y-4">
            {section === "dashboard" && dashboard}
            {section === "users" && users}
            {section === "tickets" && tickets}
            {section === "devices" && devicesSection}
            {section === "reports" && reports}
            {canManageTechnicalNews && <section className={section === "news" ? "block" : "hidden"}>{newsSection}</section>}
            {section === "settings" && settings}
          </div>
        </main>
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

        {/* MODAL CREAR / ASIGNAR NUEVO TICKET */}
        {showNewTicketModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold" style={{ color: theme.text }}>Crear Nuevo Ticket</h3>
                <button type="button" onClick={() => setShowNewTicketModal(false)} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: theme.border, color: theme.text }}>
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Solicitante (nombre)" value={newTicketForm.user} onChange={(e) => setNewTicketForm({ ...newTicketForm, user: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
                <textarea placeholder="Descripción de la incidencia" value={newTicketForm.description} onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })} className="w-full p-3 rounded-lg border h-28" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newTicketForm.tech} onChange={(e) => setNewTicketForm({ ...newTicketForm, tech: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                    <option value="">Seleccionar técnico</option>
                    {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={newTicketForm.priority} onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Critica">Crítica</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveNewTicket} disabled={creatingTicket} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>{creatingTicket ? 'Creando...' : 'Crear y Asignar'}</button>
                  <button onClick={() => setShowNewTicketModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: theme.border, color: theme.text }}>Cancelar</button>
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

      {/* MODAL DE USUARIO */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.text }}>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre completo" value={modalForm.name} onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <input type="email" placeholder="Correo electrónico" value={modalForm.email} onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <select value={modalForm.role} onChange={(e) => setModalForm({ ...modalForm, role: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="">Seleccionar rol</option>
                <option value="Admin">Administrador</option>
                <option value="Soporte">Soporte</option>
                <option value="Cliente">Cliente</option>
              </select>
              <div className="flex gap-3">
                <button onClick={handleSaveUser} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Guardar</button>
                <button onClick={() => setShowUserModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: theme.border, color: theme.text }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE TÉCNICO */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.text }}>{selectedTech ? "Editar Técnico" : "Nuevo Técnico"}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre completo" value={modalForm.name} onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <input type="text" placeholder="Nombre de usuario" value={modalForm.username} onChange={(e) => setModalForm({ ...modalForm, username: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <select value={modalForm.role} onChange={(e) => setModalForm({ ...modalForm, role: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="">Seleccionar rol</option>
                <option value="Soporte L1">Soporte L1</option>
                <option value="Soporte L2">Soporte L2</option>
                <option value="Supervisor">Supervisor</option>
              </select>
              <div className="flex gap-3">
                <button onClick={handleSaveTech} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Guardar</button>
                <button onClick={() => setShowTechModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: theme.border, color: theme.text }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResetPasswordModal && resetTargetUser && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-xl font-bold" style={{ color: theme.text }}>Gestion de contraseña</h3>
            <p className="text-sm mt-1" style={{ color: theme.sub }}>
              Usuario: <span style={{ color: theme.text, fontWeight: 600 }}>{resetTargetUser.name}</span> · {resetTargetUser.email}
            </p>
            <p className="text-sm mt-3" style={{ color: theme.sub }}>
              Selecciona el tipo de acción que deseas ejecutar para esta cuenta.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResetMode("email")}
                className="px-3 py-2 rounded-lg border text-sm text-left"
                style={{
                  borderColor: resetMode === "email" ? ACCENT : theme.border,
                  backgroundColor: resetMode === "email" ? `${ACCENT}22` : theme.panel,
                  color: theme.text,
                }}
              >
                Reset por correo
              </button>
              <button
                type="button"
                onClick={() => setResetMode("now")}
                className="px-3 py-2 rounded-lg border text-sm text-left"
                style={{
                  borderColor: resetMode === "now" ? ACCENT : theme.border,
                  backgroundColor: resetMode === "now" ? `${ACCENT}22` : theme.panel,
                  color: theme.text,
                }}
              >
                Cambiar ahora
              </button>
            </div>

            {resetMode === "email" && (
              <div className="mt-4 rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
                <p className="text-sm" style={{ color: theme.text }}>
                  Se enviará un correo de restablecimiento a <strong>{resetTargetUser.email}</strong> con instrucciones seguras para crear una nueva contraseña.
                </p>
              </div>
            )}

            {resetMode === "now" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold" style={{ color: theme.sub }}>Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimo 8 caracteres"
                    className="w-full mt-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                    style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold" style={{ color: theme.sub }}>Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full mt-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                    style={{ borderColor: theme.border, backgroundColor: theme.panel, color: theme.text }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                onClick={confirmResetPasswordAction}
                className="flex-1 py-2.5 rounded-lg text-white font-semibold"
                style={{ backgroundColor: ACCENT }}
              >
                Confirmar accion
              </button>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="flex-1 py-2.5 rounded-lg border font-semibold"
                style={{ borderColor: theme.border, color: theme.text }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportDetailModal && selectedReport && (
        <div className="fixed inset-0 z-[94] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-xl font-bold" style={{ color: theme.text }}>Detalle de reporte</h3>
            <p className="text-sm mt-1" style={{ color: theme.sub }}>
              Revisa estado, periodo, formato y acciones disponibles.
            </p>

            <div className="mt-4 rounded-xl border p-4 space-y-2" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p style={{ color: theme.sub }}>Reporte</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.name}</p>
                <p style={{ color: theme.sub }}>Periodo</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.period}</p>
                <p style={{ color: theme.sub }}>Propietario</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.owner}</p>
                <p style={{ color: theme.sub }}>Estado</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.status}</p>
                <p style={{ color: theme.sub }}>Formato</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.format}</p>
                <p style={{ color: theme.sub }}>Ultima generacion</p>
                <p className="font-semibold" style={{ color: theme.text }}>{selectedReport.updated}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border p-3" style={{ borderColor: theme.border, backgroundColor: theme.panel }}>
              <p className="text-sm" style={{ color: theme.text }}>
                Este reporte puede usarse para seguimiento de SLA, auditoria operativa y trazabilidad de incidencias por periodo.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex-1 py-2.5 rounded-lg text-white font-semibold"
                style={{ backgroundColor: ACCENT }}
              >
                Descargar reporte
              </button>
              <button
                onClick={() => setShowReportDetailModal(false)}
                className="flex-1 py-2.5 rounded-lg border font-semibold"
                style={{ borderColor: theme.border, color: theme.text }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ASIGNAR TICKET */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>Asignar Ticket {selectedTicket.id}</h3>
              <button type="button" onClick={handleCloseAssignModal} className="h-9 w-9 rounded-lg border flex items-center justify-center" style={{ borderColor: theme.border, color: theme.text }}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <select value={ticketForm.tech} onChange={(e) => setTicketForm({ ...ticketForm, tech: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="">Seleccionar técnico</option>
                {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={ticketForm.status} onChange={(e) => setTicketForm({ ...ticketForm, status: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="">Estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <select value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="">Prioridad</option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Critica">Crítica</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={handleSaveTicketAssignment} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Guardar</button>
                <button type="button" onClick={handleCloseAssignModal} className="flex-1 py-3 rounded-xl border" style={{ borderColor: theme.border, color: theme.text }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GENERAR REPORTE */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.text }}>Generar Nuevo Reporte</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre del reporte" value={newReportForm.name} onChange={(e) => setNewReportForm({ ...newReportForm, name: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <input type="text" placeholder="Periodo (ej: Enero 2026)" value={newReportForm.period} onChange={(e) => setNewReportForm({ ...newReportForm, period: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }} />
              <select value={newReportForm.format} onChange={(e) => setNewReportForm({ ...newReportForm, format: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
              <div className="flex gap-3">
                <button onClick={handleSaveNewReport} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Generar</button>
                <button onClick={() => setShowGenerateReportModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: theme.border, color: theme.text }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE NOTIFICACIÓN */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3" style={{ backgroundColor: notification.type === "success" ? "#10b981" : "#ef4444", color: "white" }}>
            <span>{notification.type === "success" ? "✅" : "❌"}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
