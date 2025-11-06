// Importo axios para realizar las peticiones HTTP al backend
import axios from "axios";

/**
 * Servicio API de TechRepair
 * ----------------------------
 * En este archivo yo centralizo todas las peticiones hacia el backend.
 * Así evito repetir código en cada componente y puedo modificar la
 * dirección del servidor desde un solo lugar.
 */

// Defino la URL base del backend (ajusto el puerto según mi configuración Spring Boot)
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Creo una instancia de Axios
 * ----------------------------
 * Esto me permite configurar cabeceras y opciones globales para todas
 * las peticiones de manera sencilla.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Función para obtener todas las conexiones registradas
 * (por ejemplo, si el backend devuelve una lista de clientes o dispositivos)
 */
export const getConnections = async () => {
  try {
    const response = await api.get("/connections");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener las conexiones:", error);
    throw error;
  }
};

/**
 * Función para registrar una nueva conexión
 */
export const createConnection = async (connectionData) => {
  try {
    const response = await api.post("/connections", connectionData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la conexión:", error);
    throw error;
  }
};

/**
 * Función para eliminar o finalizar una conexión
 */
export const deleteConnection = async (id) => {
  try {
    const response = await api.delete(`/connections/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar la conexión:", error);
    throw error;
  }
};

/**
 * Función para obtener el historial de conexiones
 */
export const getHistory = async () => {
  try {
    const response = await api.get("/history");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el historial:", error);
    throw error;
  }
};

/**
 * Función para actualizar configuraciones del sistema
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put("/settings", settingsData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar configuraciones:", error);
    throw error;
  }
};

/**
 * Exporto la instancia principal por si necesito
 * hacer peticiones personalizadas en otros módulos
 */
export default api;
