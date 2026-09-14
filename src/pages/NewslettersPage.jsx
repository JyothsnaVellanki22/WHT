import React, { useState } from 'react';
import { Mail, Send, Check, Sparkles, Plus, Inbox } from 'lucide-react';

export default function NewslettersPage({ 
  subscriberCount = 5, 
  onSubscriberAdded, 
  onOpenNewNewsletterModal 
}) {
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

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenNewNewsletterModal} className="btn btn-primary">
              <Mail size={16} /> SEND NEW NEWSLETTER
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Card */}
      <section className="section-padding" style={{ borderBottom: 'var(--border-subtle)' }}>
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

      {/* Empty Newsletters Archive Placeholder */}
      <section className="section-padding" style={{ background: '#0D0D0F' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div style={{ 
            background: 'var(--bg-card)', 
            border: 'var(--border-subtle)', 
            borderRadius: '16px', 
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
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

            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.6rem', color: '#FFFFFF' }}>
              No Public Newsletters Published Yet
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '460px', marginBottom: '2rem', lineHeight: 1.6 }}>
              New weekly dispatches will appear here once broadcasted to subscribers. Click below to draft and send the first edition.
            </p>

            <button onClick={onOpenNewNewsletterModal} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="var(--color-yellow)" /> Draft & Send First Newsletter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
