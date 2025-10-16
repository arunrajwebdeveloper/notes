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
    <div className="px-6">
      <div className="text-left mb-4">
        <h1 className="font-medium text-5xl">My Notes</h1>
      </div>

      <div>
        {notes?.result?.map((note: Note) => {
          return <NoteItem key={note?._id} {...note} />;
        })}
      </div>
    </div>
  );
}

export default NoteList;
