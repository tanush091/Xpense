import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

export default function AnalyticsView({
  analytics,
  transactions = [],
  wallets = []
}) {
  const breakdown = analytics?.breakdown || [
    { category: 'Food & Dining', amount: 850, percentage: 50 },
    { category: 'Transportation', amount: 450, percentage: 26 },
    { category: 'Entertainment', amount: 350, percentage: 20 },
    { category: 'Shopping', amount: 80, percentage: 4 }
  ];

  const monthlyTrends = analytics?.monthlyTrends || {
    thisMonth: 1250,
    lastMonth: 1450,
    change: '-14%'
  };

  const dailyPatterns = analytics?.dailyPatterns || {
    peakDay: 'Friday',
    avgDailySpend: 85,
    bestDay: 'Tuesday'
  };

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      monthlyTrends,
      dailyPatterns,
      categoryBreakdown: breakdown,
      totalWallets: wallets.length,
      totalTransactions: transactions.length
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `xpense_financial_analytics_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Financial Intelligence & Analytics
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated spending distribution, trajectory forecasting, and envelope efficiency
          </p>
        </div>
        <button 
          className="btn-secondary-action"
          onClick={handleExportReport}
        >
          <Download size={15} />
          <span>Export Analytics JSON</span>
        </button>
      </div>

      {/* 2-Column Section */}
      <div className="saas-grid-2col">
        {/* Left: Category Spending Distribution */}
        <div className="saas-panel-card">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Category Expenditure Breakdown</h3>
              <p>Percentage share of capital debited per envelope category</p>
            </div>
            <PieChart size={18} color="#10b981" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '10px 0' }}>
            {breakdown.map((item, idx) => {
              const colors = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];
              const color = colors[idx % colors.length];

              return (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{item.category}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                      ₹{Number(item.amount).toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-rail" style={{ margin: 0 }}>
                    <div 
                      className="progress-bar-thumb" 
                      style={{ width: `${item.percentage}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Monthly Velocity & Run Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="saas-panel-card">
            <div className="panel-header" style={{ marginBottom: '16px' }}>
              <div className="panel-title-area">
                <h3>Monthly Trend Delta</h3>
                <p>Run-rate comparison against preceding calendar cycle</p>
              </div>
              <TrendingUp size={18} color="#facc15" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Month Outflow</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>₹{Number(monthlyTrends.thisMonth).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Previous Month Outflow</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>₹{Number(monthlyTrends.lastMonth).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Delta Variation</span>
                <span className="kpi-trend trend-down">
                  {monthlyTrends.change} (Under budget)
                </span>
              </div>
            </div>
          </div>

          <div className="saas-panel-card">
            <div className="panel-header" style={{ marginBottom: '14px' }}>
              <div className="panel-title-area">
                <h3>Behavioral Spend Days</h3>
                <p>Derived daily intensity metrics</p>
              </div>
              <Calendar size={18} color="#06b6d4" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Peak Spending Day</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{dailyPatterns.peakDay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Daily Run-rate Average</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-yellow)' }}>₹{dailyPatterns.avgDailySpend}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Optimum Savings Day</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{dailyPatterns.bestDay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Advisory Card */}
      <div className="saas-panel-card">
        <div className="panel-header" style={{ marginBottom: '16px' }}>
          <div className="panel-title-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#facc15" />
              <span>AI Advisory & Synthesis</span>
            </h3>
            <p>Heuristic algorithms trained on personal finance best practices</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
              ✓ Envelope Adherence: 94%
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Zero envelopes exceeded their monthly budget ceiling this billing cycle. Food & Dining is the highest volume category.
            </p>
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#facc15', marginBottom: '6px' }}>
              ⚡ Runway & Buffer Alert
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              At the current burn rate of ₹85/day, available liquid reserves will cover 28.8 days before requiring additional allowance inflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
