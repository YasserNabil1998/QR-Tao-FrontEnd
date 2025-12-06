
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'

interface CashierSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function CashierSidebar({ activeTab, setActiveTab }: CashierSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const menuItems = [
    { id: 'orders', label: 'إدارة الطلبات', icon: 'ri-shopping-cart-line' },
    { id: 'payments', label: 'إدارة المدفوعات', icon: 'ri-bank-card-line' },
    { id: 'reports', label: 'التقارير اليومية', icon: 'ri-file-chart-line' }
  ];

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-sidebar">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-500 border-b border-blue-600">
        <h1 className="text-xl font-bold text-white">لوحة الكاشير</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-900 border-r-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center ml-3">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className="flex-1 text-right">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center ml-3">
            <i className="ri-logout-box-line text-lg"></i>
          </div>
          <span className="flex-1 text-right">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}
