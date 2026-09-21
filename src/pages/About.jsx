import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="section-padding container">
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <span className="section-label">ABOUT WHT</span>
        <h1 className="hero-headline" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', margin: '0 auto 1rem auto' }}>
          BEHIND THE INTEL
        </h1>
        <div style={{ color: 'var(--color-coral)', fontWeight: 600, letterSpacing: '0.05em' }}>
          THE RISKS YOU TAKE, THE OPPORTUNITIES YOU MAKE
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', background: 'var(--bg-card)', border: 'var(--border-subtle)', borderRadius: '16px', padding: '3.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>WHO ARE WE?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          We are architects of the new tech frontier, fusing the solid foundations of software engineering with the limitless potential of autonomous AI and silicon breakthroughs. Navigating the tech landscape taught us that survival isn't enough—you have to decode the shifts in real time. We built this platform to publish the exact blueprints and weekly essays to keep you ahead.
        </p>

        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>THE MISSION</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          The old playbooks have expired. Our mission is to empower early-career engineers, founders, and builders to understand the macro movements in tech before they become mainstream. By mastering agentic workflows and local AI architectures, we aren't just adapting to the industry; we are shaping it.
        </p>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>WHY "WHT"?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '3rem' }}>
          Because you either know What's Happening in Tech, or you're left behind. It's time to build on your terms.
        </p>
        
        <div>
          <Link to="/#blogs" className="btn btn-primary">EXPLORE WEEKLY BLOGS <ArrowRight size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
