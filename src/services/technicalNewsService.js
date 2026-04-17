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
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }

  return "http://localhost:8080";
};

const getNewsServletUrl = () => {
  const origin = resolveBackendOrigin();
  return `${origin}${NEWS_SERVLET_PATH}`;
};

const getCandidateEndpoints = () => {
  const envEndpoint = normalizeEndpoint(import.meta.env.VITE_TECHNICAL_NEWS_ENDPOINT);
  return [...new Set([envEndpoint, ...DEFAULT_NEWS_ENDPOINTS].filter(Boolean))];
};

const extractNewsList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.noticias)) return payload.noticias;
  if (Array.isArray(payload?.news)) return payload.news;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeNewsItem = (item, index = 0) => ({
  id: item?.id ?? item?.noticiaId ?? item?.newsId ?? `technical-news-${index}`,
  titulo: item?.titulo ?? item?.title ?? item?.nombre ?? "Sin titulo",
  contenido: item?.contenido ?? item?.content ?? item?.descripcion ?? "",
  fecha:
    item?.fechaPublicacion ??
    item?.fechaCreacion ??
    item?.createdAt ??
    item?.updatedAt ??
    item?.fecha ??
    null,
  autor: item?.autor ?? item?.author ?? item?.usuario ?? "",
  estado: item?.estado ?? item?.status ?? "Publicado",
});

const parseNewsHtml = (html) => {
  if (typeof DOMParser === "undefined" || typeof html !== "string") {
    return [];
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const rows = [...document.querySelectorAll("tbody tr")];

  return rows
    .map((row, index) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 3) return null;

      return normalizeNewsItem(
        {
          id: `legacy-news-${index + 1}`,
          titulo: cells[1]?.textContent?.trim() || "",
          contenido: cells[2]?.textContent?.trim() || "",
          estado: "Registrada",
        },
        index
      );
    })
    .filter(Boolean);
};

const requestServletList = async () => {
  const response = await axios.get(getNewsServletUrl(), {
    headers: { Accept: "text/html,application/xhtml+xml" },
  });

  return parseNewsHtml(response.data);
};

const requestServletCreate = async (body) => {
  const response = await axios.post(getNewsServletUrl(), new URLSearchParams(body).toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const parsedNews = parseNewsHtml(response.data);
  return parsedNews[parsedNews.length - 1] || normalizeNewsItem(body);
};

const requestWithFallback = async (requestFactory) => {
  const endpoints = getCandidateEndpoints();
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      return await requestFactory(endpoint);
    } catch (error) {
      lastError = error;
      if (error?.response?.status === 404) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("No se encontro un endpoint valido para noticias tecnicas.");
};

export const technicalNewsService = {
  async list() {
    try {
      const servletNews = await requestServletList();
      if (Array.isArray(servletNews)) {
        return servletNews.reverse();
      }
    } catch (error) {
      if (error?.response?.status && error.response.status !== 404) {
        throw error;
      }
    }

    const response = await requestWithFallback((endpoint) => apiClient.get(endpoint));
    return extractNewsList(response.data).map((item, index) => normalizeNewsItem(item, index));
  },

  async create(payload) {
    const body = {
      titulo: String(payload?.titulo || "").trim(),
      contenido: String(payload?.contenido || "").trim(),
    };

    try {
      return await requestServletCreate(body);
    } catch (error) {
      if (error?.response?.status && error.response.status !== 404) {
        throw error;
      }
    }

    const response = await requestWithFallback((endpoint) => apiClient.post(endpoint, body));
    return normalizeNewsItem(response?.data || body);
  },
};

export default technicalNewsService;
