import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', fontWeight: 600, border: 'var(--border-thick)', background: 'white' }}>No articles found.</div>;
  }

  return (
    <div className="grid-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          summary={article.summary}
          imageUrl={article.image_url}
          publishedAt={article.published_at}
          slug={article.slug}
          category={article.sub_category}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;
