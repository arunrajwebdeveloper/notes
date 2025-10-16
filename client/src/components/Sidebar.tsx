import { Plus } from "lucide-react";

function Sidebar() {
  return (
    <aside>
      <div>
        {/* Logo */}
        <div className="mb-4">
          <div className="flex w-10 h-10 flex-wrap gap-2">
            <div className="basis-1/2 bg-red-400"></div>
            <div className="basis-1/2 bg-red-400"></div>
            <div className="basis-1/2 bg-red-400"></div>
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
