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
    sortOrder: "desc",
    noteType: "active",
  });
  const [localSearch, setLocalSearch] = useState(filterState.search);
  const [isOpenNoteModal, setIsOpenNoteModal] = useState<boolean>(false);
  const [isOpenTagModal, setIsOpenTagModal] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deletingNoteTagIds, setDeletingNoteTagIds] = useState<
    Map<string, string[]>
  >(new Map());

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
    onSuccess: (newNote) => {
      queryClient.setQueryData(["get_notes", filterState], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData?.pages.map((page: any, index: number) => {
          if (index === 0) {
            return {
              ...page,
              result: [newNote, ...page.result],
              total: (page.total || 0) + 1, // increment total if exists
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    },
    onError: (error: any) => {
      console.error(
        "Note creation failed:",
        error.response?.data?.result?.message || error.message,
      );
    },
    onSettled: () => {
      closeNoteModal();
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      notesAPI.updateNote(id, payload),
    onSuccess: (updatedNote, { id }) => {
      queryClient.setQueryData(["get_notes", filterState], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            result: page.result.map((note: any) =>
              note._id === id ? updatedNote : note,
            ),
          })),
        };
      });
    },
    onError: (error: any) => {
      console.error(
        "Note updation failed:",
        error.response?.data?.result?.message || error.message,
      );
    },
    onSettled: () => {
      closeNoteModal();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: notesAPI.deleteNote,
    onSuccess: (_, { id }) => {
      queryClient.setQueryData(["get_notes", filterState], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            result: page.result.filter((note: any) => note._id !== id),
            total: Math.max((page.total || 0) - 1, 0),
          })),
        };
      });
    },
    onError: (error: any) => {
      console.error(
        "Note deletion failed:",
        error.response?.data?.result?.message || error.message,
      );
    },
  });

  const createTagMutation = useMutation({
    mutationFn: notesAPI.createTag,
    onSuccess: (newTag) => {
      queryClient.setQueryData(["get_tags"], (oldData: any) => {
        if (!oldData) return oldData;
        return [newTag, ...oldData]?.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });
    },
    onError: (error: any) => {
      console.error(
        "Tag creation failed:",
        error.response?.data?.result?.message || error.message,
      );
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      notesAPI.editTag(id, payload),
    onSuccess: async (newTag) => {
      await Promise.all([
        queryClient.setQueryData(["get_tags"], (oldData: any) => {
          if (!oldData) return oldData;

          return oldData.map((tag: any) =>
            tag._id === newTag._id ? newTag : tag,
          );
        }),
        queryClient.invalidateQueries({
          queryKey: ["get_notes", filterState],
        }),
      ]);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: notesAPI.deleteTag,
    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.setQueryData(["get_tags"], (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.filter((tag: any) => tag._id !== id);
        }),
        queryClient.invalidateQueries({ queryKey: ["get_notes", filterState] }),
      ]);
    },
  });

  // const removeNoteTagMutation = useMutation({
  //   mutationFn: notesAPI.removeNoteTag,
  //   onMutate: ({ payload: { tagId } }) => {
  //     setDeletingNoteTagIds((prev) => new Set([...prev, String(tagId)]));
  //   },
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: ["get_notes", filterState],
  //     });
  //   },
  //   onSettled: (_, __, { payload: { tagId } }) => {
  //     setDeletingNoteTagIds((prev) => {
  //       const next = new Set(prev);
  //       next.delete(String(tagId));
  //       return next;
  //     });
  //   },
  // });

  const removeNoteTagMutation = useMutation({
    mutationFn: notesAPI.removeNoteTag,
    onMutate: ({ id: noteId, payload: { tagId } }) => {
      const tid = String(tagId);
      const nid = String(noteId);

      setDeletingNoteTagIds((prevMap) => {
        const newMap = new Map(prevMap);
        const existingTags = newMap.get(nid) || [];

        // Add tagId to the array for this specific note
        newMap.set(nid, [...existingTags, tid]);
        return newMap;
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get_notes", filterState],
      });
    },
    onSettled: (_, __, { id: noteId, payload: { tagId } }) => {
      const tid = String(tagId);
      const nid = String(noteId);

      setDeletingNoteTagIds((prevMap) => {
        const newMap = new Map(prevMap);
        const existingTags = newMap.get(nid) || [];

        // Filter out the tag that just finished deleting
        const updatedTags = existingTags.filter((id) => id !== tid);

        if (updatedTags.length === 0) {
          newMap.delete(nid); // Clean up the key if no tags are left deleting
        } else {
          newMap.set(nid, updatedTags);
        }

        return newMap;
      });
    },
  });

  const restoreNoteMutation = useMutation({
    mutationFn: notesAPI.restoreNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_notes", filterState],
      });
    },
  });

  const deleteNoteFromTrashMutation = useMutation({
    mutationFn: notesAPI.deleteNoteFromTrash,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_notes", filterState],
      });
    },
  });

  const emptyTrashMutation = useMutation({
    mutationFn: notesAPI.emptyTrash,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get_notes", filterState],
      });
    },
  });

  const archiveNoteMutation = useMutation({
    mutationFn: notesAPI.archiveNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_notes"] });
    },
  });

  const unarchiveNoteMutation = useMutation({
    mutationFn: notesAPI.unarchiveNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_notes"] });
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
    archiveNoteMutation,
    unarchiveNoteMutation,
    restoreNoteMutation,
    deleteNoteFromTrashMutation,
    emptyTrashMutation,
    removeNoteTagMutation,
    deletingNoteTagIds,
  };
};
