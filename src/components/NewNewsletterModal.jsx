import React, { useState } from 'react';
import { X, Send, Sparkles, Mail, Zap, CheckCircle2, Linkedin } from 'lucide-react';
import RichContentEditor from './RichContentEditor';

export default function NewNewsletterModal({ isOpen, onClose, onNewsletterSent, subscriberCount = 0 }) {
  const [formData, setFormData] = useState({
    edition: 'Edition #' + (Math.floor(Math.random() * 20) + 14),
    title: '',
    subject: '',
    tech_spotlight: '',
    linkedin_url: '',
    content: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [successResult, setSuccessResult] = useState(null);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill in the newsletter title and content.');
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      alert('Authentication required: You must be signed in as an administrator to broadcast a newsletter.');
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 401 || res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Access denied: Administrator permissions required to dispatch newsletters.');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to dispatch newsletter.');
      }

      const data = await res.json();
      if (data && data.newsletter) {
        setSuccessResult(data);
        if (onNewsletterSent) {
          onNewsletterSent(data.newsletter);
        }
      }
    } catch (err) {
      console.error('API error while sending newsletter:', err);
      alert(err.message || 'Failed to dispatch newsletter. Please check server connection.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    onClose();
  };

  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255, 207, 42, 0.35)',
        boxShadow: 'var(--shadow-hover)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
        padding: '2.5rem',
        color: 'var(--text-main)'
      }}>

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'var(--bg-card-hover)',
            color: 'var(--text-main)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {successResult ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 207, 42, 0.15)', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Newsletter Broadcasted!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              {successResult.message}
            </p>
            <div style={{ background: 'var(--bg-card-hover)', border: 'var(--border-subtle)', borderRadius: '8px', padding: '1.2rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-yellow)', fontWeight: 700 }}>SUBJECT: {formData.subject}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>RECIPIENTS: {successResult.recipient_count} enrolled student emails</div>
            </div>
            <button onClick={handleClose} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ marginBottom: '2rem', borderBottom: 'var(--border-subtle)', paddingBottom: '1.2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-yellow)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Mail size={14} /> WEEKLY DISPATCH ENGINE
              </div>
              <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>
                Draft & Broadcast Weekly Newsletter
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.4rem 0 0 0' }}>
                Sends to all enrolled student subscribers in the SQLite database.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div className="modal-grid-2">
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--color-yellow)', textTransform: 'uppercase' }}>
                    Edition
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: 'var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      background: 'var(--bg-card-hover)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--color-yellow)', textTransform: 'uppercase' }}>
                    Tech Spotlight Tool
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ollama 0.5 + DeepSeek-R1"
                    value={formData.tech_spotlight}
                    onChange={(e) => setFormData({ ...formData, tech_spotlight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: 'var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      background: 'var(--bg-card-hover)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>


              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  Newsletter Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'var(--bg-card-hover)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'var(--bg-card-hover)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  <Linkedin size={13} color="#0A66C2" /> LinkedIn Pulse / Article URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/pulse/your-article-slug/"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'var(--bg-card-hover)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <RichContentEditor

                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                label="Newsletter Content & In-Between Images"
                placeholder="Write your weekly dispatch and upload/insert images in-between paragraphs..."
                rows={8}
              />

              <div style={{ background: 'rgba(255, 207, 42, 0.08)', border: '1px dashed var(--color-yellow)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Zap size={20} color="var(--color-yellow)" />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <strong>Broadcast Ready:</strong> This will dispatch to all active student subscriber emails stored in the SQLite database.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn-primary"
                >
                  {isSending ? 'Broadcasting Emails...' : 'Send Weekly Newsletter'} <Send size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
