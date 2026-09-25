import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Download,
  ShoppingBag,
  Car,
  Gamepad2,
  BookOpen
} from 'lucide-react';

export default function DashboardView({
  user,
  wallets = [],
  goals = [],
  transactions = [],
  analytics,
  onNavigate,
  onOpenAddModal
}) {
  const totalBalance = parseFloat(user?.total_balance || 2450);
  const monthlySpend = parseFloat(analytics?.monthlyTrends?.thisMonth || 1250);
  const monthlyInflow = 5000;
  const savingsRate = Math.round(((monthlyInflow - monthlySpend) / monthlyInflow) * 100);

  // Recent transactions
  const recentTxs = transactions.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Welcome Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Financial Overview & Operations
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Welcome back, {user?.full_name || 'Aditya'}. Here is your real-time treasury and cashflow summary.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary-action"
            onClick={() => onNavigate('payments')}
          >
            <CreditCard size={15} />
            <span>Instant Pay & UPI</span>
          </button>
          <button 
            className="btn-primary-action"
            onClick={onOpenAddModal}
          >
            <span>+ Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="saas-kpi-grid">
        {/* KPI 1: Net Treasury Balance */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Cash Balance</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(250, 204, 21, 0.12)', color: '#facc15' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div className="kpi-amount">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-trend trend-up">
              <ArrowUpRight size={14} /> +12.4%
            </span>
            <span className="kpi-subtext">vs last month</span>
          </div>
        </div>

        {/* KPI 2: Monthly Inflow */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Monthly Inflow / Deposits</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-amount">₹{monthlyInflow.toLocaleString('en-IN')}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-trend trend-up">
              <ArrowUpRight size={14} /> Steady
            </span>
            <span className="kpi-subtext">Salary / Allowance</span>
          </div>
        </div>

        {/* KPI 3: Monthly Burn / Spend */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Monthly Burn / Outflow</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="kpi-amount">₹{monthlySpend.toLocaleString('en-IN')}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-trend trend-down">
              <ArrowDownRight size={14} /> -15%
            </span>
            <span className="kpi-subtext">under max budget cap</span>
          </div>
        </div>

        {/* KPI 4: Net Savings Rate */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Target Savings Rate</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a855f7' }}>
              <Target size={18} />
            </div>
          </div>
          <div className="kpi-amount">{savingsRate}%</div>
          <div className="kpi-footer-meta">
            <span className="kpi-trend trend-up">
              {goals.length} active targets
            </span>
            <span className="kpi-subtext">on track</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Visual Cash Flow Chart + AI Financial Copilot */}
      <div className="saas-grid-2col">
        {/* Left Column: Interactive Cash Flow & Burn Graph */}
        <div className="saas-panel-card">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Cashflow & Budget Velocity</h3>
              <p>Weekly spending trajectory vs allocated category envelopes</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Budget Cap
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15' }} /> Actual Burn
              </span>
            </div>
          </div>

          {/* SVG Multi-bar Cashflow Chart */}
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '18px', padding: '10px 0 20px 0' }}>
            {[
              { day: 'Mon', budget: 350, actual: 180 },
              { day: 'Tue', budget: 400, actual: 210 },
              { day: 'Wed', budget: 350, actual: 95 },
              { day: 'Thu', budget: 450, actual: 320 },
              { day: 'Fri', budget: 500, actual: 440 },
              { day: 'Sat', budget: 600, actual: 380 },
              { day: 'Sun', budget: 450, actual: 140 },
            ].map((col) => {
              const maxVal = 600;
              const budgetH = Math.round((col.budget / maxVal) * 160);
              const actualH = Math.round((col.actual / maxVal) * 160);

              return (
                <div key={col.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px', height: '170px' }}>
                    {/* Budget limit rail */}
                    <div 
                      style={{ 
                        width: '12px', 
                        height: `${budgetH}px`, 
                        background: '#1e283d', 
                        borderRadius: '4px 4px 0 0',
                        position: 'relative'
                      }}
                      title={`Budget: ₹${col.budget}`}
                    />
                    {/* Actual Spend */}
                    <div 
                      style={{ 
                        width: '12px', 
                        height: `${actualH}px`, 
                        background: 'linear-gradient(180deg, #facc15 0%, #ca8a04 100%)', 
                        borderRadius: '4px 4px 0 0',
                        boxShadow: '0 0 10px rgba(250, 204, 21, 0.25)'
                      }}
                      title={`Actual: ₹${col.actual}`}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>{col.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Financial Copilot */}
        <div className="saas-panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="panel-header" style={{ marginBottom: '14px' }}>
              <div className="panel-title-area">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#facc15" />
                  <span>AI Financial Copilot</span>
                </h3>
                <p>Automated intelligence & liquidity alerts</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  🎉 Weekly Spending Efficiency +15%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Your daily run-rate is tracking 15% lower than last week. Projected month-end surplus: <strong>₹850</strong>.
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                  💡 Liquidity Recommendation
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Auto-allocate <strong>₹500</strong> to your <em>Emergency Fund</em> goal before weekend expenses begin.
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Risk score: <strong>Low (92/100)</strong></span>
            <button 
              onClick={() => onNavigate('analytics')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-yellow)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Analytics <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Spending Envelopes Grid */}
      <div className="saas-panel-card">
        <div className="panel-header">
          <div className="panel-title-area">
            <h3>Active Category Envelopes ({wallets.length})</h3>
            <p>Monitored budget pools and real-time envelope balances</p>
          </div>
          <button 
            className="btn-secondary-action"
            onClick={() => onNavigate('wallets')}
          >
            <span>Manage All Envelopes</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="saas-cards-grid">
          {wallets.map((w) => {
            const balance = parseFloat(w.balance);
            const limit = parseFloat(w.budget_limit || 1000);
            const pct = Math.min(100, Math.round((balance / limit) * 100));

            return (
              <div key={w.id} className="envelope-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{w.name}</h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>{w.cycle_days_left || 30} days remaining</span>
                  </div>
                  <span className={`category-tag ${pct > 25 ? 'trend-up' : 'trend-down'}`}>
                    {pct > 25 ? 'Healthy' : 'Low Headroom'}
                  </span>
                </div>

                <div className="progress-bar-rail">
                  <div 
                    className="progress-bar-thumb" 
                    style={{ width: `${pct}%`, background: w.color || '#3b82f6' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: 800, color: '#fff' }}>₹{balance.toLocaleString('en-IN')} <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>of ₹{limit.toLocaleString('en-IN')}</span></span>
                  <span style={{ color: 'var(--text-dim)' }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions SaaS Ledger Table */}
      <div className="saas-panel-card">
        <div className="panel-header">
          <div className="panel-title-area">
            <h3>Recent Financial Transactions</h3>
            <p>Live ledger feed synced across wallets and Supabase database</p>
          </div>
          <button 
            className="btn-secondary-action"
            onClick={() => onNavigate('transactions')}
          >
            <span>View Full Ledger</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="saas-table-container">
          <table className="saas-data-table">
            <thead>
              <tr>
                <th>Description / Payee</th>
                <th>Category</th>
                <th>Envelope / Wallet</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTxs.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-title-cell">
                        <div className="tx-icon-sq" style={{ background: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.06)', color: isIncome ? '#10b981' : '#facc15' }}>
                          {tx.category === 'Food & Dining' ? <ShoppingBag size={16} /> :
                           tx.category === 'Transportation' ? <Car size={16} /> :
                           tx.category === 'Entertainment' ? <Gamepad2 size={16} /> :
                           <BookOpen size={16} />}
                        </div>
                        <div className="tx-meta-info">
                          <div className="name">{tx.title}</div>
                          <div className="sub">{tx.merchant || tx.recipient || 'Standard Transaction'}</div>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
