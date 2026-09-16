import React, { useState } from 'react';
import { X, ShieldAlert, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { email: email.trim(), password, name: name.trim() || 'Student Builder' }
      : { email: email.trim(), password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success && data.access_token) {
        localStorage.setItem('wht_auth_token', data.access_token);
        localStorage.setItem('wht_user_profile', JSON.stringify(data.user));
        onAuthSuccess(data.user, data.access_token);
        setEmail('');
        setPassword('');
        setName('');
        onClose();
      } else {
        setError(data.detail || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#151518',
          border: '1px solid rgba(255, 207, 42, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2.5rem',
          color: '#FFFFFF'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.3rem' }}>
              DATABASE RBAC AUTH
            </span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#FFFFFF' }}>
              {isRegister ? 'Create Builder Account' : 'Sign In to WHT'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(230, 57, 70, 0.12)', border: '1px solid var(--color-red)', color: 'var(--color-red)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem', justifyContent: 'center', marginBottom: '1.2rem' }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.2rem', textAlign: 'center', fontSize: '0.82rem' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-yellow)', cursor: 'pointer', fontWeight: 700, padding: 0 }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
