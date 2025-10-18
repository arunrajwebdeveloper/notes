import apiClient from "../axios.config";

export const notesAPI = {
  getNotes: async () => {
    const response = await apiClient.get("/notes");
    return response.data;
  },
  getNoteById: async (id: string) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },
  getTags: async () => {
    const response = await apiClient.get("/tags");
    return response.data;
  },
  createNote: async (payload: any) => {
    const response = await apiClient.post("/notes", payload);
    return response.data;
  },
  updateNote: async (id: string, payload: any) => {
    const response = await apiClient.patch(`/notes/${id}`, payload);
    return response.data;
  },
};
