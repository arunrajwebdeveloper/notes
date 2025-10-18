import type { InfiniteData } from "@tanstack/react-query";
import type { Note, NotesResponse } from "../../types/note.types";
import NoteItem from "./NoteItem";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Used for scroll detection

export interface BaseProps {
  onEdit: (id: string) => void;
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
}: InfiniteMatchListProps) {
  // 1. Intersection Observer Hook
  const { ref, inView } = useInView();

  // 2. Auto-fetch logic
  useEffect(() => {
    // If the sentinel element is visible, there's a next page, and we're not currently fetching
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the array of pages into a single array of users
  const allNotes: Note[] =
    data?.pages?.flatMap((page: any) => page.result) || [];

  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error.message}
      </div>
    );
  }

  if (isLoading && allNotes.length === 0)
    return <h3 className="px-6">Loading...</h3>;

  // {[...Array(8)].map((_, index) => (
  //         <UserListSkeleton key={`initial-profiles-skel-${index}`} />
  //       ))}

  return (
    <div className=" mt-8 md:mt-10 mb-10">
      <div className="text-left">
        <h1 className="font-medium text-4xl xl:text-5xl">My Notes</h1>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row flex-wrap -mx-2 xl:-mx-3">
        {allNotes?.length !== 0 ? (
          allNotes?.map((note: Note) => {
            return <NoteItem key={note?._id} note={note} onEdit={onEdit} />;
          })
        ) : (
          <p className="p-2 xl:p-3 text-lg text-slate-500 select-none">
            No notes found.
          </p>
        )}
      </div>

      {/* 3. Sentinel Element and Loading Indicator */}
      <div ref={ref} className="text-center my-8 select-none">
        {isFetchingNextPage ? (
          // Skeleton loaders for the next page fetch
          <div>
            {/* {[...Array(3)].map((_, index) => (
                <span>Fetching data...</span>
              ))} */}
            <p className="text-sm text-slate-500 m-0">Fetching data...</p>
          </div>
        ) : hasNextPage ? (
          // Fallback manual 'Load More' button
          <button
            onClick={() => fetchNextPage()}
            className="text-slate-500 font-medium text-xs py-2 px-6 rounded-4xl inline-block bg-slate-100 hover:bg-slate-200 transition duration-300"
          >
            Load More Notes
          </button>
        ) : (
          // End of list
          allNotes.length > 0 && (
            <p className="text-sm text-slate-500 m-0">All Notes loaded.</p>
          )
        )}
      </div>
    </div>
  );
}

export default NoteList;
