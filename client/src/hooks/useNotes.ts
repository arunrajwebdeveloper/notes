import { useQuery } from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";

export const useNotes = ({ enabled = false }: { enabled: boolean }) => {
  const {
    data: notes,
    isLoading: isLoadingNotes,
    isFetching: isFetchingNotes,
  } = useQuery({
    queryKey: ["get_notes"],
    queryFn: notesAPI.getNotes,
    enabled: enabled,
  });

  const {
    data: tags,
    isLoading: isLoadingTags,
    isFetching: isFetchingTags,
  } = useQuery({
    queryKey: ["get_tags"],
    queryFn: notesAPI.getTags,
    enabled: enabled,
  });

  return {
    notes,
    tags,
    isLoadingNotes: isLoadingNotes || isFetchingNotes,
    isLoadingTags: isLoadingTags || isFetchingTags,
  };
};
