import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/login.css";

export default function Login() {
  const { login, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.username, form.password);
      navigate("/events");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{user ? "You’re signed in" : "Welcome back"}</h2>
        <p className="auth-subtitle">Sign in to explore and host events.</p>

        {error && <p className="error">{error}</p>}

        {!user ? (
          <>
            <label className="input-group">
              <span>Username</span>
              <input
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </label>

            <label className="input-group password-group">
              <span>Password</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            <button type="submit" className="submit-btn">Login</button>
            <p className="auth-link">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </>
        ) : (
          <>
            <p className="success">Welcome, {user.username}</p>
            <button type="button" className="submit-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </form>
    </div>
  );
}