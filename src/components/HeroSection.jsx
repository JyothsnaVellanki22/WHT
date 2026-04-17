import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div>
          <h1 className="title-huge">
            WHT IS<br/>HAPPENING<br/>IN TECH?
          </h1>
          <p>
            The game has changed. Decode the Job Market. Crack the Interview. Built for Gen Z and international students.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/playbook" className="btn">
              START THE PLAYBOOK <ArrowRight size={24} style={{strokeWidth: 3}} />
            </Link>
            <Link to="/agentic-ai" className="btn btn-dark">
              <Terminal size={24} style={{strokeWidth: 3}} /> AI WORKFLOWS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
