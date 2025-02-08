"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaSpinner, FaTimes, FaTrash } from "react-icons/fa";
import MainLayout from "../../components/MainLayout";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [userRole, setUserRole] = useState<"lead" | "team" | null>(null);
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [teamMembers, setTeamMembers] = useState<{ id: number; email: string }[]>([]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "lead") {
      alert("You do not have permission to access this page.");
      router.push("/pages/dashboard"); // Arahkan pengguna ke halaman lain
    } else {
      setUserRole(storedRole as "lead");
      fetchTeamMembers();
      fetchTasks();
    }
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get<{ id: number; email: string }[]>("/api/users?role=team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Task[]>("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddTask = async (task: Partial<Task>) => {
    try {
      const response = await axios.post(
        "/api/tasks",
        {
          title: task.title,
          description: task.description,
          status: task.status || "Not Started", // Default status jika tidak disediakan
          assigned_to: task.assigned_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        fetchTasks(); // Refresh daftar tugas setelah menambahkan
        setIsModalOpen(false); // Tutup modal
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      const response = await axios.put(
        `/api/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          status: task.status,
          assigned_to: task.assigned_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        fetchTasks(); // Refresh daftar tugas setelah mengupdate
        setIsModalOpen(false); // Tutup modal
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        fetchTasks(); // Refresh daftar tugas setelah menghapus
        setIsDeleteModalOpen(false); // Tutup modal
        setTaskToDelete(null); // Reset task yang akan dihapus
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const openModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Task Management</h1>
            {userRole === "lead" && (
              <button
                onClick={() => openModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <FaPlus className="inline-block mr-2" /> Add Task
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <p className="text-sm text-gray-500 mb-2">Assigned to: {task.assigned_to}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">{task.status}</span>
                    {userRole === "lead" && (
                      <div className="flex space-x-2">
                        <button onClick={() => openModal(task)} className="text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">
                          <FaEdit className="text-xl" />
                        </button>
                        <button onClick={() => openDeleteModal(task)} className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out">
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTask ? "Edit Task" : "Add Task"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <TaskForm task={selectedTask} teamMembers={teamMembers} onAdd={handleAddTask} onUpdate={handleUpdateTask} onCancel={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}

        {isDeleteModalOpen && taskToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Task</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete "{taskToDelete.title}"? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button onClick={() => handleDeleteTask(taskToDelete.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface TaskFormProps {
  task: Task | null;
  teamMembers: { id: number; email: string }[];
  onAdd: (task: Partial<Task>) => void;
  onUpdate: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, teamMembers, onAdd, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "Not Started");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onUpdate({ id: task.id, title, description, status, assigned_to: assignedTo });
    } else {
      onAdd({ title, description, status, assigned_to: assignedTo });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
          Assigned To
        </label>
        <select id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Assignee</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.email}>
              {member.email}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          {task ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskManagement;
