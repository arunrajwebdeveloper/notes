import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";
import type { NotesResponse } from "../types/note.types";

type NoteQueryKey = ["get_notes", { limit: number }];

export const useNotes = ({
  enabled = false,
  limit = 10,
}: {
  enabled: boolean;
  limit?: number;
}) => {
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

  const notes = useInfiniteQuery<
    NotesResponse, // TQueryFnData: Single page data type
    Error, // TError
    InfiniteData<NotesResponse, number>, // TData: The CORRECT type for the 'data' property
    NoteQueryKey, // TQueryKey
    number // TPageParam
  >({
    queryKey: ["get_notes", { limit }],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1, queryKey }) => {
      const [, { limit: queryLimit }] = queryKey;
      return notesAPI.getNotes({
        page: pageParam,
        limit: queryLimit,
      });
    },

    getNextPageParam: (lastPage: NotesResponse) => {
      if (lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    // staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: ["get_notes", { limit }] });
    },
    onError: (error: any) => {
      console.error(
        "Note creation failed:",
        error.response?.data?.result?.message || error.message
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
      queryClient.invalidateQueries({ queryKey: ["get_notes", { limit }] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
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
