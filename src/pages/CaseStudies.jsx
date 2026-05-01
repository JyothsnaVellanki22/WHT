import { useState, useEffect } from 'react';
import { Terminal, ArrowRight, Zap, Target, Activity } from 'lucide-react';

export default function CaseStudies() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminalMode, setTerminalMode] = useState(false);
  const [realityToggle, setRealityToggle] = useState(false);

  useEffect(() => {
    // Fetch from new intelligence API
    fetch('http://localhost:8000/api/signals')
      .then(res => res.json())
      .then(data => {
        setSignals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback mock data if API is down
        setSignals([{
          id: "agentic-ai",
          title: "AI AGENTS ARE REPLACING BACKEND LOGIC",
          signal_level: "HIGH",
          impact: "Backend Engineers",
          action: "Learn Orchestration (LangGraph, tool-calling APIs)",
          what_happened: "Explosion of agent frameworks like AutoGPT and LangChain. LLMs are becoming tool users.",
          why_it_matters: "Traditional CRUD APIs are being replaced by autonomous agents.",
          hidden_signal: "Backend roles are shifting to orchestrating AI workflows.",
          influencer_hype: "AI will write all the code for you! Just learn prompting!",
        }]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-fade section-padding container">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title-huge" style={{ fontSize: '3rem', margin: 0 }}>CASE STUDY ENGINE</h1>
        <button 
          className={terminalMode ? "btn btn-dark" : "btn"} 
          onClick={() => setTerminalMode(!terminalMode)}
        >
          <Terminal size={20} /> {terminalMode ? "EXIT TERMINAL" : "TERMINAL MODE"}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
          className="btn" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: realityToggle ? 'var(--color-yellow)' : 'white' }}
          onClick={() => setRealityToggle(!realityToggle)}
        >
          <Activity size={16} /> REALITY VS HYPE: {realityToggle ? 'REALITY' : 'HYPE'}
        </button>
      </div>

      {terminalMode ? (
        <div style={{ background: '#111', color: '#0f0', padding: '2rem', fontFamily: 'monospace', borderRadius: '4px', border: 'var(--border-thick)' }}>
          <p>&gt; root@wht/engine:~</p>
          <p>&gt; fetching signals...</p>
          {signals.map(s => (
            <div key={s.id} style={{ marginTop: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
              <p><strong>[SIGNAL: {s.signal_level}]</strong> {s.title}</p>
              <p>&gt; IMP: {s.impact}</p>
              <p>&gt; ACT: {s.action}</p>
            </div>
          ))}
          <p className="cursor-blink">_</p>
          <style>{`@keyframes blink { 50% { opacity: 0; } } .cursor-blink { animation: blink 1s step-end infinite; }`}</style>
        </div>
      ) : (
        <div className="grid-3" style={{ display: 'flex', overflowX: 'auto', snapType: 'x mandatory', gap: '2rem', paddingBottom: '2rem' }}>
          {/* Swipeable Insights style */}
          {signals.map((s, i) => (
            <div key={i} className="card" style={{ minWidth: '320px', flex: '0 0 auto', scrollSnapAlign: 'start', position: 'relative' }}>
              <div className="card-tag" style={{ background: s.signal_level === 'CRITICAL' ? 'var(--color-red)' : 'var(--color-yellow)' }}>
                [ SIGNAL LEVEL: {s.signal_level} ]
              </div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{s.title}</h3>
              
              <div style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem', border: '2px solid #111' }}>
                <p style={{ margin: 0, fontWeight: 800 }}>→ IMPACT: <span style={{ fontWeight: 500 }}>{s.impact}</span></p>
                <p style={{ margin: 0, fontWeight: 800 }}>→ ACTION: <span style={{ fontWeight: 500 }}>{s.action}</span></p>
              </div>

              {realityToggle && s.influencer_hype ? (
                <div style={{ borderLeft: '4px solid var(--color-red)', paddingLeft: '1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-red)', fontWeight: 800, margin: 0 }}>INFLUENCER HYPE:</p>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>"{s.influencer_hype}"</p>
                </div>
              ) : null}

              <div style={{ marginTop: 'auto' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>WHAT HAPPENED:</strong> {s.what_happened}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>WHY IT MATTERS:</strong> {s.why_it_matters}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>HIDDEN SIGNAL:</strong> {s.hidden_signal}</p>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-dark" style={{ width: '100%', fontSize: '1rem', padding: '0.5rem' }}>
                  <Zap size={16} /> SAVE INSIGHT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
