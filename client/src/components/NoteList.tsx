import type { Note, NotesResponse } from "../types/note.types";
import NoteItem from "./NoteItem";

function NoteList({
  notes,
  isLoading,
}: {
  notes: NotesResponse;
  isLoading: boolean;
}) {
  if (isLoading) return <h3 className="px-6">Loading...</h3>;

  return (
    <div className="mt-6 mb-10">
      <div className="text-left">
        <h1 className="font-medium text-5xl">My Notes</h1>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row flex-wrap">
        {notes?.result?.map((note: Note) => {
          return <NoteItem key={note?._id} {...note} />;
        })}
      </div>
    </div>
  );
}

export default NoteList;
