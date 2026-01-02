import { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { notesAPI } from "../api/endpoints/notes.api";
import type {
  Note,
  NoteFilterState,
  NotesResponse,
  NoteType,
} from "../types/note.types";
import { useDebounce } from "../utils/useDebounce";

type NoteQueryKey = ["get_notes", NoteFilterState];

export const useNotes = ({
  enabled = false,
  limit = 10,
}: {
  enabled: boolean;
  limit?: number;
}) => {
  const queryClient = useQueryClient();

  const [filterState, setFilterState] = useState<NoteFilterState>({
    limit,
    search: "",
    tagId: null,
    sortBy: "orderIndex",
    sortOrder: "asc",
    noteType: "active",
  });
  const [localSearch, setLocalSearch] = useState(filterState.search);
  const [isOpenNoteModal, setIsOpenNoteModal] = useState<boolean>(false);
  const [isOpenTagModal, setIsOpenTagModal] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== filterState.search) {
      setFilterState((prev) => ({
        ...prev,
        search: debouncedSearch,
      }));
    }
  }, [debouncedSearch, filterState.search]);

  const openNoteModal = (note?: Note | null) => {
    setSelectedNote(note || null);
    setIsOpenNoteModal(true);
  };

  const closeNoteModal = () => {
    setIsOpenNoteModal(false);
    setSelectedNote(null);
  };

  const openTagModal = () => {
    setIsOpenTagModal(true);
  };

  const closeTagModal = () => {
    setIsOpenTagModal(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value;
    setLocalSearch(newSearchValue);
    // If the user starts typing, immediately clear the selected tag.
    if (newSearchValue !== "" && filterState.tagId !== null) {
      setFilterState((prev) => ({
        ...prev,
        tagId: null,
      }));
    }
  };

  const handleTagSelect = (tagId: string) => {
    const newSelectedTagId = filterState.tagId === tagId ? null : tagId;

    setFilterState((prev) => ({
      ...prev,
      tagId: newSelectedTagId,
      search: "",
      noteType: "active",
    }));

    setLocalSearch("");
  };

  const handleNoteType = (type: string) => {
    setFilterState((prev) => ({
      ...prev,
      noteType: type as NoteType,
      tagId: null,
    }));
  };

  const notes = useInfiniteQuery<
    NotesResponse, // TQueryFnData: Single page data type
    Error, // TError
    InfiniteData<NotesResponse, number>, // TData: The CORRECT type for the 'data' property
    NoteQueryKey, // TQueryKey
    number // TPageParam
  >({
    queryKey: ["get_notes", filterState],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1, queryKey }) => {
      // Destructure the filter state from the second element of the queryKey
      const [, filters] = queryKey;
      return notesAPI.getNotes({
        page: pageParam,
        ...filters,
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

  const {
    data: tags,
    isLoading: isLoadingTagsList,
    isFetching: isFetchingTags,
  } = useQuery({
    queryKey: ["get_tags"],
    queryFn: notesAPI.getTags,
    enabled: enabled,
  });

  const createNoteMutation = useMutation({
    mutationFn: notesAPI.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
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
      queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
    },
    onSettled: () => {
      closeNoteModal();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: notesAPI.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: notesAPI.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
    },
    onError: (error: any) => {
      console.error(
        "Tag creation failed:",
        error.response?.data?.result?.message || error.message
      );
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      notesAPI.editTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: notesAPI.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] });
      queryClient.invalidateQueries({ queryKey: ["get_tags"] });
    },
  });

  return {
    notes,
    tags,
    isLoadingTags: isLoadingTagsList || isFetchingTags,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
    selectedNote,
    handleSearchChange,
    handleTagSelect,
    filterState,
    localSearch,
    isOpenTagModal,
    openTagModal,
    closeTagModal,
    handleNoteType,
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
};
