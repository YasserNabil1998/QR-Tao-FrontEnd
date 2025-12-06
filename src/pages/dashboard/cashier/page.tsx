
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import CashierSidebar from './components/CashierSidebar';
import OrdersList from './components/OrdersList';
import PaymentManagement from './components/PaymentManagement';
import DailyReport from './components/DailyReport';

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState('orders')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        color: '#4F46E5'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <CashierSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="dashboard-wrapper">
            {activeTab === 'orders' && <OrdersList />}
            {activeTab === 'payments' && <PaymentManagement />}
            {activeTab === 'reports' && <DailyReport />}
          </div>
        </div>
      </div>
    </div>
  )
}
