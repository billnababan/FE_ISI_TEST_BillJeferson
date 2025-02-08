"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaSpinner } from "react-icons/fa";
import MainLayout from "../../components/MainLayout";

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
  const [userRole, setUserRole] = useState<"lead" | "team" | null>(null);
  const token = localStorage.getItem("token");
  const [teamMembers, setTeamMembers] = useState<{ id: number; email: string }[]>([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchTasks();
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole as "lead" | "team" | null);
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
      await axios.post("/api/tasks", task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await axios.put(
        `/api/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          assigned_to: task.assigned_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const openModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Task Management</h1>
            {userRole === "lead" && (
              <button onClick={() => openModal()} className="bg-indigo-600 text-white py-2 px-4 rounded-full">
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
                <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm">Assigned to: {task.assigned_to}</p>
                  {userRole === "lead" && (
                    <button onClick={() => openModal(task)} className="text-indigo-600 mt-2">
                      <FaEdit className="inline-block mr-1" /> Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedTask ? "Edit Task" : "Add Task"}</h2>
              <TaskForm task={selectedTask} teamMembers={teamMembers} onAdd={handleAddTask} onUpdate={handleUpdateTask} onCancel={() => setIsModalOpen(false)} />
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
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
        <option value="">Select Assignee</option>
        {teamMembers.map((member) => (
          <option key={member.id} value={member.email}>
            {member.email}
          </option>
        ))}
      </select>
      <button type="submit">{task ? "Update Task" : "Add Task"}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TaskManagement;
