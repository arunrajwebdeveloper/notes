import type { Note, NotesResponse } from "../types/note.types";
import NoteItem from "./NoteItem";

function NoteList({
  notes,
  isLoading,
  onEdit,
}: {
  notes: NotesResponse;
  isLoading: boolean;
  onEdit: (id: string) => void;
}) {
  if (isLoading) return <h3 className="px-6">Loading...</h3>;

  return (
    <div className=" mt-8 md:mt-10 mb-10">
      <div className="text-left">
        <h1 className="font-medium text-4xl xl:text-5xl">My Notes</h1>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row flex-wrap -mx-2 xl:-mx-3">
        {notes?.result?.length !== 0 ? (
          notes?.result?.map((note: Note) => {
            return <NoteItem key={note?._id} note={note} onEdit={onEdit} />;
          })
        ) : (
          <p className="p-2 xl:p-3 text-lg text-slate-500 ">No notes found.</p>
        )}
      </div>
    </div>
  );
}

export default NoteList;
