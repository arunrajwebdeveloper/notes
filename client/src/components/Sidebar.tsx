import type { TagItem } from "../types/note.types";
import { Plus } from "lucide-react";
import { List, type RowComponentProps } from "react-window";

function TagRowComponent({
  index,
  style,
  tags,
}: RowComponentProps<{
  tags: TagItem[];
}>) {
  const tag = tags[index];

  return (
    <button
      style={style}
      className="flex items-center justify-between gap-4 px-6 w-full cursor-pointer text-base text-black hover:bg-slate-100 hover:text-blue-500 transition duration-300"
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {tag?.name}
      </span>
      {tag?.noteCount !== 0 && (
        <span className="rounded-full min-w-7 h-7 bg-slate-200 text-slate-800 flex justify-center items-center text-sm">
          {tag?.noteCount}
        </span>
      )}
    </button>
  );
}

function Sidebar({
  tags,
  isLoadingTags,
}: {
  tags: TagItem[];
  isLoadingTags: boolean;
}) {
  return (
    <aside className="h-dvh w-full flex flex-col justify-between">
      <div className="space-y-10 w-full h-full">
        <div className="sticky top-0 space-y-10 bg-white pb-6 pt-6">
          {/* Logo */}
          <div className="px-6">
            <h2 className="text-3xl font-semibold text-black m-0 select-none">
              NOTI
            </h2>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-xl text-black font-medium">Tags</h2>
            <button className="bg-slate-200 text-slate-800 group flex gap-2 items-center text-base rounded-full py-1 px-3 transition duration-300 cursor-pointer border-3 border-slate-200 hover:border-t-blue-500 hover:border-l-blue-500 hover:border-r-amber-400 hover:border-b-amber-400">
              <Plus
                size={20}
                className="group-hover:rotate-90 transition duration-300 origin-center"
              />
              <span>Create Tag</span>
            </button>
          </div>
          <div className="mt-10 virtualized-list">
            {isLoadingTags && <span>Loading...</span>}
            {!isLoadingTags && tags?.length !== 0 && (
              <List
                rowComponent={TagRowComponent}
                rowCount={tags?.length || 0}
                rowHeight={56}
                rowProps={{ tags }}
                style={{ height: "calc(100dvh - 200px)", width: "100%" }}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
