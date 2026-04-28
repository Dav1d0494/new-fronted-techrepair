import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit2, Newspaper, RefreshCw, Save, ShieldCheck, Trash2, X } from "lucide-react";
import technicalNewsService from "../../services/technicalNewsService";

const TECH_NEWS_STORAGE_KEY = "techrepair_technical_news";

const formatNewsDate = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, theme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl border shadow-xl max-w-md w-full p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: theme.sub }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border" style={{ borderColor: theme.border, color: theme.text }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: "#ef4444" }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export function TechnicalNewsPanel({
  active,
  theme,
  accentColor = "#7F00FF",
  roleLabel = "Tecnico",
  accessId = "tech-001",
}) {
  const [form, setForm] = useState({ titulo: "", contenido: "" });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const stats = useMemo(() => {
    const latest = news[0];
    return [
      { label: "Noticias registradas", value: String(news.length) },
      { label: "Última publicación", value: latest ? formatNewsDate(latest.fecha) : "Pendiente" },
      { label: "Control de acceso", value: roleLabel },
    ];
  }, [news, roleLabel]);

  const loadNews = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await technicalNewsService.list();
      setNews(data);
      setBootstrapped(true);
    } catch {
      setFeedback({ type: "error", message: "No fue posible cargar las noticias técnicas desde el backend." });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!active || bootstrapped) return;
    loadNews();
  }, [active, bootstrapped]);

  useEffect(() => {
    if (!active) return undefined;

    const onStorageChange = (event) => {
      if (event.key !== TECH_NEWS_STORAGE_KEY) return;
      loadNews({ silent: true });
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [active]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setFeedback({ type: "error", message: "Completa título y contenido." });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const updated = await technicalNewsService.update(editing.id, form);
        setNews((prev) => prev.map((n) => (n.id === editing.id ? updated : n)));
        setFeedback({ type: "success", message: "Noticia actualizada correctamente." });
        setEditing(null);
      } else {
        const created = await technicalNewsService.create(form);
        setNews((prev) => [created, ...prev]);
        setFeedback({ type: "success", message: "Noticia guardada correctamente." });
      }
      setForm({ titulo: "", contenido: "" });
    } catch {
      setFeedback({ type: "error", message: editing ? "Error al actualizar." : "Error al guardar en backend." });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ titulo: item.titulo, contenido: item.contenido });
    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm({ titulo: "", contenido: "" });
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    setDeleting(id);
    try {
      await technicalNewsService.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      setFeedback({ type: "success", message: "Noticia eliminada correctamente." });
      if (editing?.id === id) {
        setEditing(null);
        setForm({ titulo: "", contenido: "" });
      }
    } catch {
      setFeedback({ type: "error", message: "Error al eliminar la noticia." });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, id: null });
  };

  const frameStyle = { backgroundColor: theme.card, borderColor: theme.border };
  const panelStyle = { backgroundColor: theme.panel, borderColor: theme.border };

  return (
    <div className="w-full h-full px-4 md:px-6 py-4 overflow-auto">

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Confirmar eliminación"
        message="¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer."
        theme={theme}
      />

      {/* HEADER - Responsive */}
      <section className="rounded-2xl border p-4 md:p-6 mb-4 md:mb-6" style={frameStyle}>
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h2 className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-semibold" style={{ color: theme.text }}>
              <span className="p-2 md:p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
                <Newspaper size={18} className="md:size-5" />
              </span>
              Noticias técnicas
            </h2>
            <p className="text-xs md:text-sm mt-1 md:mt-2" style={{ color: theme.sub }}>
              Gestión de novedades técnicas del sistema.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 w-full lg:w-auto">
            {stats.map((s) => (
              <div key={s.label} className="p-2 md:p-3 rounded-xl border text-center" style={panelStyle}>
                <p className="text-xs" style={{ color: theme.sub }}>{s.label}</p>
                <p className="font-semibold text-sm md:text-base" style={{ color: theme.text }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALERT */}
      {feedback.message && (
        <div className="mb-4 p-3 rounded-xl flex gap-2 text-sm border"
          style={{
            background: feedback.type === "error" ? "#7f1d1d33" : "#14532d33",
            borderColor: feedback.type === "error" ? "#7f1d1d" : "#14532d",
            color: theme.text,
          }}>
          {feedback.type === "error" ? <AlertCircle size={16} /> : <ShieldCheck size={16} />}
          {feedback.message}
        </div>
      )}

      {/* GRID PRINCIPAL - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

        {/* FORMULARIO */}
        <section className="lg:col-span-2 rounded-2xl border p-4 md:p-6 shadow" style={frameStyle}>
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center justify-between" style={{ color: theme.text }}>
            <span>{editing ? "Editar noticia" : "Nueva noticia"}</span>
            {editing && (
              <button onClick={handleCancelEdit} style={{ color: theme.sub }} title="Cancelar edición">
                <X size={18} />
              </button>
            )}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" className="w-full p-2 md:p-3 rounded-lg border text-sm" style={panelStyle} />
            <textarea name="contenido" value={form.contenido} onChange={handleChange} rows={5} placeholder="Contenido" className="w-full p-2 md:p-3 rounded-lg border text-sm" style={panelStyle} />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="flex-1 py-2 md:py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                style={{ backgroundColor: editing ? "#3b82f6" : accentColor }}>
                <Save size={16} />
                {saving ? "Guardando..." : editing ? "Actualizar" : "Guardar"}
              </button>
              {editing && (
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 md:py-3 rounded-xl border text-sm" style={{ borderColor: theme.border, color: theme.text }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTADO */}
        <section className="lg:col-span-3 rounded-2xl border shadow overflow-hidden" style={frameStyle}>
          <div className="flex justify-between items-center p-3 md:p-4 border-b" style={{ borderColor: theme.border }}>
            <h3 className="font-semibold text-sm md:text-base" style={{ color: theme.text }}>Listado de noticias</h3>
            <button onClick={loadNews} className="text-xs md:text-sm flex items-center gap-1 md:gap-2" style={{ color: theme.sub }}>
              <RefreshCw size={14} /> Actualizar
            </button>
          </div>
          <div className="p-3 md:p-4 space-y-2 md:space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto">
            {!loading && news.length === 0 && <p className="text-sm" style={{ color: theme.sub }}>No hay noticias registradas.</p>}
            {loading && <p className="text-sm" style={{ color: theme.sub }}>Cargando...</p>}
            {news.map((n) => (
              <div key={n.id} className="p-3 md:p-4 rounded-xl border relative group" style={panelStyle}>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(n)} className="p-1.5 rounded-lg hover:bg-black/10" style={{ color: "#3b82f6" }} title="Editar">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteClick(n.id)} disabled={deleting === n.id} className="p-1.5 rounded-lg hover:bg-black/10" style={{ color: "#ef4444" }} title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
                <h4 className="font-semibold text-sm md:text-base pr-16" style={{ color: theme.text }}>{n.titulo}</h4>
                <p className="text-xs md:text-sm mt-1" style={{ color: theme.sub }}>{n.contenido}</p>
                <span className="text-xs block mt-2" style={{ color: theme.sub }}>{formatNewsDate(n.fecha)}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default TechnicalNewsPanel;
