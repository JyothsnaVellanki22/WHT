import React, { useState, useEffect } from 'react';
import ArticleGrid from '../components/ArticleGrid';
import Newsletter from '../components/Newsletter';

const TrendsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/_/backend/api/trends")
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch articles", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-fade">
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <h1 className="title-huge" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>Tech Trends Feed</h1>
              <p>The shifting landscape of tech, from cloud optimization to developer tools.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <h2 className="section-title">Latest Intel</h2>
          {loading ? (
            <h3 style={{fontFamily: 'var(--font-display)', fontSize: '2rem'}}>LOADING FEED...</h3>
          ) : (
            <ArticleGrid articles={articles} />
          )}
        </div>
      </section>
      
      <Newsletter />
    </div>
  );
};

export default TrendsPage;
