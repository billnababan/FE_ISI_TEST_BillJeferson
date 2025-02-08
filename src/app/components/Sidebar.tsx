"use client";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { MdDashboard, MdTask, MdDataUsage } from "react-icons/md";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: MdDashboard, href: "/pages/dashboard" },

    { name: "Tasks", icon: MdTask, href: "/pages/tasks" },
    { name: "Log Data", icon: MdDataUsage, href: "/pages/status" },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button onClick={() => setOpen(false)} className="lg:hidden text-white focus:outline-none">
          <FaTimes size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href}>
                <span className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${pathname === item.href ? "bg-gray-800 text-white" : ""}`}>
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
