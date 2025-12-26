import { Archive, Plus, Trash2 } from "lucide-react";
import type { NoteFilterState, TagItem } from "../types/note.types";
import TagsSidebar from "./TagsSidebar";
import Tooltip from "./common/Tooltip";

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
  openNoteModal: (id: string | null) => void;
}) {
  return (
    <aside className="h-dvh w-auto hidden lg:flex">
      <div className="w-[100px] h-full flex flex-col justify-between items-center py-6 border-r border-r-slate-200">
        {/* Logo */}
        <div className="w-14 h-14 rounded-full bg-black flex">
          <p className="text-lg font-semibold text-white m-auto leading-4 select-none">
            <span className="block">NO</span>
            <span className="block">TI</span>
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => openNoteModal(null)}
            className="w-14 h-14 rounded-full group relative bg-black flex items-center cursor-pointer text-base text-white transition duration-300"
          >
            <Plus className="m-auto group-hover:rotate-90 transition duration-300 origin-center" />
            <Tooltip content="Create Note" position="right" />
          </button>
          <button
            onClick={() => handleNoteType("archive")}
            className={`w-14 h-14 group relative rounded-full bg-white flex items-center cursor-pointer text-base text-black transition duration-300 hover:bg-slate-100`}
          >
            <Archive size={20} className="m-auto" />
            <Tooltip content="Archive" position="right" />
          </button>
          <button
            onClick={() => handleNoteType("trash")}
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
      />
    </aside>
  );
}

export default Sidebar;
