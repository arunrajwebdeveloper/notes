import { Plus } from "lucide-react";

function Sidebar() {
  return (
    <aside className="h-dvh px-4 w-[300px] flex-none">
      <div>
        {/* Logo */}
        <div className="mb-4">
          <div className="flex w-8 flex-wrap">
            <div className="w-4 h-4 bg-yellow-400"></div>
            <div className="w-4 h-4 bg-green-400"></div>
            <div className="w-4 h-4 bg-blue-400"></div>
          </div>
        </div>
        {/* Add */}
        <div className="mb-4">
          <button>
            <div>
              <Plus />
              <span>Create</span>
            </div>
          </button>
        </div>
        <div className="mb-4">
          <div>
            <h2>Tags</h2>
            <button>Create Tag</button>
          </div>
          <div>{/* tag lists */}</div>
        </div>
        <div className="mb-4">
          <div>{/* Profile / settings */}</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
