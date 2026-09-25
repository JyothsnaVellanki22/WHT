import React, { useState, useRef } from 'react';
import { X, Plus, Sparkles, Image, BookOpen, Tag, User, Code, Layers, Upload, Linkedin, Trash2 } from 'lucide-react';

export default function NewTutorialModal({ isOpen, onClose, onAddBlog }) {
  const [formData, setFormData] = useState({
    title: '',
    tech_stack: 'Python, Ollama, LangChain',
    difficulty: 'INTERMEDIATE',
    category: 'AI TUTORIAL',
    read_time: '6 MIN READ',
    author: 'Jyothsna Vellanki',
    image_url: '',
    linkedin_url: '',
    summary: '',
    content: '',
    notify_subscribers: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const token = localStorage.getItem('wht_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers,
        body: uploadData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFormData((prev) => ({ ...prev, image_url: data.url }));
          setIsUploadingImage(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend image upload error, using local data URL fallback:', err);
    }

    // Local DataURL fallback
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setFormData((prev) => ({ ...prev, image_url: loadEvt.target.result }));
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) {
      alert('Please provide a title and summary for your practical tutorial.');
      return;
    }

    const token = localStorage.getItem('wht_auth_token');
    if (!token) {
      alert('Authentication required: You must be signed in as an administrator to publish a tutorial.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.status === 401 || res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Access denied: Administrator permissions required to publish tutorials.');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to publish tutorial');
      }

      const data = await res.json();
      if (data && data.blog) {
        onAddBlog(data.blog);
        if (data.notified_subscribers > 0) {
          alert(`Tutorial published and email notification logged for ${data.notified_subscribers} student subscribers!`);
        }
        onClose();
      }
    } catch (err) {
      console.error('API error while creating blog:', err);
      alert(err.message || 'Failed to publish tutorial. Please check server connection.');
    } finally {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        title: '',
        tech_stack: 'Python, Ollama, LangChain',
        difficulty: 'INTERMEDIATE',
        category: 'AI TUTORIAL',
        read_time: '6 MIN READ',
        author: 'Jyothsna Vellanki',
        image_url: '',
        linkedin_url: '',
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
        background: 'var(--bg-card)',
        border: '1px solid rgba(255, 207, 42, 0.3)',
        boxShadow: 'var(--shadow-hover)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
        padding: '2.5rem',
        color: 'var(--text-main)'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'var(--bg-card-hover)',
            color: 'var(--text-main)',
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
        <div style={{ marginBottom: '2rem', borderBottom: 'var(--border-subtle)', paddingBottom: '1.2rem' }}>
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
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'var(--bg-card-hover)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          <div className="modal-grid-2">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
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
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                <Layers size={13} color="var(--color-yellow)" /> Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                <Tag size={13} color="var(--color-yellow)" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
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
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="modal-grid-2">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
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
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                <Linkedin size={13} color="#0A66C2" /> LinkedIn Post URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/pulse/..."
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Manual Cover Image Upload / URL */}
          <div style={{ background: 'var(--bg-card-hover)', border: 'var(--border-subtle)', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', margin: 0 }}>
                <Image size={14} color="var(--color-yellow)" /> Cover Image (Optional)
              </label>
              
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="btn btn-outline"
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Upload size={13} /> {isUploadingImage ? 'Uploading...' : 'Upload Image File'}
                </button>
                {formData.image_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    style={{
                      background: 'rgba(230, 57, 70, 0.15)',
                      border: '1px solid var(--color-red)',
                      color: 'var(--color-red)',
                      borderRadius: '6px',
                      padding: '0.3rem 0.7rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Trash2 size={13} /> Remove Image
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="Or paste an image URL directly (e.g. https://...)"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.88rem',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />

            {formData.image_url && (
              <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '80px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: 'var(--border-subtle)', background: '#000' }}>
                  <img src={formData.image_url} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image ready for publication</span>
              </div>
            )}
          </div>



          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
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
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'var(--bg-card-hover)',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
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
                border: 'var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                background: 'var(--bg-card-hover)',
                color: 'var(--text-main)',
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
            <label htmlFor="notify_subscribers" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
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
