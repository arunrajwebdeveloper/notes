import type { InfiniteData } from "@tanstack/react-query";
import type {
  Note,
  NoteFilterState,
  NotesResponse,
} from "../../types/note.types";
import NoteItem from "./NoteItem";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Used for scroll detection
import { Trash2 } from "lucide-react";

export interface BaseProps {
  onEdit: (id: string) => void;
  filterState: NoteFilterState;
}
export interface InfiniteMatchListProps extends BaseProps {
  data: InfiniteData<NotesResponse, number> | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

function NoteList({
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onEdit,
  filterState,
}: InfiniteMatchListProps) {
  // Intersection Observer Hook
  const { ref, inView } = useInView();

  // Auto-fetch logic
  useEffect(() => {
    // If the sentinel element is visible, there's a next page, and we're not currently fetching
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the array of pages into a single array of notes
  const allNotes: Note[] =
    data?.pages?.flatMap((page: any) => page.result) || [];

  const pageTitle =
    {
      active: "My Notes",
      archive: "Archive",
      trash: "Trash",
    }[filterState?.noteType] || "My Notes";

  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error.message}
      </div>
    );
  }

  return (
    <div className=" mt-8 md:mt-10 mb-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-medium text-4xl xl:text-5xl m-0">{pageTitle}</h1>
        {filterState?.noteType === "trash" && allNotes.length && (
          <button className="flex items-center gap-3 text-blue-500 bg-blue-50 h-10 cursor-pointer px-4 rounded-lg text-sm">
            <Trash2 size={20} />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {isLoading && allNotes.length === 0 && (
        <div className="mt-10 animate-pulse flex flex-col sm:flex-row flex-wrap -mx-2 xl:-mx-3">
          {[...Array(12)].map((_, index) => (
            <div
              key={`initial-notes-skel-${index}`}
              className="basis-1 sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4 p-2 xl:p-3 flex"
            >
              <div className="bg-slate-200 rounded-lg h-80 w-full"></div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row flex-wrap -mx-2 xl:-mx-3">
        {!isLoading && allNotes?.length !== 0
          ? allNotes?.map((note: Note) => {
              return (
                <NoteItem
                  key={note?._id}
                  note={note}
                  onEdit={onEdit}
                  searchTest={filterState?.search}
                />
              );
            })
          : !isLoading && (
              <p className="p-2 xl:p-3 text-lg text-slate-500 select-none">
                No notes found.
              </p>
            )}
      </div>

      <div ref={ref} className="text-center my-10 select-none">
        {isFetchingNextPage ? (
          <div>
            <p className="text-sm text-slate-500 m-0">Fetching data...</p>
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="text-slate-500 font-medium text-sm py-2 px-6 rounded-4xl inline-block bg-slate-100 hover:bg-slate-200 transition duration-300"
          >
            Load More Notes
          </button>
        ) : (
          allNotes.length > 0 && (
            <p className="text-sm text-slate-500 m-0">All Notes loaded.</p>
          )
        )}
      </div>
    </div>
  );
}

export default NoteList;
