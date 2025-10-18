import type { ApiResponse } from "../../types/api.types";
import type { Note, NotesResponse } from "../../types/note.types";
import apiClient from "../axios.config";

export const notesAPI = {
  getNotes: async ({
    page = 1,
    limit = 10,
    filters = {},
  }: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }) => {
    const params = { page, limit, filters };
    const response = await apiClient.get<ApiResponse<NotesResponse>>("/notes", {
      params,
    });
    return response.data.result;
  },
  getNoteById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
    return response.data.result;
  },
  getTags: async () => {
    const response = await apiClient.get("/tags");
    return response.data.result;
  },
  createNote: async (payload: any) => {
    const response = await apiClient.post("/notes", payload);
    return response.data.result;
  },
  updateNote: async (id: string, payload: any) => {
    const response = await apiClient.patch(`/notes/${id}`, payload);
    return response.data.result;
  },
};
