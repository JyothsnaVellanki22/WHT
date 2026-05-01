import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { ArrowLeft } from 'lucide-react';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/articles/${slug}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch article", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="title-huge">LOADING...</h1>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-fade">
        <section className="section-padding text-center">
          <div className="container">
            <h1 className="title-huge" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>ARTICLE NOT FOUND</h1>
            <Link to="/" className="btn" style={{ marginTop: '2rem' }}>Return Home</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-fade">
      <section className="hero" style={{ background: 'white', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link to={article.category === 'AGENTIC_AI' ? '/agentic-ai' : '/trends'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-red)' }}>
              <ArrowLeft size={18} style={{ strokeWidth: 3 }} /> BACK TO FEED
            </Link>
            {article.sub_category && <span className="card-tag" style={{ marginLeft: '1rem', display: 'inline-block' }}>{article.sub_category}</span>}
          </div>
          
          <h1 className="title-huge" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>{article.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '2rem', borderBottom: 'var(--border-thick)', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            <span style={{ marginRight: '1.5rem', color: 'var(--color-pink)' }}>{article.source_name}</span>
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {article.image_url && (
            <div style={{ width: '100%', height: '400px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-block)', marginBottom: '3rem', background: '#eee' }}>
              <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div className="article-body" style={{ fontSize: '1.25rem', lineHeight: 1.8 }}>
            <p style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--color-red)' }}>{article.summary}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </section>
      
      <style>{`
        .article-body p { margin-bottom: 1.5rem; }
        .article-body h2 { font-size: 2.5rem; margin-top: 3rem; margin-bottom: 1rem; color: #111; }
        .article-body ul { margin-bottom: 1.5rem; padding-left: 2rem; list-style-type: square; }
        .article-body li { margin-bottom: 0.5rem; }
      `}</style>
      
      <Newsletter />
    </div>
  );
};

export default ArticleDetailPage;
