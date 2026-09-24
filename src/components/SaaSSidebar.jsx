import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Target, 
  BarChart3, 
  QrCode, 
  Settings, 
  ChevronDown, 
  Database,
  LogOut
} from 'lucide-react';

export default function SaaSSidebar({
  activeTab,
  onTabChange,
  user,
  walletsCount = 0,
  transactionsCount = 0,
  goalsCount = 0,
  isSupabaseConfigured = false,
  onLogout
}) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallets', label: 'Wallets & Envelopes', icon: Wallet, badge: walletsCount },
    { id: 'transactions', label: 'Transactions Ledger', icon: ArrowLeftRight, badge: transactionsCount },
    { id: 'goals', label: 'Savings & Budgets', icon: Target, badge: goalsCount },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'payments', label: 'Quick Pay & UPI', icon: QrCode },
  ];

  const systemNavItems = [
    { id: 'settings', label: 'Settings & Database', icon: Settings },
  ];

  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A';

  return (
    <aside className="saas-sidebar" aria-label="SaaS Sidebar Navigation">
      {/* Top Header & Brand */}
      <div>
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand-identity">
              <div className="brand-icon-sq">X</div>
              <div className="brand-name-wrap">
                <h2>
                  Xpense
                  <span className="brand-tag-badge">PRO SAAS</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="workspace-selector-btn" title="Current Workspace">
            <div className="workspace-avatar">
              {userInitial}
            </div>
            <div className="workspace-info">
              <div className="workspace-title">{user?.full_name || 'Aditya Burle'}</div>
              <div className="workspace-sub">{user?.account_type || 'Student Account (Admin)'}</div>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="sidebar-nav-container">
          <div>
            <div className="nav-group-label">Platform Core</div>
            <div className="nav-links-list">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                    id={`sidebar-nav-${item.id}`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="nav-counter-pill">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="nav-group-label">System & Ops</div>
            <div className="nav-links-list">
              {systemNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                    id={`sidebar-nav-${item.id}`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & User */}
      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <span className="status-dot-pulse" style={{ background: isSupabaseConfigured ? '#10b981' : '#facc15' }} />
          <span>{isSupabaseConfigured ? 'Supabase Live Sync' : 'Local Preview DB (Active)'}</span>
        </div>

        <div className="user-profile-widget" onClick={() => onTabChange('settings')}>
          <div className="user-avatar-circle">{userInitial}</div>
          <div className="user-details">
            <div className="user-name">{user?.full_name || 'Aditya Burle'}</div>
            <div className="user-role-badge">{user?.email || '128003008@sastra.ac.in'}</div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
