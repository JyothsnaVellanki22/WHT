import HeroSection from '../components/HeroSection';
import ContentCard from '../components/ContentCard';
import Newsletter from '../components/Newsletter';
import { Link } from 'react-router-dom';

export default function Home() {
  const featured = [
    { title: 'The 2026 Tech Layoff Survival Guide', excerpt: 'How to pivot fast when the market turns. Visas, networking, and survival tactics.', date: 'April 14', tag: 'Market Trends', link: '/trends' },
    { title: 'Resume Screening is now 100% AI', excerpt: 'If you are not optimizing for the machine, you are already rejected. Heres the workaround.', date: 'April 12', tag: 'Playbook', link: '/playbook' },
    { title: 'Automating Cold Outreach with Agentic AI', excerpt: 'Build a small python script to find recruiters, draft emails, and follow up autonomously.', date: 'April 10', tag: 'Agentic AI', link: '/agentic-ai' }
  ];

  return (
    <div className="page-fade">
      <HeroSection />
      
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Featured Intel</h2>
            <Link to="/trends" style={{ color: 'var(--accent-color)' }}>View all updates &rarr;</Link>
          </div>
          <div className="grid-3">
            {featured.map((post, i) => <ContentCard key={i} {...post} />)}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
