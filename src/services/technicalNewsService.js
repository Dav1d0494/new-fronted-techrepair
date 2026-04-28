import axios from "axios";
import apiClient from "./api";

const NEWS_SERVLET_PATH = "/evidencia-noticias";
const DEFAULT_NEWS_ENDPOINTS = ["/noticias-tecnicas", "/technical-news", "/news/technical"];
const LOCAL_STORAGE_KEY = "techrepair_technical_news";

const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return null;
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
};

const resolveBackendOrigin = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;

  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      if (parsed.pathname.endsWith("/api")) {
        parsed.pathname = parsed.pathname.slice(0, -4) || "/";
      }
      return parsed.toString().replace(/\/$/, "");
    } catch (_error) {
      return String(envUrl).replace(/\/api$/, "").replace(/\/$/, "");
    }
  }

  if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
    if (window.location.port === "5173") {
      return "";
    }
    return `${window.location.protocol}//${window.location.hostname}:8088`;
  }

  return "http://localhost:8088";
};

const getNewsServletUrl = () => {
  const origin = resolveBackendOrigin();
  return `${origin}${NEWS_SERVLET_PATH}`;
};

const normalizeNewsItem = (item, index = 0) => ({
  id: item?.id ?? item?.noticiaId ?? item?.newsId ?? `technical-news-${index}`,
  titulo: item?.titulo ?? item?.title ?? item?.nombre ?? "Sin titulo",
  contenido: item?.contenido ?? item?.content ?? item?.descripcion ?? "",
  fecha: item?.fecha ?? item?.createdAt ?? item?.fechaPublicacion ?? null,
  autor: item?.autor ?? item?.author ?? item?.usuario ?? "",
  estado: item?.estado ?? item?.status ?? "Publicado",
});

const canUseLocalStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readLocalNews = () => {
  if (!canUseLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => normalizeNewsItem(item, index));
  } catch (_error) {
    return [];
  }
};

const writeLocalNews = (news) => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(news));
};

const generateLocalNewsId = () => `technical-news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const requestServletList = async () => {
  const response = await axios.get(getNewsServletUrl(), {
    headers: { Accept: "application/json" },
  });
  return response.data.noticias || [];
};

const requestServletCreate = async (body) => {
  const response = await axios.post(getNewsServletUrl(), body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return normalizeNewsItem(response.data);
};

export const technicalNewsService = {
  async list() {
    try {
      const servletNews = await requestServletList();
      if (Array.isArray(servletNews)) {
        const normalized = servletNews.map((item, index) => normalizeNewsItem(item, index));
        writeLocalNews(normalized);
        return normalized;
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    return readLocalNews();
  },

  async create(payload) {
    const body = {
      titulo: String(payload?.titulo || "").trim(),
      contenido: String(payload?.contenido || "").trim(),
    };
    try {
      const created = await requestServletCreate(body);
      const current = readLocalNews();
      const merged = [created, ...current.filter((item) => item.id !== created.id)];
      writeLocalNews(merged);
      return created;
    } catch (error) {
      const localItem = normalizeNewsItem({
        ...body,
        id: generateLocalNewsId(),
        fecha: new Date().toISOString(),
      });
      const merged = [localItem, ...readLocalNews()];
      writeLocalNews(merged);
      return localItem;
    }
  },

  async update(id, payload) {
    const body = {
      titulo: String(payload?.titulo || "").trim(),
      contenido: String(payload?.contenido || "").trim(),
    };
    try {
      const response = await apiClient.put(`/evidencia-noticias/${id}`, body);
      const updated = normalizeNewsItem(response.data);
      const current = readLocalNews();
      const merged = current.map((item) => (String(item.id) === String(id) ? { ...item, ...updated } : item));
      writeLocalNews(merged);
      return updated;
    } catch (error) {
      const current = readLocalNews();
      const updatedLocal = current.map((item) =>
        String(item.id) === String(id) ? { ...item, ...body, fecha: item.fecha || new Date().toISOString() } : item
      );
      writeLocalNews(updatedLocal);
      const updatedItem = updatedLocal.find((item) => String(item.id) === String(id));
      if (!updatedItem) {
        throw error;
      }
      return normalizeNewsItem(updatedItem);
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/evidencia-noticias/${id}`);
      const filtered = readLocalNews().filter((item) => String(item.id) !== String(id));
      writeLocalNews(filtered);
      return response.data;
    } catch (_error) {
      const filtered = readLocalNews().filter((item) => String(item.id) !== String(id));
      writeLocalNews(filtered);
      return { deleted: true, id };
    }
  },
};

export default technicalNewsService;
