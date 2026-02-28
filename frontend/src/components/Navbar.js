import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // =========================
  // 🔔 FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Notifications fetch error:", err.response || err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // 🔄 Poll every 10s (simulate real-time)
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // =========================
  // 🔴 UNREAD COUNT
  // =========================
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // =========================
  // ✅ MARK ONE AS READ
  // =========================
  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/`, { is_read: true });

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Mark read error:", err.response || err);
    }
  };

  // =========================
  // ✅ MARK ALL AS READ
  // =========================
  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read/");

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("❌ Mark all error:", err.response || err);
    }
  };

  // =========================
  // 🖱 CLOSE DROPDOWN OUTSIDE CLICK
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* 🔷 Logo */}
      <div className="logo">
        <NavLink to="/">EventHub</NavLink>
      </div>

      {/* 🍔 Mobile Toggle */}
      <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🔗 Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        </li>

        <li>
          <NavLink to="/events" onClick={closeMenu}>Events</NavLink>
        </li>

        {user ? (
          <>
            <li>
              <NavLink to="/events/new" onClick={closeMenu}>
                Create Event
              </NavLink>
            </li>

            {/* 🔔 NOTIFICATIONS */}
            <li className="notification-wrapper" ref={dropdownRef}>
              <div
                className="notification-bell"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}
              </div>

              {dropdownOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    {notifications.length > 0 && (
                      <button onClick={markAllAsRead}>
                        Mark all
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="empty">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-item ${n.is_read ? "read" : "unread"}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <span className="time">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>

            <li className="welcome">👋 {user.username}</li>

            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
            </li>

            <li>
              <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            </li>

            <li>
              <NavLink to="/register" onClick={closeMenu} className="register-btn">
                Get Started
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;