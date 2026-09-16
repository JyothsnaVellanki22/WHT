import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Sparkles, Check, ArrowRight, BookOpen, Layers, Mail, Terminal, Cpu, Zap, Code2, Trash2 } from 'lucide-react';
import InfiniteMenu from '../components/ui/InfiniteMenu';

export default function Home({
  blogs = [],
  subscriberCount = 5,
  onSubscriberAdded,
  onOpenNewTutorialModal,
  onOpenNewNewsletterModal,
  isAdmin = false,
  onDeleteBlog
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Take the latest/first blog as the featured blog
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data && data.success) {
        setSubscribed(true);
        setEmail('');
        if (onSubscriberAdded) onSubscriberAdded();
      }
    } catch (err) {
      setSubscribed(true);
      setEmail('');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="page-fade">
      {/* 1. Platform Landing Hero */}
      <section className="hero-editorial">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>WHT • PRACTICAL TECH & AI LEARNING PLATFORM</span>
          </div>


          <h1 className="hero-headline">
            Learn Modern AI & Emerging Tech by Building.
          </h1>

          <p className="hero-subheadline">
            Hands-on technical essays, architecture blueprints, and weekly tool deep dives for students and engineers. No abstract theories—just code, tools, and real-world implementations.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/blogs" className="btn btn-primary">
              EXPLORE ALL BLOGS <ArrowRight size={18} />
            </Link>

            <Link to="/newsletters" className="btn btn-outline">
              <Mail size={16} color="var(--color-yellow)" /> VIEW NEWSLETTERS
            </Link>

            {isAdmin && (
              <button onClick={onOpenNewTutorialModal} className="btn btn-post">
                <Plus size={18} /> POST BLOG
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Platform Impact Metrics Strip */}
      <section className="metrics-strip">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-num">{subscriberCount}+</div>
              <div className="metric-label">Enrolled Student Builders</div>
            </div>
            <div className="metric-card">
              <div className="metric-num">100%</div>
              <div className="metric-label">Practical Code & Tool Guides</div>
            </div>
            <div className="metric-card">
              <div className="metric-num">Weekly</div>
              <div className="metric-label">Direct Email Broadcasts</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ticker Strip */}
      <InfiniteMenu />

      {/* 4. Core Learning Pillars (Distinct to Home Page) */}
      <section className="section-padding">
        <div className="container">
          <span className="section-label">WHAT YOU LEARN AT WHT</span>
          <h2 className="section-headline">
            Three Core Engineering Pillars
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Pillar 1 */}
            <div style={{ background: 'var(--bg-card)', border: 'var(--border-subtle)', borderRadius: '14px', padding: '2.5rem', transition: 'transform 0.2s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255, 207, 42, 0.1)', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                Autonomous AI Agents
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Master deterministic tool execution, LangChain orchestration, multi-agent communication protocols, and local agent runtimes.
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
                LangChain • Ollama • LangGraph • Llama 3
              </div>
            </div>

            {/* Pillar 2 */}
            <div style={{ background: 'var(--bg-card)', border: 'var(--border-subtle)', borderRadius: '14px', padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                Silicon & Fine-Tuning
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Learn parameter-efficient fine-tuning (LoRA / QLoRA), 4-bit quantization, PyTorch loss curve optimization, and hardware memory scaling.
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
                PyTorch • Hugging Face • PEFT • LoRA
              </div>
            </div>

            {/* Pillar 3 */}
            <div style={{ background: 'var(--bg-card)', border: 'var(--border-subtle)', borderRadius: '14px', padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255, 207, 42, 0.1)', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Code2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                Production RAG & Vector DBs
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Construct lightning-fast semantic retrieval engines, embedding rerankers, and context injection pipelines on your private code.
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
                ChromaDB • FastEmbed • Python • Vector Search
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Spotlight Blog of the Week */}
      <section className="section-padding" style={{ background: 'rgba(255, 255, 255, 0.015)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label">SPOTLIGHT GUIDE OF THE WEEK</span>
              <h2 className="section-headline" style={{ margin: 0 }}>
                Featured Engineering Blog
              </h2>
            </div>
            <Link to="/blogs" className="btn btn-outline">
              VIEW ALL BLOGS ({blogs.length}) <ArrowRight size={16} />
            </Link>
          </div>

          {!featuredBlog ? (
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid rgba(255, 207, 42, 0.2)', 
              borderRadius: '16px', 
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
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
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                Uploads Coming Soon
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '520px', lineHeight: 1.6, marginBottom: '2rem' }}>
                Practical technical breakdowns, local AI recipes, and architecture blueprints are currently in development. Subscribe below to be the first to read new releases.
              </p>
              {isAdmin && (
                <button onClick={onOpenNewTutorialModal} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Publish First Blog Post
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid rgba(255, 207, 42, 0.25)', 
              borderRadius: '16px', 
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))'
            }}>
              <div style={{ height: '380px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={featuredBlog.image_url || featuredBlog.image} 
                  alt={featuredBlog.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="blog-tag" style={{ top: '1.5rem', left: '1.5rem' }}>
                  FEATURED SPOTLIGHT
                </span>
              </div>

              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-red)' }}>{featuredBlog.difficulty || 'INTERMEDIATE'}</span>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>• {featuredBlog.read_time || '6 MIN READ'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-yellow)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                    <Terminal size={14} /> {featuredBlog.tech_stack || 'Python, Ollama, LangChain'}
                  </div>

                  <h3 style={{ fontSize: '1.8rem', lineHeight: 1.25, marginBottom: '1rem', color: '#FFFFFF' }}>
                    {featuredBlog.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {featuredBlog.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to={`/article/${featuredBlog.slug}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    READ FULL BLOG <ArrowRight size={18} />
                  </Link>
                  {isAdmin && featuredBlog.id && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to permanently delete "${featuredBlog.title}"?`)) {
                          if (onDeleteBlog) onDeleteBlog(featuredBlog.id);
                        }
                      }}
                      title="Delete Blog (Admin Only)"
                      style={{
                        background: 'rgba(230, 57, 70, 0.15)',
                        border: '1px solid var(--color-red)',
                        color: 'var(--color-red)',
                        borderRadius: '8px',
                        padding: '0.65rem 1.1rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-red)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(230, 57, 70, 0.15)';
                        e.currentTarget.style.color = 'var(--color-red)';
                      }}
                    >
                      <Trash2 size={15} /> DELETE BLOG
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="newsletter-card">
            <span className="section-label">JOIN {subscriberCount}+ STUDENT BUILDERS</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '1rem' }}>
              Receive our top weekly practical tech essay every Sunday.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 auto 2rem auto', maxWidth: '520px' }}>
              Zero spam. Only code blueprints, model releases, and practical AI implementations.
            </p>

            {subscribed ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255, 207, 42, 0.15)', color: 'var(--color-yellow)', padding: '0.8rem 1.8rem', borderRadius: '9999px', fontWeight: 700 }}>
                <Check size={20} /> YOU ARE ENROLLED IN THE WHT DISPATCH!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form-dark">
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your student email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={subscribing}>
                  {subscribing ? 'ENROLLING...' : 'ENROLL FREE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Builder Philosophy Quote Card */}
      <section className="section-padding" style={{ background: 'rgba(255, 255, 255, 0.015)' }}>
        <div className="container">
          <div className="quote-card">
            <span className="section-label">BUILDER PHILOSOPHY</span>
            <div className="quote-text">
              "We believe students learn best when they build real tools with code, not when they read abstract theories. We give you the exact pipelines to build, test, and deploy."
            </div>
            <div className="quote-author">
              <div className="quote-avatar">
                WHT
              </div>
              <div>
                <div className="quote-name">What's Happening in Tech (WHT)</div>
                <div className="quote-role">Practical AI & Tech Learning Platform for Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
