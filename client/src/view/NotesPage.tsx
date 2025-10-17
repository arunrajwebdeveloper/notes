import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteList from "../components/NoteList";
import { useNotes } from "../hooks/useNotes";
import NoteModal from "../components/modal/NoteModal";
import { useAppDispatch, useAppSelector } from "../hooks";

function NotesPage() {
  const { user } = useAppSelector((state) => state.auth);
  // const dispatch = useAppDispatch();

  const {
    notes,
    tags,
    isLoadingNotes,
    isLoadingTags,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
  } = useNotes({
    enabled: true,
  });

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <div className="h-dvh w-[340px] flex-none hidden lg:block">
        <Sidebar
          tags={tags}
          isLoadingTags={isLoadingTags}
          user={user}
          onCreateNote={openNoteModal}
        />
      </div>
      <div
        className="w-full lg:w-[calc(100%-340px)] flex-1 overflow-y-auto px-10 transition duration-300 
      [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
      "
      >
        <Header />
        <NoteList notes={notes} isLoading={isLoadingNotes} />
      </div>
      {/* NOTE MODAL */}
      <NoteModal
        isShow={isOpenNoteModal}
        tags={tags}
        onHide={() => closeNoteModal()}
        createNoteMutation={createNoteMutation}
      />
    </div>
  );
}

export default NotesPage;
