import { Plus } from "lucide-react";
import type { TagItem } from "../types/note.types";
import type { User } from "../types/auth.types";

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
      <div className="my-6 space-y-10 overflow-y-auto overflow-x-hidden px-6 w-full h-[calc(100%-80px)]">
        {/* Logo */}
        <div className="">
          <h2 className="text-2xl font-semibold text-black m-0 select-none">
            NOTI
          </h2>
        </div>
        {/* Add */}
        <div className="">
          <button className="bg-black font-medium cursor-pointer text-white flex justify-center items-center gap-1 h-14 rounded-full">
            <div className="w-14 h-full flex">
              <Plus className="m-auto" />
            </div>
            <div className="pe-8">
              <span>Create Note</span>
            </div>
          </button>
        </div>
        <div className="">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-black font-medium">Tags</h2>
            <button className="bg-slate-100 text-slate-600 text-base rounded-full py-1 px-3 cursor-pointer">
              Create Tag
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {isLoadingTags && <span>Loading...</span>}
            {!isLoadingTags &&
              tags?.map((tag: TagItem) => {
                return (
                  <button
                    key={tag?._id}
                    className="flex items-center justify-between w-full cursor-pointer py-1 text-base text-black hover:text-amber-500 transition duration-300"
                  >
                    <span> {tag?.name}</span>
                    {tag?.noteCount !== 0 && (
                      <span className="rounded-full min-w-7 h-7 bg-blue-200 text-blue-800 flex justify-center items-center text-sm">
                        {tag?.noteCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
      <div className="h-[80px] flex flex-none items-center px-6">
        <button className="flex items-center gap-4 text-left cursor-pointer w-full">
          <div className="w-12 h-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              role="img"
            >
              <g>
                <circle cx="64" cy="64" r="64" fill="#c1c7d0" />
                <g>
                  <path
                    fill="#fff"
                    d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
                  />
                  <path
                    fill="#fff"
                    d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
                  />
                </g>
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-base text-black m-0 leading-4">{`${
              user?.firstName
            } ${user?.lastName || ""}`}</h3>
            <span className="text-sm text-slate-600 m-0">{user?.email}</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
