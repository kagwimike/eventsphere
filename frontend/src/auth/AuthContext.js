import { createContext, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔑 Login using username & password (JWT)
  const login = async (username, password) => {
    try {
      // Request JWT tokens
      const res = await API.post("/token/", { username, password });

      // Save tokens in localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Optionally: set user directly from response
      setUser(res.data.user);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS CODE:", error.response?.status);
      throw error; // allow Login.js to catch & display the error
    }
  };

  // 🔑 Register new user
  const register = async (data) => {
    try {
      const res = await API.post("/auth/register/", data);
      return res.data; // optional: return created user
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS CODE:", error.response?.status);
      throw error; // allow Register.js to catch & display
    }
  };

  // 🔑 Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
