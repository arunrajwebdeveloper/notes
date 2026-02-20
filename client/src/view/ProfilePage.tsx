import { useState, type ChangeEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios.config";

const ProfilePage = () => {
  const { user } = useAuth();

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
    }) => {
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
    updateProfileMutation.mutate(userData);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={userData.firstName}
              onChange={onHandleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={userData.lastName}
              onChange={onHandleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={onHandleChange}
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
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
