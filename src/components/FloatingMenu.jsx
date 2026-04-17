import { Link } from 'react-router-dom';

export default function FloatingMenu() {
  const menuItems = [
    { name: 'HOME', path: '/', color: '#F26430', rotate: '10deg', textColor: 'white' },
    { name: 'TRENDS', path: '/trends', color: '#0F9D58', rotate: '-5deg', textColor: 'white' },
    { name: 'AGENTIC AI', path: '/agentic-ai', color: '#C5283D', rotate: '8deg', textColor: 'white' },
    { name: 'PLAYBOOK', path: '/playbook', color: '#004B8D', rotate: '-8deg', textColor: 'white' },
    { name: 'CASE STUDIES', path: '/case-studies', color: '#E1A118', rotate: '2deg', textColor: '#111' },
    { name: 'ABOUT', path: '/about', color: '#5E50A1', rotate: '-12deg', textColor: 'white' }
  ];

  return (
    <div className="floating-menu">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="float-item"
          style={{
            backgroundColor: item.color,
            color: item.textColor,
            '--hover-rotate': item.rotate
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
