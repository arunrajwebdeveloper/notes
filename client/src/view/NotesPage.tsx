import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteModal from "../components/NoteModal";
import NoteList from "../components/NoteList";
import { useNotes } from "../hooks/useNotes";
// import { useAuth } from "../hooks/useAuth";

// import { decrement, increment } from "../store/features/counterSlice";
// import { useAppDispatch, useAppSelector } from "../hooks";

function NotesPage() {
  // const count = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();

  // const { user, logout } = useAuth();

  const { notes, isLoadingNotes } = useNotes({ enabled: true });

  return (
    <div className="flex h-dvh w-full">
      <Sidebar />
      <div className="w-full flex-1">
        <Header />
        <NoteList notes={notes} isLoading={isLoadingNotes} />
      </div>

      {/* MODAL */}

      {/* <NoteModal /> */}
    </div>
  );
}

export default NotesPage;
