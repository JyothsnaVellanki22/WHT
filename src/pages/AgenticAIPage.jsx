import React, { useState, useEffect } from 'react';
import ArticleGrid from '../components/ArticleGrid';
import Newsletter from '../components/Newsletter';

const AgenticAIPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/agentic-ai")
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
              <h1 className="title-huge" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>Agentic AI Feed</h1>
              <p>Latest trends, tools, and models shaping the AI agent landscape.</p>
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

export default AgenticAIPage;
