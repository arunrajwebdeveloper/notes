import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";

export const useNotes = ({ enabled = false }: { enabled: boolean }) => {
  const queryClient = useQueryClient();

  const [isOpenNoteModal, setIsOpenNoteModal] = useState<boolean>(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const openNoteModal = (noteId?: string | null) => {
    setSelectedNoteId(noteId || null);
    setIsOpenNoteModal(true);
  };

  const closeNoteModal = () => {
    setIsOpenNoteModal(false);
    setSelectedNoteId(null);
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

  const { data: noteDetails, isLoading: isLoadingNoteDetails } = useQuery({
    queryKey: ["get_note_by_id", selectedNoteId],
    queryFn: () => notesAPI.getNoteById(selectedNoteId as string),
    enabled: enabled && !!selectedNoteId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes"] });
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

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      notesAPI.updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes"] });
      queryClient.invalidateQueries({
        queryKey: ["get_note_by_id", selectedNoteId],
      });
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
    noteDetails,
    isLoadingNoteDetails,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
    updateNoteMutation,
    selectedNoteId,
  };
};
