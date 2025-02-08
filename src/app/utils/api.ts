import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export interface User {
  id: number;
  email: string;
  role: string;
  uuid: number;
  token: string;
}
// Specify the response type as User
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post<User>("/auth/login", { email, password });
    console.log("API login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Lempar error agar bisa ditangani di komponen yang memanggil
  }
};
export const logoutUser = async (token: string) => {
  await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
};

// Add other API functions as needed
