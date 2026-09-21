import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditNewsletterModal({ isOpen, onClose, newsletter, onNewsletterUpdated, onNewsletterDeleted }) {
  const [formData, setFormData] = useState({
    edition: '',
    title: '',
    subject: '',
    tech_spotlight: '',
    content: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (newsletter) {
      setFormData({
        edition: newsletter.edition || '',
        title: newsletter.title || '',
        subject: newsletter.subject || '',
        tech_spotlight: newsletter.tech_spotlight || '',
        content: newsletter.content || ''
      });
      setStatusMsg('');
      setIsError(false);
    }
  }, [newsletter]);

  if (!isOpen || !newsletter) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setIsError(true);
      setStatusMsg('Title and content are required.');
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      setIsError(true);
      setStatusMsg('Authentication required: Admin login required.');
      return;
    }

    setIsSaving(true);
    setStatusMsg('');
    setIsError(false);

    try {
      const res = await fetch(`/api/newsletters/${newsletter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to update newsletter.');
      }

      if (data.success && data.newsletter) {
        if (onNewsletterUpdated) {
          onNewsletterUpdated(data.newsletter);
        }
        setStatusMsg('Newsletter edition updated successfully!');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      setIsError(true);
      setStatusMsg(err.message || 'Error updating newsletter.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${newsletter.title}"?`)) {
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      setIsError(true);
      setStatusMsg('Authentication required: Admin login required.');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/newsletters/${newsletter.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to delete newsletter.');
      }

      if (data.success) {
        if (onNewsletterDeleted) {
          onNewsletterDeleted(newsletter.id);
        }
        onClose();
      }
    } catch (err) {
      setIsError(true);
      setStatusMsg(err.message || 'Error deleting newsletter.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255, 207, 42, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        position: 'relative',
        boxShadow: 'var(--shadow-hover)',
        color: 'var(--text-main)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.3rem' }}>
              ADMIN EDIT MODE
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0 }}>
              Edit Newsletter Edition
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-card-hover)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {statusMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            background: isError ? 'rgba(230, 57, 70, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            color: isError ? 'var(--color-red)' : '#22c55e',
            border: isError ? '1px solid rgba(230, 57, 70, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Edition Identifier
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                required
                placeholder="e.g. Edition #14"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-card-hover)',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Tech Spotlight Tag
              </label>
              <input
                type="text"
                value={formData.tech_spotlight}
                onChange={(e) => setFormData({ ...formData, tech_spotlight: e.target.value })}
                placeholder="e.g. DeepSeek-R1, Ollama"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-card-hover)',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Headline / Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Newsletter headline"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-card-hover)',
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="Email subject line"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-card-hover)',
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Edition Content & Code Notes
            </label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Write the newsletter essay or markdown/html notes..."
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--bg-card-hover)',
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                outline: 'none',
                fontFamily: 'var(--font-body)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: 'rgba(230, 57, 70, 0.1)',
                border: '1px solid rgba(230, 57, 70, 0.3)',
                color: 'var(--color-red)',
                padding: '0.75rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Trash2 size={16} /> {isDeleting ? 'Deleting...' : 'Delete Edition'}
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
