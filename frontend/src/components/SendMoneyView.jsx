import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RECIPIENTS } from '../data/demo';

export default function SendMoneyView({
  wallets = [],
  onBack,
  onSendTransfer
}) {
  const [selectedRecipient, setSelectedRecipient] = useState(RECIPIENTS[0]);
  const [amount, setAmount] = useState('250');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [isSending, setIsSending] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const activeWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedRecipient || numAmount <= 0) return;

    if (activeWallet && activeWallet.balance < numAmount) {
      alert(`Insufficient balance in ${activeWallet.name}. Available: ₹${activeWallet.balance}`);
      return;
    }

    setIsSending(true);
    try {
      await onSendTransfer({
        title: `Transfer to ${selectedRecipient.name}`,
        recipient: selectedRecipient.name,
        amount: numAmount,
        type: 'expense',
        category: 'Transfer',
        wallet_id: activeWallet ? activeWallet.id : null,
        wallet_name: activeWallet ? activeWallet.name : 'Main Account',
        payment_method: 'UPI Transfer'
      });

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      alert(`Transferred ₹${numAmount} successfully to ${selectedRecipient.name}!`);
      onBack();
    } catch (err) {
      alert(err.message || 'Transfer failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
          id="btn-send-money-back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>Send Money</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Instant peer transfer</p>
        </div>
      </div>

      {/* Select Recipient */}
      <div>
        <label style={{ display: 'block', fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
          Select Recipient
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {RECIPIENTS.map((rec) => {
            const isSelected = selectedRecipient.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecipient(rec)}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '20px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  border: isSelected ? '2.5px solid #3b82f6' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.25)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: rec.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800
                  }}
                >
                  {rec.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{rec.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{rec.email}</div>
                </div>
                {isSelected && <CheckCircle2 size={20} color="#3b82f6" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enter Amount */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Transfer Amount
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
            id="input-send-amount"
          />
        </div>
      </div>

      {/* Debit From Wallet */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Debit from Wallet
        </label>
        <select 
          className="form-input"
          value={selectedWalletId}
          onChange={(e) => setSelectedWalletId(e.target.value)}
        >
          {wallets.map(w => (
            <option key={w.id} value={w.id}>
              {w.name} (Available: ₹{w.balance})
            </option>
          ))}
        </select>
      </div>

      {/* Send Button */}
      <button 
        className="pay-confirm-btn"
        onClick={handleSend}
        disabled={isSending}
        id="btn-confirm-send-transfer"
      >
        {isSending ? 'Sending...' : `Send ₹${numAmount} to ${selectedRecipient.name}`}
      </button>
    </div>
  );
}
