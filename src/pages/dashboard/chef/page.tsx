
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import ChefSidebar from './components/ChefSidebar';
import KitchenOrders from './components/KitchenOrders';
import OrderQueue from './components/OrderQueue';
import MenuItems from './components/MenuItems';

export default function ChefDashboard() {
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
      <ChefSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="dashboard-wrapper">
            {activeTab === 'orders' && <KitchenOrders />}
            {activeTab === 'queue' && <OrderQueue />}
            {activeTab === 'menu' && <MenuItems />}
          </div>
        </div>
      </div>
    </div>
  )
}
