import type { ApiResponse } from "../../types/api.types";
import type { Note, NotesResponse } from "../../types/note.types";
import apiClient from "../axios.config";

export const notesAPI = {
  getNotes: async (params: any) => {
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
  createTag: async (payload: any) => {
    console.log("payload :>> ", payload);
    const response = await apiClient.post("/tags", payload);
    return response.data.result;
  },
  editTag: async (id: string, payload: any) => {
    const response = await apiClient.patch(`/tags/${id}`, payload);
    return response.data.result;
  },
  deleteTag: async ({ id }: { id: string }) => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data.result;
  },
};
