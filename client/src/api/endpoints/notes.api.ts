import apiClient from "../axios.config";

export const notesAPI = {
  getNotes: async () => {
    const response = await apiClient.get("/notes");
    return response.data;
  },
};
