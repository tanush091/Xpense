import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Share2, Check, Download, Zap } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function ReceiveMoneyView({
  user,
  onBack,
  onReceiveFunds
}) {
  const [amount, setAmount] = useState('10');
  const [copied, setCopied] = useState(false);
  const qrCanvasRef = useRef(null);

  const upiId = user?.email || '128003008@sastra.ac.in';
  const payeeName = user?.full_name || 'Aditya Venkata Sai Burle';

  const numAmount = parseFloat(amount) || 0;
  const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${numAmount > 0 ? numAmount : ''}&cu=INR`;

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        upiPayload,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [upiPayload]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    const receiveAmt = numAmount > 0 ? numAmount : 500;
    onReceiveFunds({
      title: 'Received via UPI QR',
      amount: receiveAmt,
      type: 'income',
      category: 'Income',
      payment_method: 'UPI QR',
      recipient: payeeName
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    alert(`Successfully received ₹${receiveAmt} into Total Balance!`);
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
          id="btn-receive-money-back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>Receive Money</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>QR & UPI request</p>
        </div>
      </div>

      {/* Enter Amount (Optional) */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Enter Amount (Optional)
        </label>
        <div 
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '2px solid #3b82f6',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
          }}
        >
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#64748b' }}>₹</span>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              width: '100%',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            id="input-receive-amount"
          />
        </div>
      </div>

      {/* QR Code Container Card */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px 20px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Scan to Pay Me</h3>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
          {numAmount > 0 ? `Requesting ₹${numAmount}` : 'Requesting payment'}
        </p>

        {/* QR Code Canvas */}
        <div 
          style={{
            margin: '20px auto',
            padding: '14px',
            background: '#f8fafc',
            borderRadius: '20px',
            display: 'inline-block',
            border: '1px solid #e2e8f0'
          }}
        >
          <canvas ref={qrCanvasRef} style={{ display: 'block', borderRadius: '12px' }} />
        </div>

        <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
          UPI ID: <span style={{ color: '#0f172a', fontWeight: 700 }}>{upiId}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleCopyLink}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
          <span>{copied ? 'Copied Link!' : 'Copy UPI Link'}</span>
        </button>

        <button 
          onClick={handleSimulatePayment}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            background: '#10b981',
            border: 'none',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}
          title="Simulate receiving this payment"
        >
          <Zap size={18} />
          <span>Simulate Pay</span>
        </button>
      </div>
    </div>
  );
}
