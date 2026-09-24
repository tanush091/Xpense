import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Shield, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ExternalLink 
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SettingsView({
  user,
  onUpdateProfile
}) {
  const [fullName, setFullName] = useState(user?.full_name || 'Aditya Venkata Sai Burle');
  const [email, setEmail] = useState(user?.email || '128003008@sastra.ac.in');
  const [accountType, setAccountType] = useState(user?.account_type || 'Student Account');
  const [currency, setCurrency] = useState('INR (₹)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile({ full_name: fullName, email, account_type: accountType });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
          Settings & Infrastructure
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Workspace profile, database configuration, security policies and audit records
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="saas-panel-card">
        <div className="panel-header" style={{ marginBottom: '14px' }}>
          <div className="panel-title-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="#10b981" />
              <span>Supabase Cloud PostgreSQL Status</span>
            </h3>
            <p>Database synchronization and Row Level Security state</p>
          </div>
          <span className={`category-tag ${isSupabaseConfigured ? 'trend-up' : 'trend-neutral'}`}>
            {isSupabaseConfigured ? 'Connected & Synced' : 'Local Preview DB (Active)'}
          </span>
        </div>

        <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {isSupabaseConfigured ? (
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {isSupabaseConfigured 
                  ? 'Live PostgreSQL Database Connected' 
                  : 'Operating in High-Performance Local Storage Mode'}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                {isSupabaseConfigured 
                  ? 'All writes, envelopes, and transactions are synchronized with your Supabase cloud backend with strict Row Level Security (RLS).' 
                  : 'To link your live Supabase instance, supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside .env and run supabase/schema.sql in the Supabase SQL Editor.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="saas-panel-card">
        <div className="panel-header">
          <div className="panel-title-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#3b82f6" />
              <span>Workspace Profile & Identity</span>
            </h3>
            <p>Primary user attributes and role classification</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group-saas">
              <label className="form-label-saas">Full Name</label>
              <input 
                type="text" 
                className="form-input-saas" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group-saas">
              <label className="form-label-saas">Email / Student ID</label>
              <input 
                type="email" 
                className="form-input-saas" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group-saas">
              <label className="form-label-saas">Account Role & Tier</label>
              <select 
                className="form-input-saas"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="Student Account">Student Account (Full Access)</option>
                <option value="Corporate SaaS">Corporate SaaS (Enterprise)</option>
                <option value="Personal Ledger">Personal Ledger</option>
              </select>
            </div>

            <div className="form-group-saas">
              <label className="form-label-saas">Base Currency</label>
              <select 
                className="form-input-saas"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                <option value="USD ($)">USD ($ - US Dollar)</option>
                <option value="EUR (€)">EUR (€ - Euro)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            {savedSuccess && (
              <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Changes saved successfully!
              </span>
            )}
            <button 
              type="submit" 
              className="btn-primary-action"
              style={{ marginLeft: 'auto' }}
            >
              <Save size={15} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
