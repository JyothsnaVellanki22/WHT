import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Columns, 
  Eye, 
  Edit3, 
  Sparkles,
  Layers,
  Tag,
  Mail,
  Linkedin
} from 'lucide-react';
import RichContentEditor from '../components/RichContentEditor';

export default function NewsletterEditorPage({ 
  mode = 'edit', 
  subscriberCount = 5,
  onNewsletterSent,
  onNewsletterUpdated,
  onNewsletterDeleted
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    edition: mode === 'new' ? `Edition #${Math.floor(Math.random() * 20) + 14}` : '',
    tech_spotlight: mode === 'new' ? 'Security & Cloud Systems' : '',
    linkedin_url: '',
    content: ''
  });

  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'write' | 'split' | 'preview'

  // Fetch newsletter in edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      setIsLoading(true);
      fetch(`/api/newsletters/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            // Fallback: try fetching all and filtering
            const allRes = await fetch('/api/newsletters');
            if (allRes.ok) {
              const list = await allRes.json();
              const found = list.find((n) => String(n.id) === String(id));
              if (found) return found;
            }
            throw new Error('Newsletter edition not found.');
          }
          return res.json();
        })
        .then((data) => {
          setFormData({
            title: data.title || '',
            subject: data.subject || '',
            edition: data.edition || '',
            tech_spotlight: data.tech_spotlight || '',
            linkedin_url: data.linkedin_url || '',
            content: data.content || ''
          });
          setIsLoading(false);
        })

        .catch((err) => {
          console.error('Error loading newsletter:', err);
          setIsError(true);
          setStatusMsg(err.message || 'Failed to load newsletter data.');
          setIsLoading(false);
        });
    }
  }, [mode, id]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setIsError(true);
      setStatusMsg('Headline / Title and Content are required.');
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      setIsError(true);
      setStatusMsg('Admin authentication required. Please sign in as an admin.');
      return;
    }

    setIsSaving(true);
    setStatusMsg('');
    setIsError(false);

    try {
      if (mode === 'edit') {
        const res = await fetch(`/api/newsletters/${id}`, {
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

        if (data.newsletter && onNewsletterUpdated) {
          onNewsletterUpdated(data.newsletter);
        }
        setIsError(false);
        setStatusMsg('✓ Edition changes saved successfully!');
        setTimeout(() => setStatusMsg(''), 3500);
      } else {
        // Create new newsletter
        const res = await fetch('/api/newsletters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Failed to dispatch newsletter.');
        }

        if (data.newsletter && onNewsletterSent) {
          onNewsletterSent(data.newsletter);
        }

        setIsError(false);
        setStatusMsg(`✓ Newsletter successfully broadcast to ${subscriberCount} subscribers!`);
        setTimeout(() => {
          navigate('/newsletters');
        }, 1200);
      }
    } catch (err) {
      setIsError(true);
      setStatusMsg(err.message || 'Error occurred while saving newsletter.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${formData.title || 'this newsletter'}"?`)) {
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      setIsError(true);
      setStatusMsg('Admin authentication required.');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/newsletters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to delete newsletter.');
      }

      if (onNewsletterDeleted) {
        onNewsletterDeleted(Number(id));
      }
      navigate('/newsletters');
    } catch (err) {
      setIsError(true);
      setStatusMsg(err.message || 'Failed to delete newsletter.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-yellow)' }}>
          <Sparkles className="spin" size={24} />
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Newsletter Edition...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Top Sticky Header */}
      <header style={{
        position: 'sticky',
        top: '64px',
        zIndex: 50,
        background: 'var(--bg-header)',
        backdropFilter: 'blur(16px)',
        borderBottom: 'var(--border-subtle)',
        padding: '0.8rem 2rem'
      }}>
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Left: Back Link & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/newsletters')}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={15} /> Back to Newsletters
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Newsletters</span>
              <span style={{ color: 'var(--text-subtle)' }}>/</span>
              <span style={{
                background: 'rgba(255, 207, 42, 0.1)',
                color: 'var(--color-yellow)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem'
              }}>
                {formData.edition || (mode === 'edit' ? `Edition #${id}` : 'New Edition')}
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {mode === 'edit' ? 'Editor' : 'Composer'}
              </span>
            </div>
          </div>

          {/* Right: View Mode Toggle & Primary Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            {/* View Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-card)',
              border: 'var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.2rem'
            }}>
              <button
                type="button"
                onClick={() => setViewMode('write')}
                style={{
                  background: viewMode === 'write' ? 'var(--color-yellow)' : 'transparent',
                  color: viewMode === 'write' ? '#0D0D0D' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Edit3 size={13} /> Editor Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                style={{
                  background: viewMode === 'split' ? 'var(--color-yellow)' : 'transparent',
                  color: viewMode === 'split' ? '#0D0D0D' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Columns size={13} /> Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                style={{
                  background: viewMode === 'preview' ? 'var(--color-yellow)' : 'transparent',
                  color: viewMode === 'preview' ? '#0D0D0D' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Eye size={13} /> Reader Preview
              </button>
            </div>

            {/* Action: Delete (Edit mode only) */}
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.82rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={14} /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}

            {/* Action: Save Changes or Dispatch */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1.3rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              {mode === 'edit' ? (
                <>
                  <Save size={15} /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </>
              ) : (
                <>
                  <Send size={15} /> {isSaving ? 'Dispatching...' : `Broadcast to ${subscriberCount} Subscribers`}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main style={{ maxWidth: '1500px', margin: '1.8rem auto 0 auto', padding: '0 2rem' }}>
        {/* Status / Alert Banner */}
        {statusMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.2rem',
            borderRadius: '10px',
            marginBottom: '1.4rem',
            background: isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            border: isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            color: isError ? '#f87171' : '#4ade80',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Metadata Inputs (Title, Subject, Edition, Tech Spotlight) */}
        <section style={{
          background: 'var(--bg-card)',
          border: 'var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.8rem',
          marginBottom: '1.8rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
            {/* Headline / Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Headline / Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Security Engineering Behind reCAPTCHA"
                style={{
                  width: '100%',
                  padding: '0.85rem 1.2rem',
                  background: 'var(--bg-card-hover)',
                  border: 'var(--border-subtle)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  outline: 'none',
                  fontFamily: 'var(--font-heading)',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Subject Line */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                <Mail size={13} color="var(--color-yellow)" /> Subscriber Email Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Human or Bot? The Security Decision Behind Every Request"
                style={{
                  width: '100%',
                  padding: '0.75rem 1.1rem',
                  background: 'var(--bg-card-hover)',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.96rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* 2-Column: Edition & Tech Spotlight */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  <Layers size={13} color="var(--color-yellow)" /> Edition Tag
                </label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  placeholder="e.g. Edition 1"
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    background: 'var(--bg-card-hover)',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  <Tag size={13} color="var(--color-yellow)" /> Technology Spotlight
                </label>
                <input
                  type="text"
                  value={formData.tech_spotlight}
                  onChange={(e) => setFormData({ ...formData, tech_spotlight: e.target.value })}
                  placeholder="e.g. Security & Cloud Defense"
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    background: 'var(--bg-card-hover)',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* LinkedIn Article / Post Link */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                <Linkedin size={13} color="#0A66C2" /> LinkedIn Pulse / Article URL (Optional)
              </label>
              <input
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://www.linkedin.com/pulse/your-article-slug/"
                style={{
                  width: '100%',
                  padding: '0.75rem 1.1rem',
                  background: 'var(--bg-card-hover)',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </section>


        {/* Content & Media Visual Workspace */}
        <section>
          <RichContentEditor
            value={formData.content}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            label="Edition Body, Diagrams & Visual Media"
            placeholder="Write newsletter article content here..."
          />
        </section>
      </main>
    </div>
  );
}
