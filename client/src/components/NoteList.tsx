import { useNotes } from "../hooks/useNotes";
import Note from "./Note";

function NoteList() {
  const { notes, isLoadingNotes } = useNotes({ enabled: true });

  console.log("notes :>> ", notes);
  console.log("isLoadingNotes :>> ", isLoadingNotes);
  return (
    <div>
      <Note />;
    </div>
  );
}

export default NoteList;
