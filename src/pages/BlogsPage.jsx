import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Terminal, Search, Sparkles, Trash2 } from 'lucide-react';

const FALLBACK_BLOGS = [
  {
    id: 1,
    num: '01',
    slug: 'rise-of-reasoning-models-deepseek-r1-test-time-compute',
    title: 'The Rise of Reasoning Models: How DeepSeek-R1 and Test-Time Compute are Reshaping AI',
    category: 'AI RESEARCH',
    tech_stack: 'DeepSeek-R1, OpenAI o1, Reinforcement Learning, Test-Time Compute, MCTS',
    difficulty: 'ADVANCED',
    read_time: '7 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    summary: 'A comprehensive breakdown of the newest frontier in AI research: how inference-time compute scaling, reinforcement learning without human feedback (RLVR), and tree-search thinking models like DeepSeek-R1 are outperforming pure pre-training scaling laws.',
    author: 'WHT AI Research Team'
  },
  {
    id: 2,
    num: '02',
    slug: 'nist-post-quantum-cryptography-ai-zero-day-threats',
    title: 'NIST Finalizes Post-Quantum Encryption Standards as AI Zero-Day Attacks Surge',
    category: 'CYBER SECURITY',
    tech_stack: 'Post-Quantum Cryptography, ML-KEM, ML-DSA, Zero Trust, eBPF',
    difficulty: 'INTERMEDIATE',
    read_time: '6 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    summary: 'NIST has officially published FIPS 203, 204, and 205, cementing the world\'s quantum-resistant cryptographic algorithms. We analyze why organizations are replacing RSA/ECC today and how automated AI threat hunting is mitigating weaponized zero-days.',
    author: 'WHT Security Desk'
  },
  {
    id: 3,
    num: '03',
    slug: 'react-19-deep-dive-compiler-actions-use-memo',
    title: 'React 19 Deep Dive: The React Compiler, Server Actions, and the Death of useMemo',
    category: 'REACT & WEB',
    tech_stack: 'React 19, React Compiler, useActionState, useOptimistic, RSC',
    difficulty: 'INTERMEDIATE',
    read_time: '5 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    summary: 'React 19 revolutionizes the React paradigm. Discover how the automated React Compiler eliminates manual dependency arrays and useMemo/useCallback, and how Actions and the useActionState hook drastically simplify forms and async state.',
    author: 'WHT Web Engineering'
  }
];

export default function BlogsPage({ blogs = [], onOpenNewTutorialModal, isAdmin = false, onDeleteBlog }) {
  const [activeTech, setActiveTech] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const displayBlogs = blogs;

  const techFilters = ['ALL', 'AI Research', 'DeepSeek-R1', 'Cyber Security', 'Post-Quantum', 'React 19', 'RSC'];

  const filteredBlogs = displayBlogs.filter(blog => {
    const stack = blog.tech_stack || blog.category || '';
    const title = blog.title || '';
    const summary = blog.summary || '';
    
    const matchesFilter = activeTech === 'ALL' || stack.toLowerCase().includes(activeTech.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stack.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-fade">
      {/* Blogs Page Hero */}
      <section className="hero-editorial">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>WHT PRACTICAL AI BLOGS & TUTORIALS</span>
          </div>


          <h1 className="hero-headline">
            Practical AI Blogs & Engineering Guides
          </h1>

          <p className="hero-subheadline">
            Explore step-by-step guides, code implementations, and tool breakdowns for modern software and AI builders.
          </p>

          {isAdmin && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={onOpenNewTutorialModal} className="btn btn-primary">
                <Plus size={18} /> POST NEW BLOG
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="section-padding">
        <div className="container">
          {blogs.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {techFilters.map(tech => (
                  <button
                    key={tech}
                    onClick={() => setActiveTech(tech)}
                    className={`category-pill ${activeTech === tech ? 'active' : ''}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search blogs & tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.6rem',
                    background: 'var(--bg-card)',
                    border: 'var(--border-subtle)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Blogs Grid or Uploads Coming Soon */}
          {blogs.length === 0 ? (
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid rgba(255, 207, 42, 0.2)', 
              borderRadius: '16px', 
              padding: '5rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 207, 42, 0.1)',
                border: '1px solid rgba(255, 207, 42, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-yellow)',
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                Uploads Coming Soon
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
                Our engineering team is actively writing practical AI tutorials, security deep-dives, and production architecture blueprints. Subscribe to our weekly dispatch to get notified the second new guides are published.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/newsletters" className="btn btn-primary">
                  Subscribe to Dispatches
                </Link>
                {isAdmin && (
                  <button onClick={onOpenNewTutorialModal} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} color="var(--color-yellow)" /> Publish First Blog
                  </button>
                )}
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <h3>No blogs match your filter "{searchQuery || activeTech}"</h3>
              <button onClick={() => { setActiveTech('ALL'); setSearchQuery(''); }} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-editorial">
              {filteredBlogs.map((blog, idx) => (
                <article key={blog.id || idx} className="blog-card">
                  <div className="blog-img-wrap">
                    <img src={blog.image_url || blog.image} alt={blog.title} />
                    <span className="blog-tag">{blog.difficulty || 'PRACTICAL'}</span>
                  </div>

                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-num">{blog.num || `0${idx + 1}`}</span>
                      <span>{blog.read_time || '5 MIN READ'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-yellow)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                      <Terminal size={13} /> {blog.tech_stack || 'Python, AI'}
                    </div>

                    <h3 className="blog-title">
                      {blog.title}
                    </h3>

                    <p className="blog-summary">
                      {blog.summary}
                    </p>

                    <div className="blog-footer">
                      <span className="blog-author">{blog.author || 'WHT Tech Team'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) {
                                if (onDeleteBlog) onDeleteBlog(blog.id);
                              }
                            }}
                            title="Delete Blog (Admin Only)"
                            style={{
                              background: 'rgba(230, 57, 70, 0.12)',
                              border: '1px solid var(--color-red)',
                              color: 'var(--color-red)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--color-red)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(230, 57, 70, 0.12)';
                              e.currentTarget.style.color = 'var(--color-red)';
                            }}
                          >
                            <Trash2 size={13} /> DELETE
                          </button>
                        )}
                        <Link to={`/article/${blog.slug}`} className="blog-arrow">
                          READ BLOG <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
