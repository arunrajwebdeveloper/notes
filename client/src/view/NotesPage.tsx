import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteList from "../components/notes/NoteList";
import { useNotes } from "../hooks/useNotes";
import NoteModal from "../components/modal/NoteModal";
import { useAppSelector } from "../hooks";
import TagsManageModal from "../components/modal/TagsManageModal";

function NotesPage() {
  const { user } = useAppSelector((state) => state.auth);

  const {
    notes: notesData,
    tags,
    isLoadingTags,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
    updateNoteMutation,
    selectedNoteId,
    noteDetails,
    isLoadingNoteDetails,
    handleSearchChange,
    handleTagSelect,
    filterState,
    localSearch,
    isOpenTagModal,
    openTagModal,
    closeTagModal,
    handleNoteType,
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  } = useNotes({
    enabled: true,
  });

  const {
    data,
    isPending: isLoadingNotes,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = notesData;

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar
        tags={tags}
        isLoadingTags={isLoadingTags}
        isLoadingNotes={isLoadingNotes}
        handleTagSelect={handleTagSelect}
        filterState={filterState}
        openTagModal={openTagModal}
        handleNoteType={handleNoteType}
        openNoteModal={openNoteModal}
      />

      <div
        className="w-full lg:w-[calc(100%-340px)] flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 transition duration-300 
      [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
      "
      >
        <Header
          user={user}
          handleSearchChange={handleSearchChange}
          isLoading={isLoadingNotes}
          localSearch={localSearch}
        />
        <NoteList
          data={data}
          isLoading={isLoadingNotes}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onEdit={(noteId) => openNoteModal(noteId)}
          filterState={filterState}
        />
      </div>
      {/* NOTE MODAL */}
      <NoteModal
        isShow={isOpenNoteModal}
        mode={selectedNoteId ? "edit" : "create"}
        tags={tags}
        onHide={closeNoteModal}
        createNoteMutation={createNoteMutation}
        updateNoteMutation={updateNoteMutation}
        noteDetails={noteDetails}
        isLoadingNoteDetails={isLoadingNoteDetails}
      />

      {/* Tags Modal */}

      <TagsManageModal
        isShow={isOpenTagModal}
        tags={tags}
        onHide={closeTagModal}
        createTagMutation={createTagMutation}
        updateTagMutation={updateTagMutation}
        deleteTagMutation={deleteTagMutation}
      />
    </div>
  );
}

export default NotesPage;
