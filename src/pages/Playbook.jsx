import ContentCard from '../components/ContentCard';

export default function Playbook() {
  const sections = [
    { title: 'Resume Strategies', excerpt: 'How to bypass the ATS, format for impact, and quantify your achievements without lying.', date: 'Module 1', tag: 'Resume', link: '/playbook/resume' },
    { title: 'LinkedIn Optimization', excerpt: 'Turn your profile into an inbound funnel for recruiters. SEO for the job seeker.', date: 'Module 2', tag: 'LinkedIn', link: '/playbook/linkedin' },
    { title: 'Networking Scripts', excerpt: 'Exact DM templates to message alumni, hiring managers, and founders without being annoying.', date: 'Module 3', tag: 'Outreach', link: '/playbook/networking' },
    { title: 'Cracking the Technical', excerpt: 'Leetcode is not enough. System design and behavioral interview mastery.', date: 'Module 4', tag: 'Interviews', link: '/playbook/technical' },
  ];

  return (
    <div className="page-fade section-padding container">
      <h1 className="title-huge" style={{ fontSize: '4rem' }}>The Job Search Playbook</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.2rem', maxWidth: '600px' }}>
        Step-by-step strategies to go from absolute 0 to multiple offers.
      </p>
      
      <div className="grid-2">
        {sections.map((post, i) => <ContentCard key={i} {...post} />)}
      </div>
    </div>
  );
}
