import { Archive, Plus, Trash2 } from "lucide-react";
import type { Note, NoteFilterState, TagItem } from "../types/note.types";
import TagsSidebar from "./TagsSidebar";
import Tooltip from "./common/Tooltip";
import { useSidebarContext } from "../context/SidebarContext";

function Sidebar({
  tags,
  isLoadingTags,
  isLoadingNotes,
  handleTagSelect,
  filterState,
  openTagModal,
  handleNoteType,
  openNoteModal,
}: {
  tags: TagItem[];
  isLoadingTags: boolean;
  isLoadingNotes: boolean;
  handleTagSelect: (tagId: string) => void;
  filterState: NoteFilterState;
  openTagModal: () => void;
  handleNoteType: (type: string) => void;
  openNoteModal: (note: Note | null) => void;
}) {
  const { isOpenSidebar, windowWidth, closeSidebar } = useSidebarContext();

  const closeSidebarOnSmDevice = () => {
    if (windowWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <aside className={`h-dvh w-auto ${isOpenSidebar ? "flex" : "hidden"}`}>
      <div className="w-[60px] lg:w-[100px] h-full flex flex-col justify-between items-center py-6 border-r border-r-slate-200">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold text-black m-auto leading-5 select-none">
            <span className="block">NO</span>
            <span className="block">TI</span>
          </p>

          <button
            onClick={() => {
              openNoteModal(null);
              closeSidebarOnSmDevice();
            }}
            className="w-12 h-12 lg:w-16 lg:h-16 mt-14 rounded-full group relative bg-black flex items-center cursor-pointer text-base text-white transition duration-300"
          >
            <Plus className="m-auto transition duration-300 origin-center group-hover:rotate-90" />
            <Tooltip content="Create Note" position="right" />
          </button>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => {
              handleNoteType("archive");
              closeSidebarOnSmDevice();
            }}
            className={`w-14 h-14 group relative rounded-full bg-white flex items-center cursor-pointer text-base text-black transition duration-300 hover:bg-slate-100`}
          >
            <Archive size={20} className="m-auto" />
            <Tooltip content="Archive" position="right" />
          </button>
          <button
            onClick={() => {
              handleNoteType("trash");
              closeSidebarOnSmDevice;
            }}
            className={`w-14 h-14 group relative rounded-full bg-white flex items-center cursor-pointer text-base text-black transition duration-300 hover:bg-slate-100`}
          >
            <Trash2 size={20} className="m-auto" />
            <Tooltip content="Trash" position="right" />
          </button>
        </div>
      </div>

      {/* Tags Sidebar */}

      <TagsSidebar
        tags={tags}
        isLoadingTags={isLoadingTags}
        isLoadingNotes={isLoadingNotes}
        handleTagSelect={handleTagSelect}
        filterState={filterState}
        openTagModal={openTagModal}
        handleNoteType={handleNoteType}
        closeSidebarOnSmDevice={closeSidebarOnSmDevice}
      />
    </aside>
  );
}

export default Sidebar;
