import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { walletService } from './services/walletService';
import { transactionService } from './services/transactionService';
import { savingsGoalService } from './services/savingsGoalService';
import { analyticsService } from './services/analyticsService';

import SaaSSidebar from './components/SaaSSidebar';
import SaaSTopbar from './components/SaaSTopbar';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import WalletsView from './components/WalletsView';
import GoalsView from './components/GoalsView';
import AnalyticsView from './components/AnalyticsView';
import PaymentsView from './components/PaymentsView';
import SettingsView from './components/SettingsView';
import AddTransactionModal from './components/AddTransactionModal';

// Mobile preview components fallback
import HomeScreen from './components/HomeScreen';
import WalletsScreen from './components/WalletsScreen';
import GoalsScreen from './components/GoalsScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import ProfileScreen from './components/ProfileScreen';
import ScanPayView from './components/ScanPayView';
import ReceiveMoneyView from './components/ReceiveMoneyView';
import SendMoneyView from './components/SendMoneyView';
import Navbar from './components/Navbar';

import { CheckCircle2, Monitor, Smartphone } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, updateProfile, signOut, signIn, signUp, isSupabaseConfigured } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSubView, setMobileSubView] = useState('main'); // For mobile mode: 'main', 'scan-pay', 'receive-money', 'send-money'
  
  // Data states
  const [wallets, setWallets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Topbar search & filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);

  // View Mode: False = Full SaaS Platform Layout (Default), True = Compact Mobile Phone Preview
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Auth form states
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all initial data
  const loadData = useCallback(async () => {
    try {
      const [fetchedWallets, fetchedGoals, fetchedTxs] = await Promise.all([
        walletService.getWallets(user?.id),
        savingsGoalService.getGoals(user?.id),
        transactionService.getTransactions({ userId: user?.id })
      ]);

      setWallets(fetchedWallets || []);
      setGoals(fetchedGoals || []);
      setTransactions(fetchedTxs || []);

      const calculatedAnalytics = analyticsService.calculateAnalytics(
        fetchedTxs || [],
        fetchedWallets || []
      );
      setAnalytics(calculatedAnalytics);
    } catch (err) {
      console.error('Failed to load application data', err);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Wallet operations
  const handleAddWallet = async (walletData) => {
    try {
      const newWallet = await walletService.createWallet({
        ...walletData,
        user_id: user?.id
      });
      setWallets(prev => [newWallet, ...prev]);
      showToast(`Spending envelope "${newWallet.name}" created!`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTopUpWallet = async (id, amount) => {
    try {
      const updated = await walletService.topUpWallet(id, amount);
      setWallets(prev => prev.map(w => (w.id === id ? updated : w)));
      showToast(`Topped up ₹${amount} successfully!`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteWallet = async (id) => {
    try {
      await walletService.deleteWallet(id);
      setWallets(prev => prev.filter(w => w.id !== id));
      showToast('Envelope removed');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Goal operations
  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await savingsGoalService.createGoal({
        ...goalData,
        user_id: user?.id
      });
      setGoals(prev => [newGoal, ...prev]);
      showToast(`Savings milestone "${newGoal.title}" created!`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleContributeGoal = async (id, amount) => {
    try {
      const updated = await savingsGoalService.contributeToGoal(id, amount);
      setGoals(prev => prev.map(g => (g.id === id ? updated : g)));
      showToast(`Deposited ₹${amount} to milestone!`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await savingsGoalService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      showToast('Goal deleted');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Transaction operations
  const handleRecordTransaction = async (txData) => {
    try {
      const createdTx = await transactionService.createTransaction({
        ...txData,
        user_id: user?.id
      });
      setTransactions(prev => [createdTx, ...prev]);
      showToast(`Recorded ${txData.type === 'expense' ? 'payment' : 'receipt'} of ₹${txData.amount}!`);
      await loadData();
      return createdTx;
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction removed');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword);
        showToast('Authenticated successfully!');
      } else {
        await signUp(authEmail, authPassword, authName);
        showToast('Account registered successfully!');
      }
    } catch (err) {
      alert(err.message || 'Authentication error');
    }
  };

  // Filtered transactions for global search
  const filteredTxs = transactions.filter(t => {
    if (!globalSearch.trim()) return true;
    return (
      t.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.category?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.recipient?.toLowerCase().includes(globalSearch.toLowerCase())
    );
  });

  return (
    <div className="saas-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="saas-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        wallets={wallets}
        onSubmit={handleRecordTransaction}
      />

      {/* RENDER MODE 1: FULL SAAS PLATFORM LAYOUT (DEFAULT) */}
      {!isMobilePreview ? (
        <>
          {/* SaaS Sidebar */}
          <SaaSSidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            walletsCount={wallets.length}
            transactionsCount={transactions.length}
            goalsCount={goals.length}
            isSupabaseConfigured={isSupabaseConfigured}
            onLogout={signOut}
          />

          {/* Main SaaS Viewport */}
          <div className="saas-main-viewport">
            {/* Topbar */}
            <SaaSTopbar 
              searchQuery={globalSearch}
              onSearchChange={setGlobalSearch}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
              isMobileView={isMobilePreview}
              onToggleMobileView={() => setIsMobilePreview(true)}
            />

            {/* Dynamic View Content */}
            <main className="saas-content-area">
              {activeTab === 'dashboard' && (
                <DashboardView 
                  user={user}
                  wallets={wallets}
                  goals={goals}
                  transactions={filteredTxs}
                  analytics={analytics}
                  onNavigate={setActiveTab}
                  onOpenAddModal={() => setIsAddTxModalOpen(true)}
                />
              )}

              {activeTab === 'wallets' && (
                <WalletsView 
                  wallets={wallets}
                  onAddWallet={handleAddWallet}
                  onTopUpWallet={handleTopUpWallet}
                  onDeleteWallet={handleDeleteWallet}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsView 
                  transactions={filteredTxs}
                  onDeleteTransaction={handleDeleteTransaction}
                  onOpenAddModal={() => setIsAddTxModalOpen(true)}
                />
              )}

              {activeTab === 'goals' && (
                <GoalsView 
                  goals={goals}
                  onCreateGoal={handleCreateGoal}
                  onContributeGoal={handleContributeGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView 
                  analytics={analytics}
                  transactions={transactions}
                  wallets={wallets}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentsView 
                  user={user}
                  wallets={wallets}
                  onProcessPayment={handleRecordTransaction}
                  onReceiveFunds={handleRecordTransaction}
                  onSendTransfer={handleRecordTransaction}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  user={user}
                  onUpdateProfile={updateProfile}
                />
              )}
            </main>
          </div>
        </>
      ) : (
        /* RENDER MODE 2: COMPACT MOBILE APP PREVIEW */
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
          {/* Switcher floating button */}
          <div style={{ marginBottom: '14px' }}>
            <button 
              className="btn-primary-action"
              onClick={() => setIsMobilePreview(false)}
            >
              <Monitor size={16} />
              <span>Back to Full SaaS Platform Layout</span>
            </button>
          </div>

          <div className="app-viewport-wrapper">
            <main className="app-screen-content">
              {mobileSubView === 'scan-pay' && (
                <ScanPayView 
                  wallets={wallets}
                  onBack={() => setMobileSubView('main')}
                  onProcessPayment={handleRecordTransaction}
                />
              )}

              {mobileSubView === 'receive-money' && (
                <ReceiveMoneyView 
                  user={user}
                  onBack={() => setMobileSubView('main')}
                  onReceiveFunds={handleRecordTransaction}
                />
              )}

              {mobileSubView === 'send-money' && (
                <SendMoneyView 
                  wallets={wallets}
                  onBack={() => setMobileSubView('main')}
                  onSendTransfer={handleRecordTransaction}
                />
              )}

              {mobileSubView === 'main' && (
                <>
                  {activeTab === 'dashboard' && (
                    <HomeScreen 
                      user={user}
                      wallets={wallets}
                      goals={goals}
                      transactions={transactions}
                      analytics={analytics}
                      onNavigate={(target) => {
                        if (['scan-pay', 'receive-money', 'send-money'].includes(target)) {
                          setMobileSubView(target);
                        } else {
                          setActiveTab(target);
                        }
                      }}
                    />
                  )}

                  {activeTab === 'wallets' && (
                    <WalletsScreen 
                      wallets={wallets}
                      onAddWallet={handleAddWallet}
                      onTopUpWallet={handleTopUpWallet}
                      onDeleteWallet={handleDeleteWallet}
                    />
                  )}

                  {activeTab === 'goals' && (
                    <GoalsScreen 
                      goals={goals}
                      onCreateGoal={handleCreateGoal}
                      onContributeGoal={handleContributeGoal}
                      onDeleteGoal={handleDeleteGoal}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <AnalyticsScreen 
                      analytics={analytics}
                      transactions={transactions}
                      wallets={wallets}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <ProfileScreen 
                      user={user}
                      walletsCount={wallets.length}
                      goalsCount={goals.length}
                      transactionsCount={transactions.length}
                      onUpdateProfile={updateProfile}
                      onLogout={signOut}
                    />
                  )}
                </>
              )}
            </main>

            {mobileSubView === 'main' && (
              <Navbar 
                activeTab={activeTab === 'dashboard' ? 'home' : activeTab === 'settings' ? 'profile' : activeTab}
                onTabChange={(tab) => {
                  setMobileSubView('main');
                  setActiveTab(tab === 'home' ? 'dashboard' : tab === 'profile' ? 'settings' : tab);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Auth Modal if logged out */}
      {!authLoading && !user && (
        <div className="modal-backdrop-saas">
          <div className="modal-window-saas">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="brand-icon-sq" style={{ margin: '0 auto 12px auto' }}>X</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                Xpense SaaS Platform
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Sign in to your organization treasury or personal workspace
              </p>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="form-group-saas">
                  <label className="form-label-saas">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input-saas" 
                    placeholder="Aditya Venkata Sai Burle"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required 
                  />
                </div>
              )}

              <div className="form-group-saas">
                <label className="form-label-saas">Email Address</label>
                <input 
                  type="email" 
                  className="form-input-saas" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="128003008@sastra.ac.in"
                  required 
                />
              </div>

              <div className="form-group-saas">
                <label className="form-label-saas">Password</label>
                <input 
                  type="password" 
                  className="form-input-saas" 
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary-action" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
                {authMode === 'login' ? 'Sign In to Workspace' : 'Create SaaS Account'}
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => signIn('128003008@sastra.ac.in', 'demo123')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-yellow)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Quick Demo Login (Aditya Burle)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
