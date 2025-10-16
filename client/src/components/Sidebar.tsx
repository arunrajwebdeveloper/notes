import { Plus } from "lucide-react";

function Sidebar() {
  return (
    <aside className="h-dvh px-6 w-[300px] flex-none overflow-y-auto overflow-x-hidden">
      <div className="my-6 space-y-10">
        {/* Logo */}
        <div className="">
          <h2 className="text-2xl font-semibold text-black m-0 select-none">
            NOTI
          </h2>
        </div>
        {/* Add */}
        <div className="">
          <button className="bg-black cursor-pointer text-white flex justify-center items-center gap-1 h-14 rounded-full">
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
            <h2 className="text-lg text-black">Tags</h2>
            <button className="bg-slate-100 text-slate-600 text-base rounded-full py-1 px-3 cursor-pointer">
              Create Tag
            </button>
          </div>
          <div className="mt-4">
            {
              // jjjj
            }
          </div>
        </div>
        <div className="">
          <div>{/* Profile / settings */}</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
