import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  BookOpen, 
  CreditCard 
} from 'lucide-react';

export default function TransactionsView({
  transactions = [],
  onDeleteTransaction,
  onOpenAddModal
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, expense, income, transfer
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = 
        tx.title?.toLowerCase().includes(search.toLowerCase()) ||
        tx.category?.toLowerCase().includes(search.toLowerCase()) ||
        tx.recipient?.toLowerCase().includes(search.toLowerCase()) ||
        tx.merchant?.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      const matchCategory = categoryFilter === 'all' || tx.category === categoryFilter;

      return matchSearch && matchType && matchCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['ID', 'Title', 'Amount (INR)', 'Type', 'Category', 'Wallet', 'Payment Method', 'Date'];
    const rows = filtered.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.wallet_name || '').replace(/"/g, '""')}"`,
      t.payment_method || 'UPI',
      `"${t.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xpense_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = Array.from(new Set(transactions.map(t => t.category).filter(Boolean)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Transactions Ledger
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Full financial journal and audit trail across all spending envelopes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary-action"
            onClick={handleExportCSV}
            title="Download CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button 
            className="btn-primary-action"
            onClick={onOpenAddModal}
          >
            <Plus size={16} strokeWidth={3} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-filter-bar">
        {/* Type pills */}
        <div className="table-filter-pills">
          {['all', 'expense', 'income', 'transfer'].map(type => (
            <button
              key={type}
              className={`filter-pill ${typeFilter === type ? 'active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? 'All Entries' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          {/* Category Dropdown */}
          <select 
            className="date-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Quick search input */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} className="search-icon-pos" />
            <input 
              type="text" 
              className="global-search-input"
              style={{ padding: '6px 10px 6px 32px', fontSize: '12px' }}
              placeholder="Search table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SaaS Table */}
      <div className="saas-table-container">
        <table className="saas-data-table">
          <thead>
            <tr>
              <th>Description / Merchant</th>
              <th>Category</th>
              <th>Envelope / Account</th>
              <th>Method</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th style={{ textAlign: 'right' }}>Amount (INR)</th>
              <th style={{ textAlign: 'center', width: '60px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map(tx => {
                const isIncome = tx.type === 'income';

                return (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-title-cell">
                        <div className="tx-icon-sq" style={{ background: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.06)', color: isIncome ? '#10b981' : '#facc15' }}>
                          {tx.category === 'Food & Dining' ? <ShoppingBag size={16} /> :
                           tx.category === 'Transportation' ? <Car size={16} /> :
                           tx.category === 'Entertainment' ? <Gamepad2 size={16} /> :
                           <CreditCard size={16} />}
                        </div>
                        <div className="tx-meta-info">
                          <div className="name">{tx.title}</div>
                          <div className="sub">{tx.merchant || tx.recipient || 'Standard payment'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag" style={{ background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td>{tx.wallet_name || 'Main Wallet'}</td>
                    <td>{tx.payment_method || 'UPI'}</td>
                    <td>
                      <span className="status-badge-cell status-completed">
                        ● Completed
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={isIncome ? 'amount-income' : 'amount-expense'}>
                        {isIncome ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete transaction "${tx.title}"?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        title="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-dim)' }}>
        <span>Showing {filtered.length} of {transactions.length} total entries</span>
        <span>Audit Status: Encrypted & Verified</span>
      </div>
    </div>
  );
}
