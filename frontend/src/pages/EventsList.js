import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events/");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/${id}/`);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="events-list">
      <h2>Events</h2>
      <button onClick={() => navigate("/events/new")}>
        Create New Event
      </button>

      <ul>
        {events.map((event) => {
          const isOwner = user && user.username === event.owner;

          // ✅ Debug logs (SAFE)
          console.log("====== EVENT DEBUG ======");
          console.log("USER:", user);
          console.log("USER USERNAME:", user?.username);
          console.log("EVENT OWNER:", event.owner);
          console.log("MATCH:", isOwner);

          return (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <p>
                <strong>Location:</strong> {event.location} <br />
                <strong>Start:</strong>{" "}
                {new Date(event.start_time).toLocaleString()} <br />
                <strong>End:</strong>{" "}
                {new Date(event.end_time).toLocaleString()} <br />
                <strong>Capacity:</strong> {event.capacity} <br />
                <strong>Owner:</strong> {event.owner}
              </p>

              {/* ✅ OWNER CHECK */}
              {isOwner && (
                <div className="event-actions">
                  <button
                    onClick={() =>
                      navigate(`/events/${event.id}/edit`)
                    }
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(event.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}