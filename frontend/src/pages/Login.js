import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{user ? "You're Logged In" : "Login"}</h2>

        {error && <p className="error">{error}</p>}

        {!user ? (
          <>
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button type="submit">Login</button>
          </>
        ) : (
          <>
            <p className="success">Welcome, {user.username}</p>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </form>
    </div>
  );
}