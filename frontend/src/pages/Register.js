import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/register.css";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(form);
      setSuccess("Account created successfully.");
    } catch (err) {
      const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Join EventSphere and start hosting or attending great events.</p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label className="input-group">
          <span>Username</span>
          <input placeholder="Choose a username" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} required />
        </label>

        <label className="input-group">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
        </label>

        <label className="input-group password-group">
          <span>Password</span>
          <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          <button type="button" className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </label>

        <button type="submit" className="submit-btn">Register</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}