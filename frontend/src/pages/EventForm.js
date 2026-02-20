import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

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
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      API.get(`/events/${id}/`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (id) {
        await API.put(`/events/${id}/`, form);
      } else {
        await API.post("/events/", form);
      }
      navigate("/events");
    } catch (err) {
      console.error(err);
      setError("Failed to save event. Check console for details.");
    }
  };

  return (
    <div className="event-form">
      <h2>{id ? "Edit Event" : "Create Event"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <button type="submit">{id ? "Update Event" : "Create Event"}</button>
      </form>
    </div>
  );
}