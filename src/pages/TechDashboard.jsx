import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  Camera,
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  Headphones,
  LogOut,
  MessageSquare,
  Monitor,
  PauseCircle,
  PhoneCall,
  PlayCircle,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Timer,
  TerminalSquare,
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
  Newspaper
} from "lucide-react";
import { ACCENT, ACCENT_HOVER, buildOrbitUi, cx, Pill } from "../components/workspaces/shared";
import { auth } from "../lib/firebase";
import remoteSessionService from "../services/remoteSessionService";
import TechnicalNewsPanel from "../components/news/TechnicalNewsPanel";
import logo from "../assets/logo.png";
import { canAccessTechnicalNews, resolveTechnicalNewsUserMeta } from "../utils/technicalNewsAccess";

const LEONARDO_CHAT_KEY = "techrepair_chat_TR-809-541-001";
const TECH_NAIN_CHAT_KEY = "techrepair_chat_TEC-808-544-541";

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

function TechDashboard({ user }) {
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
  const [myTicketsList, setMyTicketsList] = useState([
    { id: "TK-9321", user: "Paula Gomez", priority: "Alta", status: "Pendiente", eta: "12 min", device: "HQ-PC-001" },
    { id: "TK-9312", user: "Luis Ortega", priority: "Media", status: "En progreso", eta: "25 min", device: "FIN-LAP-008" },
    { id: "TK-9298", user: "Marta Leon", priority: "Critica", status: "Pendiente", eta: "5 min", device: "OPS-MOB-021" },
    { id: "TK-9401", user: "Leonardo Martinez", priority: "Media", status: "Pendiente", eta: "18 min", device: "USR-809541001" },
  ]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({ status: "", diagnostic: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [remoteSessionsList, setRemoteSessionsList] = useState([
    { id: "RS-1402", client: "CL-809115", category: "Correctivo", priority: "Alta", status: "Activa", date: "2026-02-16 17:45", duration: "22 min" },
    { id: "RS-1401", client: "CL-772201", category: "Preventivo", priority: "Media", status: "Finalizada", date: "2026-02-16 16:30", duration: "38 min" },
    { id: "RS-1398", client: "CL-550980", category: "Instalacion", priority: "Baja", status: "Finalizada", date: "2026-02-16 14:10", duration: "19 min" },
    { id: "RS-1395", client: "CL-991204", category: "Correctivo", priority: "Critica", status: "Pendiente", date: "2026-02-16 12:55", duration: "Sin iniciar" },
    { id: "RS-1393", client: "CL-664030", category: "Auditoria", priority: "Media", status: "Finalizada", date: "2026-02-15 18:20", duration: "41 min" },
    { id: "RS-1390", client: "CL-440312", category: "Preventivo", priority: "Alta", status: "Activa", date: "2026-02-15 11:05", duration: "15 min" },
  ]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState(null);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationTarget, setEscalationTarget] = useState("tecnico");
  const [knowledgeBase, setKnowledgeBase] = useState([
    { id: 1, title: "Guía de diagnóstico remoto para red inestable", category: "Redes", content: "1. Verificar conectividad con ping...\n2. Comprobar firewall y antivirus...\n3. Reiniciar adaptador de red...\n4. Verificar DNS y proxy..." },
    { id: 2, title: "Checklist de cierre de ticket crítico", category: "Procedimientos", content: "✓ Validar que la solución funciona\n✓ Confirmar con el usuario final\n✓ Documentar en bitácora\n✓ Verificar SLA cumplido\n✓ Cerrar ticket en sistema" },
    { id: 3, title: "Procedimiento de reinstalación de agente", category: "Software", content: "1. Desinstalar versión anterior desde Panel de Control\n2. Descargar último instalador desde portal TechRepair\n3. Ejecutar como administrador\n4. Configurar permisos y firewall\n5. Verificar conexión con servidor" },
    { id: 4, title: "Matriz de escalamiento L1 -> L2", category: "Gestión", content: "Casos que requieren escalamiento:\n- SLA comprometido (>15 min)\n- Error desconocido sin documentación\n- Permisos insuficientes\n- Fallo de hardware\n- Requiere acceso a base de datos" },
  ]);
  const [searchKnowledge, setSearchKnowledge] = useState("");
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [techChatKey, setTechChatKey] = useState(TECH_NAIN_CHAT_KEY);
  const canUseTechnicalNews = canAccessTechnicalNews(user, "tecnico");
  const technicianTechnicalNewsMeta = resolveTechnicalNewsUserMeta(user);

  const nav = [
    { id: "dashboard", label: "Inicio tecnico", icon: Activity },
    { id: "tickets", label: "Mis tickets", icon: ClipboardCheck },
    { id: "sessions", label: "Sesiones remotas", icon: Headphones },
    { id: "devices", label: "Dispositivos asignados", icon: Monitor },
    { id: "knowledge", label: "Base de conocimiento", icon: BookOpen },
    { id: "shift", label: "Turno y bitacora", icon: Clock3 },
    ...(canUseTechnicalNews ? [{ id: "news", label: "Noticias Tecnicas", icon: Newspaper }] : []),
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
    ? { bg: "#070B16", panel: "#0F1729", card: "#0D1426", border: "#27324A", text: "#E5EBFF", sub: "#9EABC8" }
    : { bg: "#F4F6FB", panel: "#F7F7F7", card: "#FFFFFF", border: "#D1D1D1", text: "#1B2642", sub: "#617094" };
  const ui = buildOrbitUi(isTechDark);

  const settingsNav = [
    ["interface", "Interfaz y tema"],
    ["notifications", "Notificaciones tecnicas"],
    ["connection", "Conexion remota"],
    ["privacy", "Privacidad de sesion"],
  ];

  const devices = [
    { name: "HQ-PC-001", os: "Windows 11", state: "Online", ping: "18ms", last: "Ahora" },
    { name: "OPS-MOB-021", os: "Android 14", state: "Inestable", ping: "98ms", last: "2 min" },
    { name: "DIR-TAB-004", os: "iPadOS", state: "Online", ping: "26ms", last: "Ahora" },
  ];
  const remoteSessionId = useMemo(() => {
    const normalized = (activeRemoteClient || "general").trim().replace(/\s+/g, "-");
    return `tech-${normalized}`;
  }, [activeRemoteClient]);

  useEffect(() => {
    const existing = readSharedChat(techChatKey);
    if (existing.length) {
      setRemoteMessages(existing);
    } else {
      const seed = [{ from: "system", text: "Canal tecnico seguro iniciado.", time: new Date().toLocaleTimeString() }];
      writeSharedChat(techChatKey, seed);
      setRemoteMessages(seed);
    }

    const onStorage = (event) => {
      if (event.key !== techChatKey) return;
      setRemoteMessages(readSharedChat(techChatKey));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [techChatKey]);

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

    const localMessage = {
      from: "tech",
      text,
      time: new Date().toLocaleTimeString(),
    };
    setRemoteMessages((prev) => {
      const updated = [localMessage, ...prev];
      writeSharedChat(techChatKey, updated);
      return updated;
    });

    try {
      const savedMessage = await remoteSessionService.sendMessage(remoteSessionId, {
        senderName: user?.displayName || user?.email || "Tecnico",
        senderRole: "tech",
        text,
      });
      setRemoteMessages((prev) => {
        const updated = [toUiMessage(savedMessage), ...prev.slice(1)];
        writeSharedChat(techChatKey, updated);
        return updated;
      });
      setRemoteChatInput("");
    } catch (error) {
      setRemoteChatInput("");
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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketForm({ status: ticket.status, diagnostic: "" });
    setShowTicketModal(true);
  };

  const handleDiagnosticar = (ticket) => {
    setSelectedTicket(ticket);
    setShowDiagnosticModal(true);
  };

  const handleStartDiagnostic = async () => {
    if (!selectedTicket) return;

    const currentTicket = myTicketsList.find((t) => t.id === selectedTicket.id) || selectedTicket;
    const canStartDiagnostic = currentTicket.status !== "Cerrado";
    const diagnosticMessage = canStartDiagnostic
      ? `Hola ${currentTicket.user}, iniciamos el diagnostico del ticket ${currentTicket.id}. Estado actual: ${currentTicket.status}.`
      : `Hola ${currentTicket.user}, no podemos iniciar el diagnostico del ticket ${currentTicket.id} porque su estado actual es "${currentTicket.status}".`;

    const localChatMessage = {
      from: "tech",
      text: diagnosticMessage,
      time: new Date().toLocaleTimeString(),
    };
    setRemoteMessages((prev) => {
      const updated = [localChatMessage, ...prev];
      writeSharedChat(LEONARDO_CHAT_KEY, updated);
      return updated;
    });

    if (sessionActive && activeRemoteClient) {
      try {
        const savedMessage = await remoteSessionService.sendMessage(remoteSessionId, {
          senderName: user?.displayName || user?.email || "Tecnico",
          senderRole: "tech",
          text: diagnosticMessage,
        });
        setRemoteMessages((prev) => [toUiMessage(savedMessage), ...prev.slice(1)]);
      } catch (_error) {
        setRemoteMessages((prev) => [
          { from: "system", text: "No se pudo sincronizar el mensaje de diagnostico con la sesion remota.", time: new Date().toLocaleTimeString() },
          ...prev,
        ]);
      }
    }

    if (!canStartDiagnostic) {
      showNotification(`No se puede iniciar: ticket ${currentTicket.id} en estado ${currentTicket.status}`, "error");
      setShowDiagnosticModal(false);
      return;
    }

    showNotification(`Iniciando diagnostico para ${currentTicket.id}...`, "info");
    setTimeout(() => {
      showNotification(`Diagnostico completado para ${currentTicket.id}`, "success");
      setShowDiagnosticModal(false);
    }, 2000);
  };

  const handleCerrarTicket = (ticket) => {
    if (window.confirm(`¿Cerrar ticket ${ticket.id}? Se registrará como resuelto.`)) {
      setMyTicketsList((prev) => prev.filter((t) => t.id !== ticket.id));
      showNotification(`✅ Ticket ${ticket.id} cerrado correctamente`, "success");
    }
  };

  const handleSaveTicket = () => {
    if (!selectedTicket) return;
    setMyTicketsList((prev) => prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: ticketForm.status } : t)));
    showNotification(`✅ Ticket ${selectedTicket.id} actualizado`, "success");
    setShowTicketModal(false);
    setSelectedTicket(null);
  };

  const handleOpenSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleViewHistory = (session) => {
    setSelectedHistorySession(session);
    setShowHistoryModal(true);
  };

  const handleStartSession = (session) => {
    setRemoteSessionsList((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "Activa", duration: "0 min" } : s)));
    showNotification(`▶️ Sesión ${session.id} iniciada`, "success");
    setShowSessionModal(false);
  };

  const handleEndSession = (session) => {
    setRemoteSessionsList((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "Finalizada" } : s)));
    showNotification(`⏹️ Sesión ${session.id} finalizada`, "success");
    setShowSessionModal(false);
  };

  const handleEscalateSession = (session) => {
    setSelectedSession(session);
    setEscalationTarget("tecnico");
    setShowEscalationModal(true);
  };

  const handleConfirmEscalation = () => {
    if (!selectedSession) return;
    const targetLabel = escalationTarget === "admin" ? "Administrador" : "Tecnico";
    showNotification(`Sesion ${selectedSession.id} escalada a ${targetLabel}`, "success");
    setShowEscalationModal(false);
  };

  const filteredKnowledge = knowledgeBase.filter((article) =>
    article.title.toLowerCase().includes(searchKnowledge.toLowerCase()) ||
    article.category.toLowerCase().includes(searchKnowledge.toLowerCase())
  );

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
    setShowKnowledgeModal(true);
  };

  const card = "tech-card rounded-3xl border shadow-[0_18px_45px_-25px_rgba(127,0,255,0.18)] backdrop-blur-xl";
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
              placeholder="Escribe un mensaje tecnico..."
              className="flex-1 min-w-[260px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
              style={{ borderColor: techTheme.border, backgroundColor: techTheme.card, color: techTheme.text }}
            />
            <button
              onClick={sendRemoteMessage}
              className="px-3 h-10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
              disabled={!remoteChatInput.trim()}
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
            {myTicketsList.map((t) => (
              <tr key={t.id} className="border-b border-[#D1D1D1]">
                <td className="py-3 font-semibold text-[#333333]">{t.id}</td>
                <td>{t.user}</td>
                <td><Pill tone={t.priority === "Critica" ? "bad" : t.priority === "Alta" ? "warn" : "neutral"}>{t.priority}</Pill></td>
                <td className="text-[#333333]">{t.status}</td>
                <td className="text-[#6B6B6B]">{t.eta}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenTicket(t)} className="px-2 py-1 rounded-md border border-[#D1D1D1]">Abrir</button>
                    <button onClick={() => handleDiagnosticar(t)} className="px-2 py-1 rounded-md border border-[#D1D1D1]">Diagnosticar</button>
                    <button onClick={() => handleCerrarTicket(t)} className="px-2 py-1 rounded-md bg-[#7F00FF] text-white">Cerrar</button>
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
            ["Total sesiones", String(remoteSessionsList.length), "Ultimos 2 dias"],
            ["Activas", String(remoteSessionsList.filter((s) => s.status === "Activa").length), "Atencion en curso"],
            ["Pendientes", String(remoteSessionsList.filter((s) => s.status === "Pendiente").length), "Sin iniciar"],
            ["Criticas", String(remoteSessionsList.filter((s) => s.priority === "Critica").length), "Escalar si supera SLA"],
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
              {remoteSessionsList.map((s) => (
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
                      <button onClick={() => handleOpenSession(s)} className="px-2 py-1 rounded-md border border-[#D1D1D1]">Abrir</button>
                      <button onClick={() => handleViewHistory(s)} className="px-2 py-1 rounded-md border border-[#D1D1D1]">Historial</button>
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
          <input value={searchKnowledge} onChange={(e) => setSearchKnowledge(e.target.value)} className="bg-transparent outline-none text-sm" placeholder="Buscar procedimiento..." />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredKnowledge.map((item) => (
          <article key={item.id} className="rounded-lg border border-[#D1D1D1] p-4 bg-[#F7F7F7]">
            <p className="text-sm font-medium text-[#333333]">{item.title}</p>
            <button onClick={() => handleOpenArticle(item)} className="mt-3 text-xs text-[#7F00FF] font-semibold">Abrir documento</button>
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

  const newsSection = (
    <TechnicalNewsPanel
      active={section === "news"}
      theme={techTheme}
      accentColor={ACCENT}
      accentHoverColor={ACCENT_HOVER}
      cardClassName={card}
      roleLabel="Tecnico"
      accessId={technicianTechnicalNewsMeta.displayId}
    />
  );

  return (
    <div className={cx("min-h-screen relative overflow-hidden tech-shell role-shell", ui.pageBg, isTechDark ? "tech-dark" : "tech-light")} style={{ fontFamily: "Inter, Roboto, sans-serif", color: techTheme.text }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[#7F00FF]/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[340px] w-[340px] rounded-full bg-[#2E6BFF]/20 blur-3xl" />
      </div>
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
      <div className="relative flex min-h-screen">
        <aside className={cx("w-[250px] min-h-screen border-r p-4 hidden md:flex md:flex-col backdrop-blur-lg", ui.sidebar)} style={{ borderColor: techTheme.border }}>
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="TechRepair" className="h-11 w-11 rounded-xl border p-1.5 object-contain bg-[#0D1426]" style={{ borderColor: techTheme.border }} />
            <div>
              <p className={cx("font-semibold", ui.textMain)}>TechRepair</p>
              <p className={cx("text-xs", ui.textSub)}>Technician Orbit</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            {nav.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors", active ? "bg-[#7F00FF] text-white shadow-[0_8px_22px_-12px_rgba(127,0,255,0.8)]" : `${ui.textSub} hover:bg-[#7F00FF]/15`)}
                >
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
          <header className={cx("rounded-3xl border p-4 md:p-5 backdrop-blur-xl shadow-[0_18px_45px_-25px_rgba(127,0,255,0.35)]", ui.frame)} style={{ borderColor: techTheme.border }}>
            <div className="flex flex-wrap gap-3 items-start justify-between">
              <div>
                <p className={cx("text-xs uppercase tracking-[0.18em]", ui.textSub)}>TechRepair Technician Orbit</p>
                <h1 className={cx("text-2xl md:text-3xl font-black mt-1", ui.textMain)}>Panel Tecnico</h1>
                <p className={cx("text-sm mt-2 break-all sm:break-words", ui.textSub)}>{user?.email} · Rol: Tecnico</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs"><CheckCircle2 size={14} /> Disponible</span>
                <span className={cx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs", ui.soft, ui.textMain)} style={{ borderColor: techTheme.border }}><TerminalSquare size={14} /> Diagnostico listo</span>
                <span className={cx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs", ui.soft, ui.textMain)} style={{ borderColor: techTheme.border }}><Clock3 size={14} /> SLA en objetivo</span>
              </div>
            </div>
          </header>

          <div className="space-y-4">
            {section === "dashboard" && dashboard}
            {section === "tickets" && ticketSection}
            {section === "sessions" && sessionsSection}
            {section === "devices" && devicesSection}
            {section === "knowledge" && knowledgeSection}
            {section === "shift" && shiftSection}
            {canUseTechnicalNews && <section className={section === "news" ? "block" : "hidden"}>{newsSection}</section>}
            {section === "settings" && settingsSection}
          </div>
        </main>
      </div>

      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3" style={{ backgroundColor: notification.type === "success" ? "#10b981" : notification.type === "error" ? "#ef4444" : "#3b82f6", color: "white" }}>
            <span>{notification.type === "success" ? "✅" : notification.type === "error" ? "❌" : "ℹ️"}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: techTheme.text }}>Ticket {selectedTicket.id}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Usuario</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedTicket.user}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Dispositivo</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedTicket.device}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Prioridad</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedTicket.priority}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>ETA</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedTicket.eta}</p></div>
              </div>
              <select value={ticketForm.status} onChange={(e) => setTicketForm({ ...ticketForm, status: e.target.value })} className="w-full p-3 rounded-lg border" style={{ backgroundColor: techTheme.panel, borderColor: techTheme.border, color: techTheme.text }}>
                <option value="">Cambiar estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <div className="flex gap-3">
                <button onClick={handleSaveTicket} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Guardar</button>
                <button onClick={() => setShowTicketModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: techTheme.border, color: techTheme.text }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDiagnosticModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: techTheme.text }}>🔍 Diagnóstico - {selectedTicket.id}</h3>
            <div className="space-y-4">
              <p style={{ color: techTheme.text }}>Dispositivo: {selectedTicket.device}</p>
              <p style={{ color: techTheme.text }}>Usuario: {selectedTicket.user}</p>
              <div className="p-4 rounded-lg border" style={{ backgroundColor: techTheme.panel, borderColor: techTheme.border }}>
                <p className="text-sm font-semibold mb-2" style={{ color: techTheme.text }}>Chequeos automáticos:</p>
                <ul className="space-y-1 text-sm" style={{ color: techTheme.text }}>
                  <li>✅ Conectividad: Estable (24ms)</li>
                  <li>✅ CPU: 34% (normal)</li>
                  <li>✅ RAM: 62% (normal)</li>
                  <li>⚠️ Disco: 89% (requiere atención)</li>
                  <li>✅ Firewall: Configurado</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button onClick={handleStartDiagnostic} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Iniciar diagnóstico</button>
                <button onClick={() => setShowDiagnosticModal(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: techTheme.border, color: techTheme.text }}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: techTheme.text }}>Sesión {selectedSession.id}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Cliente</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.client}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Categoría</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.category}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Prioridad</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.priority}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Estado</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.status}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Fecha</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.date}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Duración</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedSession.duration}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSession.status !== "Activa" && selectedSession.status !== "Finalizada" && (
                  <button onClick={() => handleStartSession(selectedSession)} className="flex-1 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: "#10b981" }}>▶ Iniciar</button>
                )}
                {selectedSession.status === "Activa" && (
                  <button onClick={() => handleEndSession(selectedSession)} className="flex-1 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: "#ef4444" }}>⏹ Finalizar</button>
                )}
                <button onClick={() => handleEscalateSession(selectedSession)} className="flex-1 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: "#f59e0b" }}>📤 Escalar</button>
                <button onClick={() => setShowSessionModal(false)} className="w-full py-2 rounded-lg border text-sm" style={{ borderColor: techTheme.border, color: techTheme.text }}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEscalationModal && selectedSession && (
        <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: techTheme.text }}>Escalar sesion {selectedSession.id}</h3>
            <p className="text-sm mb-4" style={{ color: techTheme.sub }}>
              Selecciona el destino para transferir esta sesion remota.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setEscalationTarget("tecnico")}
                className="px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: escalationTarget === "tecnico" ? ACCENT : techTheme.border,
                  backgroundColor: escalationTarget === "tecnico" ? `${ACCENT}22` : techTheme.panel,
                  color: techTheme.text,
                }}
              >
                Otro tecnico
              </button>
              <button
                onClick={() => setEscalationTarget("admin")}
                className="px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: escalationTarget === "admin" ? ACCENT : techTheme.border,
                  backgroundColor: escalationTarget === "admin" ? `${ACCENT}22` : techTheme.panel,
                  color: techTheme.text,
                }}
              >
                Administrador
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmEscalation}
                className="flex-1 py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: ACCENT }}
              >
                Confirmar escalamiento
              </button>
              <button
                onClick={() => setShowEscalationModal(false)}
                className="flex-1 py-3 rounded-xl border"
                style={{ borderColor: techTheme.border, color: techTheme.text }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && selectedHistorySession && (
        <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: techTheme.text }}>Historial de sesion {selectedHistorySession.id}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Cliente</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedHistorySession.client}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Categoría</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedHistorySession.category}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Duración</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedHistorySession.duration}</p></div>
                <div><p className="text-sm" style={{ color: techTheme.sub }}>Estado</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedHistorySession.status}</p></div>
                <div className="col-span-2"><p className="text-sm" style={{ color: techTheme.sub }}>Fecha</p><p className="font-semibold" style={{ color: techTheme.text }}>{selectedHistorySession.date}</p></div>
              </div>
              <div className="p-4 rounded-lg border" style={{ backgroundColor: techTheme.panel, borderColor: techTheme.border }}>
                <p className="text-sm" style={{ color: techTheme.text }}>
                  Registro de sesión listo para revisión y transferencia operativa.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: ACCENT }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showKnowledgeModal && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: techTheme.card, borderColor: techTheme.border }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: techTheme.text }}>{selectedArticle.title}</h3>
            <p className="text-sm mb-4" style={{ color: techTheme.sub }}>Categoría: {selectedArticle.category}</p>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: techTheme.panel, borderColor: techTheme.border }}>
              <p style={{ color: techTheme.text, whiteSpace: "pre-wrap" }}>{selectedArticle.content}</p>
            </div>
            <div className="mt-6">
              <button onClick={() => setShowKnowledgeModal(false)} className="w-full py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: ACCENT }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

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

export default TechDashboard;
