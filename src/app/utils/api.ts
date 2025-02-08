import axios from "axios";
import { User } from "../context/AuthContext"; // Import the User interface

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Specify the response type as User
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await api.post<User>("/auth/login", { email, password });

  console.log("API Response:", response.data); // 🔍 Debugging
  return response.data;
};

export const logoutUser = async (token: string) => {
  await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
};

// Add other API functions as needed
