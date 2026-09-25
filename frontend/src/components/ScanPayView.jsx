import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  QrCode, 
  ArrowRight, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  Store,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MERCHANTS } from '../data/demo';

const WALLET_ICONS = {
  'Food & Dining': ShoppingBag,
  'Transportation': Car,
  'Entertainment': Gamepad2
};

export default function ScanPayView({
  wallets = [],
  onBack,
  onProcessPayment
}) {
  const [selectedMerchant, setSelectedMerchant] = useState(MERCHANTS[0]);
  const [amount, setAmount] = useState('100');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];
  const numAmount = parseFloat(amount) || 0;
  const currentWalletBalance = activeWallet ? parseFloat(activeWallet.balance) : 0;
  const afterWalletBalance = Math.max(0, currentWalletBalance - numAmount);

  const handleWalletSelect = (wallet) => {
    setSelectedWalletId(wallet.id);
    if (numAmount > 0) {
      setShowConfirmSheet(true);
    }
  };

  const handleExecutePayment = async () => {
    if (!activeWallet || numAmount <= 0) return;
    if (currentWalletBalance < numAmount) {
      alert(`Insufficient funds in ${activeWallet.name}. Current: ₹${currentWalletBalance}`);
      return;
    }

    setIsProcessing(true);
    try {
      await onProcessPayment({
        title: selectedMerchant.name,
        merchant: selectedMerchant.name,
        amount: numAmount,
        type: 'expense',
        category: activeWallet.category,
        wallet_id: activeWallet.id,
        wallet_name: activeWallet.name,
        payment_method: 'UPI QR'
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setShowConfirmSheet(false);
      onBack();
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="scan-pay-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
        <button 
          onClick={onBack}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          id="btn-scan-pay-back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>Scan & Pay</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Quick payments made easy</p>
        </div>
      </div>

      {/* Merchant Info Card */}
      <div className="merchant-info-card">
        <div className="merchant-qr-thumb">
          <QrCode size={52} color="#facc15" />
          <div className="verified-dot-badge">
            <Check size={14} strokeWidth={3} />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#fff' }}>{selectedMerchant.name}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {selectedMerchant.location} • Verified Merchant
          </p>
        </div>

        <div className="merchant-status-badge">
          <span className="dot-yellow"></span>
          <span>Ready to pay</span>
        </div>

        {/* Change merchant select dropdown */}
        <div style={{ marginTop: '4px' }}>
          <select 
            value={selectedMerchant.id}
            onChange={(e) => {
              const m = MERCHANTS.find(x => x.id === e.target.value);
              if (m) setSelectedMerchant(m);
            }}
            style={{
              background: '#1a1f2c',
              border: '1px solid #333d52',
              color: '#94a3b8',
              padding: '6px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {MERCHANTS.map(m => (
              <option key={m.id} value={m.id}>Merchant: {m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Enter Amount */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
          Enter Amount
        </label>
        <div className="amount-input-box">
          <span className="amount-symbol">₹</span>
          <input 
            type="number"
            className="amount-input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            id="input-scan-pay-amount"
          />
        </div>
      </div>

      {/* Pay From Wallet Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
          Pay from
        </label>
        <div className="horizontal-wallet-select">
          {wallets.map((w) => {
            const Icon = WALLET_ICONS[w.category] || ShoppingBag;
            const isSelected = activeWallet?.id === w.id;

            return (
              <div 
                key={w.id}
                onClick={() => handleWalletSelect(w)}
                className={`wallet-pill-select ${isSelected ? 'active' : ''}`}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  background: '#f1f5f9', 
                  color: w.color || '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{w.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>₹{w.balance}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue / Trigger Confirmation */}
      <button 
        className="pay-confirm-btn"
        onClick={() => {
          if (numAmount <= 0) {
            alert('Please enter an amount to pay');
            return;
          }
          setShowConfirmSheet(true);
        }}
        id="btn-trigger-confirm-payment"
      >
        Proceed to Pay ₹{numAmount || 0}
      </button>

      {/* Confirm Payment Bottom Sheet */}
      {showConfirmSheet && (
        <div className="bottom-sheet-backdrop" onClick={() => setShowConfirmSheet(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header-row">
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Confirm Payment</h3>
              <span className="sheet-pill-badge">{activeWallet?.category || 'General'}</span>
            </div>

            <div className="balance-transition-card">
              <div className="balance-stage">
                <div className="tag">Current</div>
                <div className="amt">₹{currentWalletBalance}</div>
              </div>

              <div className="arrow-circle-mid">
                <ArrowRight size={18} />
              </div>

              <div className="balance-stage">
                <div className="tag">After</div>
                <div className="amt yellow">₹{afterWalletBalance}</div>
              </div>
            </div>

            <button 
              className="pay-confirm-btn"
              onClick={handleExecutePayment}
              disabled={isProcessing}
              id="btn-confirm-final-pay"
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${numAmount}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
