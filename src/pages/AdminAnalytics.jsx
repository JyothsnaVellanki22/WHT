import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Eye, 
  TrendingUp, 
  Send, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';

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
          throw new Error('Admin authorization required to access this dashboard.');
        }
        throw new Error(`Failed to load analytics: HTTP ${res.status}`);
      }

      const data = await res.json();
      setAnalytics(data);
      setLastRefreshed(new Date().toLocaleTimeString());
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
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid rgba(255, 207, 42, 0.25)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-hover)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 207, 42, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <ShieldCheck size={32} color="var(--color-yellow)" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
            Admin Authorization Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This analytics dashboard contains confidential subscriber metrics, email deliverability logs, and open rates. Please sign in with an Administrator account to view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics-page" style={{ minHeight: '85vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Top Header & Refresh Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.2rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'var(--color-yellow)',
                color: '#0d0d0d',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                ADMIN METRICS
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                {lastRefreshed ? `Updated at ${lastRefreshed}` : 'Real-time telemetry'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Platform & Email Analytics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
              Live subscriber engagement, email open rates, and user growth telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="btn btn-outline"
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                borderRadius: '8px'
              }}
              title="Refresh Analytics Metrics"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> {loading ? 'Refreshing...' : 'Refresh'}
            </button>

            {onOpenNewNewsletterModal && (
              <button
                onClick={onOpenNewNewsletterModal}
                className="btn btn-primary"
                style={{
                  padding: '0.55rem 1.2rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '8px'
                }}
              >
                <Send size={14} /> Send Newsletter
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '1rem 1.4rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#ef4444'
          }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{error}</span>
          </div>
        )}

        {/* 4 Core KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.4rem',
          marginBottom: '3rem'
        }}>
          {/* KPI 1: Subscribers */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 207, 42, 0.25)',
            borderRadius: '14px',
            padding: '1.6rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Subscribers
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 207, 42, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={18} color="var(--color-yellow)" />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : analytics?.subscribers?.active || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle size={13} /> {analytics?.subscribers?.total || 0} Total enrolled
              </span>
              {analytics?.subscribers?.unsubscribed > 0 && (
                <span style={{ color: 'var(--text-subtle)' }}>({analytics.subscribers.unsubscribed} inactive)</span>
              )}
            </div>
          </div>

          {/* KPI 2: Open Rate */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '14px',
            padding: '1.6rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Avg Email Open Rate
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye size={18} color="#38bdf8" />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : `${analytics?.emails?.overall_open_rate || 0}%`}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                {analytics?.emails?.total_opened || 0}
              </span> opens out of {analytics?.emails?.total_sent || 0} total dispatched
            </div>
          </div>

          {/* KPI 3: Total Deliveries */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '14px',
            padding: '1.6rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Dispatched Emails
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Send size={18} color="#a855f7" />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : analytics?.emails?.total_sent || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Newsletters + new tutorial dispatches
            </div>
          </div>

          {/* KPI 4: Registered Users */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.6rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Platform Accounts
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={18} color="var(--text-main)" />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.6rem' }}>
              {loading && !analytics ? '...' : analytics?.users?.total || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem' }}>
              <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>
                {analytics?.users?.admins || 0} Admin
              </span>
              <span>•</span>
              <span>{analytics?.users?.students || 0} Students</span>
            </div>
          </div>
        </div>

        {/* Section 1: Newsletter Campaigns Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: 'var(--border-subtle)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                Newsletter Campaigns & Deliverability
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', margin: 0 }}>
                Track recipient reach, individual open rates, and reader engagement per edition.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', background: 'var(--bg-card-hover)', padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
              {analytics?.campaigns?.length || 0} Dispatched Campaigns
            </span>
          </div>

          {analytics?.campaigns?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
              <Mail size={32} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
              <p>No newsletter dispatches recorded yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Edition & Title</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Sent Date</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Recipients</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Unique Opens</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Open Rate Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.campaigns?.map((camp) => (
                    <tr 
                      key={camp.id}
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        fontSize: '0.92rem',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <td style={{ padding: '1.1rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 207, 42, 0.15)',
                            color: 'var(--color-yellow)'
                          }}>
                            {camp.edition || 'Weekly Edition'}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {camp.title}
                        </span>
                      </td>

                      <td style={{ padding: '1.1rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {camp.sent_at ? new Date(camp.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </td>

                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-main)' }}>
                        {camp.recipient_count}
                      </td>

                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>
                        <span style={{ 
                          fontWeight: 800, 
                          color: camp.opens > 0 ? '#38bdf8' : 'var(--text-subtle)',
                          background: camp.opens > 0 ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px'
                        }}>
                          {camp.opens}
                        </span>
                      </td>

                      <td style={{ padding: '1.1rem 1rem', minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ 
                            flex: 1, 
                            height: '8px', 
                            background: 'rgba(255, 255, 255, 0.08)', 
                            borderRadius: '9999px',
                            overflow: 'hidden' 
                          }}>
                            <div style={{
                              width: `${Math.min(100, Math.max(camp.open_rate, 4))}%`,
                              height: '100%',
                              background: camp.open_rate >= 50 
                                ? '#10b981' 
                                : camp.open_rate >= 20 
                                  ? 'var(--color-yellow)' 
                                  : '#38bdf8',
                              borderRadius: '9999px',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: '0.88rem', 
                            fontWeight: 800, 
                            color: 'var(--text-main)', 
                            minWidth: '45px', 
                            textAlign: 'right' 
                          }}>
                            {camp.open_rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Two Columns (Subscribers + Users) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem'
        }}>
          {/* Column A: Recent Subscribers */}
          <div style={{
            background: 'var(--bg-card)',
            border: 'var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.8rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--color-yellow)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Active Subscribers ({analytics?.subscribers?.total || 0})
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                100% Verified
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.subscribers?.recent?.map((sub) => (
                <div 
                  key={sub.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-card-hover)',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sub.is_active ? '#10b981' : 'var(--text-subtle)' }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sub.email}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : 'Subscribed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Registered Platform Users */}
          <div style={{
            background: 'var(--bg-card)',
            border: 'var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.8rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Registered Users ({analytics?.users?.total || 0})
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                RBAC Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.users?.recent?.map((u) => (
                <div 
                  key={u.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-card-hover)',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {u.name || 'Student'}
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                        background: u.role === 'ADMIN' ? 'rgba(255, 207, 42, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: u.role === 'ADMIN' ? 'var(--color-yellow)' : '#38bdf8'
                      }}>
                        {u.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
                      {u.email}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
