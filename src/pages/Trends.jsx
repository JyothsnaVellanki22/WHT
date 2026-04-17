import ContentCard from '../components/ContentCard';

export default function Trends() {
  const posts = [
    { title: 'What Changed This Week in Tech Hiring', excerpt: 'FAANG is slowing down, but mid-size AI startups are hiring aggressively.', date: 'April 15', tag: 'Weekly Update', link: '#' },
    { title: 'H-1B Visa Alternatives for 2026', excerpt: 'O-1 visas are becoming the new standard. Here is how to build your profile.', date: 'April 08', tag: 'Visa Updates', link: '#' },
    { title: 'Why Remote Roles Are Disappearing', excerpt: 'The shift back to hybrid and what it means for international students.', date: 'April 01', tag: 'Market Trends', link: '#' },
    { title: 'AI Impact on Software Engineering Jobs', excerpt: 'Junior roles are shrinking. Mid-level requires AI workflow experience.', date: 'March 25', tag: 'AI Impact', link: '#' },
  ];

  return (
    <div className="page-fade section-padding container">
      <h1 className="title-huge" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>Tech & Job Market Trends</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.2rem' }}>
        Layoffs, hiring shifts, and the macro environment decoded.
      </p>
      
      <div className="grid-2">
        {posts.map((post, i) => <ContentCard key={i} {...post} />)}
      </div>
    </div>
  );
}
