import React, { useState } from 'react';
import { X, Plus, Sparkles, Image, BookOpen, Tag, User, Code, Layers } from 'lucide-react';

export default function NewTutorialModal({ isOpen, onClose, onAddBlog }) {
  const [formData, setFormData] = useState({
    title: '',
    tech_stack: 'Python, Ollama, LangChain',
    difficulty: 'INTERMEDIATE',
    category: 'AI TUTORIAL',
    read_time: '6 MIN READ',
    author: 'Jyothsna Vellanki',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    notify_subscribers: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) {
      alert('Please provide a title and summary for your practical tutorial.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data && data.blog) {
        onAddBlog(data.blog);
        if (data.notified_subscribers > 0) {
          alert(`Tutorial published and email notification sent to ${data.notified_subscribers} student subscribers!`);
        }
      }
    } catch (err) {
      console.warn('API error, falling back to local storage:', err);
      const fallbackBlog = {
        id: `blog-${Date.now()}`,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: formData.title,
        tech_stack: formData.tech_stack,
        difficulty: formData.difficulty,
        category: formData.category,
        date: new Date().toLocaleDateString('en-US', { month: 'SHORT', day: 'numeric', year: 'numeric' }).toUpperCase(),
        read_time: formData.read_time,
        author: formData.author,
        image_url: formData.image_url,
        summary: formData.summary,
        content: formData.content || formData.summary
      };
      onAddBlog(fallbackBlog);
    } finally {
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        title: '',
        tech_stack: 'Python, Ollama, LangChain',
        difficulty: 'INTERMEDIATE',
        category: 'AI TUTORIAL',
        read_time: '6 MIN READ',
        author: 'Jyothsna Vellanki',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        summary: '',
        content: '',
        notify_subscribers: true
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        background: '#151518',
        border: '1px solid rgba(255, 207, 42, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
        padding: '2.5rem',
        color: '#FFFFFF'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-yellow)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> PRACTICAL BLOG CREATOR
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>
            Publish Practical AI Blog
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.4rem 0 0 0' }}>
            Share practical tools, step-by-step architectures, and code snippets with students.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--color-yellow)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Blog Title *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Building a Local Coding Agent with Ollama and LangChain"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: '#0D0D0F',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          <div className="modal-grid-2">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <Code size={13} color="var(--color-yellow)" /> Tech Stack
              </label>
              <input
                type="text"
                placeholder="e.g. Python, Ollama, LangChain"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <Layers size={13} color="var(--color-yellow)" /> Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="BEGINNER">BEGINNER (Fundamentals & Tools)</option>
                <option value="INTERMEDIATE">INTERMEDIATE (Pipelines & Systems)</option>
                <option value="PRO">PRO (Quantization, Kernels & Training)</option>
              </select>
            </div>
          </div>

          <div className="modal-grid-2">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <Tag size={13} color="var(--color-yellow)" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="AI TUTORIAL">AI TUTORIAL</option>
                <option value="HANDS-ON GUIDE">HANDS-ON GUIDE</option>
                <option value="TOOLS & FRAMEWORKS">TOOLS & FRAMEWORKS</option>
                <option value="SYSTEM ARCHITECTURE">SYSTEM ARCHITECTURE</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <BookOpen size={13} color="var(--color-yellow)" /> Read Time
              </label>
              <input
                type="text"
                placeholder="e.g. 6 MIN READ"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="modal-grid-2">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <User size={13} color="var(--color-yellow)" /> Author Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jyothsna Vellanki"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
                <Image size={13} color="var(--color-yellow)" /> Cover Image URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#0D0D0F',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>
          </div>


          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
              Practical Summary & Takeaways *
            </label>
            <textarea
              required
              rows={2}
              placeholder="What practical problem does this tutorial solve for students?"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: '#0D0D0F',
                color: '#FFFFFF',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#CCC', textTransform: 'uppercase' }}>
              Step-by-Step Code & Tutorial Content (HTML/Markdown Supported)
            </label>
            <textarea
              rows={6}
              placeholder="<h3>1. Setup</h3><p>Install prerequisites...</p><pre><code>pip install langchain</code></pre>"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                background: '#0D0D0F',
                color: '#FFFFFF',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }}>
            <input
              type="checkbox"
              id="notify_subscribers"
              checked={formData.notify_subscribers}
              onChange={(e) => setFormData({ ...formData, notify_subscribers: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-yellow)', cursor: 'pointer' }}
            />
            <label htmlFor="notify_subscribers" style={{ fontSize: '0.9rem', color: '#DDD', cursor: 'pointer' }}>
              Automatically send email notification to all enrolled student subscribers upon publishing
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Publishing & Notifying...' : 'Publish Blog'} <Plus size={16} />
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
