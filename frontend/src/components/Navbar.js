import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">EventHub</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>

        {user ? (
          <>
            {/* <li><Link to="/create-event">Create Event</Link></li> */}
            <li className="welcome">Hi, {user.username}</li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;