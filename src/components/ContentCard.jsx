import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ContentCard({ title, excerpt, date, tag, link }) {
  return (
    <div className="card">
      {tag && <div className="card-tag">{tag}</div>}
      <h3>{title}</h3>
      <p>{excerpt}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
        <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{date}</span>
        <Link to={link} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          READ <ArrowRight size={18} style={{strokeWidth: 3}} />
        </Link>
      </div>
    </div>
  );
}
