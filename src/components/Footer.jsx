import { Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="logo-container" style={{ marginBottom: '2rem' }}>
          <div className="logo-wht">
            <span className="w-letter">W</span>
            <span className="h-letter">H</span>
            <span className="t-letter">T</span>
          </div>
          <span className="logo-script">What's Happening in Tech</span>
        </div>
        <p style={{ maxWidth: '500px', margin: '0 auto 2rem', fontWeight: 600 }}>
          Decoding tech, built for next gen
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <a href="#" className="footer-icon-link" aria-label="LinkedIn"><Linkedin size={28} /></a>
          <a href="#" className="footer-icon-link" aria-label="Instagram"><Instagram size={28} /></a>
          <a href="#" className="footer-icon-link" aria-label="YouTube"><Youtube size={28} /></a>
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          &copy; {new Date().getFullYear()} WHT. Built with React.
        </p>
      </div>
    </footer>
  );
}
