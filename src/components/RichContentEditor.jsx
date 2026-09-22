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

// Helper to escape HTML characters in preformatted blocks
function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inline formatting for markdown: **bold**, *italic*, `code`, [link](url)
function formatInline(text = '') {
  let t = text;
  // bold: **text**
  t = t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-main);font-weight:700;">$1</strong>');
  // italic: *text*
  t = t.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // inline code: `code`
  t = t.replace(/`([^`]+)`/g, '<code class="newsletter-inline-code">$1</code>');
  // links: [text](url)
  t = t.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--color-yellow);text-decoration:underline;">$1</a>');
  return t;
}

// Dedent utility: strips common leading whitespace across all non-empty lines
function dedentText(text = '') {
  const lines = text.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
  }
  if (minIndent === Infinity || minIndent === 0) return text.trimEnd();
  return lines.map(line => line.length >= minIndent ? line.slice(minIndent) : line).join('\n').trim();
}

function renderVisualFlowchart(title = '', ascii = '') {
  const t = title.toLowerCase();

  const renderArrow = (label = '') => `
    <div class="logic-flow-arrow">
      <div class="logic-arrow-line"></div>
      <div class="logic-arrow-tip">▼</div>
      ${label ? `<span class="logic-arrow-label">${escapeHtml(label)}</span>` : ''}
    </div>
  `;

  let visualHtml = '';

  // Case 1: Diagram 1 - The Problem
  if (t.includes('the problem') || t.includes('diagram 1')) {
    visualHtml = `
      <div class="logic-visual-canvas">
        <div class="logic-flow-node logic-node-primary">
          <div class="logic-node-icon">🌐</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Web Application</span>
            <span class="logic-node-subtitle">Receives incoming HTTP interactions</span>
          </div>
        </div>

        ${renderArrow('Incoming Request')}

        <div class="logic-flow-node logic-node-security">
          <div class="logic-node-icon">🛡️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Behavior & Risk Check</span>
            <span class="logic-node-subtitle">Evaluates request context & automated patterns</span>
          </div>
        </div>

        ${renderArrow('Traffic Classification')}

        <div class="logic-flow-fork">
          <div class="logic-flow-branch logic-branch-success">
            <div class="logic-branch-badge">✅ Legitimate Activity</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">👤</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Normal Interaction</span>
                <span class="logic-node-subtitle">Human user browsing smoothly</span>
              </div>
            </div>
          </div>

          <div class="logic-flow-branch logic-branch-danger">
            <div class="logic-branch-badge">⚠️ Automated Activity</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🤖</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Potential Abuse</span>
                <span class="logic-node-subtitle">Scraping, brute-force or spam bot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  // Case 2: Diagram 2 - Where reCAPTCHA Enters the Request Flow
  else if (t.includes('where recaptcha enters') || t.includes('request flow') || t.includes('diagram 2')) {
    visualHtml = `
      <div class="logic-visual-canvas">
        <div class="logic-flow-node">
          <div class="logic-node-icon">👤</div>
          <div class="logic-node-content">
            <span class="logic-node-title">User / Client Browser</span>
            <span class="logic-node-subtitle">Navigates to protected web page</span>
          </div>
        </div>

        ${renderArrow()}

        <div class="logic-flow-node logic-node-primary">
          <div class="logic-node-icon">🌐</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Web Application</span>
            <span class="logic-node-subtitle">Handles frontend presentation & API routes</span>
          </div>
        </div>

        ${renderArrow('Trigger Sensitive Action')}

        <div class="logic-flow-node logic-node-highlight">
          <div class="logic-node-icon">⚡</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Sensitive Action Initiated</span>
            <span class="logic-node-subtitle">Login • Signup • Form Submit • Transaction</span>
          </div>
        </div>

        ${renderArrow('Client Verification')}

        <div class="logic-flow-node logic-node-security">
          <div class="logic-node-icon">🛡️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">reCAPTCHA Assessment</span>
            <span class="logic-node-subtitle">Evaluates user interaction telemetry & risk score</span>
          </div>
        </div>

        ${renderArrow('Risk Decision')}

        <div class="logic-flow-node">
          <div class="logic-node-icon">⚖️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Security Decision Engine</span>
            <span class="logic-node-subtitle">Compare risk score against configured policy</span>
          </div>
        </div>

        ${renderArrow('Policy Branch')}

        <div class="logic-flow-fork">
          <div class="logic-flow-branch logic-branch-success">
            <div class="logic-branch-badge">✅ Low Risk (Pass)</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🔓</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Continue Action</span>
                <span class="logic-node-subtitle">Allow access & process protected request</span>
              </div>
            </div>
          </div>

          <div class="logic-flow-branch logic-branch-warning">
            <div class="logic-branch-badge">⚠️ High Risk / Suspicious</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🧩</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Additional Action</span>
                <span class="logic-node-subtitle">Prompt visual challenge, MFA, or reject</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  // Case 3: Diagram 3 - The Security Trade-Off
  else if (t.includes('security trade-off') || t.includes('trade-off') || t.includes('diagram 3')) {
    visualHtml = `
      <div class="logic-visual-canvas">
        <div class="logic-flow-node">
          <div class="logic-node-icon">⚖️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Security Policy Decision</span>
            <span class="logic-node-subtitle">Balancing system security against user friction</span>
          </div>
        </div>

        ${renderArrow('Architectural Dilemma')}

        <div class="logic-flow-fork">
          <div class="logic-flow-branch logic-branch-warning">
            <div class="logic-branch-badge">🔓 Too Permissive Policy</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">⚠️</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Abuse Gets Through</span>
                <span class="logic-node-subtitle">Fake signups & credential stuffing degrade service</span>
              </div>
            </div>
          </div>

          <div class="logic-flow-branch logic-branch-danger">
            <div class="logic-branch-badge">🔒 Too Restrictive Policy</div>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🛑</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Real Users Suffer</span>
                <span class="logic-node-subtitle">High false positives & annoying challenges cause drop-off</span>
              </div>
            </div>
          </div>
        </div>

        ${renderArrow('Engineering Target')}

        <div class="logic-flow-node logic-node-highlight">
          <div class="logic-node-icon">🎯</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Balanced Protection</span>
            <span class="logic-node-subtitle">Adaptive background risk scoring without disrupting genuine users</span>
          </div>
        </div>
      </div>
    `;
  }
  // Case 4: Diagram 4 - reCAPTCHA Inside the Application
  else if (t.includes('inside the application') || t.includes('diagram 4')) {
    visualHtml = `
      <div class="logic-visual-canvas">
        <div class="logic-flow-node">
          <div class="logic-node-icon">💻</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Browser Client</span>
            <span class="logic-node-subtitle">Executes frontend client code & generates challenge token</span>
          </div>
        </div>

        ${renderArrow('1. Submit Form + Client Token')}

        <div class="logic-flow-node logic-node-primary">
          <div class="logic-node-icon">🌐</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Web Application Backend</span>
            <span class="logic-node-subtitle">Holds server Secret Key, intercepting payload</span>
          </div>
        </div>

        ${renderArrow('2. Verify Token with Secret Key')}

        <div class="logic-flow-node logic-node-security">
          <div class="logic-node-icon">🛡️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">reCAPTCHA Cloud Service</span>
            <span class="logic-node-subtitle">Backend-to-backend cryptographic verification</span>
          </div>
        </div>

        ${renderArrow('3. If Token Valid & Score Passed')}

        <div class="logic-flow-node logic-node-highlight">
          <div class="logic-node-icon">⚙️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Application Core Logic</span>
            <span class="logic-node-subtitle">Processes account creation, payment, or data update</span>
          </div>
        </div>

        ${renderArrow('Executed Safely')}

        <div class="logic-flow-node">
          <div class="logic-node-icon">✅</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Protected Action Completed</span>
            <span class="logic-node-subtitle">Protected resources returned to authentic user</span>
          </div>
        </div>
      </div>
    `;
  }
  // Case 5: Diagram 5 - Layered Application Security
  else if (t.includes('layered') || t.includes('defense in depth') || t.includes('diagram 5')) {
    visualHtml = `
      <div class="logic-visual-canvas">
        <div class="logic-flow-node">
          <div class="logic-node-icon">🌍</div>
          <div class="logic-node-content">
            <span class="logic-node-title">User / Internet Traffic</span>
            <span class="logic-node-subtitle">Mixed stream of authentic learners & malicious bots</span>
          </div>
        </div>

        ${renderArrow('Gateway Ingress')}

        <div class="logic-flow-node logic-node-primary">
          <div class="logic-node-icon">🌐</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Web Application Edge</span>
            <span class="logic-node-subtitle">Enforces defense-in-depth architecture</span>
          </div>
        </div>

        ${renderArrow('Parallel Defensive Controls')}

        <div class="logic-defense-grid">
          <div class="logic-defense-col">
            <span class="logic-defense-pill">LAYER 1</span>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🔑</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Auth</span>
                <span class="logic-node-subtitle">JWT & Passwords</span>
              </div>
            </div>
          </div>

          <div class="logic-defense-col">
            <span class="logic-defense-pill">LAYER 2</span>
            <div class="logic-flow-node">
              <div class="logic-node-icon">🛡️</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Bot Defense</span>
                <span class="logic-node-subtitle">reCAPTCHA Score</span>
              </div>
            </div>
          </div>

          <div class="logic-defense-col">
            <span class="logic-defense-pill">LAYER 3</span>
            <div class="logic-flow-node">
              <div class="logic-node-icon">⏱️</div>
              <div class="logic-node-content">
                <span class="logic-node-title">Rate Limits</span>
                <span class="logic-node-subtitle">IP & Burst Throttle</span>
              </div>
            </div>
          </div>
        </div>

        ${renderArrow('All Controls Passed')}

        <div class="logic-flow-node logic-node-highlight">
          <div class="logic-node-icon">⚙️</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Application Core Logic</span>
            <span class="logic-node-subtitle">Business operations executing with confidence</span>
          </div>
        </div>

        ${renderArrow()}

        <div class="logic-flow-node">
          <div class="logic-node-icon">💎</div>
          <div class="logic-node-content">
            <span class="logic-node-title">Protected Data & State</span>
            <span class="logic-node-subtitle">Secure platform database and user records</span>
          </div>
        </div>
      </div>
    `;
  }

  const cleanAscii = dedentText(ascii);

  return `
    <div class="logic-diagram-card">
      <div class="logic-diagram-header">
        <div class="logic-diagram-header-left">
          <span class="logic-diagram-pill">LOGIC DIAGRAM</span>
          <span class="logic-diagram-title">${escapeHtml(title)}</span>
        </div>
      </div>

      ${visualHtml ? visualHtml : ''}

      ${cleanAscii ? `
        <details class="logic-ascii-details" ${!visualHtml ? 'open' : ''}>
          <summary class="logic-ascii-summary">
            <span>${visualHtml ? '▶ View Raw Architecture Diagram (ASCII)' : 'Architecture Diagram (Monospace)'}</span>
          </summary>
          <pre class="logic-diagram-pre"><code>${escapeHtml(cleanAscii)}</code></pre>
        </details>
      ` : ''}
    </div>
  `;
}

export function formatNewsletterContent(content = '') {
  if (!content) return '';

  // If content was already fully compiled into our structured classes, sanitize and return
  if (content.includes('class="logic-diagram-card"') || content.includes('class="key-takeaway-card"')) {
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['figure', 'figcaption', 'pre', 'code', 'blockquote', 'hr', 'h1', 'h2', 'h3', 'span', 'strong', 'em', 'img', 'details', 'summary', 'p', 'div', 'a'],
      ADD_ATTR: ['src', 'alt', 'style', 'class', 'width', 'height', 'target', 'rel', 'loading', 'open']
    });
  }

  // Pre-process: ensure HTML <img> tags, markdown images, and diagram titles have surrounding double newlines
  let raw = content;
  raw = raw.replace(/(!\[.*?\]\(.*?\))/g, '\n\n$1\n\n');
  raw = raw.replace(/(<img\b[^>]*\/?>)/gi, '\n\n$1\n\n');
  raw = raw.replace(/(Logic Diagram \d+[^\n]*)\n(?!\n)/gi, '$1\n\n');

  // Split into raw blocks by 2 or more newlines
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const htmlBlocks = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // 1. Markdown image: ![Caption](url)
    const mdImgMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (mdImgMatch) {
      const alt = mdImgMatch[1] || '';
      const src = mdImgMatch[2] || '';
      htmlBlocks.push(
        `<figure class="newsletter-img-figure">
          <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />
          ${alt && alt !== 'image' && alt !== 'illustration' ? `<figcaption class="newsletter-img-caption">${escapeHtml(alt)}</figcaption>` : ''}
        </figure>`
      );
      i++;
      continue;
    }

    // 2. HTML <img> tag
    if (block.startsWith('<img')) {
      const srcMatch = block.match(/src=["'](.*?)["']/);
      const altMatch = block.match(/alt=["'](.*?)["']/);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      if (src) {
        htmlBlocks.push(
          `<figure class="newsletter-img-figure">
            <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />
            ${alt && alt !== 'image' ? `<figcaption class="newsletter-img-caption">${escapeHtml(alt)}</figcaption>` : ''}
          </figure>`
        );
      } else {
        htmlBlocks.push(block);
      }
      i++;
      continue;
    }

    // 3. Logic Diagrams
    const isDiagramTitle = /^Logic Diagram \d+|^Architecture Diagram|^Flow Diagram/i.test(block);
    const hasBoxChars = /[│─┌┐└┘┴┬┼►◄▼▲├┤]/.test(block);

    if (isDiagramTitle) {
      const title = block.replace(/^Logic Diagram \d+\s*[-—:]?\s*/i, '').trim() || block;
      let diagramCode = '';

      if (i + 1 < blocks.length) {
        const nextBlock = blocks[i + 1];
        if (/[│─┌┐└┘┴┬┼►◄▼▲├┤|]/.test(nextBlock) || nextBlock.split('\n').length >= 2) {
          diagramCode = nextBlock;
          i += 2;
        } else {
          diagramCode = '';
          i++;
        }
      } else {
        i++;
      }

      htmlBlocks.push(renderVisualFlowchart(title, diagramCode));
      continue;
    }

    // Block containing box-drawing characters without a preceding title
    if (hasBoxChars && block.split('\n').length >= 2) {
      htmlBlocks.push(renderVisualFlowchart('System Architecture Flow', block));
      i++;
      continue;
    }

    // 4. Key Takeaway Block
    const isTakeawayHeader = /^Key Takeaway\b/i.test(block);
    if (isTakeawayHeader) {
      let takeawayText = '';
      if (/^Key Takeaway[:\s]*$/i.test(block)) {
        if (i + 1 < blocks.length) {
          takeawayText = blocks[i + 1];
          i += 2;
        } else {
          i++;
        }
      } else {
        takeawayText = block.replace(/^Key Takeaway[:\s-]*/i, '').trim();
        i++;
      }

      htmlBlocks.push(
        `<div class="key-takeaway-card">
          <div class="key-takeaway-badge">
            <span class="key-takeaway-dot"></span>
            KEY TAKEAWAY
          </div>
          <p class="key-takeaway-body">${formatInline(escapeHtml(takeawayText))}</p>
        </div>`
      );
      continue;
    }

    // 5. Code blocks: ```lang ... ```
    const codeFenceMatch = block.match(/^```([a-z0-9_-]*)\n([\s\S]*?)```$/i);
    if (codeFenceMatch) {
      const lang = codeFenceMatch[1] || 'code';
      const code = codeFenceMatch[2];
      htmlBlocks.push(
        `<div class="logic-diagram-card">
          <div class="logic-diagram-header">
            <span class="logic-diagram-pill">${escapeHtml(lang.toUpperCase())}</span>
          </div>
          <pre class="logic-diagram-pre"><code>${escapeHtml(code)}</code></pre>
        </div>`
      );
      i++;
      continue;
    }

    // 6. Markdown Headings #, ##, ###
    if (/^###\s+(.*$)/.test(block)) {
      htmlBlocks.push(`<h3 class="newsletter-h3">${formatInline(escapeHtml(block.replace(/^###\s+/, '')))}</h3>`);
      i++;
      continue;
    }
    if (/^##\s+(.*$)/.test(block)) {
      htmlBlocks.push(`<h2 class="newsletter-h2">${formatInline(escapeHtml(block.replace(/^##\s+/, '')))}</h2>`);
      i++;
      continue;
    }
    if (/^#\s+(.*$)/.test(block)) {
      htmlBlocks.push(`<h1 class="newsletter-h1">${formatInline(escapeHtml(block.replace(/^#\s+/, '')))}</h1>`);
      i++;
      continue;
    }

    // 7. Blockquotes > ...
    if (block.startsWith('>')) {
      const quoteText = block.replace(/^>\s*/gm, '');
      htmlBlocks.push(`<blockquote class="newsletter-blockquote">${formatInline(escapeHtml(quoteText))}</blockquote>`);
      i++;
      continue;
    }

    // 8. Horizontal rules
    if (block === '---' || block === '***') {
      htmlBlocks.push('<hr class="newsletter-hr" />');
      i++;
      continue;
    }

    // 9. Standalone section titles in plain text articles
    const isStandaloneTitle = 
      block.length < 80 && 
      !block.includes('\n') && 
      !block.endsWith('.') && 
      !block.endsWith(',') && 
      !block.endsWith(';') && 
      !block.endsWith(':') &&
      /^(The|Where|Why|How|What|Concept|Security|When|Part|Step|Phase|Architecture)\b/i.test(block);

    if (isStandaloneTitle) {
      htmlBlocks.push(`<h2 class="newsletter-h2">${formatInline(escapeHtml(block))}</h2>`);
      i++;
      continue;
    }

    // 10. Standard Paragraph
    const lines = block.split('\n').map(l => formatInline(escapeHtml(l))).join('<br/>');
    htmlBlocks.push(`<p class="newsletter-p">${lines}</p>`);
    i++;
  }

  const finalHtml = htmlBlocks.join('\n');
  return DOMPurify.sanitize(finalHtml, {
    ADD_TAGS: ['figure', 'figcaption', 'pre', 'code', 'blockquote', 'hr', 'h1', 'h2', 'h3', 'span', 'strong', 'em', 'img', 'p', 'div', 'a', 'details', 'summary'],
    ADD_ATTR: ['src', 'alt', 'style', 'class', 'width', 'height', 'target', 'rel', 'loading', 'href', 'open']
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
  const [isUploading, setIsUploading] = useState(false);
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

  const uploadAndInsertImage = async (file) => {
    if (!file) return;

    setIsUploading(true);
    const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('wht_auth_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Clean, readable markdown image syntax (no huge base64 strings!)
          insertAtCursor(`\n\n![${caption}](${data.url})\n\n`);
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend image upload error, using local fallback:', err);
    }

    // Client-side compressed data URL fallback if offline
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
        
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        insertAtCursor(`\n\n![${caption}](${optimizedDataUrl})\n\n`);
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAndInsertImage(file);
    e.target.value = '';
  };

  const handleInsertImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const caption = imageCaption.trim() || 'Newsletter illustration';
    // Clean markdown image syntax instead of bulky HTML
    insertAtCursor(`\n\n![${caption}](${imageUrl.trim()})\n\n`);
    setImageUrl('');
    setImageCaption('');
    setShowImageUrlModal(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadAndInsertImage(file);
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
            disabled={isUploading}
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
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            <Upload size={14} /> {isUploading ? 'Uploading...' : 'Upload Image'}
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
