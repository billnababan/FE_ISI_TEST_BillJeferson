import React from "react";
import Link from "next/link";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ Gunakan hanya import ini
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuButtonClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuButtonClick }) => {
  const { user, logout } = useAuth(); // ✅ Ambil logout dari useAuth
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logout(); // ✅ Pastikan logout dari context dipanggil
      }

      // Bersihkan localStorage
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");

      // Redirect ke halaman login
      router.push("/pages/login"); // ✅ Pastikan path benar
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onMenuButtonClick} className="text-white hover:text-gray-600 focus:outline-none lg:hidden" aria-label="Open menu">
              <FaBars size={24} />
            </button>
            <Link href="/dashboard" className="ml-4 text-xl font-semibold text-white hover:text-gray-600">
              Dashboard
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-white">
              <FaUserCircle size={24} className="mr-2" />
              <span>{user?.email || "User"}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FaSignOutAlt size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
          <div className="flex md:hidden">
            <button className="text-white hover:text-gray-600 focus:outline-none" aria-label="Open user menu">
              <FaUserCircle size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
