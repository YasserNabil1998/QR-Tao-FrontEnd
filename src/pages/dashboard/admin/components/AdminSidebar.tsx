
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

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
      <div className="flex items-center justify-center h-16 px-4 bg-orange-500 border-b border-orange-600">
        <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-orange-100 text-orange-900 border-r-4 border-orange-500'
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
