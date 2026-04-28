import { useEffect, useRef, useState } from "react";
import {
  Clock3,
  FolderOpen,
  Home as HomeIcon,
  Lock,
  MessageSquare,
  Monitor,
  PhoneCall,
  Paperclip,
  Shield,
  Send,
  ShieldCheck,
  Timer,
  UploadCloud,
  UserCheck,
  Users,
  Video,
  Keyboard,
  MousePointer2,
  FileUp,
  X,
  Wifi,
  Wrench
} from "lucide-react";
import { ACCENT, ACCENT_HOVER, cx, Pill } from "../components/workspaces/shared";
import { auth } from "../lib/firebase";
import logo from "../assets/logo.png";

function Dashboard({ user }) {
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
  const [showClientInviteModal, setShowClientInviteModal] = useState(false);
  const [clientInviteCode, setClientInviteCode] = useState("");
  const [inviteGenerated, setInviteGenerated] = useState(false);
  const [showClientRemoteModal, setShowClientRemoteModal] = useState(false);
  const [clientSessionSeconds, setClientSessionSeconds] = useState(0);
  const [remoteChatInput, setRemoteChatInput] = useState("");
  const [clientCallMuted, setClientCallMuted] = useState(false);
  const [clientSpeakerOn, setClientSpeakerOn] = useState(true);
  const [clientVideoMicOn, setClientVideoMicOn] = useState(true);
  const [clientVideoCamOn, setClientVideoCamOn] = useState(true);
  const [clientVideoShareOn, setClientVideoShareOn] = useState(false);
  const [clientPendingFiles, setClientPendingFiles] = useState([]);
  const [remoteCode, setRemoteCode] = useState("");
  const [clientTheme, setClientTheme] = useState(() => localStorage.getItem("app_theme_mode") || localStorage.getItem("client_theme_mode") || "auto");
  const [selectedDetail, setSelectedDetail] = useState(null);
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

  const generateInviteCode = () => {
    const rnd = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `INV-${rnd()}-${rnd()}`;
    setClientInviteCode(code);
    setInviteGenerated(true);
  };

  const copyInviteCode = async () => {
    if (!clientInviteCode) return;
    try {
      await navigator.clipboard?.writeText(clientInviteCode);
    } catch (e) {
      console.warn("No se pudo copiar el codigo", e);
    }
  };

  const clientAcceptInvitation = () => {
    // Simulate client accepting: close invite modal and open remote control view
    setInviteGenerated(false);
    setShowClientInviteModal(false);
    setShowClientRemoteModal(true);
    setClientSessionSeconds(0);
  };

  const clientRejectInvitation = () => {
    // Simulate client rejecting: close modal and clear code
    setInviteGenerated(false);
    setClientInviteCode("");
    setShowClientInviteModal(false);
  };

  const clientResendInvitation = () => {
    // Resend simply regenerates or reuses code and keeps modal open
    if (!clientInviteCode) generateInviteCode();
  };

  useEffect(() => {
    if (!showClientRemoteModal) return;
    const timer = setInterval(() => setClientSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [showClientRemoteModal]);

  const sendRemoteMessageFromClient = () => {
    const text = (remoteChatInput || "").toString().trim();
    if (!text) return;
    setSupportMessages((prev) => [{ from: "client", text, time: new Date().toLocaleTimeString() }, ...prev]);
    setRemoteChatInput("");
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target.value || "").toString().trim();
                if (val) {
                  setClientInviteCode(val);
                  setInviteGenerated(true);
                  setShowClientInviteModal(true);
                }
              }
            }}
            onBlur={() => {
              const val = (remoteCode || "").toString().trim();
              if (val) {
                setClientInviteCode(val);
                setInviteGenerated(true);
                setShowClientInviteModal(true);
              }
            }}
            placeholder="Ingresa el codigo del dispositivo remoto (ej. CL-402-991-123)"
            className={cx("w-full bg-transparent outline-none text-sm", isDark ? "placeholder:text-[#8292B2]" : "placeholder:text-[#8B98B6]")}
          />
        </div>
        <button onClick={() => {
            const val = (remoteCode || "").toString().trim();
            if (val) {
              setClientInviteCode(val);
              setInviteGenerated(true);
            }
            setShowClientInviteModal(true);
          }} className="h-11 px-4 rounded-xl bg-[#7F00FF] hover:bg-[#5E00CC] text-white text-sm font-medium">
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
        </div>
      </article>

      {/* Acciones rápidas: Llamada / Videollamada / Invitación */}
      <article className={cx("rounded-3xl border p-5 md:p-6", ui.frame)}>
        <p className={cx("text-sm font-semibold", ui.textMain)}>Acciones rápidas</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowClientCallModal(true)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-white transition-transform transform hover:-translate-y-0.5"
            style={{ backgroundColor: "#16A34A" }}
            aria-label="Llamada"
          >
            <PhoneCall size={24} />
            <span className="font-semibold">Llamada</span>
            <span className="text-xs opacity-90">Canal de voz</span>
          </button>

          <button
            onClick={() => setShowClientVideoModal(true)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-white transition-transform transform hover:-translate-y-0.5"
            style={{ backgroundColor: "#1D6BFF" }}
            aria-label="Videollamada"
          >
            <Video size={24} />
            <span className="font-semibold">Videollamada</span>
            <span className="text-xs opacity-90">Canal de video</span>
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
              <button
                onClick={() => setSelectedDetail({ title: card.title, status: card.status, detail: card.detail, extra: { tone: card.tone } })}
                className="mt-4 px-3 py-1.5 text-sm rounded-lg border border-[#7F00FF]/40 text-[#DCCBFF] hover:bg-[#7F00FF]/20"
              >
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
            {/* Solo icono gancho para adjuntar archivos */}
            <div className="flex gap-2">
              <button
                onClick={() => clientFileInputRef.current?.click()}
                className={cx("h-10 w-10 rounded-lg border hover:bg-[#7F00FF]/20 flex items-center justify-center", ui.input)}
                title="Adjuntar archivos"
                aria-label="Adjuntar archivos"
              >
                <Paperclip size={16} />
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

  function DetailModal() {
    if (!selectedDetail) return null;

    const st = (selectedDetail.status || "").toLowerCase();
    let badgeColor = "#7F00FF";
    if (["listo", "exito", "éxito", "activa", "activo", "estable", "éxito"].some((k) => st.includes(k))) badgeColor = "#10b981";
    else if (["pendiente", "progreso", "progres"].some((k) => st.includes(k))) badgeColor = "#f59e0b";
    else if (["nuevo", "recomendado", "recom"].some((k) => st.includes(k))) badgeColor = "#3b82f6";
    else if (["cerrado", "error"].some((k) => st.includes(k))) badgeColor = "#ef4444";

    const headerGradient = isDark
      ? "linear-gradient(135deg,#2b2443 0%,#1b1130 100%)"
      : "linear-gradient(135deg,#667eea 0%,#764ba2 100%)";

    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" onClick={() => setSelectedDetail(null)}>
        <div className="absolute inset-0 bg-black/60" />

        <style>{`
          @keyframes fadeInZoom { from { opacity: 0; transform: scale(.98); } to { opacity: 1; transform: scale(1); } }
        `}</style>

        <div
          role="dialog"
          aria-modal="true"
          className={cx("relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden z-[1000]")}
          style={{ animation: "fadeInZoom .18s ease-out", background: isDark ? undefined : undefined }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ background: headerGradient }} className="px-6 py-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileUp size={24} className="text-white" />
              <div>
                <h3 className="text-white text-xl font-bold tracking-tight">{selectedDetail.title}</h3>
                <p className="text-white/80 text-xs">Detalle</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="h-9 w-9 rounded-full flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)' }}
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          <div className="p-6 space-y-4" style={{ background: isDark ? undefined : undefined }}>
            <div className={cx("rounded-lg p-4", ui.soft)}>
              <p className={cx("text-xs uppercase", ui.textSub)}>Estado</p>
              <div className="mt-2 flex items-center justify-between">
                <p className={cx("font-semibold", ui.textMain)}>{selectedDetail.status}</p>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: badgeColor, color: '#fff' }}>{selectedDetail.status}</span>
              </div>
            </div>

            <div className={cx("rounded-lg p-4", ui.soft)}>
              <p className={cx("text-xs uppercase tracking-wide", ui.textSub)}>Descripcion</p>
              <p className={cx("mt-2 text-base leading-relaxed", ui.textMain)} style={{ lineHeight: 1.6 }}>{selectedDetail.detail}</p>
            </div>

            {selectedDetail.extra && (
              <div className={cx("rounded-lg p-4", ui.soft)}>
                <p className={cx("text-xs uppercase tracking-wide", ui.textSub)}>Informacion adicional</p>
                {typeof selectedDetail.extra === 'string' ? (
                  <p className={cx("mt-2 text-base leading-relaxed", ui.textMain)} style={{ lineHeight: 1.6 }}>{selectedDetail.extra}</p>
                ) : Array.isArray(selectedDetail.extra) ? (
                  <ul className={cx("mt-2 list-disc pl-5", ui.textMain)}>
                    {selectedDetail.extra.map((it, i) => (
                      <li key={i} className="text-sm">{typeof it === 'object' ? JSON.stringify(it) : String(it)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className={cx("mt-2 space-y-1 text-sm", ui.textMain)}>
                    {Object.entries(selectedDetail.extra).map(([k, v]) => (
                      <div key={k} className="flex gap-2 items-start">
                        <div className="font-medium text-sm" style={{ minWidth: 120 }}>{k}:</div>
                        <div className="text-sm">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              {[{ label: 'Seguro', emoji: '🛡️' }, { label: 'En tiempo real', emoji: '⚡' }, { label: 'Verificado', emoji: '✅' }].map((b) => (
                <span
                  key={b.label}
                  className={cx("px-3 py-1 rounded-full text-xs font-medium", ui.card)}
                  style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#F3F4F6', color: isDark ? '#E5EBFF' : '#1B2642' }}
                >
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => setSelectedDetail(null)}
              className="w-full py-3 rounded-2xl text-white font-semibold"
              style={{ background: 'linear-gradient(90deg,#7F00FF,#5E00CC)', transition: 'opacity .12s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.95')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <main className="flex-1 p-4 md:p-6 space-y-4 role-main h-full overflow-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
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
      {showClientInviteModal && (
        <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[calc(100vh-48px)] rounded-2xl border shadow-2xl overflow-y-auto" style={{ background: isDark ? '#0B1220' : '#FFFFFF', borderColor: isDark ? '#27324B' : '#D1D1D1' }}>
            <div className={cx("px-5 py-4 border-b flex items-center justify-between", ui.input)}>
              <div>
                <p className={cx("text-xs uppercase tracking-wider", ui.textSub)}>Invitación remota</p>
                <h3 className={cx("text-xl font-semibold", ui.textMain)}>Esperando respuesta del cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClientInviteModal(false)}
                className="h-9 w-9 rounded-lg border flex items-center justify-center"
                style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0">
              <section className="p-5 border-r" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6' }}>
                <div className="rounded-xl border p-4" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#F9FAFE' }}>
                  <p className={cx("text-xs uppercase tracking-wide", ui.textSub)}>Cliente destino</p>
                  <p className="text-3xl font-black mt-1 text-[#7F00FF]">{clientInviteCode || connectionCode}</p>
                  <p className={cx("text-sm mt-2", ui.textSub)}>
                    La solicitud fue enviada. El tecnico espera confirmación del cliente para compartir pantalla, teclado y mouse.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#FFFFFF' }}>
                    <Monitor size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Pantalla</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#FFFFFF' }}>
                    <Keyboard size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Teclado</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#FFFFFF' }}>
                    <MousePointer2 size={16} className="mx-auto mb-1 text-[#7F00FF]" />
                    <p className="text-xs" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Mouse</p>
                  </div>
                </div>
              </section>

              <section className="p-5">
                <p className="text-sm font-semibold" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Estado de invitación</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#FFFFFF', color: isDark ? '#E5EBFF' : '#1B2642' }}>
                    1. Invitación enviada correctamente
                  </div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: isDark ? '#27324B' : '#E6E6E6', background: isDark ? '#0D1426' : '#FFFFFF', color: isDark ? '#E5EBFF' : '#1B2642' }}>
                    2. Esperando confirmación del cliente...
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={clientAcceptInvitation} className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#7F00FF', color: '#FFFFFF' }}>
                    Simular aceptar
                  </button>
                  <button onClick={clientRejectInvitation} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642', background: isDark ? '#0D1426' : '#FFFFFF' }}>
                    Simular rechazar
                  </button>
                  <button onClick={clientResendInvitation} className="px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }}>
                    Reenviar invitación
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      {showClientRemoteModal && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm p-3 md:p-6">
          <div className="h-full w-full max-w-[1200px] max-h-[calc(100vh-24px)] mx-auto rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', background: isDark ? '#071023' : '#0B1220' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: isDark ? '#1E2638' : '#E6E6E6' }}>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className={cx("text-sm", isDark ? "text-white" : "text-[#1B2642]")}>Control remoto activo · Cliente {clientInviteCode || connectionCode.replace('TR-','').replace(/-/g,'')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-[#7F00FF]/30 text-[#DCCBFF]">{new Date(clientSessionSeconds * 1000).toISOString().substr(14,5)}</span>
                <button onClick={() => setShowClientRemoteModal(false)} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">Finalizar</button>
              </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_320px]">
              <section className="relative border-r border-[#1E2638] bg-[#0D1320]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(127,0,255,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(29,107,255,0.08),transparent_40%)]" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-[92%] h-[85%] rounded-xl border border-[#2B3752] bg-[#08101a] shadow-inner flex items-center justify-center text-center p-6">
                    <div>
                      <Monitor size={56} className="mx-auto text-[#7F00FF]" />
                      <p className="text-lg text-[#E5EBFF] mt-3 font-semibold">Vista de escritorio remoto</p>
                      <p className="text-sm text-[#9EABC8] mt-2">Aquí se renderiza la pantalla y el técnico controla mouse/teclado.</p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="p-4 flex flex-col gap-4 min-h-0 overflow-y-auto" style={{ background: isDark ? '#071022' : '#0B1220' }}>
                <div className="rounded-xl border p-3" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1' }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: isDark ? '#9EABC8' : '#617094' }}>Herramientas rápidas</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <button className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }}>Multi monitor</button>
                    <button className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }}>Enviar archivo</button>
                    <button className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }}>Descargar</button>
                  </div>
                </div>

                <div className="rounded-xl border p-3" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1' }}>
                  <p className="text-sm font-semibold" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Canal de sesión</p>
                  <div className="mt-2 space-y-1 text-xs" style={{ color: isDark ? '#9EABC8' : '#617094' }}>
                    <p className="flex items-center gap-2"><Wifi size={13} /> Latencia estable (24ms)</p>
                    <p className="flex items-center gap-2"><ShieldCheck size={13} /> Cifrado extremo a extremo</p>
                    <p className="flex items-center gap-2"><Clock3 size={13} /> Inicio: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="rounded-xl border p-3 flex flex-col" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: isDark ? '#E5EBFF' : '#1B2642' }}>Chat con técnico</p>

                  <div className="flex-1 overflow-y-auto space-y-2 mb-3 py-1">
                    {supportMessages.slice(0, 8).map((m, i) => (
                      <div key={`${m.time}-${i}`} className={`rounded-lg px-2 py-1.5 text-xs max-w-full ${m.from === 'client' ? 'ml-auto bg-[#7F00FF] text-white' : `${isDark ? 'bg-[#0D1426] text-[#E5EBFF]' : 'bg-[#F1F4FC] text-[#1B2642]'}`}`}>
                        <p className="leading-tight break-words">{m.text}</p>
                        <p className="text-[10px] mt-1 opacity-70">{m.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button onClick={() => clientFileInputRef.current?.click()} className="h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0" style={{ borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }} title="Adjuntar archivo">
                      <Paperclip size={16} />
                    </button>
                    <input aria-hidden="true" type="file" multiple className="hidden" />
                    <input value={remoteChatInput} onChange={(e) => setRemoteChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendRemoteMessageFromClient()} placeholder="Escribe al técnico..." className="flex-1 min-w-0 rounded-lg border px-3 py-1.5 text-sm outline-none" style={{ background: isDark ? '#071022' : '#FFFFFF', borderColor: isDark ? '#27324B' : '#D1D1D1', color: isDark ? '#E5EBFF' : '#1B2642' }} />
                    <button onClick={sendRemoteMessageFromClient} className="w-12 h-9 rounded-lg bg-[#7F00FF] text-white flex items-center justify-center flex-shrink-0">Enviar</button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
      <DetailModal />
    </div>
  );
}

export default Dashboard;
