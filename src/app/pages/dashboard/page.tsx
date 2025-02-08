"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
}

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          return;
        }

        const response = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate totals
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.status === "Done").length;
  const notStartedTasks = tasks.filter((task) => task.status === "Not Started").length;

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Tasks */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800">Total Tasks</h2>
              <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
            </div>

            {/* Done Tasks */}
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800">Done Tasks</h2>
              <p className="text-3xl font-bold text-green-600">{doneTasks}</p>
            </div>

            {/* Not Started Tasks */}
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-800">Not Started Tasks</h2>
              <p className="text-3xl font-bold text-yellow-600">{notStartedTasks}</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
