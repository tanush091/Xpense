import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  MoreVertical, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  ShoppingCart, 
  X, 
  Trash2, 
  TrendingUp, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Food & Dining': ShoppingBag,
  'Transportation': Car,
  'Entertainment': Gamepad2,
  'Shopping': ShoppingCart,
  'Shopping & Utilities': ShoppingCart,
  'General': Wallet
};

export default function WalletsView({
  wallets = [],
  onAddWallet,
  onTopUpWallet,
  onDeleteWallet
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [topUpTarget, setTopUpTarget] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('500');

  // New Wallet form
  const [walletName, setWalletName] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [budgetLimit, setBudgetLimit] = useState('2000');
  const [initialBalance, setInitialBalance] = useState('500');

  const totalAllocated = wallets.reduce((sum, w) => sum + parseFloat(w.budget_limit || 0), 0);
  const totalAvailable = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!walletName.trim()) return;

    let icon = 'Wallet';
    let color = '#3B82F6';
    if (category === 'Food & Dining') { icon = 'ShoppingBag'; color = '#10B981'; }
    else if (category === 'Transportation') { icon = 'Car'; color = '#3B82F6'; }
    else if (category === 'Entertainment') { icon = 'Gamepad2'; color = '#A855F7'; }
    else if (category === 'Shopping') { icon = 'ShoppingCart'; color = '#F59E0B'; }

    onAddWallet({
      name: walletName,
      category,
      budget_limit: parseFloat(budgetLimit) || 1000,
      balance: parseFloat(initialBalance) || 0,
      icon,
      color
    });

    setShowAddModal(false);
    setWalletName('');
  };

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    if (!topUpTarget || !topUpAmount) return;
    onTopUpWallet(topUpTarget.id, parseFloat(topUpAmount));
    setTopUpTarget(null);
    setTopUpAmount('500');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Spending Envelopes & Virtual Wallets
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Segmented budget pools to enforce category spending limits
          </p>
        </div>
        <button 
          className="btn-primary-action"
          onClick={() => setShowAddModal(true)}
          id="btn-add-envelope-saas"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New Envelope</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="saas-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Total Category Allocation</span>
          <div className="kpi-amount">₹{totalAllocated.toLocaleString('en-IN')}</div>
          <span className="kpi-subtext">Sum of all monthly caps</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Current Available Headroom</span>
          <div className="kpi-amount" style={{ color: '#10b981' }}>₹{totalAvailable.toLocaleString('en-IN')}</div>
          <span className="kpi-subtext">{Math.round((totalAvailable / Math.max(1, totalAllocated)) * 100)}% available to spend</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Active Envelopes</span>
          <div className="kpi-amount">{wallets.length}</div>
          <span className="kpi-subtext">Zero unallocated spillover</span>
        </div>
      </div>

      {/* Grid of Envelopes */}
      <div className="saas-cards-grid">
        {wallets.map(w => {
          const Icon = CATEGORY_ICONS[w.category] || Wallet;
          const balance = parseFloat(w.balance);
          const limit = parseFloat(w.budget_limit || 1000);
          const pct = Math.min(100, Math.round((balance / limit) * 100));

          return (
            <div key={w.id} className="saas-panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: w.color || '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{w.name}</h3>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>{w.cycle_days_left || 30} days left in cycle</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete envelope "${w.name}"?`)) {
                        onDeleteWallet(w.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    title="Delete Envelope"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
                    ₹{balance.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Cap: ₹{limit.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="progress-bar-rail">
                  <div 
                    className="progress-bar-thumb" 
                    style={{ width: `${pct}%`, background: w.color || '#3b82f6' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '18px' }}>
                  <span>Daily avg: ₹{w.daily_avg || 350}</span>
                  <span className={`category-tag ${pct > 25 ? 'trend-up' : 'trend-down'}`}>
                    {pct > 25 ? 'Healthy' : 'Low Headroom'}
                  </span>
                </div>
              </div>

              <button 
                className="btn-secondary-action" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setTopUpTarget(w)}
              >
                <Plus size={15} />
                <span>Top Up Envelope</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Envelope Modal */}
      {showAddModal && (
        <div className="modal-backdrop-saas" onClick={() => setShowAddModal(false)}>
          <div className="modal-window-saas" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Create Spending Envelope</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group-saas">
                <label className="form-label-saas">Envelope Title</label>
                <input 
                  type="text" 
                  className="form-input-saas" 
                  placeholder="e.g. Cloud & Subscriptions"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Spending Category</label>
                <select 
                  className="form-input-saas"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping & Tech</option>
                  <option value="General">General Operations</option>
                </select>
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Monthly Budget Cap (₹)</label>
                <input 
                  type="number" 
                  className="form-input-saas" 
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  min="100"
                  required
                />
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Initial Allocation (₹)</label>
                <input 
                  type="number" 
                  className="form-input-saas" 
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary-action" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Create Envelope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {topUpTarget && (
        <div className="modal-backdrop-saas" onClick={() => setTopUpTarget(null)}>
          <div className="modal-window-saas" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Inject Capital / Top Up</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{topUpTarget.name}</p>
              </div>
              <button onClick={() => setTopUpTarget(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit}>
              <div className="form-group-saas">
                <label className="form-label-saas">Top Up Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-input-saas" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min="10"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['200', '500', '1000', '2500'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: '8px',
                      background: topUpAmount === amt ? 'var(--accent-yellow)' : 'var(--bg-app)',
                      color: topUpAmount === amt ? '#000' : '#cbd5e1',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn-secondary-action" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTopUpTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Injection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
