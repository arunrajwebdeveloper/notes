import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";

export const useNotes = ({ enabled = false }: { enabled: boolean }) => {
  const queryClient = useQueryClient();

  const [isOpenNoteModal, setIsOpenNoteModal] = useState<boolean>(false);

  const openNoteModal = () => {
    setIsOpenNoteModal(true);
  };

  const closeNoteModal = () => {
    setIsOpenNoteModal(false);
  };

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

  const createNoteMutation = useMutation({
    mutationFn: notesAPI.createNote,
    onSuccess: async (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["get_notes"] });
      }
    },
    onError: (error: any) => {
      console.error(
        "Note creation failed:",
        error.response?.data?.message || error.message
      );
    },
    onSettled: () => {
      closeNoteModal();
    },
  });

  return {
    notes,
    tags,
    isLoadingNotes: isLoadingNotes || isFetchingNotes,
    isLoadingTags: isLoadingTags || isFetchingTags,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
  };
};
