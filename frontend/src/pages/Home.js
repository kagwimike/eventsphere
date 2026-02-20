import React from "react";
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to EventHub 🎉</h1>
      <p>Discover, create and manage events easily.</p>

      <div className="cta-buttons">
        <a href="/register" className="btn primary">Get Started</a>
        <a href="/login" className="btn secondary">Login</a>
      </div>
    </div>
  );
}

export default Home;
