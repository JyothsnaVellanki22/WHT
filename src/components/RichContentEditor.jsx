import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Bold, 
  Italic, 
  Heading2, 
  List, 
  Quote, 
  Code, 
  Minus, 
  Eye, 
  Edit3,
  X
} from 'lucide-react';
import DOMPurify from 'dompurify';

export function formatNewsletterContent(content = '') {
  if (!content) return '';
  
  // If content already contains HTML block tags, process markdown images and return sanitized
  let html = content;

  // Convert markdown images: ![alt](url) -> <img>
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:10px;margin:1.5rem auto;display:block;box-shadow:0 4px 20px rgba(0,0,0,0.3);" />');

  // If already full of HTML tags
  if (html.includes('<p') || html.includes('<h1') || html.includes('<h2') || html.includes('<h3') || html.includes('<div') || html.includes('<pre') || html.includes('<img')) {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe', 'img'],
      ADD_ATTR: ['src', 'alt', 'style', 'width', 'height', 'target', 'rel']
    });
  }

  // Convert markdown headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.3rem;margin:1.8rem 0 0.8rem 0;color:var(--text-main);font-weight:700;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.6rem;margin:2rem 0 1rem 0;color:var(--text-main);font-weight:800;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:1.9rem;margin:2.2rem 0 1.2rem 0;color:var(--text-main);font-weight:900;">$1</h1>');

  // Convert bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-main);font-weight:700;">$1</strong>');

  // Convert italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert blockquote: > text
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left:3px solid var(--color-yellow);padding-left:1rem;margin:1.5rem 0;color:var(--text-muted);font-style:italic;background:rgba(255,207,42,0.05);padding:0.8rem 1rem;border-radius:0 8px 8px 0;">$1</blockquote>');

  // Convert horizontal rules
  html = html.replace(/^---$/gim, '<hr style="border:none;border-top:var(--border-subtle);margin:2rem 0;" />');

  // Convert paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<img') || block.startsWith('<blockquote') || block.startsWith('<hr') || block.startsWith('<pre') || block.startsWith('<ul') || block.startsWith('<ol')) {
      return block;
    }
    return `<p style="margin-bottom:1.2rem;line-height:1.75;font-size:1.02rem;">${block.replace(/\n/g, '<br/>')}</p>`;
  }).join('');

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe', 'img'],
    ADD_ATTR: ['src', 'alt', 'style', 'width', 'height', 'target', 'rel']
  });
}

export default function RichContentEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Write newsletter content here...', 
  rows = 10,
  label = 'Content (Images and Markdown Supported)'
}) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = before + textToInsert + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional client-side image compression to keep payload efficient
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to optimal JPEG/WebP dataUrl
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const imgTag = `\n\n<img src="${optimizedDataUrl}" alt="${file.name.replace(/\.[^/.]+$/, '')}" style="max-width:100%;border-radius:10px;margin:1.8rem auto;display:block;box-shadow:0 4px 20px rgba(0,0,0,0.3);" />\n\n`;
        insertAtCursor(imgTag);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same file can be re-uploaded if desired
  };

  const handleInsertImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const imgTag = `\n\n<img src="${imageUrl.trim()}" alt="${imageCaption.trim() || 'Newsletter illustration'}" style="max-width:100%;border-radius:10px;margin:1.8rem auto;display:block;box-shadow:0 4px 20px rgba(0,0,0,0.3);" />\n\n`;
    insertAtCursor(imgTag);
    setImageUrl('');
    setImageCaption('');
    setShowImageUrlModal(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgTag = `\n\n<img src="${event.target.result}" alt="${file.name}" style="max-width:100%;border-radius:10px;margin:1.8rem auto;display:block;" />\n\n`;
        insertAtCursor(imgTag);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
          {label}
        </label>

        {/* Tab switch: Write vs Preview */}
        <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-card-hover)', padding: '0.2rem', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            style={{
              background: activeTab === 'write' ? 'var(--color-yellow)' : 'transparent',
              color: activeTab === 'write' ? '#0D0D0D' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Edit3 size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              background: activeTab === 'preview' ? 'var(--color-yellow)' : 'transparent',
              color: activeTab === 'preview' ? '#0D0D0D' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div style={{
        border: 'var(--border-subtle)',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'var(--bg-card-hover)'
      }}>
        {/* LinkedIn-Inspired Formatting & Image Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 0.8rem',
          borderBottom: 'var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)',
          flexWrap: 'wrap'
        }}>
          {/* Primary Action: Insert Image from Computer */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image from computer (inserts in-between text)"
            style={{
              background: 'rgba(255, 207, 42, 0.12)',
              border: '1px solid rgba(255, 207, 42, 0.3)',
              borderRadius: '6px',
              color: 'var(--color-yellow)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Upload size={14} /> Upload Image
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: 'none' }}
          />

          {/* Secondary Action: Insert Image via URL */}
          <button
            type="button"
            onClick={() => setShowImageUrlModal(true)}
            title="Insert image from web URL"
            style={{
              background: 'transparent',
              border: 'var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-main)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <ImageIcon size={14} /> Image URL
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 0.3rem' }} />

          {/* Formatting Quick Tools */}
          <button
            type="button"
            onClick={() => insertAtCursor('\n\n## Section Headline\n')}
            title="Add Heading"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('**bold text**')}
            title="Bold"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('*italic text*')}
            title="Italic"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Italic size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('\n- List item 1\n- List item 2\n')}
            title="Bullet List"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('\n> Memorable key takeaway quote\n')}
            title="Quote Block"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Quote size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('\n```python\n# Practical code snippet\n```\n')}
            title="Code Block"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Code size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('\n---\n')}
            title="Divider Line"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <Minus size={15} />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor('[Link text](https://example.com)')}
            title="Hyperlink"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
          >
            <LinkIcon size={15} />
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onDrop={handleDrop}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '1.2rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.98rem',
              lineHeight: 1.7,
              outline: 'none',
              fontFamily: 'var(--font-body)',
              resize: 'vertical',
              minHeight: '220px'
            }}
          />
        ) : (
          <div 
            style={{
              padding: '1.5rem',
              minHeight: '220px',
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              lineHeight: 1.75
            }}
            dangerouslySetInnerHTML={{
              __html: formatNewsletterContent(value) || '<p style="color:var(--text-subtle);font-style:italic;">Nothing to preview yet. Start writing or insert an image to see it here.</p>'
            }}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
        <span>Tip: Drag & drop images directly or use <strong>Upload Image</strong> to insert diagrams in-between text.</span>
        <span>{value.length} characters</span>
      </div>

      {/* Modal for inserting image from web URL */}
      {showImageUrlModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 207, 42, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-hover)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>Insert Image via URL</h3>
              <button
                type="button"
                onClick={() => setShowImageUrlModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-card-hover)',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>
                  Caption / Alt Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architecture Diagram of Reasoning Model"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-card-hover)',
                    border: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowImageUrlModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertImageUrl}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
