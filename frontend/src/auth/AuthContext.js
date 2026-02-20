import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me/");
      setUser(res.data);
    } catch (error) {
      console.error("FETCH USER ERROR:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Login
  const login = async (username, password) => {
    try {
      const res = await API.post("/token/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ Immediately fetch user after login
      await fetchUser();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS CODE:", error.response?.status);
      throw error;
    }
  };

  // 🔑 Register
  const register = async (data) => {
    try {
      const res = await API.post("/auth/register/", data);
      return res.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS CODE:", error.response?.status);
      throw error;
    }
  };

  // 🔑 Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // 🔁 Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};