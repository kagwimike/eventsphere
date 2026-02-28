import "../styles/about.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About EventSphere</h1>

        <p>
          EventSphere is a modern event management platform designed to simplify
          how people discover, create, and manage events. Whether it's a
          conference, workshop, concert, or meetup, EventSphere provides a
          seamless experience for both organizers and attendees.
        </p>

        <p>
          The platform supports real-time registrations, waitlist management,
          category-based filtering, and smart notifications to keep users
          informed at every stage of an event lifecycle.
        </p>

        <p>
          Built with a focus on scalability and clean system design, EventSphere
          demonstrates best practices in backend engineering, API design, and
          modern frontend development.
        </p>

        <div className="about-highlight">
          🚀 Built for performance. Designed for people.
        </div>
      </div>
    </div>
  );
}