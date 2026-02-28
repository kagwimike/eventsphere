import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} EventSphere. All rights reserved.</p>

        <div className="socials">
          <a href="#" target="_blank" rel="noreferrer">🐦</a>
          <a href="#" target="_blank" rel="noreferrer">📸</a>
          <a href="#" target="_blank" rel="noreferrer">📘</a>
          <a href="#" target="_blank" rel="noreferrer">💼</a>
        </div>
      </div>
    </footer>
  );
}