// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isRegisterLoading, registerError } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    register({ firstName, lastName, email, password });
  };

  return (
    <div className="min-h-screen select-none w-full flex flex-col justify-between items-center  bg-blue-900">
      <div className="pt-5 p-b-2">
        <h2 className="text-white font-semibold text-3xl">NOTI</h2>
      </div>

      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-2xl text-white font-bold text-left">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="fname"
              type="text"
              placeholder="First Name *"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-4 text-white bg-white/10 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100/20"
            />
          </div>

          <div>
            <input
              id="lname"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-4 text-white bg-white/10 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100/20"
            />
          </div>

          <div>
            <input
              id="email"
              type="email"
              placeholder="Email Address *"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-4 text-white bg-white/10 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100/20"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              placeholder="Password *"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-4 text-white bg-white/10 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100/20"
            />
          </div>

          <div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password *"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-4 text-white bg-white/10 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100/20"
            />
          </div>

          <button
            type="submit"
            disabled={isRegisterLoading}
            className="w-full p-4 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegisterLoading ? "Creating account..." : "Create Account"}
          </button>

          <div className="flex items-center gap-2 text-sm font-medium mt-6">
            <p className="text-white"> Already have an account?</p>
            <Link className="text-white underline" to="/login">
              Sign in
            </Link>
          </div>

          {registerError && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {(registerError as any)?.response?.data?.message ||
                "Registration failed"}
            </div>
          )}
        </form>
      </div>

      <div className="text-center py-4">
        <p className="text-white text-xs">&copy; 2025</p>
      </div>
    </div>
  );
};

export default RegisterPage;
