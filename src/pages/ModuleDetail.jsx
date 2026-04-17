import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const moduleContent = {
  resume: {
    title: "Resume Strategies: Beating the ATS",
    tag: "Module 1",
    content: (
      <>
        <h2>The Brutal Truth About Resumes</h2>
        <p>A recruiter spends an average of 6 seconds looking at your resume. An Applicant Tracking System (ATS) spends mere milliseconds parsing it. If your resume isn't optimized for both, you're immediately disqualified before human eyes ever see your hard work.</p>

        <h2>Rules for ATS-Friendly Formatting</h2>
        <ul>
          <li><strong>No Columns, Graphics, or Complex Tables:</strong> The ATS reads left to right, top to bottom. Multi-column formats scramble the text. Stick to a clean, single-column document.</li>
          <li><strong>Standard Fonts Only:</strong> Use Inter, Arial, Calibri, or Helvetica. Avoid custom or downloaded fonts.</li>
          <li><strong>Keyword Optimization:</strong> You must weave the exact keywords from the job description into your experience. If the description asks for "RESTful APIs," don't write "backend web services." Match the phrasing exactly.</li>
        </ul>

        <h2>The XYZ Bullet Point Formula</h2>
        <p>Your bullet points should not be a list of responsibilities. They must be a list of accomplishments. Use Google's XYZ formula:</p>
        <div style={{ background: '#eee', padding: '1.5rem', borderLeft: '4px solid var(--color-red)', marginBottom: '2rem' }}>
          <em>"Accomplished [X] as measured by [Y], by doing [Z]."</em>
        </div>

        <p><strong>Bad:</strong> "Wrote Java code for the backend service."<br />
          <strong>Actionable:</strong> "Decreased API latency by 40% (X) resulting in higher user retention (Y), by refactoring the core Java-based microservice architecture (Z)."</p>
      </>
    )
  },
  linkedin: {
    title: "LinkedIn: Inbound SEO Optimization",
    tag: "Module 2",
    content: (
      <>
        <h2>Why LinkedIn Matters More Than Your Resume</h2>
        <p>While your resume goes into a black-hole portal, your LinkedIn profile acts as a 24/7 landing page for inbound opportunities. Recruiters use "LinkedIn Recruiter" software, which heavily relies on SEO to surface candidates.</p>

        <h2>Profile Headline Hacker Techniques</h2>
        <p>The headline is the most heavily weighted SEO field. Do not use generic titles like "Student at University." Instead, format it as a value proposition or specific skill array.</p>
        <ul>
          <li><strong>Example:</strong> "Software Engineer | Java, Spring Boot, React | Building scalable backend systems & Agentic AI workflows"</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>The 'About' Section & Engagement</h2>
        <p>Your About section shouldn't read like a dry corporate bio. Tell a story. Mention the hard tech you are working on, the problems you are passionate about, and your willingness to relocate or step into high-impact roles. Furthermore, post your insights consistently—the algorithm drastically favors active users.</p>
      </>
    )
  },
  networking: {
    title: "Networking & Outreach Scripts",
    tag: "Module 3",
    content: (
      <>
        <h2>The Cold Intro Masterclass</h2>
        <p>Applying blindly without referrals has a conversion rate of close to 1-2%. If you want to bypass the portal, you need internal champions. This is where strategic outreach comes into play.</p>

        <h2>Who to Target</h2>
        <ul>
          <li><strong>Alumni from your University:</strong> They share a background and are usually highly willing to help entry-level talent.</li>
          <li><strong>Hiring Managers / 2nd Connections:</strong> Sometimes risky, but reaching the person actually making the hiring decision cuts out the middleman recruiting filter.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>The Perfect DM Template</h2>
        <div style={{ background: '#eee', padding: '1.5rem', borderLeft: '4px solid var(--color-yellow)', marginBottom: '2rem', fontFamily: 'monospace' }}>
          <p>Hi [Name],</p>
          <p>I noticed you transitioned from [XYZ] into your current role at [Company] as a [Role]. I’m a recent Java/AI engineer deeply impressed by [specific Company project].</p>
          <p>I know you’re incredibly busy, but I’d love to ask just two quick questions about your experience working with [technology/team] there. Any chance you have 10 minutes for a quick chat next week?</p>
          <p>Thanks,<br />[Your Name]</p>
        </div>
      </>
    )
  },
  technical: {
    title: "Cracking the Technical Interviews",
    tag: "Module 4",
    content: (
      <>
        <h2>Beyond Leetcode</h2>
        <p>Grinding algorithms is essential, but it is no longer the only bar. Companies want to understand how you architect systems, debug in the real world, and communicate under pressure.</p>

        <h2>System Design Foundations</h2>
        <p>Even for junior roles, basic system design is beginning to surface. You must understand:</p>
        <ul>
          <li><strong>Load Balancing & Scalability:</strong> Horizontal vs. Vertical scaling.</li>
          <li><strong>Database Tradeoffs:</strong> When to use SQL (ACID) vs. NoSQL (Eventual Consistency).</li>
          <li><strong>Caching Strategies:</strong> Redis, Memcached, and CDN implementations to reduce latency.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Behavioral (The STAR Method)</h2>
        <p>If you nail the technicals but fail the "fit" test, you will not get an offer. Structure every story using the STAR method: <strong>Situation, Task, Action, Result.</strong> Have exactly 5 versatile stories mapped out perfectly before stepping foot into the interview room.</p>
      </>
    )
  }
};

export default function ModuleDetail() {
  const { slug } = useParams();
  const moduleData = moduleContent[slug];

  if (!moduleData) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center' }}>
        <h1 className="title-huge">Module Not Found</h1>
        <Link to="/playbook" className="btn btn-dark">Return to Playbook</Link>
      </div>
    );
  }

  return (
    <div className="section-padding container">
      <Link to="/playbook" style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> BACK TO PLAYBOOK
      </Link>

      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', boxShadow: '-8px 8px 0px rgba(0,0,0,1)' }}>
        <div className="card-tag">{moduleData.tag}</div>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>{moduleData.title}</h1>

        <div className="module-content">
          {moduleData.content}
        </div>
      </div>
    </div>
  );
}
