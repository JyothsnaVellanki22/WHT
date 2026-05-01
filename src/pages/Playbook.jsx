import { useState, useEffect } from 'react';
import { Target, Activity, FileText, ArrowRight } from 'lucide-react';

export default function Playbook() {
  const [careerData, setCareerData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/career-path')
      .then(r => r.json()).then(setCareerData).catch(e => {
        setCareerData({
          role: 'backend', readiness: 63,
          gaps: [{ skill: 'System Design', priority: 'High' }, { skill: 'Kafka', priority: 'Medium' }],
          suggested_plan: [{ week: 'Week 1', task: 'Async systems' }, { week: 'Week 2', task: 'Kafka basics' }]
        });
      });
      
    fetch('http://localhost:8000/api/market/trends')
      .then(r => r.json()).then(setMarketData).catch(e => {
        setMarketData({ rising_skills: ['LangGraph', 'CUDA'], dying_skills: ['Basic React', 'REST'], salary_trend: '+15% AI roles' });
      });
  }, []);

  const handleResumeScan = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/resume/analyze', { method: 'POST' });
      const data = await res.json();
      setAtsScore(data);
    } catch (e) {
      setAtsScore({ score: 65, missing_keywords: ['Agentic AI', 'Kafka'], advice: 'Mock result.' });
    }
  };

  return (
    <div className="page-fade section-padding container">
      <h1 className="title-huge" style={{ fontSize: '3rem', marginBottom: '2rem' }}>WAR ROOM: THE DASHBOARD</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Career Decision Dashboard */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Target size={24} color="var(--color-red)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>WHAT SHOULD I LEARN NEXT?</h2>
          </div>
          
          {careerData ? (
            <div>
              <div style={{ background: '#111', color: 'white', padding: '1rem', display: 'inline-block', marginBottom: '1rem', fontWeight: 800 }}>
                {careerData.readiness}% READY FOR {careerData.role.toUpperCase()}
              </div>
              
              <h4 style={{ margin: '1rem 0 0.5rem' }}>CRITICAL GAPS:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {careerData.gaps.map((g, i) => (
                  <li key={i} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{g.skill}</strong>
                    <span style={{ color: g.priority === 'High' ? 'var(--color-red)' : 'var(--color-yellow)' }}>[{g.priority}]</span>
                  </li>
                ))}
              </ul>

              <h4 style={{ margin: '1.5rem 0 0.5rem' }}>SUGGESTED PLAN:</h4>
              {careerData.suggested_plan.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-pink)' }}>{p.week}</span>
                  <span>{p.task}</span>
                </div>
              ))}
            </div>
          ) : <p>Loading intelligence...</p>}
        </div>

        {/* ATS Reality */}
        <div className="card" style={{ background: 'var(--color-yellow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FileText size={24} color="#111" />
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#111' }}>ATS REALITY SIMULATOR</h2>
          </div>
          
          <textarea 
            placeholder="Paste your resume text here..." 
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '1rem', fontFamily: 'var(--font-body)', border: 'var(--border-thick)', marginBottom: '1rem', resize: 'none' }}
          ></textarea>
          
          <button className="btn btn-dark" onClick={handleResumeScan} style={{ width: '100%', marginBottom: '1rem' }}>
            RUN ATS SCAN
          </button>

          {atsScore && (
            <div style={{ background: 'white', padding: '1rem', border: 'var(--border-thick)' }}>
              <h3 style={{ fontSize: '2rem', margin: 0, color: atsScore.score < 70 ? 'var(--color-red)' : '#111' }}>
                SCORE: {atsScore.score}/100
              </h3>
              <p style={{ fontWeight: 800, marginTop: '1rem' }}>MISSING KEYWORDS:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {atsScore.missing_keywords.map(k => <span key={k} style={{ background: '#eee', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>{k}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Market Signals */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Activity size={24} color="var(--color-pink)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>MARKET SIGNALS</h2>
          </div>
          
          {marketData ? (
            <div>
              <div style={{ borderLeft: '4px solid var(--color-pink)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 800, margin: 0 }}>SALARY TREND</p>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{marketData.salary_trend}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--color-pink)', borderBottom: '2px solid #111', paddingBottom: '0.5rem' }}>RISING SKILLS</p>
                  {marketData.rising_skills.map(s => <p key={s} style={{ margin: '0.5rem 0', fontWeight: 600 }}>↑ {s}</p>)}
                </div>
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--color-red)', borderBottom: '2px solid #111', paddingBottom: '0.5rem' }}>DYING SKILLS</p>
                  {marketData.dying_skills.map(s => <p key={s} style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>↓ {s}</p>)}
                </div>
              </div>
            </div>
          ) : <p>Scanning market data...</p>}
        </div>

      </div>
    </div>
  );
}
