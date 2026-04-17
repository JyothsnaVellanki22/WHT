import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="section-padding container">
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h1 className="title-huge" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1rem' }}>BEHIND THE SCREEN</h1>
          <div className="card-tag" style={{ display: 'inline-block', fontSize: '1.2rem' }}>JAVA + AI + REAL INDUSTRY EXPOSURE</div>
        </div>

        <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem' }}>WHO AM I?</h2>
          <p style={{ fontSize: '1.2rem', color: '#111' }}>
            I am a builder focused on bridging the gap between traditional software engineering and the emerging world of Agentic AI. I've navigated the brutal tech job market firsthand as an international student, and I built this platform to share the exact playbooks that work.
          </p>

          <h2 style={{ fontSize: '2.5rem', marginTop: '2rem' }}>THE MISSION</h2>
          <p style={{ fontSize: '1.2rem', color: '#111' }}>
            The hiring market is broken. Traditional advice no longer works. My mission is to empower Gen Z and international students by decoding the system and teaching them how to leverage AI tools to automate and optimize their job search.
          </p>
          
          <h2 style={{ fontSize: '2.5rem', marginTop: '2rem' }}>WHY "WHT"?</h2>
          <p style={{ fontSize: '1.2rem', color: '#111' }}>
            Because you either know What's Happening in Tech, or you're left behind. It's time to play the game on your terms.
          </p>
          
          <div style={{ marginTop: '3rem' }}>
            <Link to="/playbook" className="btn btn-dark">GET STARTED <ArrowRight strokeWidth={3} /></Link>
          </div>
        </div>
    </div>
  );
}
