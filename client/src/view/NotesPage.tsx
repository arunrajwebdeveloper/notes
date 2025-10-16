import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteModal from "../components/NoteModal";
import NoteList from "../components/NoteList";
import { useNotes } from "../hooks/useNotes";

import { useAppDispatch, useAppSelector } from "../hooks";

function NotesPage() {
  const { user } = useAppSelector((state) => state.auth);
  // const dispatch = useAppDispatch();

  const { notes, tags, isLoadingNotes, isLoadingTags } = useNotes({
    enabled: true,
  });

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <div className="h-dvh w-[340px] flex-none hidden lg:block">
        <Sidebar tags={tags} isLoadingTags={isLoadingTags} user={user} />
      </div>
      <div className="w-full lg:w-[calc(100%-340px)] flex-1 overflow-y-auto px-10 transition duration-300">
        <Header />
        <NoteList notes={notes} isLoading={isLoadingNotes} />
      </div>

      {/* MODAL */}

      {/* <NoteModal /> */}
    </div>
  );
}

export default NotesPage;
