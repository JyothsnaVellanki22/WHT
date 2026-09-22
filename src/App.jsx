import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewTutorialModal from './components/NewTutorialModal';
import NewNewsletterModal from './components/NewNewsletterModal';
import EditNewsletterModal from './components/EditNewsletterModal';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import BlogsPage from './pages/BlogsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewslettersPage from './pages/NewslettersPage';
import About from './pages/About';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wht_theme') || 'dark';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wht_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [isEditNewsletterModalOpen, setIsEditNewsletterModalOpen] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(5);
  const [blogs, setBlogs] = useState([]);
  const [newsletters, setNewsletters] = useState([]);

  const isAdmin = currentUser?.role === 'ADMIN';

  // Sync theme with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wht_theme', theme);
  }, [theme]);

  // Validate JWT on load
  useEffect(() => {
    const token = localStorage.getItem('wht_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired');
      })
      .then(user => {
        setCurrentUser(user);
        localStorage.setItem('wht_user_profile', JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem('wht_auth_token');
        localStorage.removeItem('wht_user_profile');
        setCurrentUser(null);
      });
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch blogs, newsletters, and subscriber count on load
  useEffect(() => {
    fetchBlogs();
    fetchNewsletters();
    fetchSubscriberCount();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.warn('Backend not reachable, loading fallback cache:', err);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const res = await fetch('/api/newsletters');
      if (res.ok) {
        const data = await res.json();
        setNewsletters(data);
      }
    } catch (err) {
      console.warn('Backend not reachable:', err);
    }
  };

  const fetchSubscriberCount = async () => {
    try {
      const res = await fetch('/api/subscribers/count');
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.subscriber_count || 5);
      }
    } catch (err) {
      console.warn('Backend not reachable:', err);
    }
  };

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('wht_auth_token');
    localStorage.removeItem('wht_user_profile');
    setCurrentUser(null);
  };

  const handleDeleteBlog = async (blogId) => {
    const token = localStorage.getItem('wht_auth_token');
    if (!token || !currentUser || currentUser.role !== 'ADMIN') {
      alert('Administrator access required to delete blogs.');
      return false;
    }

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== blogId));
        return true;
      } else {
        alert(data.detail || 'Failed to delete blog. Admin privileges required.');
        return false;
      }
    } catch (err) {
      console.error('Delete blog error:', err);
      alert('Network error while attempting to delete blog.');
      return false;
    }
  };

  const handleAddBlog = (newBlog) => {
    setBlogs((prev) => [newBlog, ...prev]);
  };

  const handleNewsletterSent = (newNewsletter) => {
    setNewsletters((prev) => [newNewsletter, ...prev]);
  };

  const handleOpenEditNewsletter = (newsletter) => {
    if (!isAdmin) return;
    setEditingNewsletter(newsletter);
    setIsEditNewsletterModalOpen(true);
  };

  const handleNewsletterUpdated = (updatedNewsletter) => {
    setNewsletters((prev) =>
      prev.map((item) => (item.id === updatedNewsletter.id ? updatedNewsletter : item))
    );
  };

  const handleNewsletterDeleted = (deletedId) => {
    setNewsletters((prev) => prev.filter((item) => item.id !== deletedId));
  };

  const handleOpenTutorialModal = () => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
    } else {
      setIsTutorialModalOpen(true);
    }
  };

  const handleOpenNewsletterModal = () => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
    } else {
      setIsNewsletterModalOpen(true);
    }
  };

  return (
    <Router>
      <Navbar 
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenNewTutorialModal={handleOpenTutorialModal}
        onOpenNewNewsletterModal={handleOpenNewsletterModal}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                blogs={blogs}
                subscriberCount={subscriberCount}
                onSubscriberAdded={() => fetchSubscriberCount()}
                onOpenNewTutorialModal={handleOpenTutorialModal}
                onOpenNewNewsletterModal={handleOpenNewsletterModal}
                isAdmin={isAdmin}
                onDeleteBlog={handleDeleteBlog}
              />
            } 
          />
          <Route 
            path="/blogs" 
            element={
              <BlogsPage 
                blogs={blogs}
                onOpenNewTutorialModal={handleOpenTutorialModal}
                isAdmin={isAdmin}
                onDeleteBlog={handleDeleteBlog}
              />
            } 
          />
          <Route 
            path="/article/:slug" 
            element={
              <ArticleDetailPage 
                blogs={blogs} 
                isAdmin={isAdmin}
                onDeleteBlog={handleDeleteBlog}
              />
            } 
          />
          <Route 
            path="/newsletters" 
            element={
              <NewslettersPage 
                newsletters={newsletters}
                subscriberCount={subscriberCount}
                onSubscriberAdded={() => fetchSubscriberCount()}
                onOpenNewNewsletterModal={handleOpenNewsletterModal}
                onEditNewsletter={handleOpenEditNewsletter}
                isAdmin={isAdmin}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route 
            path="/admin/analytics" 
            element={
              <AdminAnalytics 
                isAdmin={isAdmin}
                onOpenNewNewsletterModal={handleOpenNewsletterModal}
                onOpenNewTutorialModal={handleOpenTutorialModal}
              />
            } 
          />
        </Routes>
      </main>

      {/* Builder Modals (Restricted to Admin) */}
      <NewTutorialModal 
        isOpen={isTutorialModalOpen && isAdmin} 
        onClose={() => setIsTutorialModalOpen(false)} 
        onAddBlog={handleAddBlog} 
      />

      <NewNewsletterModal
        isOpen={isNewsletterModalOpen && isAdmin}
        onClose={() => setIsNewsletterModalOpen(false)}
        onNewsletterSent={handleNewsletterSent}
        subscriberCount={subscriberCount}
      />

      <EditNewsletterModal
        isOpen={isEditNewsletterModalOpen && isAdmin}
        onClose={() => {
          setIsEditNewsletterModalOpen(false);
          setEditingNewsletter(null);
        }}
        newsletter={editingNewsletter}
        onNewsletterUpdated={handleNewsletterUpdated}
        onNewsletterDeleted={handleNewsletterDeleted}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <Footer />
    </Router>
  );
}

export default App;
