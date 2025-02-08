import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { loginUser, logoutUser } from "../utils/api";

export interface User {
  id: number;
  email: string;
  role: string;
  uuid: number; // Tambahkan uuid
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User; // Parse data user
        setUser({
          ...parsedUser,
          token: storedToken, // Tambahkan token ke state user
        });
        console.log("User data loaded from localStorage:", parsedUser); // Log data user
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user"); // Hapus data yang tidak valid
        localStorage.removeItem("token"); // Hapus token yang tidak valid
      }
    }
  }, []);

  // Login function using axios
  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password); // Panggil fungsi loginUser dari utils/api

      // Simpan data pengguna secara terpisah
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          uuid: userData.uuid,
        })
      );
      localStorage.setItem("token", userData.token); // Simpan token secara terpisah

      // Set state user
      setUser({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        uuid: userData.uuid,
        token: userData.token,
      });

      console.log("User logged in:", userData); // Log data user setelah login
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Lempar error agar bisa ditangani di komponen yang memanggil
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (user?.token) {
        await logoutUser(user.token); // Panggil fungsi logoutUser dari utils/api
      }
      setUser(null); // Hapus user data dari state
      localStorage.removeItem("user"); // Hapus data user dari localStorage
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
