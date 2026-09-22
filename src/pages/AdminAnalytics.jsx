import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  Eye, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Heart,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Award,
  Zap,
  Coffee,
  Compass,
  Smile
} from 'lucide-react';

// Generates warm, consistent avatar colors from string
function getAvatarGradient(str = '') {
  const gradients = [
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Friendly relative time formatter
function formatTimeAgo(isoString) {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

// Get greeting based on time of day
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AdminAnalytics({ isAdmin = false, onOpenNewNewsletterModal, onOpenNewTutorialModal }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('wht_auth_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/admin/analytics', { headers });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Admin authorization required to view community analytics.');
        }
        throw new Error(`Failed to load analytics: HTTP ${res.status}`);
      }

      const data = await res.json();
      setAnalytics(data);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '65vh' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid rgba(255, 207, 42, 0.25)',
          borderRadius: '20px',
          padding: '3.5rem 2rem',
          boxShadow: 'var(--shadow-hover)'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(255, 207, 42, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <ShieldCheck size={34} color="var(--color-yellow)" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.8rem', fontWeight: 800 }}>
            Curator Access Only
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This dashboard contains sensitive community metrics and subscriber feedback. Please log in with your Admin account to continue.
          </p>
        </div>
      </div>
    );
  }

  const activeSubCount = analytics?.subscribers?.active || 0;
  const totalSent = analytics?.emails?.total_sent || 0;
  const openRate = analytics?.emails?.overall_open_rate || 0;
  const usersCount = analytics?.users?.total || 0;

  return (
    <div className="admin-analytics-page" style={{ minHeight: '90vh', padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        
        {/* Humanized Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 207, 42, 0.12) 0%, rgba(56, 189, 248, 0.05) 50%, rgba(13, 13, 13, 0.4) 100%)',
          border: '1px solid rgba(255, 207, 42, 0.25)',
          borderRadius: '20px',
          padding: '2.4rem',
          marginBottom: '2.5rem',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 207, 42, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{
                  background: 'var(--color-yellow)',
                  color: '#0d0d0d',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Coffee size={12} /> CREATOR HUB
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                  {lastRefreshed ? `Checked ${lastRefreshed}` : 'Live Community Telemetry'}
                </span>
              </div>

              <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                {getTimeGreeting()}, Editor! 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
                Here is how your student community and tech readers are connecting with your lessons and weekly dispatches today.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                onClick={fetchAnalytics}
                disabled={loading}
                className="btn btn-outline"
                style={{
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '10px'
                }}
                title="Refresh metrics from database"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} /> {loading ? 'Checking...' : 'Refresh'}
              </button>

              <button
                onClick={() => navigate('/newsletters/new')}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.3rem',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(255, 207, 42, 0.3)'
                }}
              >
                <Send size={14} /> Write to Subscribers
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Celebration Pill */}
        {openRate > 0 && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1rem 1.4rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={18} color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                Exceptional Reader Curiosity!
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Your average open rate of <strong style={{ color: '#10b981' }}>{openRate}%</strong> significantly outperforms the tech media average (~21%). Your students appreciate your real-world architecture breakdowns.
              </p>
            </div>
          </div>
        )}

        {/* 4 Human-Centered Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.4rem',
          marginBottom: '3rem'
        }}>
          {/* Card 1: Devoted Readers */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 207, 42, 0.25)',
            borderRadius: '16px',
            padding: '1.8rem 1.6rem',
            boxShadow: 'var(--shadow-card)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Devoted Readers
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 207, 42, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={18} color="var(--color-yellow)" />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : activeSubCount}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Active & Engaged</span>
              <span>waiting for next edition</span>
            </div>
          </div>

          {/* Card 2: Reader Curiosity (Open Rate) */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '16px',
            padding: '1.8rem 1.6rem',
            boxShadow: 'var(--shadow-card)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Reader Curiosity
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye size={18} color="#38bdf8" />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : `${openRate}%`}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#38bdf8' }}>{analytics?.emails?.total_opened || 0}</strong> letters eagerly opened by students
            </div>
          </div>

          {/* Card 3: Letters Shared */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '16px',
            padding: '1.8rem 1.6rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Stories Dispatched
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={18} color="#a855f7" />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : totalSent}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Delivered safely to subscriber mailboxes
            </div>
          </div>

          {/* Card 4: Community Learners */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.8rem 1.6rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Learning Community
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={18} color="var(--text-main)" />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : usersCount}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>
                {analytics?.users?.admins || 0} Mentor
              </span>
              <span>•</span>
              <span>{analytics?.users?.students || 0} Students registered</span>
            </div>
          </div>
        </div>

        {/* Section 1: Letters to Your Community (Campaigns Table) */}
        <div style={{
          background: 'var(--bg-card)',
          border: 'var(--border-subtle)',
          borderRadius: '18px',
          padding: '2.2rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <BookOpen size={20} color="var(--color-yellow)" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Letters to Your Community
                </h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                How individual newsletter editions were received by your audience.
              </p>
            </div>
            <span style={{ 
              fontSize: '0.82rem', 
              color: 'var(--text-muted)', 
              background: 'var(--bg-card-hover)', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {analytics?.campaigns?.length || 0} Published Dispatches
            </span>
          </div>

          {analytics?.campaigns?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-subtle)' }}>
              <Mail size={36} style={{ opacity: 0.25, marginBottom: '0.8rem' }} />
              <p style={{ fontSize: '1rem', margin: 0 }}>No newsletters have been dispatched yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>When you send your first edition, reader opens will appear here live.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Newsletter Story</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Date Dispatched</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Inboxes Reached</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Unique Readers</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Reader Reception</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.campaigns?.map((camp) => {
                    const isHighReception = camp.open_rate >= 50;
                    return (
                      <tr 
                        key={camp.id}
                        style={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          fontSize: '0.94rem'
                        }}
                      >
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              background: 'rgba(255, 207, 42, 0.15)',
                              color: 'var(--color-yellow)'
                            }}>
                              {camp.edition || 'Weekly Edition'}
                            </span>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.02rem', marginBottom: '0.2rem' }}>
                            {camp.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                            Subject: “{camp.subject}”
                          </div>
                        </td>

                        <td style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          <div>{camp.sent_at ? new Date(camp.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                            {formatTimeAgo(camp.sent_at)}
                          </div>
                        </td>

                        <td style={{ padding: '1.2rem 1rem', textAlign: 'center', fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
                          {camp.recipient_count}
                        </td>

                        <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                          <span style={{ 
                            fontWeight: 800, 
                            color: camp.opens > 0 ? '#38bdf8' : 'var(--text-subtle)',
                            background: camp.opens > 0 ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.92rem'
                          }}>
                            {camp.opens}
                          </span>
                        </td>

                        <td style={{ padding: '1.2rem 1rem', minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                            <div style={{ 
                              flex: 1, 
                              height: '9px', 
                              background: 'rgba(255, 255, 255, 0.08)', 
                              borderRadius: '9999px',
                              overflow: 'hidden' 
                            }}>
                              <div style={{
                                width: `${Math.min(100, Math.max(camp.open_rate, 5))}%`,
                                height: '100%',
                                background: isHighReception
                                  ? 'linear-gradient(90deg, #10b981, #059669)'
                                  : 'linear-gradient(90deg, #38bdf8, var(--color-yellow))',
                                borderRadius: '9999px',
                                transition: 'width 0.6s ease'
                              }} />
                            </div>
                            <span style={{ 
                              fontSize: '0.92rem', 
                              fontWeight: 900, 
                              color: isHighReception ? '#10b981' : 'var(--text-main)', 
                              minWidth: '48px', 
                              textAlign: 'right' 
                            }}>
                              {camp.open_rate}%
                            </span>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: isHighReception ? '#10b981' : 'var(--text-subtle)', fontWeight: 600 }}>
                            {isHighReception ? '🎉 Standing ovation from readers!' : '📖 Steady readership'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Real People in Your Community (Two Humanized Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Column A: Subscribers with friendly avatars */}
          <div style={{
            background: 'var(--bg-card)',
            border: 'var(--border-subtle)',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} color="var(--color-yellow)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Active Readers
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', margin: '0.2rem 0 0 0' }}>
                  Students who requested to receive your weekly tech breakdowns.
                </p>
              </div>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px'
              }}>
                {analytics?.subscribers?.total || 0} Readers
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analytics?.subscribers?.recent?.map((sub) => {
                const initial = sub.email ? sub.email.charAt(0).toUpperCase() : 'S';
                return (
                  <div 
                    key={sub.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1.1rem',
                      background: 'var(--bg-card-hover)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: getAvatarGradient(sub.email),
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>
                        {initial}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                          {sub.email}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                          <span>●</span> Active Reader
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                      {formatTimeAgo(sub.subscribed_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: Registered Platform Learners */}
          <div style={{
            background: 'var(--bg-card)',
            border: 'var(--border-subtle)',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="#38bdf8" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Platform Members
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', margin: '0.2rem 0 0 0' }}>
                  People signed into the WHT interactive ecosystem.
                </p>
              </div>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px'
              }}>
                {analytics?.users?.total || 0} Members
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analytics?.users?.recent?.map((u) => {
                const initial = u.name ? u.name.charAt(0).toUpperCase() : (u.email ? u.email.charAt(0).toUpperCase() : 'U');
                const isAdminRole = u.role === 'ADMIN';
                return (
                  <div 
                    key={u.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1.1rem',
                      background: 'var(--bg-card-hover)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isAdminRole 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
                          : getAvatarGradient(u.email),
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>
                        {initial}
                      </div>

                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {u.name || 'Student Member'}
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            background: isAdminRole ? 'rgba(255, 207, 42, 0.18)' : 'rgba(56, 189, 248, 0.15)',
                            color: isAdminRole ? 'var(--color-yellow)' : '#38bdf8'
                          }}>
                            {isAdminRole ? 'AUTHOR' : 'STUDENT'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                      {formatTimeAgo(u.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Creator Reflection & Editorial Ideas */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 207, 42, 0.06) 0%, rgba(13, 13, 13, 0.2) 100%)',
          border: '1px dashed rgba(255, 207, 42, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Zap size={18} color="var(--color-yellow)" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Next Idea for Your Students
              </h4>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
              Your readers engaged heavily with <em>Logic Diagram 1 & 2</em>. Consider following up with a hands-on guide on <strong>JWT Token Invalidation & Session Defense</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {onOpenNewTutorialModal && (
              <button
                onClick={onOpenNewTutorialModal}
                className="btn btn-outline"
                style={{
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px'
                }}
              >
                <BookOpen size={14} /> New Tutorial
              </button>
            )}
            <button
              onClick={() => navigate('/newsletters/new')}
              className="btn btn-primary"
              style={{
                padding: '0.55rem 1.2rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '8px'
              }}
            >
              <Send size={14} /> Send Newsletter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
