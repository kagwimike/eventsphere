import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/event-list.css";

export default function EventsList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  // 🔄 Fetch events (with filter)
  const fetchEvents = async (category = "") => {
    setLoading(true);
    try {
      const url = category
        ? `/events/filter/?category=${category}`
        : `/events/`;

      const res = await API.get(url);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  // 🔍 Handle filter
  const handleFilterChange = (value) => {
    setSelectedCategory(value);
    fetchEvents(value);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${eventId}/`);
      fetchEvents(selectedCategory);
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Discover Events</h2>

        {/* 🔍 FILTER DROPDOWN */}
        <select
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name.toLowerCase()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {events.length === 0 && <p>No events found</p>}

      <div className="events-grid">
        {events.map((event) => {
          const eventId = event.id;

          const confirmed = event.confirmed_count || 0;
          const capacity = event.capacity || 0;
          const isFull = confirmed >= capacity;

          return (
            <div key={eventId} className="event-card fade-in">
              
              {/* 🎯 CATEGORY BADGE */}
              {event.category && (
                <span className="category-badge">
                  {event.category.name}
                </span>
              )}

              <h3>{event.title}</h3>
              <p>{event.description?.slice(0, 80)}...</p>

              <p className="meta">📍 {event.location}</p>
              <p className="meta">👤 {event.owner}</p>

              <p className="capacity">
                {confirmed}/{capacity} {isFull && "• FULL"}
              </p>

              <Link to={`/events/${eventId}`} className="view-btn">
                View Details
              </Link>

              {user && user.username === event.owner && (
                <div className="owner-actions">
                  <button onClick={() => navigate(`/events/${eventId}/edit`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(eventId)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}