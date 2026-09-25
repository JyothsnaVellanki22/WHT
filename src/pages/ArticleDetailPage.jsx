import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, Terminal, Layers, Code, Trash2 } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function ArticleDetailPage({ blogs = [], isAdmin = false, onDeleteBlog }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check in passed blogs props
    const match = blogs.find(b => b.slug === slug || String(b.id) === slug);
    if (match) {
      setTutorial(match);
      setLoading(false);
      return;
    }

    // 2. Fetch from backend API
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.title) {
          setTutorial(data);
        } else {
          setTutorial(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch tutorial:", err);
        setLoading(false);
      });
  }, [slug, blogs]);

  if (loading) {
    return (
      <div className="page-fade" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--color-yellow)' }}>LOADING TUTORIAL...</h2>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="page-fade">
        <section className="section-padding text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>TUTORIAL NOT FOUND</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              The requested practical tutorial could not be located.
            </p>
            <Link to="/" className="btn btn-primary">Return to Tutorials Feed</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-fade">
      <section style={{ padding: '4rem 0 2rem 0', borderBottom: 'var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-yellow)', letterSpacing: '0.05em' }}>
              <ArrowLeft size={16} /> BACK TO TUTORIALS
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isAdmin && (
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to permanently delete "${tutorial.title}"?`)) {
                      if (onDeleteBlog) {
                        const ok = await onDeleteBlog(tutorial.id);
                        if (ok) {
                          navigate('/blogs');
                        }
                      }
                    }
                  }}
                  title="Delete Blog (Admin Only)"
                  style={{
                    background: 'rgba(230, 57, 70, 0.15)',
                    border: '1px solid var(--color-red)',
                    color: 'var(--color-red)',
                    borderRadius: '9999px',
                    padding: '0.2rem 0.8rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-red)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(230, 57, 70, 0.15)';
                    e.currentTarget.style.color = 'var(--color-red)';
                  }}
                >
                  <Trash2 size={13} /> DELETE BLOG
                </button>
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0D0D0D', background: 'var(--color-yellow)', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                {tutorial.difficulty || 'PRACTICAL'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-red)', background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.25)', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                {tutorial.category || 'AI TUTORIAL'}
              </span>
            </div>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.15, marginBottom: '1.5rem', fontWeight: 800 }}>
            {tutorial.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-yellow)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <Terminal size={16} /> <span>Tech Stack: {tutorial.tech_stack || 'Python, AI, Ollama'}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>By {tutorial.author || 'WHT Tech Team'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {tutorial.read_time || tutorial.readTime || '5 MIN READ'}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              {tutorial.linkedin_url && (
                <a 
                  href={tutorial.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Linkedin size={14} /> VIEW ON LINKEDIN
                </a>
              )}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Share2 size={14} /> SHARE TUTORIAL
              </a>
            </div>
          </div>
        </div>
      </section>


      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          {(tutorial.image_url || tutorial.image) && (
            <div style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', border: 'var(--border-subtle)', marginBottom: '3rem' }}>
              <img src={tutorial.image_url || tutorial.image} alt={tutorial.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ background: 'var(--bg-card)', border: 'var(--border-subtle)', borderRadius: '14px', padding: '3.5rem' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '2.5rem', paddingLeft: '1.2rem', borderLeft: '3px solid var(--color-yellow)', background: 'rgba(255, 207, 42, 0.04)', padding: '1rem 1.2rem', borderRadius: '0 8px 8px 0' }}>
              <strong>Prerequisites & Takeaway:</strong> {tutorial.summary}
            </div>
            
            <div 
              style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(
                  (tutorial.content || '').includes('<') 
                    ? (tutorial.content || '') 
                    : `<p>${(tutorial.content || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
                )
              }} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
