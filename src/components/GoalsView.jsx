import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  X, 
  Sparkles, 
  Lightbulb 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOAL_IDEAS } from '../data/demo';

export default function GoalsView({
  goals = [],
  onCreateGoal,
  onContributeGoal,
  onDeleteGoal
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [depositTarget, setDepositTarget] = useState(null);
  const [depositAmount, setDepositAmount] = useState('500');

  // Form states
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('10000');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const totalTarget = goals.reduce((s, g) => s + parseFloat(g.target_amount || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + parseFloat(g.current_amount || 0), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateGoal({
      title,
      target_amount: parseFloat(targetAmount) || 5000,
      current_amount: 0,
      target_date: targetDate,
      category: 'Savings',
      status: 'in_progress'
    });

    setShowCreateModal(false);
    setTitle('');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositTarget || !depositAmount) return;

    onContributeGoal(depositTarget.id, parseFloat(depositAmount));
    
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    setDepositTarget(null);
    setDepositAmount('500');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Savings Milestones & Goals
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Structured capital reserve targets with automated contribution tracking
          </p>
        </div>
        <button 
          className="btn-primary-action"
          onClick={() => setShowCreateModal(true)}
          id="btn-create-goal-saas"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New Goal</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="saas-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Total Target Capital</span>
          <div className="kpi-amount">₹{totalTarget.toLocaleString('en-IN')}</div>
          <span className="kpi-subtext">Across {goals.length} active milestones</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Total Funds Reserved</span>
          <div className="kpi-amount" style={{ color: '#a855f7' }}>₹{totalSaved.toLocaleString('en-IN')}</div>
          <span className="kpi-subtext">{overallPct}% of aggregate milestone target</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Remaining Deficit</span>
          <div className="kpi-amount" style={{ color: '#facc15' }}>₹{Math.max(0, totalTarget - totalSaved).toLocaleString('en-IN')}</div>
          <span className="kpi-subtext">To fully fund all plans</span>
        </div>
      </div>

      {/* 2-Column Section: Active Goals + Recommended Ideas */}
      <div className="saas-grid-2col">
        {/* Left: Goals Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.map(goal => {
            const current = parseFloat(goal.current_amount || 0);
            const target = parseFloat(goal.target_amount || 1);
            const pct = Math.min(100, Math.round((current / target) * 100));
            const isDone = pct >= 100;

            return (
              <div key={goal.id} className="saas-panel-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {goal.title}
                      {isDone && <CheckCircle2 size={16} color="#10b981" />}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Calendar size={13} /> Target Date: {goal.target_date || 'Ongoing'}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete goal "${goal.title}"?`)) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    title="Delete Goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#a855f7' }}>
                    ₹{current.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    of ₹{target.toLocaleString('en-IN')} ({pct}%)
                  </span>
                </div>

                <div className="progress-bar-rail" style={{ marginBottom: '16px' }}>
                  <div 
                    className="progress-bar-thumb" 
                    style={{ width: `${pct}%`, background: isDone ? '#10b981' : 'linear-gradient(90deg, #8b5cf6, #d946ef)' }}
                  />
                </div>

                <button 
                  className="btn-secondary-action" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setDepositTarget(goal)}
                >
                  <Plus size={15} />
                  <span>Contribute Funds</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Goal Ideas & Pro Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="saas-panel-card">
            <div className="panel-header" style={{ marginBottom: '12px' }}>
              <div className="panel-title-area">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={18} color="#facc15" />
                  <span>Pre-Configured Milestone Templates</span>
                </h3>
                <p>One-click adopt proven savings models</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {GOAL_IDEAS.map(idea => (
                <div 
                  key={idea.id}
                  onClick={() => {
                    setTitle(idea.title);
                    setTargetAmount(idea.amount.toString());
                    setShowCreateModal(true);
                  }}
                  style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-yellow)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <span style={{ fontSize: '20px' }}>{idea.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{idea.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target: ₹{idea.amount.toLocaleString('en-IN')}</div>
                  </div>
                  <Plus size={16} color="var(--accent-yellow)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-backdrop-saas" onClick={() => setShowCreateModal(false)}>
          <div className="modal-window-saas" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Create Milestone Goal</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group-saas">
                <label className="form-label-saas">Goal Title</label>
                <input 
                  type="text" 
                  className="form-input-saas" 
                  placeholder="e.g. MacBook Pro M3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Target Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-input-saas" 
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  min="500"
                  required
                />
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Target Deadline</label>
                <input 
                  type="date" 
                  className="form-input-saas" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary-action" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositTarget && (
        <div className="modal-backdrop-saas" onClick={() => setDepositTarget(null)}>
          <div className="modal-window-saas" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Deposit Reserve Capital</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{depositTarget.title}</p>
              </div>
              <button onClick={() => setDepositTarget(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit}>
              <div className="form-group-saas">
                <label className="form-label-saas">Contribution Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-input-saas" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="10"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary-action" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDepositTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
