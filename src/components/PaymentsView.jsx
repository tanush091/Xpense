import React, { useState } from 'react';
import ScanPayView from './ScanPayView';
import ReceiveMoneyView from './ReceiveMoneyView';
import SendMoneyView from './SendMoneyView';
import { QrCode, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function PaymentsView({
  user,
  wallets = [],
  onProcessPayment,
  onReceiveFunds,
  onSendTransfer
}) {
  const [activeSubTab, setActiveSubTab] = useState('scan_pay'); // scan_pay, receive, send

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
            Instant Payments & UPI Gateway
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Instant merchant checkout, dynamic QR generation, and peer-to-peer capital transfers
          </p>
        </div>
      </div>

      {/* Sub navigation pills */}
      <div className="table-filter-pills" style={{ alignSelf: 'flex-start' }}>
        <button
          className={`filter-pill ${activeSubTab === 'scan_pay' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('scan_pay')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <QrCode size={14} /> Scan & Merchant Pay
          </span>
        </button>
        <button
          className={`filter-pill ${activeSubTab === 'receive' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('receive')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowDownLeft size={14} /> Dynamic UPI QR (Receive)
          </span>
        </button>
        <button
          className={`filter-pill ${activeSubTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('send')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpRight size={14} /> Peer Transfer (Send)
          </span>
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="saas-panel-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        {activeSubTab === 'scan_pay' && (
          <ScanPayView 
            wallets={wallets}
            onBack={() => {}}
            onProcessPayment={onProcessPayment}
          />
        )}

        {activeSubTab === 'receive' && (
          <ReceiveMoneyView 
            user={user}
            onBack={() => {}}
            onReceiveFunds={onReceiveFunds}
          />
        )}

        {activeSubTab === 'send' && (
          <SendMoneyView 
            wallets={wallets}
            onBack={() => {}}
            onSendTransfer={onSendTransfer}
          />
        )}
      </div>
    </div>
  );
}
