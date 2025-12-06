
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

interface HeroProps {
  onNavigateToSection?: (section: string) => void;
}

export default function Hero({ onNavigateToSection }: HeroProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  const handleSectionClick = (section: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(section)
    }
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20restaurant%20interior%20with%20elegant%20dining%20tables%2C%20warm%20lighting%2C%20contemporary%20design%2C%20professional%20food%20service%20atmosphere%2C%20clean%20minimalist%20style%2C%20high-end%20restaurant%20ambiance%20with%20digital%20technology%20integration&width=1920&height=1080&seq=hero-bg&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8 space-x-reverse">
            <h1 className="text-3xl font-bold text-white font-arabic" style={{ fontFamily: 'Pacifico, serif' }}>
              QTap
            </h1>
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              <button 
                onClick={() => handleSectionClick('features')}
                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap"
              >
                المميزات
              </button>
              <button 
                onClick={() => handleSectionClick('restaurants')}
                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap"
              >
                المطاعم
              </button>
              <button 
                onClick={() => handleSectionClick('showcase')}
                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap"
              >
                العرض التوضيحي
              </button>
              <button 
                onClick={() => handleSectionClick('testimonials')}
                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap"
              >
                آراء العملاء
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link 
                  to={user.role === 'restaurant_admin' ? '/admin' : user.role === 'cashier' ? '/cashier' : '/chef'}
                  className="nav-link text-white hover:text-orange-400 whitespace-nowrap"
                >
                  لوحة التحكم
                </Link>
                <span className="text-gray-300 text-body">مرحباً، {user.full_name}</span>
                <button
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 transition-colors whitespace-nowrap text-button"
                >
                  <i className="ri-logout-box-line ml-1"></i>
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link text-white hover:text-orange-400 whitespace-nowrap"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary whitespace-nowrap"
                >
                  ابدأ الآن
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-cairo">
          مستقبل المطاعم
          <span className="block text-orange-400">الرقمية</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed font-tajawal">
          حول مطعمك إلى تجربة رقمية متكاملة مع QTap
        </p>
        
        {/* Quick Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-qr-code-line text-white text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 font-cairo">قوائم QR ذكية</h3>
            <p className="text-gray-300 text-sm font-tajawal">قوائم رقمية تفاعلية</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-dashboard-line text-white text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 font-cairo">إدارة شاملة</h3>
            <p className="text-gray-300 text-sm font-tajawal">لوحة تحكم متكاملة</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-line-chart-line text-white text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 font-cairo">تحليلات ذكية</h3>
            <p className="text-gray-300 text-sm font-tajawal">تقارير مفصلة ومباشرة</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 sm:space-x-reverse mb-8">
          {!user && (
            <>
              <Link 
                to="/register" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors whitespace-nowrap font-tajawal"
              >
                ابدأ تجربتك المجانية
              </Link>
              <Link 
                to="/menu?restaurant=demo&table=1" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 rounded-lg transition-colors whitespace-nowrap font-tajawal"
              >
                شاهد العرض التوضيحي
              </Link>
            </>
          )}
          {user && (
            <Link 
              to={user.role === 'restaurant_admin' ? '/admin' : user.role === 'cashier' ? '/cashier' : '/chef'}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors whitespace-nowrap font-tajawal"
            >
              انتقل إلى لوحة التحكم
            </Link>
          )}
        </div>

        <div className="flex items-center justify-center space-x-12 space-x-reverse text-gray-300">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 font-cairo">500+</div>
            <div className="text-sm font-tajawal">مطعم نشط</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 font-cairo">50K+</div>
            <div className="text-sm font-tajawal">طلب يومي</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 font-cairo">99%</div>
            <div className="text-sm font-tajawal">رضا العملاء</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <i className="ri-arrow-down-line text-white text-2xl"></i>
        </div>
      </div>
    </div>
  )
}
