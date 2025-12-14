import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { useDirection } from '../../../../context/DirectionContext'

interface CashierSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export default function CashierSidebar({ activeTab, setActiveTab, isOpen = false, onClose }: CashierSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { direction, toggleDirection } = useDirection()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (onClose) {
      onClose()
    }
  }

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
    <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      <div
        className={`flex items-center h-14 sm:h-16 px-3 sm:px-4 bg-blue-500 border-b border-blue-600 ${
          direction === "rtl" ? "flex-row-reverse justify-between" : "flex-row-reverse"
        }`}
      >
        <h1 className="text-lg sm:text-xl font-bold text-white font-cairo hidden lg:block">
          لوحة الكاشير
        </h1>
        <div
          className={`flex items-center gap-2 ${
            direction === "rtl" ? "" : "ml-3"
          }`}
        >
          <button
            onClick={toggleDirection}
            className="flex items-center space-x-1 sm:space-x-2 space-x-reverse px-2 sm:px-3 py-1.5 text-white hover:text-blue-200 transition-colors rounded-lg hover:bg-white/10 border border-white/20 font-medium"
            title={
              direction === "rtl"
                ? "Switch to English"
                : "التبديل إلى العربية"
            }
          >
            <i className="ri-global-line text-base sm:text-lg"></i>
            <span className="font-semibold text-xs sm:text-sm">
              {direction === "rtl" ? "ع" : "en"}
            </span>
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-3 sm:py-4">
        <div className="space-y-1 px-2 sm:px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? `bg-blue-100 text-blue-900 ${
                      direction === 'rtl'
                        ? 'border-r-4 border-r-blue-500'
                        : 'border-l-4 border-l-blue-500'
                    }`
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0 ${
                  direction === 'rtl'
                    ? 'ml-2 sm:ml-3'
                    : 'mr-2 sm:mr-3'
                }`}
              >
                <i className={`${item.icon} text-base sm:text-lg`}></i>
              </div>
              <span
                className={`flex-1 truncate ${
                  direction === 'rtl' ? 'text-right' : 'text-left'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-2 sm:p-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
        >
          <div
            className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0 ${
              direction === 'rtl'
                ? 'ml-2 sm:ml-3'
                : 'mr-2 sm:mr-3'
            }`}
          >
            <i className="ri-logout-box-line text-base sm:text-lg"></i>
          </div>
          <span
            className={`flex-1 truncate ${
              direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            تسجيل الخروج
          </span>
        </button>
      </div>
    </div>
  )
}
