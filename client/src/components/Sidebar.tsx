import type { NoteFilterState, TagItem } from "../types/note.types";
import { List, type RowComponentProps } from "react-window";

function TagRowComponent({
  index,
  style,
  tags,
  isLoadingNotes,
  handleTagSelect,
  filterState,
}: RowComponentProps<{
  tags: TagItem[];
  isLoadingNotes: boolean;
  handleTagSelect: (tagId: string) => void;
  filterState: NoteFilterState;
}>) {
  const tag = tags[index];

  return (
    <button
      disabled={isLoadingNotes}
      style={style}
      onClick={() => handleTagSelect(tag._id)}
      className={`flex items-center justify-between gap-4 px-6 w-full cursor-pointer text-base text-black transition duration-300 ${
        filterState?.tagId === tag?._id ? "bg-blue-200" : "hover:bg-slate-100"
      }`}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {tag?.name}
      </span>

      {tag?.noteCount !== 0 && (
        <span className="rounded-full min-w-7 h-7 px-2 bg-slate-200 text-slate-800 flex justify-center items-center text-sm">
          {tag?.noteCount < 10 ? tag?.noteCount : "10+"}
        </span>
      )}
    </button>
  );
}

function Sidebar({
  tags,
  isLoadingTags,
  isLoadingNotes,
  handleTagSelect,
  filterState,
  openTagModal,
}: {
  tags: TagItem[];
  isLoadingTags: boolean;
  isLoadingNotes: boolean;
  handleTagSelect: (tagId: string) => void;
  filterState: NoteFilterState;
  openTagModal: () => void;
}) {
  return (
    <aside className="h-dvh w-full flex flex-col justify-between">
      <div className="w-full h-full">
        <div className="sticky top-0 bg-white mt-6">
          {/* Logo */}
          <div className="px-6">
            <h2 className="text-3xl font-semibold text-black m-0 select-none">
              NOTI
            </h2>
          </div>
        </div>
        <div className="my-8">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-xl text-black font-medium m-0">Tags</h2>
            <button
              onClick={openTagModal}
              className="text-blue-600 hover:text-blue-700 text-sm transition duration-300 cursor-pointer"
            >
              <span>Manage Tags</span>
            </button>
          </div>

          {isLoadingTags && (
            <div className="mt-6 animate-pulse space-y-6">
              {[...Array(14)].map((_, index) => (
                <div
                  key={`initial-tags-skel-${index}`}
                  className="px-6 flex gap-4 justify-between items-center rounded-sm h-6 w-full"
                >
                  <span className="h-7 bg-slate-200 flex-1 rounded-full"></span>
                  <span className="h-7 w-7 bg-slate-200 rounded-full"></span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 virtualized-list">
            {!isLoadingTags && tags?.length !== 0 ? (
              <List
                rowComponent={TagRowComponent}
                rowCount={tags?.length || 0}
                rowHeight={56}
                rowProps={{
                  tags,
                  isLoadingNotes,
                  filterState,
                  handleTagSelect,
                }}
                style={{ height: "calc(100dvh - 144px)", width: "100%" }}
              />
            ) : (
              <div className="px-6 pt-6 text-sm text-slate-500">
                <span>No tags yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
