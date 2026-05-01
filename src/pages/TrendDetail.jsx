import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TrendDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/trends/${slug}`);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center', fontFamily: 'monospace' }}>
        <h2 className="title-huge" style={{marginTop: '4rem'}}>LOADING DATA...</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center' }}>
        <h1 className="title-huge" style={{marginTop: '4rem'}}>Article Not Found</h1>
        <Link to="/trends" className="btn btn-dark" style={{marginTop: '2rem'}}>Return to Trends</Link>
      </div>
    );
  }

  // Use a generic placeholder if image doesn't exist. Our backend currently doesn't scrape images yet.
  const imageUrl = article.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="section-padding container">
      <Link to="/trends" style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> BACK TO TRENDS
      </Link>
      
      <article className="card" style={{ maxWidth: '1000px', margin: '0 auto', boxShadow: '-8px 8px 0px rgba(0,0,0,1)', padding: '0'}}>
        {/* Header Image */}
        <div style={{ width: '100%', height: '400px', overflow: 'hidden', borderBottom: '3px solid #111' }}>
          <img 
            src={imageUrl} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Content Body */}
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="card-tag">{article.tag}</div>
            <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{article.date}</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', lineHeight: '1.1' }}>
            {article.title}
          </h1>
          
          <div 
            className="module-content" 
            style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
            
            {article.original_link && (
              <div style={{marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #eee'}}>
                <a href={article.original_link} target="_blank" rel="noopener noreferrer" style={{fontWeight: 'bold', textDecoration: 'underline'}}>
                  Read Original Article
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
