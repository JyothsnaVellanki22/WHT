import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, Check, Sparkles, Plus, Inbox, Edit2 } from 'lucide-react';
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="section-label">PAST DISPATCHES</span>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0 }}>Newsletter Archive</h2>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {newsletters.length} {newsletters.length === 1 ? 'Edition' : 'Editions'} Published
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {newsletters.map((item) => (
                  <div key={item.id} className="newsletter-card" style={{ textAlign: 'left', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div>
                        <span className="section-label" style={{ marginBottom: '0.3rem' }}>{item.edition}</span>
                        <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '0.2rem 0' }}>{item.title}</h3>
                        {item.subject && (
                          <div style={{ fontSize: '0.88rem', color: 'var(--color-yellow)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                            Subject: "{item.subject}"
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        {item.tech_spotlight && (
                          <span style={{ 
                            background: 'var(--bg-card-hover)', 
                            border: 'var(--border-subtle)', 
                            color: 'var(--text-muted)', 
                            borderRadius: '9999px', 
                            padding: '0.25rem 0.75rem', 
                            fontSize: '0.75rem', 
                            fontWeight: 700 
                          }}>
                            {item.tech_spotlight}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => navigate(`/newsletters/edit/${item.id}`)}
                            className="btn btn-outline"
                            style={{
                              padding: '0.3rem 0.8rem',
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              borderRadius: '9999px'
                            }}
                            title="Edit Newsletter (Admin Only - Opens Dedicated Page)"
                          >
                            <Edit2 size={13} color="var(--color-yellow)" /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <div 
                      className="newsletter-content"
                      style={{ marginBottom: '1.4rem' }}
                      dangerouslySetInnerHTML={{ __html: formatNewsletterContent(item.content) }}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', gap: '1.2rem' }}>
                      <span>Dispatched to {item.recipient_count || subscriberCount} subscribers</span>
                      {item.sent_at && <span>{new Date(item.sent_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
