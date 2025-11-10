"use client";

import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../AuthProvider";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaBars className="w-5 h-5 text-gray-700" />
        </button>

        {/* Desktop Title - hidden on mobile */}
        <h1 className="hidden lg:block text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaBell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-800">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-gray-500">
                {user?.role || "Administrator"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserCircle className="w-8 h-8 text-gray-600" />
              <button
                onClick={logout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

