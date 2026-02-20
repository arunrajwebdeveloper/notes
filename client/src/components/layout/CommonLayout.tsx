import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const CommonLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-full overflow-hidden">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notes")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl w-full mx-auto px-4">{children}</div>
    </div>
  );
};

export default CommonLayout;
