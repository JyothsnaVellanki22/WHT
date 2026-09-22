import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Mail, Sun, Moon, Menu, X, Lock, ShieldCheck, LogOut, User, BarChart2 } from 'lucide-react';

export default function Navbar({ 
  onOpenNewTutorialModal, 
  onOpenNewNewsletterModal, 
  theme = 'dark', 
  onToggleTheme,
  currentUser = null,
  isAdmin = false,
  onOpenAuthModal,
  onLogout
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Newsletters', path: '/newsletters' },
    { name: 'About', path: '/about' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Brand Logo */}
        <div className="nav-brand">
          <Link to="/" className="logo-container" onClick={handleLinkClick}>
            <div className="logo-wht">
              <span className="w-letter">W</span>
              <span className="h-letter">H</span>
              <span className="t-letter">T</span>
            </div>
            <span className="logo-script">What's Happening in Tech</span>
          </Link>
        </div>

        {/* Desktop Navigation Links & Action Buttons */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              style={{ color: location.pathname === link.path ? 'var(--color-yellow)' : 'var(--text-muted)' }}
            >
              {link.name}
            </Link>
          ))}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isAdmin && (
              <>
                <Link
                  to="/admin/analytics"
                  className="btn btn-outline"
                  style={{ 
                    padding: '0.45rem 0.95rem', 
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    borderColor: location.pathname === '/admin/analytics' ? 'var(--color-yellow)' : undefined,
                    color: location.pathname === '/admin/analytics' ? 'var(--color-yellow)' : undefined
                  }}
                  title="Admin Analytics & Open Rates"
                >
                  <BarChart2 size={14} color="var(--color-yellow)" /> ANALYTICS
                </Link>

                <Link 
                  to="/newsletters/new"
                  className="btn btn-outline"
                  style={{ 
                    padding: '0.45rem 1rem', 
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Create and broadcast new newsletter edition"
                >
                  <Mail size={14} color="var(--color-yellow)" /> NEWSLETTER
                </Link>

                <button 
                  onClick={onOpenNewTutorialModal}
                  className="btn btn-post"
                  style={{ 
                    padding: '0.45rem 1.1rem', 
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={15} /> POST BLOG
                </button>
              </>
            )}

            {/* RBAC User Session / Admin Badge */}
            {currentUser ? (
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.45rem', 
                  background: isAdmin ? 'rgba(255, 207, 42, 0.12)' : 'var(--bg-card-hover)', 
                  border: isAdmin ? '1px solid var(--color-yellow)' : 'var(--border-subtle)', 
                  borderRadius: '9999px', 
                  padding: '0.4rem 0.85rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: isAdmin ? 'var(--color-yellow)' : 'var(--text-main)' 
                }}
              >
                {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                <span>{isAdmin ? 'ADMIN' : (currentUser.name || 'STUDENT')}</span>
                <button 
                  onClick={onLogout} 
                  title="Sign Out" 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0 0 0 0.25rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuthModal}
                className="btn btn-outline"
                title="Sign in or register"
                style={{ 
                  padding: '0.45rem 0.85rem', 
                  fontSize: '0.8rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem'
                }}
              >
                <User size={13} /> SIGN IN
              </button>
            )}

            {/* Theme Toggle Button at the end */}
            <button 
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Bright / Dark Theme"
              style={{ marginLeft: '0.2rem' }}
            >
              {theme === 'dark' ? <Sun size={18} color="var(--color-yellow)" /> : <Moon size={18} color="var(--color-red)" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Controls */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Bright / Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="var(--color-yellow)" /> : <Moon size={18} color="var(--color-red)" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.6rem', borderRadius: '8px' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={handleLinkClick}
                style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 700, 
                  color: location.pathname === link.path ? 'var(--color-yellow)' : 'var(--text-main)',
                  padding: '0.4rem 0'
                }}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', paddingTop: '1rem', borderTop: 'var(--border-subtle)' }}>
                <Link
                  to="/admin/analytics"
                  onClick={handleLinkClick}
                  className="btn btn-outline"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <BarChart2 size={16} color="var(--color-yellow)" /> ANALYTICS DASHBOARD
                </Link>

                <Link 
                  to="/newsletters/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Mail size={16} color="var(--color-yellow)" /> SEND NEWSLETTER
                </Link>

                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenNewTutorialModal(); }}
                  className="btn btn-post"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> POST BLOG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
