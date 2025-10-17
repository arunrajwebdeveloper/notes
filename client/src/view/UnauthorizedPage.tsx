// src/pages/UnauthorizedPage.tsx
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 p-8">
        <div className="text-6xl">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/notes")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
