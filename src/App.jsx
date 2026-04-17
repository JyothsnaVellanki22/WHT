import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingMenu from './components/FloatingMenu';

// Pages
import Home from './pages/Home';
import Trends from './pages/Trends';
import AgenticAI from './pages/AgenticAI';
import Playbook from './pages/Playbook';
import ModuleDetail from './pages/ModuleDetail';
import CaseStudies from './pages/CaseStudies';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Navbar />
      <FloatingMenu />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/agentic-ai" element={<AgenticAI />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/playbook/:slug" element={<ModuleDetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
