import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios.config";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.firstName || "");
  const [email, setEmail] = useState(user?.email || "");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiClient.put("/user/profile", data);
      return response.data;
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, email });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notes")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                value={user?.role || "user"}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div> */}

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending
                ? "Updating..."
                : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
