import { Terminal, Cpu, Network } from 'lucide-react';

export default function AgenticAI() {
  return (
    <div className="page-fade section-padding container">
      <h1 className="title-huge" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
        Agentic AI <span style={{ color: 'var(--accent-color)' }}>& Future of Work</span>
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
        AI isn't just generating text anymore. It's taking actions. Here is how Agentic AI is changing hiring—and how you can use it to get ahead.
      </p>

      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Cpu size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h3>What is Agentic AI?</h3>
          <p>Unlike LLMs that just answer questions, Agentic AI systems autonomously plan, execute, and iterate to achieve goals—like an intern screening resumes.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Network size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h3>AI Tools for Job Search</h3>
          <p>Don't just use ChatGPT to write your cover letter. Use LangChain agents to scrape job boards and auto-apply to roles matching your skills.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Terminal size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h3>Automation Workflows</h3>
          <p>Build outreach systems with Zapier and OpenAI to track recruiters, draft hyper-personalized DM's, and manage your follow-ups.</p>
        </div>
      </div>

      <div style={{ background: '#111', padding: '3rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2>The "Agentic" Job Applicant</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Employers are now using agents to filter your applications. If you aren't using agents to optimize them, you're bringing a knife to a gunfight.
        </p>
        <button className="btn">Get the Automation Guide</button>
      </div>
    </div>
  );
}
