
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { useDirection } from '../../../../context/DirectionContext'

interface CashierSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function CashierSidebar({ activeTab, setActiveTab }: CashierSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { direction, toggleDirection } = useDirection()

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
      <div className={`flex items-center h-16 px-4 bg-blue-500 border-b border-blue-600 ${direction === 'rtl' ? 'justify-between' : 'flex-row-reverse justify-between'}`}>
        <h1 className="text-xl font-bold text-white">لوحة الكاشير</h1>
        <button
          onClick={toggleDirection}
          className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 text-white hover:text-blue-200 transition-colors rounded-lg hover:bg-white/10 border border-white/20 font-medium"
          title={
            direction === "rtl"
              ? "Switch to English"
              : "التبديل إلى العربية"
          }
        >
          <i className="ri-global-line text-lg"></i>
          <span className="font-semibold text-sm">
            {direction === "rtl" ? "ع" : "en"}
          </span>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? `bg-blue-100 text-blue-900 ${direction === 'rtl' ? 'border-r-4 border-r-blue-500' : 'border-l-4 border-l-blue-500'}`
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className={`flex-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
        >
          <div className={`w-5 h-5 flex items-center justify-center ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
            <i className="ri-logout-box-line text-lg"></i>
          </div>
          <span className={`flex-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}
