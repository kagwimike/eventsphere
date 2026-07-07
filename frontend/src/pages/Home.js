import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <section className="home">
      <div className="hero-card">
        <p className="eyebrow">Modern event experiences</p>
        <h1>Bring people together around memorable events.</h1>
        <p className="hero-copy">
          Discover, create, and manage community experiences with a calm, polished interface that keeps everyone informed.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
