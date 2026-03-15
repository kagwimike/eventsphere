import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} EventSphere. All rights reserved.</p>

        <div className="socials">
          {/* GitHub Profile */}
          <a 
            href="https://github.com/kagwimike" 
            target="_blank" 
            rel="noopener noreferrer"
            title="GitHub"
          >
            <i className="fab fa-github"></i> {/* If using FontAwesome */}
            GitHub
          </a>

          {/* LinkedIn Profile */}
          <a 
            href="https://linkedin.com/in/mike-kagwi-1829973aa" 
            target="_blank" 
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
            LinkedIn
          </a>

          {/* Twitter/X or Portfolio */}
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Twitter"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}