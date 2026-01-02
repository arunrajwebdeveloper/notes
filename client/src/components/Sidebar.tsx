import { Archive, Plus, Trash2 } from "lucide-react";
import type { Note, NoteFilterState, TagItem } from "../types/note.types";
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
  openNoteModal: (note: Note | null) => void;
}) {
  return (
    <aside className="h-dvh w-auto hidden lg:flex">
      <div className="w-[100px] h-full flex flex-col justify-between items-center py-6 border-r border-r-slate-200">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold text-black m-auto leading-5 select-none">
            <span className="block">NO</span>
            <span className="block">TI</span>
          </p>

          <button
            onClick={() => openNoteModal(null)}
            className="w-16 h-16 mt-14 rounded-full group relative bg-black flex items-center cursor-pointer text-base text-white transition duration-300"
          >
            <Plus className="m-auto group-hover:rotate-90 transition duration-300 origin-center" />
            <Tooltip content="Create Note" position="right" />
          </button>
        </div>
        <div className="space-y-4">
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
