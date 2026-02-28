import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/register.css";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(form);
      setSuccess("Account created successfully 🎉");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Registration failed";

      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account 🚀</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="input-group">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </div>

        {/* 👁️ PASSWORD WITH TOGGLE */}
        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}