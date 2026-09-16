import { Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-editorial">
      <div className="container">
        <div className="footer-inner">
          <div>
            <Link to="/" className="logo-container" style={{ marginBottom: '0.8rem' }}>
              <div className="logo-wht">
                <span className="w-letter">W</span>
                <span className="h-letter">H</span>
                <span className="t-letter">T</span>
              </div>
              <span className="logo-script">What's Happening in Tech</span>
            </Link>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px' }}>
              Tracking daily tech shifts and publishing weekly essays on software, AI, and silicon for ambitious builders.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-main)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                Navigation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                <Link to="/blogs" style={{ color: 'var(--text-muted)' }}>Blogs</Link>
                <Link to="/newsletters" style={{ color: 'var(--text-muted)' }}>Newsletters</Link>
                <Link to="/about" style={{ color: 'var(--text-muted)' }}>About</Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-main)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                Connect
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                <a 
                  href="https://www.linkedin.com/company/113232583/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                  title="WHT LinkedIn Page"
                  className="social-icon-link"
                >
                  <Linkedin size={20} />
                </a>
                <span 
                  style={{ color: 'var(--text-muted)', opacity: 0.4, cursor: 'default', display: 'flex', alignItems: 'center' }} 
                  title="Instagram (Coming Soon)"
                >
                  <Instagram size={20} />
                </span>
                <span 
                  style={{ color: 'var(--text-muted)', opacity: 0.4, cursor: 'default', display: 'flex', alignItems: 'center' }} 
                  title="YouTube (Coming Soon)"
                >
                  <Youtube size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          <div>&copy; {new Date().getFullYear()} WHT (What's Happening in Tech). All rights reserved.</div>
          <div>Built for next-gen builders & engineers.</div>
        </div>
      </div>
    </footer>
  );
}
