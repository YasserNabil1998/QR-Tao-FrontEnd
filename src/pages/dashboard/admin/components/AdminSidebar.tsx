
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { useDirection } from '../../../../context/DirectionContext'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { direction, toggleDirection } = useDirection()

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: 'ri-dashboard-line' },
    { id: 'orders', label: 'إدارة الطلبات', icon: 'ri-shopping-cart-line' },
    { id: 'menu', label: 'إدارة القائمة', icon: 'ri-restaurant-line' },
    { id: 'tables', label: 'إدارة الطاولات', icon: 'ri-table-line' },
    { id: 'staff', label: 'إدارة الموظفين', icon: 'ri-team-line' },
    { id: 'inventory', label: 'إدارة المخزون', icon: 'ri-archive-line' },
    { id: 'suppliers', label: 'إدارة الموردين', icon: 'ri-truck-line' },
    { id: 'purchases', label: 'إدارة المشتريات', icon: 'ri-shopping-bag-line' },
    { id: 'purchase-products', label: 'منتجات المشتريات', icon: 'ri-price-tag-3-line' },
    { id: 'invoices', label: 'إدارة الفواتير', icon: 'ri-file-text-line' },
    { id: 'payments', label: 'طرق الدفع', icon: 'ri-bank-card-line' },
    { id: 'analytics', label: 'التحليلات المتقدمة', icon: 'ri-bar-chart-line' },
    { id: 'ledger', label: 'دفتر الأستاذ العام', icon: 'ri-book-line' },
    { id: 'qr-generator', label: 'مولد رمز QR', icon: 'ri-qr-code-line' },
    { id: 'settings', label: 'إعدادات المطعم', icon: 'ri-settings-line' }
  ];

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-sidebar">
      <div className={`flex items-center h-16 px-4 bg-orange-500 border-b border-orange-600 ${direction === 'rtl' ? 'justify-between' : 'flex-row-reverse justify-between'}`}>
        <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
        <button
          onClick={toggleDirection}
          className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 text-white hover:text-orange-200 transition-colors rounded-lg hover:bg-white/10 border border-white/20 font-medium"
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
                  ? `bg-orange-100 text-orange-900 ${direction === 'rtl' ? 'border-r-4 border-r-orange-500' : 'border-l-4 border-l-orange-500'}`
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
