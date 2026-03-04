import apiClient from "./api";

const remoteSessionService = {
  async getMessages(sessionId) {
    const response = await apiClient.get(`/remote/sessions/${sessionId}/messages`);
    return response.data;
  },

  async sendMessage(sessionId, payload) {
    const response = await apiClient.post(`/remote/sessions/${sessionId}/messages`, payload);
    return response.data;
  },

  async getFiles(sessionId) {
    const response = await apiClient.get(`/remote/sessions/${sessionId}/files`);
    return response.data;
  },

  async uploadFile(sessionId, file, senderName, senderRole) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderName", senderName || "Tecnico");
    formData.append("senderRole", senderRole || "tech");

    const response = await apiClient.post(`/remote/sessions/${sessionId}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

export default remoteSessionService;
