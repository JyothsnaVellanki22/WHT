import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  return (
    <div className="newsletter-section section-padding">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title">GET THE WEEKLY EDGE</h2>
        <p style={{ fontWeight: '600', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Join 10,000+ others receiving the best insights on job markets, AI tools, and interview hacks. No fluff.
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="ENTER YOUR EMAIL" required />
          <button type="submit">
            SUBSCRIBE <ArrowRight size={20} style={{strokeWidth: 3, verticalAlign: 'middle', marginLeft: '8px'}} />
          </button>
        </form>
      </div>
    </div>
  );
}
