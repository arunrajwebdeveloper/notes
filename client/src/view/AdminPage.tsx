// src/pages/AdminPage.tsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios.config";

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch all users (admin only)
  const { data: users, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Admin: {user?.name}</span>
            <button
              onClick={() => navigate("/notes")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>

          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users?.map((u: any) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 text-sm">{u.id}</td>
                      <td className="px-4 py-3 text-sm">{u.name}</td>
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-700 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
