"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FaClipboardCheck, FaCheck } from "react-icons/fa";
import MainLayout from "../../components/MainLayout";
import axios from "axios"; // Import axios

const TaskUpdatePage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [status, setStatus] = useState<string>("On Progress");
  const [description, setDescription] = useState<string>("");

  const validStatuses = ["Not Started", "On Progress", "Done", "Reject"];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<{ id: number; title: string; status: string; description: string }[]>("/api/taskteam", {
          withCredentials: true,
        });

        setTasks(response.data);

        if (response.data.length > 0) {
          setSelectedTask(response.data[0]);
          setStatus(response.data[0].status);
          setDescription(response.data[0].description);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskChange = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setStatus(task.status);
      setDescription(task.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      const response = await axios.patch<{ id: number; title: string; status: string; description: string }>(
        `/api/tasks/${selectedTask.id}`,
        { status, description },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedTask(response.data);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold flex items-center">
                <FaClipboardCheck className="mr-2" />
                Update Task
              </h1>
            </div>
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Task
                </label>
                <select
                  id="task"
                  value={selectedTask?.id || ""}
                  onChange={(e) => handleTaskChange(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {validStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Update task description..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaCheck className="-ml-1 mr-2 h-5 w-5" />
                Update Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskUpdatePage;
