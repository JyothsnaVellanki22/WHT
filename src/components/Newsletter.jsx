import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };
  
  return (
    <div className="newsletter-section section-padding">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title">GET THE WEEKLY EDGE</h2>
        <p style={{ fontWeight: '600', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Join 10,000+ others receiving the best insights on job markets, AI tools, and interview hacks. No fluff.
        </p>
        {subscribed ? (
          <div style={{ background: 'white', padding: '2rem', border: 'var(--border-thick)', boxShadow: 'var(--shadow-block)', maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
            <CheckCircle size={32} color="var(--color-red)" /> YOU ARE ON THE LIST!
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="ENTER YOUR EMAIL" required />
            <button type="submit">
              SUBSCRIBE <ArrowRight size={20} style={{strokeWidth: 3, verticalAlign: 'middle', marginLeft: '8px'}} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
