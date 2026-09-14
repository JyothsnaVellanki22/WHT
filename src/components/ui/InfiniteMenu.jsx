import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Cpu, Code, Layers, Zap } from 'lucide-react';

export default function InfiniteMenu({ items }) {
  const defaultItems = [
    { title: 'AUTONOMOUS AGENTS', tag: 'AI INTEL', icon: <Cpu size={16} />, path: '/#blogs' },
    { title: '2NM SILICON ARCHITECTURE', tag: 'HARDWARE', icon: <Zap size={16} />, path: '/#blogs' },
    { title: 'SOFTWARE ENGINEERING PLAYBOOKS', tag: 'ENGINEERING', icon: <Code size={16} />, path: '/#blogs' },
    { title: 'SYSTEMS DECONSTRUCTS', tag: 'DEEP DIVE', icon: <Layers size={16} />, path: '/#blogs' },
    { title: 'WEEKLY TECH SHIFTS', tag: 'TRENDS', icon: <Sparkles size={16} />, path: '/#blogs' }
  ];

  const menuItems = items || defaultItems;
  const doubleItems = [...menuItems, ...menuItems, ...menuItems];
  
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame;
    const speed = 0.8;

    const scroll = () => {
      if (!isHovered) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= (el.scrollWidth / 3) * 2) {
          el.scrollLeft = el.scrollWidth / 3;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '1.2rem 0',
        background: '#09090B',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0 1rem'
        }}
      >
        {doubleItems.map((item, idx) => (
          <a
            key={idx}
            href={item.path}
            style={{
              flex: '0 0 auto',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '0.5rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 207, 42, 0.08)';
              e.currentTarget.style.borderColor = 'var(--color-yellow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <span style={{ color: 'var(--color-yellow)', display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            <span>{item.title}</span>
            <span style={{ fontSize: '0.7rem', color: '#0D0D0D', background: 'var(--color-yellow)', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '9999px' }}>
              {item.tag}
            </span>
            <ArrowUpRight size={14} style={{ color: 'var(--text-subtle)' }} />
          </a>

        ))}
      </div>
    </div>
  );
}
