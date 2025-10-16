import { useNotes } from "../hooks/useNotes";
import type { Note } from "../types/note.types";
import NoteItem from "./NoteItem";

function NoteList() {
  const { notes, isLoadingNotes } = useNotes({ enabled: true });

  if (isLoadingNotes) return <h3>Loading...</h3>;

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
