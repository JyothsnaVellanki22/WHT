import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ArticleCard = ({ title, summary, imageUrl, publishedAt, slug, category }) => {
  return (
    <div className="card">
      {imageUrl && (
        <div style={{ height: '220px', width: 'calc(100% + 4rem)', marginBottom: '1.5rem', borderBottom: 'var(--border-thick)', overflow: 'hidden', margin: '-2rem -2rem 1.5rem -2rem' }}>
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {category && <div className="card-tag">{category}</div>}
      <h3>{title}</h3>
      <p>{summary}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
        <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
          {new Date(publishedAt).toLocaleDateString()}
        </span>
        <Link to={`/article/${slug}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          READ <ArrowRight size={18} style={{strokeWidth: 3}} />
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
