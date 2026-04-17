import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Trends', path: '/trends' },
    { name: 'Agentic AI', path: '/agentic-ai' },
    { name: 'Playbook', path: '/playbook' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="nav-brand">
          <Link to="/" className="logo-container">
            <div className="logo-wht">
              <span className="w-letter">W</span>
              <span className="h-letter">H</span>
              <span className="t-letter">T</span>
            </div>
            <span className="logo-script">What's Happening in Tech</span>
          </Link>
        </div>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{ color: location.pathname === link.path ? 'var(--color-red)' : '#111' }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
