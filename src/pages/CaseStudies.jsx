import ContentCard from '../components/ContentCard';

export default function CaseStudies() {
  const stories = [
    { title: 'From 500 Rejections to FAANG Offer', excerpt: 'How an international student used targeted networking and a portfolio project to break in.', date: 'Real Story', tag: 'Success', link: '#' },
    { title: 'Landing a PM Role without an MBA', excerpt: 'Transitioning from engineering to product through internal mobility and side projects.', date: 'Real Story', tag: 'Product', link: '#' },
    { title: 'The Cold Email that Got a Seed Round', excerpt: 'Not just for jobs. How precise outreach cuts through the noise.', date: 'Real Story', tag: 'Startup', link: '#' }
  ];

  return (
    <div className="page-fade section-padding container">
      <h1 className="title-huge" style={{ fontSize: '4rem', textAlign: 'center' }}>Case Studies</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.2rem' }}>
        Real stories. Exact steps. 0 fluff.
      </p>
      <div className="grid-3">
        {stories.map((story, i) => <ContentCard key={i} {...story} />)}
      </div>
    </div>
  );
}
