import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/event-form.css";

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    capacity: 0,
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Fetch categories
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/");
      
      console.log("🔥 Categories API response:", res);
      console.log("🔥 Categories data:", res.data);

      setCategories(res.data);
    } catch (err) {
      console.error("❌ Error fetching categories:", err.response || err);
    }
  };

  fetchCategories();
}, []);

  // 🔄 Fetch event (edit mode)
  useEffect(() => {
    if (id) {
      setLoading(true);
      API.get(`/events/${id}/`)
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            start_time: data.start_time?.slice(0, 16) || "",
            end_time: data.end_time?.slice(0, 16) || "",
            capacity: data.capacity || 0,
            category: data.category?.id || "",
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // ✅ Frontend validation
  if (!form.title || !form.start_time || !form.end_time) {
    return setError("Title, Start Time, and End Time are required.");
  }

  if (!form.category) {
    return setError("Please select a category.");
  }

  setLoading(true);

  try {
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      category: Number(form.category),
    };

    console.log("🚀 PAYLOAD:", payload);

    let response;

    if (id) {
      response = await API.put(`/events/${id}/`, payload);
    } else {
      response = await API.post("/events/", payload);
    }

    console.log("✅ SUCCESS RESPONSE:", response.data);

    navigate("/events");
  } catch (err) {
    console.error("🔥 FULL ERROR OBJECT:", err);

    // ✅ Case 1: Server responded (Django error)
    if (err.response) {
      console.error("🔥 BACKEND RESPONSE:", err.response.data);

      const data = err.response.data;

      // Django validation errors (field-based)
      if (typeof data === "object") {
        const messages = Object.entries(data)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`;
            }
            return `${key}: ${value}`;
          })
          .join(" | ");

        setError(messages || "Server error occurred.");
      } else {
        setError(data || "Server error occurred.");
      }
    }

    // ✅ Case 2: No response (server down / network)
    else if (err.request) {
      console.error("🔥 NO RESPONSE:", err.request);
      setError("No response from server. Is Django running?");
    }

    // ✅ Case 3: Something else
    else {
      console.error("🔥 UNKNOWN ERROR:", err.message);
      setError("Something went wrong. Try again.");
    }
  } finally {
    setLoading(false);
  }
};
  // 🎯 Get selected category name (for badge preview)
  const selectedCategory = categories.find(
    (c) => c.id === Number(form.category)
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="event-form-container">
      <form className="event-form-card" onSubmit={handleSubmit}>
        <h2>{id ? "Edit Event" : "Create Event"}</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />

        <textarea
          placeholder="Event Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <div className="date-row">
          <input
            type="datetime-local"
            value={form.start_time}
            onChange={(e) => handleChange("start_time", e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={form.end_time}
            onChange={(e) => handleChange("end_time", e.target.value)}
            required
          />
        </div>

        <input
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => handleChange("capacity", e.target.value)}
        />

        {/* 🎯 CATEGORY DROPDOWN */}
        <div className="category-wrapper">
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* 🏷️ Live Badge Preview */}
          {selectedCategory && (
            <span className="category-preview">
              {selectedCategory.name}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
}