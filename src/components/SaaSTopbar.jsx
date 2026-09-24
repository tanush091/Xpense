import React from 'react';
import { Search, Plus, Bell, Smartphone, Monitor, Filter } from 'lucide-react';

export default function SaaSTopbar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  onOpenAddModal,
  isMobileView,
  onToggleMobileView,
  notificationsCount = 2
}) {
  return (
    <header className="saas-topbar" aria-label="SaaS Top Navigation">
      {/* Search Input */}
      <div className="topbar-left">
        <div className="global-search-container">
          <Search size={16} className="search-icon-pos" />
          <input 
            type="text" 
            className="global-search-input"
            placeholder="Search transactions, envelopes, goals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="saas-global-search"
          />
          <span className="keyboard-shortcut-hint">⌘K</span>
        </div>
      </div>

      {/* Actions */}
      <div className="topbar-right">
        {/* Date Filter */}
        <select 
          className="date-filter-select"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
        >
          <option value="this_month">This Month (Sep 2026)</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_quarter">Q3 2026</option>
          <option value="all_time">All Time</option>
        </select>

        {/* View Switcher Toggle (SaaS vs Phone frame) */}
        <button 
          className="topbar-icon-action" 
          onClick={onToggleMobileView}
          title={isMobileView ? "Switch to Full SaaS Layout" : "Switch to Mobile Phone Preview"}
          id="btn-toggle-view-mode"
        >
          {isMobileView ? <Monitor size={18} /> : <Smartphone size={18} />}
        </button>

        {/* Notifications Icon */}
        <button className="topbar-icon-action" title="Notifications">
          <Bell size={18} />
          {notificationsCount > 0 && <span className="notif-badge-dot" />}
        </button>

        {/* Add Transaction Primary CTA */}
        <button 
          className="btn-primary-action"
          onClick={onOpenAddModal}
          id="btn-topbar-new-transaction"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New Transaction</span>
        </button>
      </div>
    </header>
  );
}
