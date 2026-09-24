import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, Check, Sparkles, Plus, Inbox, ExternalLink, Share2 } from 'lucide-react';
import { formatNewsletterContent } from '../components/RichContentEditor';

export default function NewslettersPage({ 
  newsletters = [],
  subscriberCount = 5, 
  onSubscriberAdded, 
  onOpenNewNewsletterModal,
  onEditNewsletter,
  isAdmin = false
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data && data.success) {
        setSubscribed(true);
        setEmail('');
        if (onSubscriberAdded) onSubscriberAdded();
      }
    } catch (err) {
      setSubscribed(true);
      setEmail('');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="page-fade">
      {/* Newsletter Page Hero */}
      <section className="hero-editorial">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-pill" style={{ margin: '0 auto 2rem auto' }}>
            <Sparkles size={14} />
            <span>WEEKLY TECH DISPATCH</span>
          </div>

          <h1 className="hero-headline" style={{ margin: '0 auto 1.5rem auto' }}>
            Weekly Newsletters
          </h1>

          <p className="hero-subheadline" style={{ margin: '0 auto 2.5rem auto' }}>
            Curated practical AI tools, architecture breakdowns, and developer blueprints dispatched directly to student builder inboxes every Sunday.
          </p>

          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/newsletters/new')} className="btn btn-primary">
                <Mail size={16} /> SEND NEW NEWSLETTER
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Subscription Card */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="newsletter-card">
            <span className="section-label">JOIN {subscriberCount}+ STUDENT BUILDERS</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>
              Subscribe to the Next Weekly Edition
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              Zero spam. Only practical code walkthroughs, tool updates, and local AI recipes.
            </p>

            {subscribed ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255, 207, 42, 0.15)', color: 'var(--color-yellow)', padding: '0.8rem 1.8rem', borderRadius: '9999px', fontWeight: 700 }}>
                <Check size={20} /> YOU ARE SUBSCRIBED TO THE WHT NEWSLETTER!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form-dark">
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your student email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={subscribing}>
                  {subscribing ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Newsletters Archive or Empty Uploads Coming Soon State */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          {newsletters.length === 0 ? (
            <div style={{ 
              background: 'var(--bg-card)', 
              border: 'var(--border-subtle)', 
              borderRadius: '16px', 
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(255, 207, 42, 0.08)', 
                border: '1px solid rgba(255, 207, 42, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-yellow)',
                marginBottom: '1.5rem'
              }}>
                <Inbox size={28} />
              </div>

              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                Uploads Coming Soon
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
                Our weekly tech dispatches are in production. Join over {subscriberCount}+ student builders by subscribing above to receive the first edition directly in your inbox.
              </p>

              {isAdmin && (
                <button onClick={() => navigate('/newsletters/new')} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} color="var(--color-yellow)" /> Draft & Send First Newsletter
                </button>
              )}
            </div>
          ) : (
            <div className="newsletter-article-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="section-label">EDITORIAL ARCHIVE</span>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0 }}>The AI Stack Publications</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {newsletters.length} {newsletters.length === 1 ? 'Edition' : 'Editions'} Published
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={() => navigate('/newsletters/new')} 
                      className="btn btn-outline" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      <Plus size={14} color="var(--color-yellow)" /> New Edition
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                {newsletters.map((item) => (
                  <article key={item.id} className="newsletter-article-card">
                    {/* Top Series & Edition Badge */}
                    <div className="newsletter-series-badge">
                      <span className="newsletter-series-tag">THE AI STACK</span>
                      <span className="newsletter-series-divider">•</span>
                      <span>{item.tech_spotlight || 'SECURITY JOURNEY'}</span>
                      {item.edition && (
                        <>
                          <span className="newsletter-series-divider">•</span>
                          <span>{item.edition}</span>
                        </>
                      )}
                    </div>

                    {/* Article Headline */}
                    <h1 className="newsletter-article-headline">
                      {item.title}
                    </h1>

                    {/* Subtitle / Deck */}
                    {item.subject && (
                      <p className="newsletter-article-deck">
                        {item.subject}
                      </p>
                    )}

                    {/* Article Body Content */}
                    <div 
                      className="newsletter-content"
                      dangerouslySetInnerHTML={{ __html: formatNewsletterContent(item.content) }}
                    />

                    {/* Action Buttons (LinkedIn & Share) */}
                    <div style={{ marginTop: '2.8rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <a
                        href="https://www.linkedin.com/pulse/ai-stack-security-journey-jyothsna-vellanki-11txf/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.6rem 1.4rem', textDecoration: 'none' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        Read & Connect on LinkedIn
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Article link copied to clipboard!');
                        }}
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}
                      >
                        <Share2 size={14} /> Share Article
                      </button>
                    </div>

                    {/* Metadata Footer */}
                    <div style={{ marginTop: '1.8rem', fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', gap: '1.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.2rem' }}>
                      <span>Dispatched to {item.recipient_count || subscriberCount} subscribers</span>
                      {item.sent_at && <span>Published {new Date(item.sent_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
