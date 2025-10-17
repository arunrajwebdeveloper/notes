import type { TagItem } from "../types/note.types";
import type { User } from "../types/auth.types";
import { Plus } from "lucide-react";

function Sidebar({
  tags,
  isLoadingTags,
  user,
}: {
  tags: TagItem[];
  isLoadingTags: boolean;
  user: User | null;
}) {
  return (
    <aside className="h-dvh w-full flex flex-col justify-between">
      <div
        className="space-y-10 overflow-y-auto overflow-x-hidden w-full h-full
      [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
      "
      >
        <div className="sticky top-0 space-y-10 bg-white pb-6 pt-6">
          {/* Logo */}
          <div className="px-6">
            <h2 className="text-2xl font-semibold text-black m-0 select-none">
              NOTI
            </h2>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-xl text-black font-medium">Tags</h2>
            <button className="bg-slate-200 text-slate-800 flex gap-2 items-center text-base rounded-full py-1 px-3 cursor-pointer">
              <Plus size={20} />
              <span>Create Tag</span>
            </button>
          </div>
          <div className="mt-10 space-y-1">
            {isLoadingTags && <span>Loading...</span>}
            {!isLoadingTags &&
              tags?.map((tag: TagItem) => {
                return (
                  <button
                    key={tag?._id}
                    className="flex items-center justify-between gap-4 px-6 w-full cursor-pointer py-3.5 text-base text-black hover:bg-slate-100 hover:text-blue-500 transition duration-300"
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
              })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
