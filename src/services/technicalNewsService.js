import axios from "axios";
import apiClient from "./api";

const NEWS_SERVLET_PATH = "/evidencia-noticias";
const DEFAULT_NEWS_ENDPOINTS = ["/noticias-tecnicas", "/technical-news", "/news/technical"];

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
        return servletNews;
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    return [];
  },

  async create(payload) {
    const body = {
      titulo: String(payload?.titulo || "").trim(),
      contenido: String(payload?.contenido || "").trim(),
    };
    return await requestServletCreate(body);
  },

  async update(id, payload) {
    const body = {
      titulo: String(payload?.titulo || "").trim(),
      contenido: String(payload?.contenido || "").trim(),
    };
    const response = await apiClient.put(`/evidencia-noticias/${id}`, body);
    return normalizeNewsItem(response.data);
  },

  async delete(id) {
    const response = await apiClient.delete(`/evidencia-noticias/${id}`);
    return response.data;
  },
};

export default technicalNewsService;