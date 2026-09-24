import React, { useState, useRef, useEffect } from 'react';
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
  Columns,
  Trash2,
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

  // Pre-process: strip existing enclosing figure tags to avoid orphaned tags when splitting
  let raw = content;
  raw = raw.replace(/<\/?figure[^>]*>/gi, '');
  raw = raw.replace(/(!\[.*?\]\(.*?\))/g, '\n\n$1\n\n');
  raw = raw.replace(/(<img\b[^>]*\/?>)/gi, '\n\n$1\n\n');
  raw = raw.replace(/(Logic Diagram \d+[^\n]*)\n(?!\n)/gi, '$1\n\n');

  // Split into raw blocks by 2 or more newlines
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const htmlBlocks = [];
  let i = 0;

  const sanitizeAlt = (altText) => {
    if (!altText) return 'reCAPTCHA Architecture Overview';
    // Suppress raw filenames, camera dumps, or AI generation filenames
    if (
      /\.(jpe?g|png|gif|webp|svg|bmp|tiff)$/i.test(altText) ||
      /^(chatgpt\s*image|screenshot|img_\d+|pasted\s*image|upload|file)/i.test(altText) ||
      altText.includes('___') ||
      /\d{4}[-_]\d{2}[-_]\d{2}/.test(altText)
    ) {
      return 'reCAPTCHA Architecture Overview';
    }
    return altText.trim();
  };

  while (i < blocks.length) {
    const block = blocks[i];

    // 1. Markdown image: ![Caption](url)
    const mdImgMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (mdImgMatch) {
      const alt = sanitizeAlt(mdImgMatch[1] || '');
      const src = mdImgMatch[2] || '';
      htmlBlocks.push(
        `<figure class="newsletter-img-figure">
          <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />
        </figure>`
      );
      i++;
      continue;
    }

    // 2. HTML <img> tag (or <figure> if any remained)
    if (block.startsWith('<figure') || block.startsWith('<img')) {
      const srcMatch = block.match(/src=["'](.*?)["']/);
      const altMatch = block.match(/alt=["'](.*?)["']/);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = sanitizeAlt(altMatch ? altMatch[1] : '');
      if (src) {
        htmlBlocks.push(
          `<figure class="newsletter-img-figure">
            <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />
          </figure>`
        );
      }
      i++;
      continue;
    }

    // 3. Logic Diagrams
    const isDiagramTitle = /^Logic Diagram \d+|^Architecture Diagram|^Flow Diagram/i.test(block);
    const hasBoxChars = /[│─┌┐└┘┴┬┼►◄▼▲├┤]/.test(block);

    if (isDiagramTitle) {
      let title = block;
      let diagramCode = '';

      if (block.includes('\n')) {
        // Diagram title and ASCII art share the same block
        const firstLineBreak = block.indexOf('\n');
        title = block.substring(0, firstLineBreak).trim();
        diagramCode = block.substring(firstLineBreak).trim();
        i++;
      } else if (i + 1 < blocks.length) {
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

      const cleanTitle = title.replace(/^Logic Diagram \d+\s*[-—:]?\s*/i, '').trim() || title;
      htmlBlocks.push(renderVisualFlowchart(cleanTitle, diagramCode));
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
            <span class="key-takeaway-icon">💡</span>
            <span>KEY TAKEAWAY</span>
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

export function parseContentToBlocks(content = '') {
  if (!content || !content.trim()) {
    return [{ id: 'txt-0', type: 'text', content: '' }];
  }

  // Matches <figure ...><img ...></figure> or <img ...> or ![alt](src)
  const imgRegex = /(?:<figure[^>]*>\s*)?<img\s+[^>]*src=["']([^"']+)["'][^>]*>(?:\s*<figcaption[^>]*>.*?<\/figcaption>)?(?:\s*<\/figure>)?|!\[(.*?)\]\(([^)]+)\)/gi;

  const blocks = [];
  let lastIndex = 0;
  let match;
  let blockId = 0;

  while ((match = imgRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim() || (blocks.length === 0 && textBefore)) {
      blocks.push({
        id: `txt-${blockId++}`,
        type: 'text',
        content: textBefore.trim()
      });
    }

    const src = match[1] || match[3] || '';
    const alt = match[2] || 'Newsletter visual';

    if (src) {
      blocks.push({
        id: `img-${blockId++}`,
        type: 'image',
        src,
        alt
      });
    }

    lastIndex = match.index + match[0].length;
  }

  const remaining = content.substring(lastIndex);
  if (remaining.trim() || blocks.length === 0) {
    blocks.push({
      id: `txt-${blockId++}`,
      type: 'text',
      content: remaining.trim()
    });
  }

  if (blocks.length === 0) {
    blocks.push({ id: `txt-0`, type: 'text', content: '' });
  }

  return blocks;
}

export function serializeBlocksToContent(blocks = []) {
  return blocks
    .map(block => {
      if (block.type === 'image') {
        const alt = block.alt && block.alt !== 'Newsletter visual' ? block.alt : 'reCAPTCHA Architecture Overview';
        return `<figure class="newsletter-img-figure"><img src="${block.src}" alt="${alt}" loading="lazy" /></figure>`;
      }
      return (block.content || '').trim();
    })
    .filter(Boolean)
    .join('\n\n');
}

export default function RichContentEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Write newsletter content here...', 
  rows = 14,
  label = 'Content & Media',
  viewMode: controlledViewMode = null,
  onViewModeChange = null,
  hideTabs = false
}) {
  const [internalViewMode, setInternalViewMode] = useState('write'); // 'write' | 'split' | 'preview'
  const activeViewMode = controlledViewMode || internalViewMode;
  const setViewMode = onViewModeChange || setInternalViewMode;

  const [blocks, setBlocks] = useState(() => parseContentToBlocks(value));
  const [focusedBlockIndex, setFocusedBlockIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTargetIndex, setUploadTargetIndex] = useState(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState(null);

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const textareaRefs = useRef({});
  const lastSerializedRef = useRef(value);

  // Sync external value changes into blocks (e.g. on newsletter load or reset)
  useEffect(() => {
    if (value !== lastSerializedRef.current) {
      setBlocks(parseContentToBlocks(value));
      lastSerializedRef.current = value;
    }
  }, [value]);

  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    const serialized = serializeBlocksToContent(newBlocks);
    lastSerializedRef.current = serialized;
    if (onChange) {
      onChange(serialized);
    }
  };

  const handleTextChange = (index, newText) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content: newText };
    updateBlocks(newBlocks);
  };

  const insertImageBlock = (src, insertIndex = null) => {
    const newImageBlock = {
      id: `img-${Date.now()}`,
      type: 'image',
      src,
      alt: 'Newsletter visual'
    };
    const newTextBlock = {
      id: `txt-${Date.now() + 1}`,
      type: 'text',
      content: ''
    };

    const newBlocks = [...blocks];
    if (insertIndex !== null && insertIndex >= 0 && insertIndex < newBlocks.length) {
      newBlocks.splice(insertIndex + 1, 0, newImageBlock, newTextBlock);
    } else {
      newBlocks.push(newImageBlock, newTextBlock);
    }
    updateBlocks(newBlocks);
  };

  const handleUploadImage = async (file, insertIndex = null) => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('wht_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          insertImageBlock(data.url, insertIndex);
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend image upload error:', err);
    }

    // Client-side fallback if offline
    const reader = new FileReader();
    reader.onload = (e) => {
      insertImageBlock(e.target.result, insertIndex);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleReplaceImage = async (file, imageIndex) => {
    if (!file || imageIndex === null) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('wht_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const newBlocks = [...blocks];
          newBlocks[imageIndex] = { ...newBlocks[imageIndex], src: data.url };
          updateBlocks(newBlocks);
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend replace error:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newBlocks = [...blocks];
      newBlocks[imageIndex] = { ...newBlocks[imageIndex], src: e.target.result };
      updateBlocks(newBlocks);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imageIndex) => {
    const newBlocks = [...blocks];
    newBlocks.splice(imageIndex, 1);
    if (newBlocks.length === 0) {
      newBlocks.push({ id: `txt-${Date.now()}`, type: 'text', content: '' });
    }
    updateBlocks(newBlocks);
  };

  const triggerUpload = (index = null) => {
    setUploadTargetIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const triggerReplace = (index) => {
    setReplaceTargetIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const applyFormat = (prefix, suffix = '') => {
    const textBlockIndices = blocks
      .map((b, i) => b.type === 'text' ? i : -1)
      .filter(i => i !== -1);
    const targetIndex = (focusedBlockIndex !== null && blocks[focusedBlockIndex]?.type === 'text')
      ? focusedBlockIndex
      : (textBlockIndices[textBlockIndices.length - 1] ?? 0);

    const block = blocks[targetIndex];
    if (!block) return;

    const textarea = textareaRefs.current[block.id];
    let newContent = block.content || '';
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = newContent.substring(start, end) || 'text';
      newContent = newContent.substring(0, start) + prefix + selected + suffix + newContent.substring(end);
      handleTextChange(targetIndex, newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 50);
    } else {
      newContent = (newContent ? newContent + '\n' : '') + prefix + 'text' + suffix;
      handleTextChange(targetIndex, newContent);
    }
  };

  const totalChars = blocks.reduce((sum, b) => sum + (b.type === 'text' ? (b.content?.length || 0) : 0), 0);
  const imageCount = blocks.filter(b => b.type === 'image').length;

  return (
    <div className="rich-editor-wrapper">
      {/* Hidden file inputs for uploading & replacing */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImage(file, uploadTargetIndex);
        }}
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReplaceImage(file, replaceTargetIndex);
        }}
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: 'none' }}
      />

      {/* Editor Header Bar with Label & View Tabs */}
      {!hideTabs && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </label>

          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-card)', padding: '0.2rem', borderRadius: '8px', border: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setViewMode('write')}
              style={{
                background: activeViewMode === 'write' ? 'var(--color-yellow)' : 'transparent',
                color: activeViewMode === 'write' ? '#0D0D0D' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Edit3 size={13} /> Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              style={{
                background: activeViewMode === 'split' ? 'var(--color-yellow)' : 'transparent',
                color: activeViewMode === 'split' ? '#0D0D0D' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Columns size={13} /> Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              style={{
                background: activeViewMode === 'preview' ? 'var(--color-yellow)' : 'transparent',
                color: activeViewMode === 'preview' ? '#0D0D0D' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={13} /> Reader Preview
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div style={{
        border: 'var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Formatting Toolbar */}
        {activeViewMode !== 'preview' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.65rem 1rem',
            borderBottom: 'var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.15)',
            flexWrap: 'wrap'
          }}>
            {/* Primary Action: Upload Image from Computer */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => triggerUpload(null)}
              title="Upload image from computer (inserts visually in edition)"
              style={{
                background: 'rgba(255, 207, 42, 0.14)',
                border: '1px solid rgba(255, 207, 42, 0.35)',
                borderRadius: '6px',
                color: 'var(--color-yellow)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                opacity: isUploading ? 0.6 : 1
              }}
            >
              <Upload size={14} /> {isUploading ? 'Uploading Image...' : '+ Insert Image'}
            </button>

            <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 0.3rem' }} />

            {/* Quick Text Formatting Tools */}
            <button
              type="button"
              onClick={() => applyFormat('\n\n## ')}
              title="Add Section Heading"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Heading2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('**', '**')}
              title="Bold Text"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Bold size={15} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('*', '*')}
              title="Italic Text"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Italic size={15} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('\n- ')}
              title="Bullet List"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <List size={15} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('\n> ')}
              title="Takeaway Quote Block"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Quote size={15} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('\n```python\n# Practical code snippet\n', '\n```\n')}
              title="Code Block"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Code size={15} />
            </button>

            <button
              type="button"
              onClick={() => applyFormat('\n---\n')}
              title="Divider Line"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
            >
              <Minus size={15} />
            </button>
          </div>
        )}

        {/* Content View Modes */}
        {activeViewMode === 'preview' ? (
          /* 1. Full Reader Preview */
          <div 
            style={{
              padding: '2.5rem',
              minHeight: '400px',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              lineHeight: 1.8
            }}
            dangerouslySetInnerHTML={{
              __html: formatNewsletterContent(serializeBlocksToContent(blocks)) || '<p style="color:var(--text-subtle);font-style:italic;">Nothing to preview yet. Start writing or insert an image to see it here.</p>'
            }}
          />
        ) : activeViewMode === 'split' ? (
          /* 2. Split View (Left: Visual Blocks, Right: Live Reader Preview) */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px', borderTop: 'none' }}>
            <div style={{ padding: '1.5rem', borderRight: 'var(--border-subtle)', maxHeight: '780px', overflowY: 'auto' }}>
              {renderBlockEditor()}
            </div>
            <div style={{ padding: '1.5rem 2rem', maxHeight: '780px', overflowY: 'auto', background: 'var(--bg-main)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-yellow)', fontWeight: 700, marginBottom: '1rem' }}>
                Live Reader Preview
              </div>
              <div 
                dangerouslySetInnerHTML={{
                  __html: formatNewsletterContent(serializeBlocksToContent(blocks)) || '<p style="color:var(--text-subtle);font-style:italic;">Preview will update live as you type...</p>'
                }}
              />
            </div>
          </div>
        ) : (
          /* 3. Visual Block Editor (Spacious Full Width) */
          <div style={{ padding: '1.5rem', minHeight: '360px' }}>
            {renderBlockEditor()}
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
        <span>Images are displayed visually without exposing raw file names or URLs. Drag & drop or use <strong>+ Insert Image</strong>.</span>
        <span>{imageCount} {imageCount === 1 ? 'image' : 'images'} • {totalChars} characters</span>
      </div>
    </div>
  );

  function renderBlockEditor() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {blocks.map((block, index) => {
          if (block.type === 'image') {
            return (
              <div 
                key={block.id}
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid rgba(255, 207, 42, 0.25)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  position: 'relative'
                }}
              >
                {/* Visual Image Preview */}
                <div style={{ textAlign: 'center', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', padding: '0.75rem', overflow: 'hidden' }}>
                  <img 
                    src={block.src} 
                    alt={block.alt || 'Newsletter visual'}
                    style={{
                      maxHeight: '220px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </div>

                {/* Image Management Actions (NO URL SHOWN) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(255, 207, 42, 0.1)',
                      color: 'var(--color-yellow)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      Visual Illustration
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                      Embedded cleanly in edition
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => triggerReplace(index)}
                      className="btn btn-outline"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      title="Upload a new image to replace this one"
                    >
                      <Upload size={12} /> Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="Remove image from newsletter"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                {/* Subtle Divider with Option to Add Text or Another Image */}
                <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={() => triggerUpload(index)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    + Insert Image After This
                  </button>
                </div>
              </div>
            );
          }

          // Text block
          return (
            <div key={block.id} style={{ position: 'relative' }}>
              <textarea
                ref={(el) => { if (el) textareaRefs.current[block.id] = el; }}
                rows={Math.max(4, Math.min(22, (block.content.split('\n').length || 1) + 2))}
                value={block.content}
                onFocus={() => setFocusedBlockIndex(index)}
                onChange={(e) => handleTextChange(index, e.target.value)}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    handleUploadImage(file, index);
                  }
                }}
                placeholder={index === 0 ? placeholder : 'Continue writing paragraphs, notes, or logic diagrams...'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.98rem',
                  lineHeight: 1.7,
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />

              {/* Inline button to insert an image after this text block */}
              {index < blocks.length - 1 && blocks[index + 1]?.type !== 'image' && (
                <div style={{ textAlign: 'center', margin: '0.4rem 0' }}>
                  <button
                    type="button"
                    onClick={() => triggerUpload(index)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)',
                      padding: '0.2rem 0.7rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    + Insert Image Here
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
