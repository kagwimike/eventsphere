import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/event-detail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [comment, setComment] = useState("");
  const [commentStatus, setCommentStatus] = useState("");

  // ---------------------------
  // 🔄 Fetch event + registrations
  // ---------------------------
  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/events/${id}/`);
      const data = res.data;
      setEvent(data);

      // Set registration status for current user
      if (user && data.registrations) {
        const existing = data.registrations.find(r => r.user === user.username);
        setIsRegistered(!!existing);
        setStatus(existing ? (existing.waitlist ? "You are on the waitlist" : "You are registered") : "");
      }

      // Owner sees full registration list
      if (user && data.owner === user.username) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      alert("Failed to load event. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id, user]);

  // ---------------------------
  // 📊 Capacity
  // ---------------------------
  const confirmedCount = event?.confirmed_count || 0;
  const waitlistCount = event?.waitlist_count || 0;
  const isFull = confirmedCount >= (event?.capacity || 0);

  // ---------------------------
  // 📝 Register
  // ---------------------------
  const handleRegister = async () => {
    if (!user) return alert("You must be logged in to register!");

    try {
      const res = await API.post(`/events/${id}/register/`, {});
      const msg = res.data.waitlist
        ? "Event full. You’ve been added to the waitlist."
        : "Successfully registered!";
      alert(msg);
      setStatus(msg);
      setIsRegistered(true);
      fetchEvent();
    } catch (err) {
      console.error("Registration error:", err);
      const detail = err.response?.data?.detail || "Failed to register.";
      alert(detail);
      setStatus(detail);
    }
  };

  // ---------------------------
  // ❌ Unregister
  // ---------------------------
  const handleUnregister = async () => {
    try {
      await API.delete(`/events/${id}/unregister/`);
      alert("You have been unregistered.");
      setStatus("You have been unregistered.");
      setIsRegistered(false);
      fetchEvent();
    } catch (err) {
      console.error("Unregister error:", err);
      const detail = err.response?.data?.detail || "Failed to unregister";
      alert(detail);
      setStatus(detail);
    }
  };

  // ---------------------------
  // ✏️ Edit Event
  // ---------------------------
  const handleEdit = () => navigate(`/events/${id}/edit`);

  // ---------------------------
  // 🗑️ Delete Event
  // ---------------------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/events/${id}/`);
      alert("Event deleted successfully.");
      navigate("/events");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.detail || "Failed to delete event");
    }
  };

  // ---------------------------
  // 💬 Add Comment
  // ---------------------------
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await API.post(`/events/${id}/comments/`, { content: comment });
      setComment("");
      setCommentStatus("Comment added!");
      fetchEvent();
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to post comment. Check console for details.");
      setCommentStatus("Failed to post comment");
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="event-detail">
      <h2>{event.title}</h2>
      {event.category && <p className="category">📂 {event.category.name}</p>}
      <p className="description">{event.description}</p>

      <div className="event-meta">
        <p><strong>📍 Location:</strong> {event.location}</p>
        <p><strong>🕒 Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
        <p><strong>🕒 End:</strong> {new Date(event.end_time).toLocaleString()}</p>
        <p><strong>👤 Owner:</strong> {event.owner}</p>
      </div>

      <div className="event-capacity">
        <p><strong>Capacity:</strong> {confirmedCount} / {event.capacity}</p>
        {isFull && <p className="full">⚠️ Event is FULL</p>}
        {waitlistCount > 0 && <p className="waitlist">{waitlistCount} people on waitlist</p>}
      </div>

      <div className="event-actions">
        {!user ? (
          <p>Please log in to register.</p>
        ) : isRegistered ? (
          <>
            <p className="status">{status}</p>
            {!status.includes("waitlist") && (
              <button className="unregister-btn" onClick={handleUnregister}>Unregister</button>
            )}
          </>
        ) : (
          <button className="register-btn" onClick={handleRegister}>
            {isFull ? "Join Waitlist" : "Register"}
          </button>
        )}

        {user && event.owner === user.username && (
          <div className="owner-actions">
            <button className="edit-btn" onClick={handleEdit}>Edit Event</button>
            <button className="delete-btn" onClick={handleDelete}>Delete Event</button>
          </div>
        )}
      </div>

      {user && event.owner === user.username && (
        <div className="registrations-list">
          <h3>👥 Registered Users</h3>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            registrations.map(r => (
              <div key={r.id} className="registration-card">
                <p>{r.user} {r.waitlist ? "(Waitlist)" : ""}</p>
              </div>
            ))
          )}
        </div>
      )}

      <div className="comments-section">
        <h3>💬 Comments</h3>
        {event.comments?.length === 0 ? <p>No comments yet.</p> :
          event.comments.map(c => (
            <div key={c.id} className="comment-card">
              <p className="comment-user">{c.user}</p>
              <p>{c.content}</p>
              <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
            </div>
          ))
        }
        {user && (
          <div className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleComment}>Post Comment</button>
            {commentStatus && <p className="comment-status">{commentStatus}</p>}
          </div>
        )}
      </div>
    </div>
  );
}