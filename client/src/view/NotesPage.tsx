import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteList from "../components/notes/NoteList";
import { useNotes } from "../hooks/useNotes";
import NoteModal from "../components/modal/NoteModal";
import { useAppSelector } from "../hooks";
import TagsManageModal from "../components/modal/TagsManageModal";
import { useSidebarContext } from "../context/SidebarContext";
import SearchModal from "../components/modal/SearchModal";
// import { useEffect } from "react";

function NotesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { isOpenSidebar, windowWidth } = useSidebarContext();
  const isSmallDevice = windowWidth < 1024;

  const {
    notes: notesData,
    tags,
    isLoadingTags,
    isOpenNoteModal,
    openNoteModal,
    closeNoteModal,
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
    selectedNote,
    handleSearchChange,
    handleTagSelect,
    filterState,
    localSearch,
    isOpenTagModal,
    isOpenSearchModal,
    openTagModal,
    closeTagModal,
    handleNoteType,
    closeSearchModal,
    openSearchModal,
    clearSearchModal,
    closeOrClearSearchModal,
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
    archiveNoteMutation,
    unarchiveNoteMutation,
    restoreNoteMutation,
    deleteNoteFromTrashMutation,
    emptyTrashMutation,
    removeNoteTagMutation,
    deletingNoteTagIds,
    archivingNoteIds,
    deletetingTrashNoteIds,
    restoringTrashNoteIds,
    deleteInfo,
    onDelete,
    resetDeleteInfo,
    onDeleteNote,
    handleDelete,
    toggleArchive,
    restoreNote,
    deleteTrashNote,
    emptyTrash,
    onRemoveNoteTag,
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
    // isSuccess,
  } = notesData;

  // Close search modal after fetch data
  // useEffect(() => {
  //   if (isOpenSearchModal && isSuccess && data) {
  //     closeSearchModal();
  //   }
  // }, [isSuccess, data]);

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
        className={`w-full overflow-y-auto px-4 sm:px-6 lg:px-10 transition duration-300 
      [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 ${isOpenSidebar && isSmallDevice ? "flex-none" : "flex-1"}`}
      >
        <Header
          user={user}
          handleSearchChange={handleSearchChange}
          isLoading={isLoadingNotes}
          localSearch={localSearch}
          openSearchModal={openSearchModal}
          clearSearchModal={clearSearchModal}
        />
        <NoteList
          data={data}
          isLoading={isLoadingNotes}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onEdit={(note) => openNoteModal(note)}
          deletingNoteTagIds={deletingNoteTagIds}
          archivingNoteIds={archivingNoteIds}
          deletetingTrashNoteIds={deletetingTrashNoteIds}
          restoringTrashNoteIds={restoringTrashNoteIds}
          filterState={filterState}
          deleteNoteMutation={deleteNoteMutation}
          archiveNoteMutation={archiveNoteMutation}
          unarchiveNoteMutation={unarchiveNoteMutation}
          restoreNoteMutation={restoreNoteMutation}
          deleteNoteFromTrashMutation={deleteNoteFromTrashMutation}
          emptyTrashMutation={emptyTrashMutation}
          removeNoteTagMutation={removeNoteTagMutation}
          deleteInfo={deleteInfo}
          onDelete={onDelete}
          resetDeleteInfo={resetDeleteInfo}
          onDeleteNote={onDeleteNote}
          handleDelete={handleDelete}
          toggleArchive={toggleArchive}
          restoreNote={restoreNote}
          deleteTrashNote={deleteTrashNote}
          emptyTrash={emptyTrash}
          onRemoveNoteTag={onRemoveNoteTag}
        />
      </div>
      {/* NOTE MODAL */}
      <NoteModal
        isShow={isOpenNoteModal}
        mode={selectedNote ? "edit" : "create"}
        tags={tags}
        onHide={closeNoteModal}
        createNoteMutation={createNoteMutation}
        updateNoteMutation={updateNoteMutation}
        selectedNote={selectedNote}
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

      {/* Search Modal */}

      <SearchModal
        isShow={isOpenSearchModal}
        onHide={closeSearchModal}
        handleSearchChange={handleSearchChange}
        isLoading={isLoadingNotes}
        localSearch={localSearch}
        closeOrClearSearchModal={closeOrClearSearchModal}
      />
    </div>
  );
}

export default NotesPage;
