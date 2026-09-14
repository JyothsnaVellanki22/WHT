import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Terminal, Search, Sparkles, Trash2 } from 'lucide-react';

const FALLBACK_BLOGS = [

  {
    id: 1,
    num: '01',
    slug: 'building-local-autonomous-coding-agent-ollama-langchain',
    title: 'Building a Local Autonomous Coding Agent with Ollama and LangChain',
    category: 'AI TUTORIAL',
    tech_stack: 'Python, Ollama, LangChain, Llama 3',
    difficulty: 'INTERMEDIATE',
    read_time: '6 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    summary: 'Step-by-step practical guide for students: Setup local LLMs with Ollama, construct an AST tool execution pipeline in LangChain, and build an agent that autonomously reviews and refactors Python code.',
    author: 'Jyothsna Vellanki'
  },
  {
    id: 2,
    num: '02',
    slug: 'fine-tuning-llama-3-lora-pytorch-guide',
    title: 'Fine-Tuning Llama 3 with LoRA and PyTorch: Step-by-Step Practical Guide',
    category: 'HANDS-ON GUIDE',
    tech_stack: 'PyTorch, Hugging Face, PEFT, LoRA',
    difficulty: 'PRO',
    read_time: '8 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    summary: 'Learn parameter-efficient fine-tuning (PEFT) on consumer GPUs. We cover dataset formatting, QLoRA 4-bit quantization, Hugging Face SFTTrainer, and evaluating loss curves.',
    author: 'WHT Tech Team'
  },
  {
    id: 3,
    num: '03',
    slug: 'production-rag-chromadb-fastembed-hybrid-search',
    title: 'Production RAG with ChromaDB, FastEmbed & Hybrid Search',
    category: 'TOOLS & FRAMEWORKS',
    tech_stack: 'ChromaDB, FastEmbed, Python, Vector DB',
    difficulty: 'BEGINNER',
    read_time: '5 MIN READ',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    summary: 'Build a blazing-fast Retrieval-Augmented Generation system. Learn vector embedding creation, cosine similarity querying, reranking, and context injection into LLM prompts.',
    author: 'WHT Editorial'
  }
];

export default function BlogsPage({ blogs = [], onOpenNewTutorialModal, isAdmin = false, onDeleteBlog }) {
  const [activeTech, setActiveTech] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const displayBlogs = blogs.length > 0 ? blogs : FALLBACK_BLOGS;

  const techFilters = ['ALL', 'Python', 'LangChain', 'Ollama', 'PyTorch', 'Vector DB', 'LoRA'];

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

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={onOpenNewTutorialModal} className="btn btn-primary">
              <Plus size={18} /> POST NEW BLOG
            </button>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="section-padding">
        <div className="container">
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

          {/* Blogs Grid */}
          {filteredBlogs.length === 0 ? (
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
