import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Newspaper, RefreshCw, Save, ShieldCheck } from "lucide-react";
import technicalNewsService from "../../services/technicalNewsService";

const cx = (...values) => values.filter(Boolean).join(" ");

const formatNewsDate = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function TechnicalNewsPanel({
  active,
  theme,
  accentColor = "#7F00FF",
  accentHoverColor = "#5E00CC",
  cardClassName,
  roleLabel,
  accessId,
}) {
  const [form, setForm] = useState({ titulo: "", contenido: "" });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const stats = useMemo(() => {
    const latest = news[0];
    return [
      {
        label: "Noticias registradas",
        value: String(news.length),
        helper: "Listado integrado al dashboard",
      },
      {
        label: "Última publicación",
        value: latest ? formatNewsDate(latest.fecha) : "Pendiente",
        helper: latest ? latest.titulo : "Aún no hay noticias",
      },
      {
        label: "Control de acceso",
        value: roleLabel,
        helper: `ID autorizado ${accessId}`,
      },
    ];
  }, [accessId, news, roleLabel]);

  const loadNews = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);

    try {
      const data = await technicalNewsService.list();
      setNews(data);
      setBootstrapped(true);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "No fue posible cargar las noticias técnicas desde el backend.",
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!active || bootstrapped) return;
    loadNews();
  }, [active, bootstrapped]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim() || !form.contenido.trim()) {
      setFeedback({
        type: "error",
        message: "Completa título y contenido.",
      });
      return;
    }

    setSaving(true);

    try {
      const created = await technicalNewsService.create(form);
      setNews((prev) => [created, ...prev]);
      setForm({ titulo: "", contenido: "" });
      setFeedback({ type: "success", message: "Noticia guardada correctamente." });
    } catch {
      setFeedback({
        type: "error",
        message: "Error al guardar en backend.",
      });
    } finally {
      setSaving(false);
    }
  };

  const frameStyle = { backgroundColor: theme.card, borderColor: theme.border };
  const panelStyle = { backgroundColor: theme.panel, borderColor: theme.border };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-4">

      {/* HEADER */}
      <section className="rounded-2xl border p-6 mb-6" style={frameStyle}>
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

          <div>
            <h2 className="flex items-center gap-3 text-2xl font-semibold" style={{ color: theme.text }}>
              <span className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
                <Newspaper size={20} />
              </span>
              Noticias técnicas
            </h2>
            <p className="text-sm mt-2" style={{ color: theme.sub }}>
              Gestión de novedades técnicas del sistema.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {stats.map((s) => (
              <div key={s.label} className="p-3 rounded-xl border text-center" style={panelStyle}>
                <p className="text-xs" style={{ color: theme.sub }}>{s.label}</p>
                <p className="font-semibold" style={{ color: theme.text }}>{s.value}</p>
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

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* FORMULARIO */}
        <section className="lg:col-span-2 rounded-2xl border p-6 shadow" style={frameStyle}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
            Nueva noticia
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Título"
              className="w-full p-3 rounded-lg border"
              style={panelStyle}
            />

            <textarea
              name="contenido"
              value={form.contenido}
              onChange={handleChange}
              rows={6}
              placeholder="Contenido"
              className="w-full p-3 rounded-lg border"
              style={panelStyle}
            />

            <button
              disabled={saving}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ backgroundColor: accentColor }}
            >
              {saving ? "Guardando..." : "Guardar noticia"}
            </button>

          </form>
        </section>

        {/* LISTADO */}
        <section className="lg:col-span-3 rounded-2xl border shadow overflow-hidden" style={frameStyle}>

          <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: theme.border }}>
            <h3 className="font-semibold" style={{ color: theme.text }}>
              Listado de noticias
            </h3>

            <button onClick={loadNews} className="text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Actualizar
            </button>
          </div>

          <div className="p-4 space-y-3">
            {!loading && news.length === 0 && (
              <p style={{ color: theme.sub }}>No hay noticias registradas.</p>
            )}

            {loading && <p>Cargando...</p>}

            {news.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border" style={panelStyle}>
                <h4 className="font-semibold">{n.titulo}</h4>
                <p className="text-sm mt-1" style={{ color: theme.sub }}>
                  {n.contenido}
                </p>
                <span className="text-xs block mt-2" style={{ color: theme.sub }}>
                  {formatNewsDate(n.fecha)}
                </span>
              </div>
            ))}
          </div>

        </section>

      </div>
    </div>
  );
}

export default TechnicalNewsPanel;