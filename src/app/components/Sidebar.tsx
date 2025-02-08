"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { MdDashboard, MdTask, MdDataUsage } from "react-icons/md";
import { useAuth } from "../context/AuthContext"; // Import useAuth

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { user } = useAuth(); // Ambil informasi pengguna dari AuthContext
  console.log("User in Sidebar:", user); // Log data user di Sidebar

  // Definisikan menu berdasarkan role
  const menuItems = [
    { name: "Dashboard", icon: MdDashboard, href: "/pages/dashboard", roles: ["lead", "team"] },
    { name: "Tasks", icon: MdTask, href: "/pages/tasks", roles: ["lead"] },
    { name: "Log Data", icon: MdDataUsage, href: "/pages/status", roles: ["team"] },
  ];

  // Filter menu berdasarkan role pengguna
  const filteredMenuItems = menuItems.filter((item) => {
    if (!user) return false; // Jika user belum login, tidak tampilkan menu
    return item.roles.includes(user.role); // Filter berdasarkan role
  });

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform transition-all duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button onClick={() => setOpen(false)} className="lg:hidden text-white focus:outline-none">
          <FaTimes size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <ul>
          {filteredMenuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href}>
                <span
                  className={`flex items-center px-4 py-2 text-gray-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 hover:text-white  duration-200 ${
                    pathname === item.href ? "bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 text-white" : ""
                  }`}
                >
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
