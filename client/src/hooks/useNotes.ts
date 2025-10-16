import { useQuery } from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";

export const useNotes = ({ enabled = false }: { enabled: boolean }) => {
  const {
    data: notes,
    isLoading: isLoadingNotes,
    isFetching,
  } = useQuery({
    queryKey: ["get_notes"],
    queryFn: notesAPI.getNotes,
    enabled: enabled,
  });

  return {
    notes,
    isLoadingNotes: isLoadingNotes || isFetching,
  };
};
