"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FaClipboardCheck, FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import MainLayout from "../../components/MainLayout";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_to: number;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
  assigned_to_email: string;
}

const TaskUpdatePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [status, setStatus] = useState<string>("Not Started");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const validStatuses = ["Not Started", "On Progress", "Done", "Reject"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("/api/status", {
        headers: { Authorization: `Bearer ${token}` }, // Sertakan token dalam header
      });

      if (Array.isArray(response.data)) {
        setTasks(response.data);
        setError(null);
      } else {
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskChange = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setStatus(task.status);
      setDescription(task.description);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTask) {
      setError("Please select a task first");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        throw new Error("No token found");
      }

      await axios.put(
        `/api/status/${selectedTask.id}`,
        {
          status,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Task updated successfully!");
      await fetchTasks();
      setSelectedTask(null);
      setStatus("Not Started");
      setDescription("");
    } catch (error: any) {
      console.error("Failed to update task:", error);
      setError(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold flex items-center">
                <FaClipboardCheck className="mr-2" /> Update Task Status
              </h1>
              <p className="text-blue-100 mt-1">Update your assigned tasks' status and progress</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 m-4">
                <div className="flex">
                  <FaTimes className="text-red-500 mt-1 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 m-4">
                <div className="flex">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 bg-gray-50 rounded-lg p-6">
                  <FaClipboardCheck className="mx-auto text-4xl mb-2 text-gray-400" />
                  <p className="text-lg font-medium">No tasks assigned</p>
                  <p className="text-sm text-gray-400">You don't have any tasks assigned at the moment.</p>
                </div>
              </div>
            ) : (
              <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <label htmlFor="task" className="block text-sm font-medium text-gray-700">
                    Select Task
                  </label>
                  <select
                    id="task"
                    value={selectedTask?.id || ""}
                    onChange={(e) => handleTaskChange(Number(e.target.value))}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Choose a task to update</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTask && (
                  <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                    <div className="space-y-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Update Status
                      </label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {validStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Update Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Provide details about the task progress..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          <span>Update Task</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {selectedTask && (
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Task Details</h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Title:</span> {selectedTask.title}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedTask.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : selectedTask.status === "On Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedTask.status === "Reject"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedTask.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span> {selectedTask.updated_at ? new Date(selectedTask.updated_at).toLocaleString() : "Never"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskUpdatePage;
