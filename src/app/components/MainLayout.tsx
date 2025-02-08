"use client";

import type React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto  bg-gradient-to-br from-blue-100 to-indigo-100 p-4">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
