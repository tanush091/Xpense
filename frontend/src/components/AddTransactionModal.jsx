import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function AddTransactionModal({
  isOpen,
  onClose,
  wallets = [],
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // expense, income
  const [category, setCategory] = useState('Food & Dining');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const selectedWallet = wallets.find(w => w.id === walletId) || wallets[0];

    onSubmit({
      title,
      amount: num,
      type,
      category,
      wallet_id: selectedWallet ? selectedWallet.id : null,
      wallet_name: selectedWallet ? selectedWallet.name : 'Main Account',
      payment_method: paymentMethod,
      date: 'Just now'
    });

    onClose();
    setTitle('');
    setAmount('');
  };

  return (
    <div className="modal-backdrop-saas" onClick={onClose}>
      <div className="modal-window-saas" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Record Financial Transaction</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="table-filter-pills" style={{ marginBottom: '16px', width: '100%', display: 'flex' }}>
            <button
              type="button"
              className={`filter-pill ${type === 'expense' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => setType('expense')}
            >
              Expense (-)
            </button>
            <button
              type="button"
              className={`filter-pill ${type === 'income' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => setType('income')}
            >
              Income (+)
            </button>
          </div>

          <div className="form-group-saas">
            <label className="form-label-saas">Description / Payee</label>
            <input 
              type="text" 
              className="form-input-saas" 
              placeholder="e.g. AWS Cloud Hosting, Grocery Mart, Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group-saas">
            <label className="form-label-saas">Amount (₹)</label>
            <input 
              type="number" 
              className="form-input-saas" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="any"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group-saas">
              <label className="form-label-saas">Category</label>
              <select 
                className="form-input-saas"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping & Tech</option>
                <option value="Salary">Salary / Allowance</option>
                <option value="General">General Operations</option>
              </select>
            </div>

            <div className="form-group-saas">
              <label className="form-label-saas">Target Envelope</label>
              <select 
                className="form-input-saas"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
              >
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (₹{w.balance})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-saas">
            <label className="form-label-saas">Payment Instrument</label>
            <select 
              className="form-input-saas"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI Instant</option>
              <option value="Card">Corporate Debit Card</option>
              <option value="Bank Transfer">NEFT / Bank Transfer</option>
              <option value="Cash">Cash / Petty</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary-action" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
              Confirm Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
